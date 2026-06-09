#!/usr/bin/env node

// Proverbs of the World — MCP Server
// Recherche hybride (Lexicale + Sémantique) avec isolation sémantique native et respect des données Wikiquote.

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { pipeline } from "@xenova/transformers";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_PATH = path.resolve(__dirname, "..", "data", "proverbs.json");

interface Proverb {
  text_original: string;
  text_fr?: string;
  context_fr?: string;
  origin: string;
  embedding?: number[];
}

interface ProverbsDB {
  meta: { total: number; license: string; attribution: string; generated_at: string; };
  proverbs: Proverb[];
}

let hfPipeline: any = null;
let db: ProverbsDB = { meta: { total: 0, license: "", attribution: "", generated_at: "" }, proverbs: [] };
let isModelReady = false;

async function initSemanticEngine(proverbs: Proverb[]): Promise<void> {
  try {
    hfPipeline = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    
    console.log("🧠 Indexation vectorielle en tâche de fond...");
    
    for (const p of proverbs) {
      const textToEmbed = p.text_fr 
        ? `${p.text_fr}.${p.context_fr ? ` Sens : ${p.context_fr}` : ''} (${p.text_original})` 
        : p.text_original;

      p.embedding = await getEmbedding(textToEmbed);
    }
    isModelReady = true;
    console.log("✨ Moteur sémantique prêt !");
  } catch (err) {
    console.error("⚠️ Impossible d'initialiser le moteur sémantique. Mode lexical seul.", err);
  }
}

async function getEmbedding(text: string): Promise<number[]> {
  if (!hfPipeline) return [];
  const output = await hfPipeline(text, { pooling: "mean", normalize: true });
  return Array.from(output.data);
}

function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA.length || !vecB.length) return 0;
  return vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
}

function loadDB(): ProverbsDB {
  if (!fs.existsSync(DATA_PATH)) {
    throw new Error(`Dataset introuvable : ${DATA_PATH}`);
  }

  const rawData = fs.readFileSync(DATA_PATH, "utf-8");
  const parsed = JSON.parse(rawData);

  let rawProverbsArray: any[] = [];
  let metadata = {
    total: 0,
    license: "CC BY-SA 3.0",
    attribution: "Wikiquote contributors",
    generated_at: new Date().toISOString()
  };

  if (Array.isArray(parsed)) {
    rawProverbsArray = parsed;
  } else if (parsed.proverbs && Array.isArray(parsed.proverbs)) {
    rawProverbsArray = parsed.proverbs;
    if (parsed.meta) metadata = { ...metadata, ...parsed.meta };
  }

  const mappedProverbs: Proverb[] = rawProverbsArray.map((p: any) => {
    return {
      text_original: p.text_original?.trim() || "",
      text_fr: (p.text || p.text_fr)?.trim() || undefined,
      context_fr: p.context_fr?.trim() || undefined,
      origin: p.origin?.trim() || "Unknown"
    };
  }).filter((p) => p.text_original.length > 0);

  metadata.total = mappedProverbs.length;
  return { meta: metadata, proverbs: mappedProverbs };
}

function tokenize(theme: string): string[] {
  return theme
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(/[\s,;.!?-]+/)
    .filter((w) => w.length > 2);
}

function scoreLexical(proverb: Proverb, keywords: string[]): number {
  const textToSearch = proverb.text_fr 
    ? `${proverb.text_original} ${proverb.text_fr} ${proverb.context_fr || ''}` 
    : proverb.text_original;
    
  const haystack = `${textToSearch} ${proverb.origin}`.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  let score = 0;
  for (const kw of keywords) {
    if (haystack.includes(kw)) score += 2;
  }
  return score;
}

async function main() {
  db = loadDB();
  const proverbs = db.proverbs;

  initSemanticEngine(proverbs).catch((err) => console.error("Erreur init IA:", err));

  const server = new McpServer({ name: "proverbs-of-the-world", version: "1.5.0" });

  server.tool(
    "search_proverbs",
    "Recherche des adages, expressions, graffitis et proverbes authentiques issus des pages Wikiquote mondiales. " +
    "CONSIGNE DE RESTITUTION : Affiche chaque élément reçu sans le modifier, en respectant scrupuleusement le format Markdown suivant :\n\n" +
    "### Proverbe #[Numéro] - [Origine]\n" +
    "- **Traduction en français :** \"[Traduction fournie]\"\n" +
    "- **Texte original :** \"[Texte original fourni]\"\n" +
    "- **Sens philosophique :** *[Sens ou contexte fourni]*",
    {
      theme: z.string().describe("Le concept ou thème à chercher (ex: mort, diable, patience)"),
      count: z.number().min(1).max(10).default(5).describe("Nombre de résultats souhaités")
    },
    async ({ theme, count }) => {
      const keywords = tokenize(theme);
      const queryEmbedding = await getEmbedding(theme);

      const scored = proverbs
        .map((p) => {
          const pools = p.embedding && queryEmbedding.length ? cosineSimilarity(p.embedding, queryEmbedding) : 0;
          const lex = scoreLexical(p, keywords);
          return { proverb: p, score: lex + (pools * 3.5) };
        })
        .filter((x) => x.score > 0.1)
        .sort((a, b) => b.score - a.score);

      const final = scored.slice(0, count).map((x) => x.proverb);

      if (final.length === 0) {
        return { content: [{ type: "text", text: `Aucun résultat trouvé sur Wikiquote pour : "${theme}".` }] };
      }

      // ISOLATION PROTOCOLAIRE NATIVE : On sépare les blocs pour éviter les hallucinations visuelles
      const contentNodes = final.map((p, index) => {
        const finalTranslation = p.text_fr || p.text_original;
        const finalContext = p.context_fr || "Sagesse ou expression répertoriée.";
        
        const markdownChunk = [
          `### Proverbe #${index + 1} - ${p.origin}`,
          `- **Traduction en français :** "${finalTranslation}"`,
          `- **Texte original :** "${p.text_original}"`,
          `- **Sens philosophique :** *${finalContext}*`
        ].join("\n");

        return {
          type: "text" as const,
          text: markdownChunk
        };
      });

      return { content: contentNodes };
    }
  );

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("Erreur critique MCP:", err);
  process.exit(1);
});
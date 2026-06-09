#!/usr/bin/env node

// Proverbs of the World — MCP Server
// Recherche hybride (Lexicale + Sémantique) de proverbes authentiques enrichis par Groq.

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
  context_fr?: string; // ✨ Support du contexte philosophique en français
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
    // Chargement asynchrone du modèle léger (~22 Mo)
    hfPipeline = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    
    console.log("🧠 Indexation vectorielle en tâche de fond basée sur les données Groq...");
    
    for (const p of proverbs) {
      // ✨ Injection du contexte : On combine la traduction ET le sens caché pour le moteur de vecteurs !
      const textToEmbed = p.text_fr 
        ? `${p.text_fr}. Sens : ${p.context_fr || ''} (${p.text_original})` 
        : p.text_original;

      p.embedding = await getEmbedding(textToEmbed);
    }
    isModelReady = true;
    console.log("✨ Moteur sémantique entièrement indexé et prêt !");
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
      text_original: p.text_original || "",
      text_fr: p.text || p.text_fr || undefined, // Mappe le champ "text" mis à jour par Groq
      context_fr: p.context_fr || undefined,     // ✨ Charge le contexte philosophique de Groq
      origin: p.origin || "Unknown"
    };
  }).filter(p => p.text_original.length > 0);

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
    for (const word of haystack.split(/\s+/)) {
      if (word.startsWith(kw) && word !== kw) score += 1;
    }
  }
  return score;
}

function formatProverbMinimal(p: Proverb, rank: number): string {
  // ✨ Optimisation psychologique : On greffe l'Origine directement dans le titre H3
  // pour empêcher Claude de faire l'impasse dessus lors de sa reformulation.
  const originTag = p.origin ? `[Origine : ${p.origin}]` : '[Origine : Inconnue]';

  if (p.text_fr && p.text_fr.trim().toLowerCase() !== p.text_original.trim().toLowerCase()) {
    return [
      `### Proverbe #${rank} ${originTag}`,
      `- **Traduction :** "${p.text_fr}"`,
      `- **Sens caché :** *${p.context_fr || 'Dicton populaire.'}*`, // ✨ Transmet l'explication Groq
      `- **Texte original :** *"${p.text_original}"*`
    ].join("\n");
  }

  return [
    `### Proverbe #${rank} ${originTag}`,
    `- **Texte :** "${p.text_original}"`
  ].join("\n");
}

async function main() {
  db = loadDB();
  const proverbs = db.proverbs;

  // IMPORTANT : On lance le chargement en tâche de fond SANS mettre de "await"
  // pour que le serveur MCP s'ouvre instantanément sans causer de Timeout côté Claude.
  initSemanticEngine(proverbs).catch((err) => console.error("Erreur init IA:", err));

  const server = new McpServer({ name: "proverbs-of-the-world", version: "1.2.0" });

  server.tool(
    "search_proverbs",
    // ✨ Consignes d'outil ultra-strictes pour forcer Claude à respecter l'affichage de l'origine géographique
    "Recherche des proverbes authentiques par pertinence hybride (mots-clés et concept). REQUIS : Tu dois restituer à l'utilisateur le texte en français, le sens caché et OBLIGATOIREMENT l'origine géographique spécifiée pour CHAQUE proverbe trouvé.",
    {
      theme: z.string().describe("Thème, concept ou mots-clés. Ex: 'argent', 'persévérance', 'sagesse'"),
      count: z.number().min(1).max(10).default(5).describe("Nombre de proverbes (défaut : 5)")
    },
    async ({ theme, count }) => {
      const keywords = tokenize(theme);
      const queryEmbedding = await getEmbedding(theme);

      const scored = proverbs
        .map((p) => {
          const lexScore = scoreLexical(p, keywords);
          const semScore = p.embedding && queryEmbedding.length ? cosineSimilarity(p.embedding, queryEmbedding) : 0;
          const finalScore = lexScore + (semScore * 3.5); 
          return { proverb: p, score: finalScore };
        })
        .filter((x) => x.score > 0.2)
        .sort((a, b) => b.score - a.score);

      let results: Proverb[];
      if (scored.length >= count) {
        results = scored.slice(0, count).map((x) => x.proverb);
      } else {
        const found = scored.map((x) => x.proverb);
        const foundIds = new Set(found.map((p) => p.text_original));
        const remaining = proverbs
          .filter((p) => !foundIds.has(p.text_original))
          .sort(() => Math.random() - 0.5)
          .slice(0, count - found.length);
        results = [...found, ...remaining];
      }

      const seen = new Set<string>();
      const diverse: Proverb[] = [];
      const overflow: Proverb[] = [];
      for (const p of results) {
        if (!seen.has(p.origin)) {
          seen.add(p.origin);
          diverse.push(p);
        } else {
          overflow.push(p);
        }
      }
      const final = [...diverse, ...overflow].slice(0, count);

      if (final.length === 0) {
        return { content: [{ type: "text", text: `Aucun proverbe trouvé pour "${theme}".` }] };
      }

      const modeStatus = isModelReady ? "Recherche Hybride IA" : "Recherche Lexicale (Indexation IA en cours...)";
      const header = `🌍 **${final.length} proverbe${final.length > 1 ? "s" : ""} trouvé${final.length > 1 ? "s" : ""} pour "${theme}" (${modeStatus})**\n\n`;
      const body = final.map((p, i) => formatProverbMinimal(p, i + 1)).join("\n\n---\n\n");

      return { content: [{ type: "text", text: header + body }] };
    }
  );

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("Erreur MCP:", err);
  process.exit(1);
});
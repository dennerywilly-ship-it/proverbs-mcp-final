/**
 * fetch-wikiquote.ts
 * Script one-shot : extrait les proverbes de Wikiquote via MediaWiki API
 * et génère data/proverbs.json
 *
 * Usage : npx tsx scripts/fetch-wikiquote.ts
 */

import fs from "fs";
import path from "path";

const API = "https://en.wikiquote.org/w/api.php";
const OUTPUT = path.join(process.cwd(), "data", "proverbs.json");

// Pages de proverbes par langue sur Wikiquote
// Format : [pageName, country, language, flag]
const PROVERB_PAGES: [string, string, string, string][] = [
  ["African proverbs",        "Afrique",          "Multilingue africain", "🌍"],
  ["Albanian proverbs",       "Albanie",          "Albanais",             "🇦🇱"],
  ["Arabic proverbs",         "Monde arabe",      "Arabe",                "🌙"],
  ["Armenian proverbs",       "Arménie",          "Arménien",             "🇦🇲"],
  ["Bengali proverbs",        "Bangladesh",       "Bengali",              "🇧🇩"],
  ["Brazilian proverbs",      "Brésil",           "Portugais (Brésil)",   "🇧🇷"],
  ["Bulgarian proverbs",      "Bulgarie",         "Bulgare",              "🇧🇬"],
  ["Burmese proverbs",        "Myanmar",          "Birman",               "🇲🇲"],
  ["Chinese proverbs",        "Chine",            "Chinois",              "🇨🇳"],
  ["Czech proverbs",          "République tchèque","Tchèque",             "🇨🇿"],
  ["Danish proverbs",         "Danemark",         "Danois",               "🇩🇰"],
  ["Dutch proverbs",          "Pays-Bas",         "Néerlandais",          "🇳🇱"],
  ["Egyptian proverbs",       "Égypte",           "Arabe égyptien",       "🇪🇬"],
  ["English proverbs",        "Angleterre",       "Anglais",              "🇬🇧"],
  ["Ethiopian proverbs",      "Éthiopie",         "Amharique",            "🇪🇹"],
  ["Finnish proverbs",        "Finlande",         "Finnois",              "🇫🇮"],
  ["French proverbs",         "France",           "Français",             "🇫🇷"],
  ["Georgian proverbs",       "Géorgie",          "Géorgien",             "🇬🇪"],
  ["German proverbs",         "Allemagne",        "Allemand",             "🇩🇪"],
  ["Greek proverbs",          "Grèce",            "Grec",                 "🇬🇷"],
  ["Hungarian proverbs",      "Hongrie",          "Hongrois",             "🇭🇺"],
  ["Icelandic proverbs",      "Islande",          "Islandais",            "🇮🇸"],
  ["Indian proverbs",         "Inde",             "Multilingue indien",   "🇮🇳"],
  ["Indonesian proverbs",     "Indonésie",        "Indonésien",           "🇮🇩"],
  ["Iranian proverbs",        "Iran",             "Persan",               "🇮🇷"],
  ["Irish proverbs",          "Irlande",          "Irlandais / Anglais",  "🇮🇪"],
  ["Italian proverbs",        "Italie",           "Italien",              "🇮🇹"],
  ["Japanese proverbs",       "Japon",            "Japonais",             "🇯🇵"],
  ["Jewish proverbs",         "Culture juive",    "Hébreu / Yiddish",     "✡️"],
  ["Korean proverbs",         "Corée",            "Coréen",               "🇰🇷"],
  ["Latin proverbs",          "Rome antique",     "Latin",                "🏛️"],
  ["Malay proverbs",          "Malaisie",         "Malais",               "🇲🇾"],
  ["Mexican proverbs",        "Mexique",          "Espagnol (Mexique)",   "🇲🇽"],
  ["Mongolian proverbs",      "Mongolie",         "Mongol",               "🇲🇳"],
  ["Moroccan proverbs",       "Maroc",            "Darija / Arabe",       "🇲🇦"],
  ["Norwegian proverbs",      "Norvège",          "Norvégien",            "🇳🇴"],
  ["Philippine proverbs",     "Philippines",      "Filipino",             "🇵🇭"],
  ["Polish proverbs",         "Pologne",          "Polonais",             "🇵🇱"],
  ["Portuguese proverbs",     "Portugal",         "Portugais",            "🇵🇹"],
  ["Romanian proverbs",       "Roumanie",         "Roumain",              "🇷🇴"],
  ["Russian proverbs",        "Russie",           "Russe",                "🇷🇺"],
  ["Scottish proverbs",       "Écosse",           "Scots / Gaélique",     "🏴󠁧󠁢󠁳󠁣󠁴󠁿"],
  ["Serbian proverbs",        "Serbie",           "Serbe",                "🇷🇸"],
  ["Spanish proverbs",        "Espagne",          "Espagnol",             "🇪🇸"],
  ["Swahili proverbs",        "Afrique de l'Est", "Swahili",              "🌍"],
  ["Swedish proverbs",        "Suède",            "Suédois",              "🇸🇪"],
  ["Thai proverbs",           "Thaïlande",        "Thaï",                 "🇹🇭"],
  ["Turkish proverbs",        "Turquie",          "Turc",                 "🇹🇷"],
  ["Ukrainian proverbs",      "Ukraine",          "Ukrainien",            "🇺🇦"],
  ["Vietnamese proverbs",     "Viêt Nam",         "Vietnamien",           "🇻🇳"],
  ["Welsh proverbs",          "Pays de Galles",   "Gallois",              "🏴󠁧󠁢󠁷󠁬󠁳󠁿"],
  ["Yiddish proverbs",        "Culture ashkénaze","Yiddish",              "✡️"],
  ["Yoruba proverbs",         "Nigeria",          "Yoruba",               "🇳🇬"],
  ["Zulu proverbs",           "Afrique du Sud",   "Zulu",                 "🇿🇦"],
];

interface Proverb {
  id: string;
  text: string;
  country: string;
  language: string;
  flag: string;
  source_page: string;
  wikiquote_url: string;
}

function parseProverbs(
  wikitext: string,
  pageName: string,
  country: string,
  language: string,
  flag: string
): Omit<Proverb, "id">[] {
  const proverbs: Omit<Proverb, "id">[] = [];
  const lines = wikitext.split("\n");

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("*") && !trimmed.startsWith(":")) continue;

    let text = trimmed
      .replace(/^\*+\s*/, "")
      .replace(/^:+\s*/, "")
      .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, "$2")
      .replace(/\[\[([^\]]+)\]\]/g, "$1")
      .replace(/'{2,3}/g, "")
      .replace(/{{[^}]+}}/g, "")
      .replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .trim();

    if (text.length < 12) continue;
    if (text.length > 280) continue;
    if (text.startsWith("http")) continue;
    if (text.startsWith("<!--")) continue;
    if (text.startsWith("Category:")) continue;
    if (text.startsWith("File:")) continue;
    if (/^\d+$/.test(text)) continue;

    proverbs.push({
      text,
      country,
      language,
      flag,
      source_page: pageName,
      wikiquote_url: `https://en.wikiquote.org/wiki/${encodeURIComponent(
        pageName.replace(/ /g, "_")
      )}`,
    });
  }

  return proverbs;
}

async function fetchPage(pageName: string): Promise<string | null> {
  const params = new URLSearchParams({
    action: "query",
    titles: pageName,
    prop: "revisions",
    rvprop: "content",
    rvslots: "main",
    format: "json",
    formatversion: "2",
  });

  try {
    const res = await fetch(`${API}?${params}`, {
      headers: {
        "User-Agent": "ProverbsMCP/1.0 (educational project; wikiquote extraction)",
      },
    });
    
    // Gère le rate limiting 429
    if (res.status === 429) {
      console.warn(`  ⏱️  Rate limited (429) - pause de 5 secondes...`);
      await sleep(5000);
      return fetchPage(pageName); // Réessaie
    }
    
    if (!res.ok) {
      console.warn(`  ⚠️  HTTP ${res.status} pour "${pageName}"`);
      return null;
    }
    const data = await res.json() as any;
    const page = data?.query?.pages?.[0];
    if (!page || page.missing) {
      console.warn(`  ⚠️  Page introuvable : "${pageName}"`);
      return null;
    }
    return page.revisions?.[0]?.slots?.main?.content ?? null;
  } catch (err) {
    console.warn(`  ⚠️  Erreur pour "${pageName}":`, err);
    return null;
  }
}

function makeId(text: string, country: string): string {
  return `${country}-${text}`
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 64);
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  console.log("🌍 Extraction des proverbes Wikiquote\n");
  console.log(`📋 ${PROVERB_PAGES.length} pages à traiter\n`);

  const allProverbs: Proverb[] = [];
  const seen = new Set<string>();

  for (const [pageName, country, language, flag] of PROVERB_PAGES) {
    process.stdout.write(`→ ${pageName}... `);

    const wikitext = await fetchPage(pageName);
    if (!wikitext) {
      console.log("ignorée");
      await sleep(500);
      continue;
    }

    const parsed = parseProverbs(wikitext, pageName, country, language, flag);
    let added = 0;

    for (const p of parsed) {
      const id = makeId(p.text, p.country);
      if (seen.has(id)) continue;
      seen.add(id);
      allProverbs.push({ ...p, id });
      added++;
    }

    console.log(`✓ ${added} proverbes`);
    await sleep(1000); // 1 seconde entre chaque requête
  }

  allProverbs.sort((a, b) => a.country.localeCompare(b.country));

  const output = {
    meta: {
      total: allProverbs.length,
      pages_scraped: PROVERB_PAGES.length,
      license: "CC BY-SA 3.0",
      attribution: "Wikiquote contributors — https://en.wikiquote.org",
      generated_at: new Date().toISOString(),
    },
    proverbs: allProverbs,
  };

  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, JSON.stringify(output, null, 2), "utf-8");

  console.log(`\n✅ ${allProverbs.length} proverbes extraits`);
  console.log(`💾 Sauvegardé dans : ${OUTPUT}`);
}

main().catch(console.error);

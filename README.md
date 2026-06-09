# proverbs-of-the-world-mcp

> 🌍 **MCP Server** | TypeScript | Node.js 18+ | MIT License

Connectez Claude (ou tout LLM) à un catalogue mondial de **7,000+ proverbes authentiques** sourcing depuis Wikiquote. Recherche hybride (lexicale + sémantique locale). Zéro hallucination. Zéro dépendances cloud.

## Le Problème

Les LLM excellent à traduire et générer du texte, mais ils hallucinent systématiquement quand on leur demande des proverbes "authentiques" :

- ❌ Inventer des citations crédibles mais fictives
- ❌ Recycler les 10 mêmes citations occidentales
- ❌ Manquer d'authenticité culturelle

Avec ce serveur : **Claude retourne des proverbes réels, vérifiés, géographiquement diversifiés.**

## Pourquoi C'est Différent

| Défi | Solution |
|------|----------|
| **Zéro hallucination** | Données exclusivement Wikiquote (CC BY-SA 3.0), typées via Zod |
| **Recherche intelligente** | Moteur hybride : lexical (mots-clés) + sémantique local (Xenova/all-MiniLM-L6-v2) |
| **Aucun coût cloud** | Embeddings calculés en local (~22 Mo embarqué) |
| **Diversité garantie** | Algorithme post-recherche : max 2 proverbes par culture dans les top-5 |

### 3 Défis d'Ingénierie Résolus

**1. Non-blocking startup**  
Indexation vectorielle asynchrone : serveur prêt en mode lexical < 100ms, bascule automatique vers sémantique quand ready.

**2. Pollution sémantique**  
Dataset brut contenait du bruit générique ("explication du sens..."). Pipeline de filtrage aggressif = espace vectoriel pur.

**3. Respect du format**  
Chaque résultat encapsulé dans un contentNode hermétique. Zéro fusion de contextes, respect strict des diacritiques régionaux.

## Installation Rapide

### Option 1 : NPM (Recommandé)

**Étape 1** : Localisez votre fichier config Claude Desktop :
- **macOS** : `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows** : `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux** : `~/.config/Claude/claude_desktop_config.json`

**Étape 2** : Ajoutez ce bloc dans `mcpServers` :

```json
{
  "mcpServers": {
    "proverbs-of-the-world": {
      "command": "npx",
      "args": ["-y", "proverbs-of-the-world-mcp"]
    }
  }
}
```
*(Windows : remplacez `npx` par `npx.cmd`)*

**Étape 3** : Redémarrez Claude Desktop. Badge `running` bleu doit apparaître en Paramètres > Développeur.

### Option 2 : Installation Locale (Dev)

```bash
git clone <repo-url>
cd proverbs-of-the-world-mcp
npm install && npm run build

# Ajoutez au config avec chemin absolu :
# "command": "node",
# "args": ["/VOTRE_CHEMIN_ABSOLU/dist/index.js"]
```

## Utilisation

Une fois activé, Claude accède automatiquement au serveur :

```
Vous : "Trouve 5 proverbes sur la mort, d'origines variées."

Claude : [appelle search_proverbs automatiquement]

Résultat :
### Proverbe #1 - Bulgarie
- Traduction : "Les Hommes Silencieux, comme les eaux calmes, sont profonds et dangereux."
- Texte original : "Silent Men, like still Waters, are deep and dangerous."
- Sens : Maxime sur le danger caché dans le silence.
```

### Outil : `search_proverbs`

| Paramètre | Type | Description |
|-----------|------|-------------|
| `theme` | string | Concept/mot-clé à chercher : "mort", "amour", "patience", etc. |
| `count` | number | Nombre de résultats (défaut: 5, max: 10) |

Résultat : Markdown structuré, multilingue, prêt pour LinkedIn/blog/content.

## Architecture

**Moteur Hybride**
- **Mode Lexical** : String matching + normalisation NFD (ultra-rapide, mots-clés exacts)
- **Mode Sémantique** : Xenova/all-MiniLM-L6-v2 embarqué (comprend synonymes, contextes abstraits)
- **Score Combiné** : µ-weighted average (exemple : "tristesse" → remonte "chagrin", "larmes")

**Isolation Sémantique Native**  
Chaque résultat encapsulé dans un contentNode hermétique. Prévient la fusion de contextes, garantit la stabilité vectorielle.

## Stats

| Métrique | Valeur |
|----------|--------|
| Proverbes | ~2,500+ (croissant) |
| Cultures | 40+ origines géographiques |
| Taille modèle | ~22 Mo (embarqué) |
| Startup | < 200ms (mode lexical) |
| Latence recherche | 100-500ms (hybride) |
| Dépendances cloud | 0 |

## Dépannage

**Serveur reste "failed"**  
```bash
node -v  # Doit être v18+
which node  # Chemin absolu requis
```
Premier lancement : télécharge modèle IA (~22 Mo depuis HuggingFace). Vérifiez proxy/pare-feu.

**Peu de résultats**  
Essayez terme plus générique ("mort" au lieu de "mort prématurée") ou augmentez `count: 10`.

**Caractères spéciaux mal affichés**  
Vérifiez encoding terminal = UTF-8.

## Contribuer

### Ajouter des Proverbes

Éditez `data/proverbs.json` :

```json
[
  {
    "text_original": "Time is money.",
    "text_fr": "Le temps, c'est de l'argent.",
    "context_fr": "Maxime anglo-saxonne sur la gestion du temps.",
    "origin": "Angleterre"
  }
]
```

Pull Request : validations auto vérifient 4 champs obligatoires, pas de doublons, longueur < 500 chars.

### Améliorer le Moteur

- Optimisations sémantiques ? Créez une issue.
- Modèle d'embeddings plus performant ? Proposez-le.
- Nouvelles langues ? PR bienvenue.

## Licence

| Composant | Licence |
|-----------|---------|
| Code source | MIT |
| Dataset | CC BY-SA 3.0 (Wikiquote) |

Attribution requise : Données extraites de Wikiquote, distribuées sous CC BY-SA 3.0.

---

**Built to eliminate LLM hallucinations at scale. Zero cloud dependencies. Production-ready.**

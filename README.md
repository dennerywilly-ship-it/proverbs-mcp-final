# 🌍 Proverbs of the World - MCP Server

**MIT License • Node.js 18+ • TypeScript 5.0+ • MCP Protocol**

📦 [NPM Package](https://www.npmjs.com/package/proverbs-of-the-world-mcp) | 💻 [GitHub Repository](https://github.com/dennerywilly-ship-it/proverbs-mcp-final)

> **Injectez de la sagesse culturelle vérifiée dans vos contenus.** Accédez à un catalogue mondial de proverbes authentiques tirés de Wikiquote, propulsé par un moteur de recherche hybride (lexical + sémantique local). Zéro hallucination, structure garantie, cultures diverses.

Connectez Claude (ou tout LLM supportant MCP) à un immense réservoir de proverbes vérifiés du monde entier - enrichis, structurés et prêts à élever la qualité de vos posts LinkedIn, présentations, écrits créatifs ou analyses philosophiques.

---

## 📊 Stats & Contexte

| Métrique | Valeur |
| :--- | :--- |
| **Proverbes dans le dataset** | ~7,000+ |
| **Langues & cultures** | 40+ origines géographiques |
| **Taille du modèle embarqué** | ~22 Mo (all-MiniLM-L6-v2) |
| **Temps de démarrage** | < 200ms (mode lexical) |
| **Latence de recherche** | 100-500ms (hybride complet) |
| **Dépendances cloud** | 0 (après première indexation) |

---

## 🎯 Le Problème

Les LLM sont d'excellents traducteurs et générateurs de texte, mais ils **hallucinent régulièrement** lorsqu'on leur demande des proverbes authentiques :

- ❌ Inventer des citations crédibles mais fictives ("sagesse chinoise" qui n'existe pas)
- ❌ Tourner en boucle autour des 10 mêmes citations occidentales du domaine public
- ❌ Manquer d'ancrage culturel véritable pour enrichir un contenu avec de l'authenticité
- ❌ Proposer des "interprétations" qui lissent la véritable sagesse populaire

**Exemple concret :**
> Claude : *"Voici un proverbe finnois sur la patience... [génère quelque chose de poétique mais totalement faux]*

**Avec ce serveur :**
> Claude : "千里之行，始于足下" (Chine) → *"Le voyage d'un millier de kilomètres commence par un seul pas."*
> Sagesse authentique, vérifiée, diverse géographiquement.

---

## ✨ La Solution

Une **architecture MCP native** qui isole sémantiquement chaque résultat pour garantir :

| Besoin | Solution |
| :--- | :--- |
| **Zéro hallucination** | Données exclusivement issues de Wikiquote (CC BY-SA 3.0), typées via validation stricte |
| **Recherche intelligente** | Moteur hybride combinant lexical (mots-clés exacts) + sémantique local (Xenova/all-MiniLM-L6-v2 embarqué) |
| **Aucun coût cloud** | Embeddings calculés en local (~22 Mo), zéro appel API external |
| **Stabilité prédictible** | Chaque proverbe encapsulé hermétiquement, *isolation native au protocole MCP* |
| **Diversité culturelle** | Algorithme post-recherche qui garantit une répartition équilibrée des cultures |

---

## 🎨 Démo Visuelle

**Requête :** "Cherche des proverbes sur la persévérance et le commencement"

**Proverbe #1 - Chine**
- Traduction: "Le voyage d'un millier de kilomètres commence par un seul pas"
- Original: "千里之行，始于足下"
- Sagesse: Sur les commencements et la persévérance

**Proverbe #2 - Japon**
- Traduction: "Chaque grain de poussière accumule une montagne"
- Original: "塵も積もれば山となる"
- Sagesse: L'accumulation progressive crée la montagne

**Proverbe #3 - Espagne**
- Traduction: "Pas à pas on va loin"
- Original: "Paso a paso se va lejos"
- Sagesse: La progressivité plutôt que l'impatience

*Résultat structuré, multilingue, vérifiable, prêt à copier dans LinkedIn ou un blog.*

---

## 🎯 Pourquoi Ce MCP et Pas les Alternatives ?

| Solution | Hallucinations | Coût Cloud | Cultures | Contrôle Local |
| :--- | :--- | :--- | :--- | :--- |
| **Ce serveur** | ✅ Zéro (données vérifiées) | ✅ Zéro | ✅ 40+ | ✅ 100% local |
| Autres MCP servers | ⚠️ Génériques | ✅ Gratuit | ❌ Limitées | ✅ Oui |
| GPT Plugins + "proverbes" | ❌ Massives | ⚠️ Payant | ⚠️ Occidentales | ❌ Non |
| APIs cloud (Wikiquote brut) | ✅ Aucune | ❌ Cher | ✅ Complètes | ❌ Non |
| Wikiquote raw JSON | ✅ Aucune | ✅ Zéro | ✅ Complètes | ✅ Oui |

**La différence clé :** Zéro hallucination + zéro coût cloud + recherche hybride intelligente + prêt pour la production.

---

## 🧠 Architecture Résolue : 4 Défis Techniques

| Défi | Problème | Solution |
| :--- | :--- | :--- |
| **⏱️ Timeout au démarrage** | Claude ferme la connexion avant que le serveur soit prêt (3-5s de latence) | Démarrage non-bloquant en mode lexical pur (< 100ms), basculement sémantique en arrière-plan |
| **🧬 Pollution sémantique** | Phrases de remplissage répétées agissent comme "aimants mathématiques", faussant la pertinence vectorielle | Pipeline de filtrage agressif avant génération des embeddings pour un espace vectoriel pur |
| **📝 Paresse du LLM** | Claude réécrit/fusionnerait les résultats pour économiser les tokens | Prompt engineering structurel dans la description MCP pour forcer une mise en page standardisée |
| **🌍 Biais géographique** | Moteur pur retourne 5x le même pays (ex: 5 chinois sur "patience") | Algorithme post-recherche qui redistribue les résultats pour diversité culturelle maximale |

### Isolation Sémantique Native

Chaque résultat est encapsulé dans un **nœud hermétique au protocole MCP** - l'attention du LLM traite chaque proverbe indépendamment, sans mélange de contextes.

**Résultat :**
- ✅ Zéro hallucination visuelle
- ✅ Caractères régionaux et diacritiques respectés
- ✅ Scalabilité stable, peu importe la complexité linguistique

### Moteur de Recherche Hybride

| Mode | Technologie | Force |
| :--- | :--- | :--- |
| **Lexical** | String matching + normalisation NFD | Mots-clés exacts, ultra-rapide |
| **Sémantique** | Xenova/all-MiniLM-L6-v2 local | Synonymes, contextes abstraits |
| **Hybride** | Score combiné | "Tristesse" remonte "chagrin", "larmes" |

**Zéro cloud:** Embeddings 100% local (~22 Mo).

---

## 🚀 Installation Rapide

### Option 1 : Via NPM (Recommandé pour tous)

**Étape 1 :** Localisez votre fichier de configuration Claude Desktop :

- **macOS :** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows :** `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux :** `~/.config/Claude/claude_desktop_config.json`

**Étape 2 :** Ajoutez ce bloc dans la section `mcpServers` :

#### Windows (npx.cmd)
```json
{
  "mcpServers": {
    "proverbs-of-the-world": {
      "command": "npx.cmd",
      "args": ["-y", "proverbs-of-the-world-mcp"]
    }
  }
}
```

#### macOS / Linux (npx)
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

**Étape 3 :** Redémarrez Claude Desktop complètement. Allez dans *Paramètres > Développeur* - votre serveur doit afficher un badge `running` bleu.

### Option 2 : Installation Locale (Développement)

```bash
# Cloner et compiler
git clone <repo-url>
cd proverbs-of-the-world-mcp
npm install
npm run build

# Ajouter au fichier de config avec le chemin absolu
{
  "mcpServers": {
    "proverbs-dev": {
      "command": "node",
      "args": ["/VOTRE_CHEMIN_ABSOLU/dist/index.js"]
    }
  }
}
```

---

## 💡 Utilisation

Une fois activé, utilise Claude Desktop normalement :

```
Utilisateur : "Trouve-moi 5 proverbes sur la mort, d'origines variées."

Claude : [appelle automatiquement search_proverbs]

Résultat : Proverbes authentiques de Mexique, Suisse, Inde, Irlande, etc.
```

Le serveur expose un seul outil intelligent :

### `search_proverbs`

| Paramètre | Type | Description | Exemple |
| :--- | :--- | :--- | :--- |
| `theme` | string | Concept, mot-clé ou thème philosophique à chercher | `"mort"`, `"amour"`, `"patience"`, `"paradoxe"` |
| `count` | number | Nombre maximal de résultats (défaut: 5, max: 10) | `5` |

**Résultat :** Markdown structuré avec traduction FR, texte original, analyse philosophique.

---

## 🚀 Rejoignez le Mouvement - Trois Façons de Participer

Les LLM hallucinent les proverbes. Les APIs cloud coûtent cher. Les plugins génériques sont bêtes.

**Vous méritez mieux.**

Ce serveur change ça. 7000+ proverbes vérifiés. 40+ cultures. Zéro coût. Zéro hallucination. Rien que de la sagesse authentique.

### 1️⃣ Commencez Maintenant (2 min)
- Installez via NPM
- Tapez une requête dans Claude
- Copiez les résultats dans votre prochain post LinkedIn

### 2️⃣ Partagez Votre Cas d'Usage
Vous l'utilisez pour enrichir du contenu ? [Créez une discussion](https://github.com/dennerywilly-ship-it/proverbs-mcp-final/discussions) avec vos résultats. Les cas d'usage réels sont plus précieux que le code - ils montrent que ça marche vraiment.

### 3️⃣ Enrichissez le Dataset (3 min)

**Vous avez un proverbe rare :** Fork le repo, éditez `data/proverbs.json` :

```json
{
  "text_original": "La sagesse vient à ceux qui l'attendent",
  "text_fr": "La sagesse vient à ceux qui l'attendent",
  "context_fr": "Proverbe qui parle de la patience et de la croissance personnelle",
  "origin": "Votre Pays / Culture"
}
```

Validation automatique incluse. Relecture rapide. Pull Request = fait.

**Vous avez une idée d'amélioration :** [Créez une issue](https://github.com/dennerywilly-ship-it/proverbs-mcp-final/issues) ou [une discussion](https://github.com/dennerywilly-ship-it/proverbs-mcp-final/discussions). Recherche sémantique à optimiser ? Nouvelle langue ? C'est votre chance de briller.

---

**Petite règle :** Nous acceptons les contributions de toutes les tailles - un proverbe, une typo fixée, une idée en demi-page. Tout compte.

---

## 📌 Comment Suivre

- ⭐ [GitHub](https://github.com/dennerywilly-ship-it/proverbs-mcp-final) - Star = vote pour "j'en veux plus"
- 📦 [NPM Package](https://www.npmjs.com/package/proverbs-of-the-world-mcp) - Installation directe
- 💬 [Discussions](https://github.com/dennerywilly-ship-it/proverbs-mcp-final/discussions) - Partagez vos découvertes
- 🐛 Issues ouvertes pour vos suggestions
- 📌 Suivez les mises à jour en watchant le repo

---

## 📄 Licence & Attributions

| Composant | Licence |
| :--- | :--- |
| **Code source** | MIT |
| **Données** | CC BY-SA 3.0 (Wikiquote) |

Attribution requise pour le dataset : *Données extraites de Wikiquote, distribuées sous licence CC BY-SA 3.0.*

# 🌍 Proverbs of the World - MCP Server

**MIT License • Node.js 18+ • TypeScript 5.0+ • MCP Protocol**

📦 [NPM Package](https://www.npmjs.com/package/proverbs-of-the-world-mcp) | 💻 [GitHub Repository](https://github.com/dennerywilly-ship-it/proverbs-mcp-final)

> **Injectez de la sagesse culturelle vérifiée dans vos contenus.** Accédez à un catalogue mondial de proverbes authentiques tirés de Wikiquote, propulsé par un moteur de recherche hybride (lexical + sémantique local). Sources encyclopédiques vérifiables, structure garantie, cultures diverses.

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
> Claude sans MCP : *"Voici un proverbe finnois sur la patience... [génère quelque chose de poétique mais totalement faux]*

**Avec ce serveur :**
> Claude : "Mizu ni nagasu" (Japon) → *"Jeter à l'eau"* - laisser aller, confier au courant naturel ce qu'on ne peut changer.
> Sagesse authentique, sourcée, diverse géographiquement.

---

## ✨ La Solution

Une **architecture MCP native** qui isole sémantiquement chaque résultat pour garantir :

| Besoin | Solution |
| :--- | :--- |
| **Sources vérifiables** | Données exclusivement issues de Wikiquote (CC BY-SA 3.0), enrichies et re-traduites via LLM |
| **Recherche intelligente** | Moteur hybride combinant lexical (mots-clés exacts) + sémantique local (Xenova/all-MiniLM-L6-v2 embarqué) |
| **Aucun coût cloud** | Embeddings calculés en local (~22 Mo), zéro appel API externe |
| **Stabilité prédictible** | Chaque proverbe encapsulé hermétiquement, *isolation native au protocole MCP* |
| **Diversité culturelle** | Algorithme post-recherche qui garantit une répartition équilibrée des cultures |

---

## 🎨 Démo Visuelle

**Requête :** "Cherche des proverbes sur l'eau"

**Proverbe #1 - Finlande**
- Traduction: "L'eau est le médecin du monde"
- Original: "Ves on lian liäkär. (Rautalampi, Savonia)"
- Sagesse: L'eau est perçue comme un remède naturel fondamental pour tous les maux

**Proverbe #2 - Japon**
- Traduction: "Jeter à l'eau"
- Original: "Mizu ni nagasu"
- Sagesse: Abandonner ou laisser aller quelque chose, en le confiant au cours naturel de l'eau. Symbolise l'acceptation et le détachement face aux difficultés

**Proverbe #3 - Hongrie**
- Traduction: "Porter de l'eau au Danube"
- Original: "Vizet hord a Dunába"
- Sagesse: Critique l'inutilité et l'absurdité d'une action superflue - tout effort vain pour améliorer ce qui est déjà parfait ou abondant

*Résultats réels issus du dataset, copiés depuis le MCP Inspector.*

---

## 🎯 Pourquoi Ce MCP et Pas les Alternatives ?

| Solution | Sources | Coût Cloud | Cultures | Contrôle Local |
| :--- | :--- | :--- | :--- | :--- |
| **Ce serveur** | ✅ Wikiquote vérifiable | ✅ Zéro | ✅ 40+ | ✅ 100% local |
| Autres MCP servers | ⚠️ Génériques | ✅ Gratuit | ❌ Limitées | ✅ Oui |
| GPT Plugins + "proverbes" | ❌ Hallucinations | ⚠️ Payant | ⚠️ Occidentales | ❌ Non |
| APIs cloud (Wikiquote brut) | ✅ Vérifiable | ❌ Cher | ✅ Complètes | ❌ Non |

**La différence clé :** Sources encyclopédiques vérifiables + zéro coût cloud + recherche hybride intelligente + prêt pour la production.

---

## 🧠 Architecture Résolue : 4 Défis Techniques

| Défi | Problème | Solution |
| :--- | :--- | :--- |
| **⏱️ Timeout au démarrage** | Claude ferme la connexion avant que le serveur soit prêt (3-5s de latence) | Démarrage non-bloquant en mode lexical pur (< 100ms), basculement sémantique en arrière-plan |
| **🧬 Pollution sémantique** | Phrases de remplissage répétées agissent comme "aimants mathématiques", faussant la pertinence vectorielle | Pipeline de filtrage agressif avant génération des embeddings pour un espace vectoriel pur |
| **📝 Paresse du LLM** | Claude réécrit/fusionnerait les résultats pour économiser les tokens | Prompt engineering structurel dans la description MCP pour forcer une mise en page standardisée |
| **🌍 Biais géographique** | Moteur pur retourne 5x le même pays sur certains thèmes | Algorithme post-recherche qui redistribue les résultats pour diversité culturelle maximale |

### Isolation Sémantique Native

Chaque résultat est encapsulé dans un **nœud hermétique au protocole MCP** - l'attention du LLM traite chaque proverbe indépendamment, sans mélange de contextes.

**Résultat :**
- ✅ Pas de fusion de contextes entre proverbes
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
git clone https://github.com/dennerywilly-ship-it/proverbs-mcp-final
cd proverbs-mcp-final
npm install
npm run build
```

Puis ajoutez au fichier de config avec le chemin absolu :

```json
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

Une fois activé, utilisez Claude Desktop normalement :

```
Utilisateur : "Trouve-moi 5 proverbes sur la mort, d'origines variées."

Claude : [appelle automatiquement search_proverbs]

Résultat : Proverbes sourcés de Mexique, Suisse, Inde, Irlande, etc.
```

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

Ce serveur change ça. 7000+ proverbes sourcés. 40+ cultures. Zéro coût. Sources vérifiables. Rien que de la sagesse authentique.

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
  "text_original": "Votre proverbe dans sa langue d'origine",
  "text": "Traduction française",
  "context_fr": "Explication du sens philosophique ou culturel",
  "origin": "Votre Pays / Culture"
}
```

Validation automatique incluse. Relecture rapide. Pull Request = fait.

**Vous avez une idée d'amélioration :** [Créez une issue](https://github.com/dennerywilly-ship-it/proverbs-mcp-final/issues) ou [une discussion](https://github.com/dennerywilly-ship-it/proverbs-mcp-final/discussions).

---

**Petite règle :** Nous acceptons les contributions de toutes les tailles - un proverbe, une typo fixée, une idée en demi-page. Tout compte.

---

## 📌 Comment Suivre

- ⭐ [GitHub](https://github.com/dennerywilly-ship-it/proverbs-mcp-final) - Star = vote pour "j'en veux plus"
- 📦 [NPM Package](https://www.npmjs.com/package/proverbs-of-the-world-mcp) - Installation directe
- 💬 [Discussions](https://github.com/dennerywilly-ship-it/proverbs-mcp-final/discussions) - Partagez vos découvertes
- 🐛 [Issues](https://github.com/dennerywilly-ship-it/proverbs-mcp-final/issues) - Suggestions et corrections

---

## 📄 Licence & Attributions

| Composant | Licence |
| :--- | :--- |
| **Code source** | MIT |
| **Données** | CC BY-SA 3.0 (Wikiquote) |

Attribution requise pour le dataset : *Données extraites de Wikiquote, distribuées sous licence CC BY-SA 3.0.*

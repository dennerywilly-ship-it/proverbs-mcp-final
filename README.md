# 🌍 Proverbs of the World — MCP Server

[![NPM Version](https://img.shields.io/npm/v/proverbs-of-the-world-mcp?color=indigo&style=flat-square)](https://www.npmjs.com/package/proverbs-of-the-world-mcp)
[![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)
[![Protocol](https://img.shields.io/badge/protocol-MCP-vibrant?style=flat-square)](https://modelcontextprotocol.io)

> Élevez la qualité de vos contenus (posts LinkedIn, présentations, écrits créatifs) en y injectant de la sagesse culturelle internationale vérifiée et garantie zéro hallucination.

Un serveur MCP (Model Context Protocol) qui donne à votre IA (Claude Desktop, Cursor, etc.) un accès direct à un immense catalogue de proverbes authentiques du monde entier, propulsé par un moteur de recherche Hybride (Lexical + Sémantique Local via Transformers.js). Données extraites de Wikiquote (CC BY-SA 3.0).

---

## 💡 Pourquoi utiliser ce MCP plutôt qu'un prompt Claude classique ?

Si vous demandez simplement à Claude "Donne-moi un proverbe tibétain sur la patience", l'IA va s'exécuter, mais avec des risques majeurs que ce serveur MCP résout définitivement :

* ❌ Le problème de l'hallucination : Les LLM ont tendance à inventer de "beaux" proverbes crédibles mais totalement fictifs, ou à mélanger les cultures.
  * La solution MCP : L'IA est obligée de puiser dans un dataset fixe et historique. Les proverbes renvoyés sont réels et authentiques.
* ❌ Le biais de répétition : Sans outil externe, Claude tourne souvent autour des 10 mêmes proverbes du domaine public.
  * La solution MCP : Le serveur applique un algorithme de diversification géographique pour forcer l'IA à piocher dans des pépites culturelles internationales méconnues.
* ❌ Le gâchis de contexte (Tokens) : Charger une base de connaissances manuellement dans le chat alourdit la mémoire de l'IA.
  * La solution MCP : La recherche sémantique s'exécute en local sur votre machine en tâche de fond. Seuls les résultats parfaits sont injectés, optimisant vos tokens.

---

## ✨ Fonctionnalités clés

* 🧠 Moteur Hybride IA Local : Combine la puissance du mot-clé exact et la recherche conceptuelle par embeddings sémantiques (Modèle local all-MiniLM-L6-v2 embarqué, zéro coût d'API).
* 🎯 Zéro Hallucination : L'IA puise exclusivement dans des sources humaines et sourcées.
* 🇫🇷 Support du Français : Recherche croisée (Anglais/Français) avec neutralisation complète des accents et des majuscules.

## 🛠️ Outils inclus

Le serveur expose un outil principal intelligent et autonome :

| Outil | Description | Arguments | Output |
| :--- | :--- | :--- | :--- |
| search_proverbs | Cherche des proverbes pertinents par concept, thème ou mots-clés. | theme (string, requis), count (number, optionnel, défaut: 5) | Un rendu Markdown propre contenant le texte traduit et l'origine géographique. |

---

## 💡 Exemples d'utilisation avec l'IA

Grâce au moteur hybride, vous pouvez chercher par mot-clé précis ou par concept abstrait (ex: chercher "tristesse" remontera des proverbes contenant "chagrin" ou "larmes").

* 📝 Pour vos réseaux sociaux : "Rédige-moi un post LinkedIn sur l'importance de la persévérance en entreprise. Utilise un proverbe asiatique pertinent issu de mon outil pour illustrer le propos."
* 🎭 Pour l'inspiration : "Trouve-moi 3 proverbes d'origines différentes parlant de la nostalgie ou du temps qui passe."

---

## ⚠️ Limites actuelles & Qualité des données (V1.1)

Bien que le moteur de recherche soit désormais sémantique et robuste, gardez en tête ces éléments propres au MVP :

1. Premier démarrage : Lors du tout premier lancement après l'installation, le serveur télécharge automatiquement le modèle d'embeddings léger (~22 Mo). Cela peut ajouter un délai de quelques secondes à la première requête. Les lancements suivants sont instantanés.
2. Qualité du Dataset (Wikiquote) : Les données proviennent d'un export automatisé. Elles peuvent présenter de rares imperfections (doublons ou attributions géographiques globales comme "Afrique" ou "Europe" plutôt qu'un pays précis).
3. Traductions partielles : Si un proverbe rare n'a pas de traduction française fiable dans l'export, le texte original en anglais sera affiché.

---

## 🚀 Installation & Configuration

### Option A : Exécution directe via NPM (Recommandé)

Ouvrez votre fichier de configuration claude_desktop_config.json et insérez le bloc correspondant à votre système :

#### Pour Windows (npx.cmd)
{
  "mcpServers": {
    "proverbs-of-the-world": {
      "command": "npx.cmd",
      "args": ["-y", "proverbs-of-the-world-mcp"]
    }
  }
}

#### Pour macOS / Linux (npx)
{
  "mcpServers": {
    "proverbs-of-the-world": {
      "command": "npx",
      "args": ["-y", "proverbs-of-the-world-mcp"]
    }
  }
}

---

### Option B : Installation Locale (Développement)

1. Cloner et préparer le projet : npm install
2. Compiler le code : npm run build (grâce au script prepublishOnly, cette commande est aussi déclenchée automatiquement si vous devez publier).
3. Ajouter au fichier de configuration de Claude : Indiquez le chemin absolu vers le fichier construit (ex: /Chemin/Vers/proverbs-of-the-world-mcp/dist/index.js) en utilisant la commande node.

---

## 🔌 Vérifier l'activation du serveur

1. Quittez complètement l'application Claude Desktop (sous Windows : clic droit dans la barre des tâches -> Quit Claude).
2. Relancez l'application.
3. Allez dans les Paramètres de Claude > onglet Développeur. Votre serveur proverbs-of-the-world doit y figurer avec un badge bleu running.

---

## 🛠️ Dépannage (Troubleshooting)

### Le serveur reste bloqué sur failed au démarrage
* Vérifiez Node.js : Assurez-vous que Node est installé et disponible globalement (node -v dans votre terminal).
* Téléchargement du modèle bloqué : Le premier lancement requiert une connexion internet pour télécharger le modèle d'IA locale depuis HuggingFace. Vérifiez qu'un pare-feu ou un proxy ne bloque pas les requêtes sortantes de Claude Desktop.

---

## 🤝 Contribution & Format des Données

Pour enrichir le fichier data/proverbs.json via Pull Request :

[
  {
    "text_original": "Time is money.",
    "text_fr": "Le temps, c'est de l'argent.",
    "origin": "Angleterre"
  }
]

## 📄 Licence & Attributions
* Code : Sous licence MIT.
* Données : Contenu issu de Wikiquote, partagé sous licence libre CC BY-SA 3.0.
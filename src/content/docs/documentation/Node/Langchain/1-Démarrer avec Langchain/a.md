---
title : LCEL - LangChain Expression Language
description : LCEL - LangChain Expression Language
---

LangChain Expression Language (LCEL) est une syntaxe simplifiée et déclarative qui permet de composer des chaînes d'appels à des LLMs, des outils ou des transformations dans le cadre de LangChain. C'est une abstraction qui rend plus intuitif le processus de création et de manipulation de pipelines complexes.

Voici un guide pour démarrer avec LCEL et quelques exemples concrets.

---

### 1. **Qu'est-ce que LCEL ?**

LCEL vous permet de spécifier des opérations comme :

- L'appel de modèles de langage (LLM).
- L'utilisation d'outils ou de fonctions personnalisées.
- La manipulation et l'enchaînement des résultats.

**Structure de base :**

- Les variables et résultats intermédiaires sont manipulés sous forme de clés et valeurs.
- Chaque étape de la chaîne est déclarée explicitement.

---

### 2. **Installer et configurer LangChain avec TypeScript**

Pour commencer, installez les packages nécessaires :

```bash
npm install langchain openai dotenv
```

Créez un fichier `.env` pour y stocker votre clé API OpenAI (ou une autre clé selon votre LLM).

---

### 3. **Exemple simple d'utilisation de LCEL**

Voici un exemple pour composer une requête à un LLM avec LCEL en TypeScript :

```typescript
import { OpenAI } from "langchain/llms/openai";
import { Chain } from "langchain/chains";
import { LCELExecutor } from "langchain/executors";

// 1. Configurer l'instance LLM
const llm = new OpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 0.7,
});

// 2. Définir une chaîne LCEL
const lcelExpression = `
{
  "steps": [
    {
      "name": "generate_summary",
      "type": "llm",
      "inputs": {
        "prompt": "Summarize this text: {input_text}",
        "llm": "llm"
      }
    },
    {
      "name": "translate_summary",
      "type": "llm",
      "inputs": {
        "prompt": "Translate this summary into French: {generate_summary.result}",
        "llm": "llm"
      }
    }
  ]
}
`;

async function main() {
  // 3. Créer un exécuteur LCEL
  const executor = new LCELExecutor({ llms: { llm } });

  // 4. Fournir des données et exécuter
  const input = { input_text: "LangChain simplifies AI pipeline creation for developers." };
  const result = await executor.execute(lcelExpression, input);

  console.log("Summary:", result.generate_summary.result);
  console.log("Translation:", result.translate_summary.result);
}

main().catch(console.error);
```

---

### 4. **Explications :**

- **Steps (étapes)** : Chaque étape est définie dans l'objet `steps` avec un nom unique (`generate_summary` et `translate_summary` ici).
- **Inputs (entrées)** : Les entrées d'une étape sont des expressions dynamiques. Par exemple, `{generate_summary.result}` utilise le résultat d'une étape précédente.
- **Type** : Cela peut être `llm`, `tool`, ou autre selon votre objectif.

---

### 5. **Exemple avancé avec outils et analyse**

Imaginez que vous voulez utiliser un outil de recherche et ensuite générer un résumé :

```typescript
import { Tool, ChainTool } from "langchain/tools";
import { OpenAI } from "langchain/llms/openai";
import { LCELExecutor } from "langchain/executors";

// Exemple d'outil personnalisé
class SearchTool extends Tool {
  name = "search_tool";
  description = "Effectue une recherche sur le web";

  async call(input: string): Promise<string> {
    return `Résultat fictif pour: ${input}`; // Remplacez par une vraie logique.
  }
}

const llm = new OpenAI({ openAIApiKey: process.env.OPENAI_API_KEY });
const searchTool = new SearchTool();

const lcelExpression = `
{
  "steps": [
    {
      "name": "perform_search",
      "type": "tool",
      "inputs": {
        "tool_name": "search_tool",
        "input": "{query}"
      }
    },
    {
      "name": "summarize_search",
      "type": "llm",
      "inputs": {
        "prompt": "Summarize the following search result: {perform_search.result}",
        "llm": "llm"
      }
    }
  ]
}
`;

async function main() {
  const executor = new LCELExecutor({ tools: { search_tool: searchTool }, llms: { llm } });
  const input = { query: "Latest advancements in AI" };

  const result = await executor.execute(lcelExpression, input);

  console.log("Search Result:", result.perform_search.result);
  console.log("Summary:", result.summarize_search.result);
}

main().catch(console.error);
```

---

### 6. **Points importants**

- LCEL est conçu pour les workflows complexes, combinant plusieurs étapes.
- L'abstraction permet une gestion facile des données intermédiaires et de l'exécution des étapes.
- Vous pouvez inclure vos propres outils, fonctions ou étapes de transformation.

---

### 7. **Liens pour aller plus loin**

- [Documentation officielle de LangChain](https://docs.langchain.com)
- [Exemples dans le dépôt GitHub de LangChain](https://github.com/hwchase17/langchain)

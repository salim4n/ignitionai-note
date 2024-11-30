---
title : Créer une chaîne simple
description : Créer une chaîne simple
---


Pour créer une chaîne simple avec LangChain en TypeScript, nous allons effectuer une tâche unique, par exemple : générer une réponse d'un modèle de langage en fonction d'une entrée donnée.

---

### Objectif

Créer une chaîne simple qui prend une question en entrée, interroge un LLM (comme OpenAI GPT), et renvoie une réponse.

---

### Installation et configuration

Assurez-vous d'avoir installé **LangChain**, **OpenAI**, et les dépendances nécessaires :

```bash
npm install langchain openai dotenv
```

Créez un fichier `.env` pour y ajouter votre clé API OpenAI :

```env
OPENAI_API_KEY=your_api_key_here
```

---

### Code pour une chaîne simple

Voici un exemple minimaliste :

```typescript
import { OpenAI } from "langchain/llms/openai";
import { SimpleChain } from "langchain/chains";

// 1. Configurer le modèle LLM
const llm = new OpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 0.7, // Contrôle de la créativité
  modelName: "text-davinci-003", // Nom du modèle
});

// 2. Créer une chaîne simple
async function createSimpleChain(input: string) {
  // Initialiser la chaîne
  const chain = new SimpleChain({
    llm: llm,
    promptTemplate: "Q: {question}\nA:", // Modèle de prompt simple
  });

  // Exécuter la chaîne avec une question en entrée
  const response = await chain.call({ question: input });

  // Retourner la réponse
  console.log("Réponse:", response.text);
}

// 3. Utiliser la chaîne avec une entrée
createSimpleChain("Quelle est la capitale de la France ?")
  .then(() => console.log("Chaîne terminée !"))
  .catch((error) => console.error("Erreur :", error));
```

---

### Fonctionnement

1. **Initialisation du LLM** : Nous configurons le modèle OpenAI avec la clé API.
2. **Chaîne simple** : Une instance de `SimpleChain` est utilisée avec un modèle de prompt de base (`Q: {question}\nA:`).
3. **Appel de la chaîne** : La méthode `call()` exécute le modèle et renvoie une réponse basée sur l'entrée.

---

### Exemple de sortie

Pour l'entrée :  

```text
Quelle est la capitale de la France ?
```

Le modèle renverra :  

```text
Réponse: Paris
```

---

### Étapes suivantes

- Ajouter des étapes supplémentaires à la chaîne.
- Modifier les paramètres comme `temperature` pour ajuster la créativité.
- Passer d’une chaîne simple à une chaîne plus complexe avec des outils ou plusieurs étapes.

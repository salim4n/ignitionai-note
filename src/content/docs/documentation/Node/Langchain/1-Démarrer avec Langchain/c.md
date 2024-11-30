---
title : Interface d'invocation
description : Interface d'invocation
---

LangChain fournit des interfaces et des protocoles flexibles pour invoquer des chaînes. Que ce soit pour une chaîne simple ou une chaîne complexe avec plusieurs étapes, l'objectif est de pouvoir facilement intégrer et manipuler ces chaînes via des appels bien structurés.

Voici comment gérer cela en TypeScript :

---

## 1. **Concepts principaux**

### **Interface d'invocation**

Une chaîne dans LangChain est essentiellement une classe qui expose une méthode d'entrée, souvent appelée `call()`. Cette méthode :

- Accepte un dictionnaire (souvent de type `{ [key: string]: any }`) comme entrée.
- Retourne un résultat (souvent un objet ou une chaîne).

### **Protocole d'invocation**

Le protocole d'invocation repose sur :

- **Entrées JSON-like** : Les données d'entrée sont sérialisées au format clé-valeur.
- **Sorties JSON-like** : Les données renvoyées sont souvent des objets complexes, mais elles peuvent être des chaînes ou des nombres selon le cas.

---

## 2. **Créer une interface d'invocation**

### Exemple d'interface TypeScript pour invoquer une chaîne

```typescript
interface ChainInvocation {
  call(inputs: { [key: string]: any }): Promise<{ [key: string]: any }>;
}
```

Chaque chaîne implémente cette interface en fournissant sa propre logique dans la méthode `call`.

---

## 3. **Implémenter une chaîne avec une interface**

Voici un exemple où nous définissons une chaîne pour répondre à une question simple en utilisant un LLM.

```typescript
import { OpenAI } from "langchain/llms/openai";
import { SimpleChain } from "langchain/chains";

// Interface pour invoquer la chaîne
interface ChainInvocation {
  call(inputs: { [key: string]: any }): Promise<{ [key: string]: any }>;
}

// Implémentation d'une chaîne
class QuestionAnsweringChain implements ChainInvocation {
  private chain: SimpleChain;

  constructor(llm: OpenAI) {
    this.chain = new SimpleChain({
      llm,
      promptTemplate: "Q: {question}\nA:",
    });
  }

  async call(inputs: { [key: string]: any }): Promise<{ [key: string]: any }> {
    const result = await this.chain.call(inputs);
    return { answer: result.text };
  }
}

// Utilisation de la chaîne
async function main() {
  const llm = new OpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    temperature: 0.7,
  });

  const qaChain = new QuestionAnsweringChain(llm);
  const response = await qaChain.call({ question: "Quelle est la capitale de la France ?" });

  console.log("Réponse :", response.answer);
}

main().catch(console.error);
```

---

## 4. **Protocole HTTP pour invoquer les chaînes**

Pour rendre vos chaînes accessibles via une API HTTP, vous pouvez utiliser un framework comme **Fastify** ou **Express** en TypeScript.

### Exemple avec **Express**

#### Installer Express

```bash
npm install express body-parser
```

#### Serveur HTTP pour invoquer une chaîne

```typescript
import express from "express";
import bodyParser from "body-parser";
import { OpenAI } from "langchain/llms/openai";
import { SimpleChain } from "langchain/chains";

// Configuration du modèle
const llm = new OpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 0.7,
});

// Création de la chaîne
const chain = new SimpleChain({
  llm,
  promptTemplate: "Q: {question}\nA:",
});

// Initialisation du serveur Express
const app = express();
app.use(bodyParser.json());

// Endpoint HTTP pour appeler la chaîne
app.post("/invoke-chain", async (req, res) => {
  const { question } = req.body;
  if (!question) {
    return res.status(400).json({ error: "La question est obligatoire." });
  }

  try {
    const result = await chain.call({ question });
    res.json({ answer: result.text });
  } catch (error) {
    console.error("Erreur lors de l'appel à la chaîne :", error);
    res.status(500).json({ error: "Une erreur s'est produite." });
  }
});

// Démarrage du serveur
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
```

---

## 5. **Utilisation du protocole**

### Exemple d'appel via HTTP avec `curl`

```bash
curl -X POST http://localhost:3000/invoke-chain \
-H "Content-Type: application/json" \
-d '{"question": "Quelle est la capitale de la France ?"}'
```

### Réponse attendue

```json
{
  "answer": "Paris"
}
```

---

## 6. **Étapes suivantes**

- Ajouter des outils pour des chaînes plus complexes.
- Fournir des réponses enrichies (exemple : contexte, sources).
- Implémenter des validations d'entrées avec des bibliothèques comme **Joi** ou **Zod**.
- Conteneuriser l'API avec Docker pour faciliter le déploiement.

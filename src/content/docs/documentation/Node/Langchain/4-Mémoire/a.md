---
title: Utilisation de la mémoire dans LangChain
description: Utilisation de la mémoire dans LangChain
---

La **mémoire** dans **LangChain** permet de conserver le contexte des interactions pour gérer des conversations ou des workflows. Elle stocke des informations des échanges passés pour que le modèle puisse s'appuyer sur celles-ci lors de futures requêtes. Voici comment utiliser la mémoire avec LangChain en TypeScript.

---

## **Types de mémoire disponibles dans LangChain**

1. **BufferMemory** :
   - Stocke tout l'historique de la conversation en une seule chaîne.
2. **ConversationBufferMemory** :
   - Stocke l'historique des interactions dans une liste structurée (messages utilisateur/bot).
3. **ConversationSummaryMemory** :
   - Résume automatiquement les conversations longues pour économiser de l'espace mémoire.
4. **VectorStoreMemory** :
   - Utilise des embeddings pour stocker et rechercher dans l'historique de manière sémantique.

---

## **Exemple avec BufferMemory**

### **1. Installer les dépendances**

Si ce n'est pas déjà fait, installez LangChain et configurez une API pour le LLM :

```bash
npm install langchain dotenv
```

Ajoutez une clé OpenAI dans votre fichier `.env` :

```env
OPENAI_API_KEY=your_openai_api_key
```

---

### **2. Implémentation avec BufferMemory**

```typescript
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import { OpenAIChat } from "langchain/llms/openai";
import dotenv from "dotenv";

dotenv.config();

// Initialiser le modèle de langage
const llm = new OpenAIChat({
  openAIApiKey: process.env.OPENAI_API_KEY!,
  temperature: 0.7,
});

// Configurer la mémoire
const memory = new BufferMemory();

// Créer une chaîne conversationnelle avec mémoire
const chain = new ConversationChain({ llm, memory });

async function runConversation() {
  console.log("Première question utilisateur...");
  const response1 = await chain.call({ input: "Quel est le capital de la France ?" });
  console.log("Bot :", response1.response);

  console.log("\nDeuxième question utilisateur...");
  const response2 = await chain.call({ input: "Et quelle est sa population ?" });
  console.log("Bot :", response2.response);

  console.log("\nMémoire actuelle :");
  console.log(await memory.loadMemoryVariables({}));
}

runConversation().catch(console.error);
```

#### **Explication du code**

1. **Initialisation de la mémoire** :
   - `BufferMemory` stocke tout l'historique sous forme de texte concaténé.
2. **Interaction utilisateur** :
   - Les appels successifs à `chain.call()` ajoutent le contexte à la mémoire.
3. **Chargement de la mémoire** :
   - La méthode `memory.loadMemoryVariables()` permet d'afficher l'état actuel de la mémoire.

---

### **3. Résultat attendu**

**Entrées utilisateur :**

```text
User : Quel est le capital de la France ?
Bot  : Le capital de la France est Paris.

User : Et quelle est sa population ?
Bot  : La population de la France est d'environ 67 millions d'habitants.
```

**Mémoire actuelle :**

```json
{
  "history": "User: Quel est le capital de la France ?\nBot: Le capital de la France est Paris.\nUser: Et quelle est sa population ?\nBot: La population de la France est d'environ 67 millions d'habitants."
}
```

---

## **Exemple avec ConversationSummaryMemory**

Le **ConversationSummaryMemory** génère un résumé automatique des interactions passées pour éviter d'envoyer tout l'historique à chaque requête.

### **Implémentation**

```typescript
import { ConversationSummaryMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import { OpenAIChat } from "langchain/llms/openai";
import dotenv from "dotenv";

dotenv.config();

const llm = new OpenAIChat({
  openAIApiKey: process.env.OPENAI_API_KEY!,
  temperature: 0.7,
});

// Mémoire avec résumé
const memory = new ConversationSummaryMemory({ llm });

const chain = new ConversationChain({ llm, memory });

async function runSummarizedConversation() {
  console.log("Première question utilisateur...");
  await chain.call({ input: "Quel est le capital de la France ?" });

  console.log("\nDeuxième question utilisateur...");
  await chain.call({ input: "Peux-tu me rappeler ce que nous avons discuté ?" });

  console.log("\nRésumé actuel de la conversation :");
  console.log(await memory.loadMemoryVariables({}));
}

runSummarizedConversation().catch(console.error);
```

---

### **Exemple de sortie**

**Résumé généré :**

```json
{
  "summary": "L'utilisateur a demandé le capital de la France, et le bot a répondu que c'était Paris."
}
```

---

## **Utilisation de VectorStoreMemory**

Le **VectorStoreMemory** est utile pour des cas où vous devez rechercher des informations sémantiquement similaires dans l'historique.

### **Exemple avec une base SQLite pour la mémoire vectorielle**

1. Installez les dépendances nécessaires :

```bash
npm install langchain sqlite3
```

2. Implémentez le stockage vectoriel :

```typescript
import { VectorStoreRetrieverMemory } from "langchain/memory";
import { HNSWLib } from "langchain/vectorstores";
import { OpenAIEmbeddings } from "langchain/embeddings";
import { OpenAIChat } from "langchain/llms/openai";
import { ConversationChain } from "langchain/chains";
import * as path from "path";
import dotenv from "dotenv";

dotenv.config();

// Initialiser le stockage vectoriel
const vectorStore = await HNSWLib.fromExistingIndex(new OpenAIEmbeddings(), path.join(__dirname, "vector_store"));

// Mémoire avec recherche vectorielle
const memory = new VectorStoreRetrieverMemory({
  retriever: vectorStore.asRetriever(),
  memoryKey: "history",
});

// Modèle LLM
const llm = new OpenAIChat({
  openAIApiKey: process.env.OPENAI_API_KEY!,
  temperature: 0.7,
});

// Chaîne conversationnelle
const chain = new ConversationChain({ llm, memory });

async function runVectorStoreConversation() {
  console.log("Première interaction utilisateur...");
  await chain.call({ input: "Quel est le capital de l'Allemagne ?" });

  console.log("\nRecherche d'informations similaires dans l'historique...");
  const results = await memory.retriever.getRelevantDocuments("Allemagne");
  console.log("Résultats similaires :", results);
}

runVectorStoreConversation().catch(console.error);
```

---

## **Points clés**

1. La mémoire rend les interactions avec LangChain plus naturelles, en maintenant le contexte.
2. Les types de mémoire peuvent être choisis en fonction des besoins :
   - **BufferMemory** : Simple et efficace.
   - **SummaryMemory** : Gère des conversations longues.
   - **VectorStoreMemory** : Recherche sémantique dans l'historique.

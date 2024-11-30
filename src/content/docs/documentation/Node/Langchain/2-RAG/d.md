---
title : Exécuter une chaîne et générer du contenu augmenté
description : Exécuter une chaîne et générer du contenu augmenté
---

Pour exécuter une chaîne et générer du contenu augmenté avec un système RAG (Récupération-Augmentation-Génération), voici comment assembler les morceaux que nous avons construits précédemment. L'objectif est de **récupérer les données pertinentes d'un vector store** et de les **utiliser pour générer une réponse contextuelle augmentée**.

---

### **1. Structure de la chaîne RAG**

La chaîne suit ces étapes :

1. **Entrée utilisateur** : Une question ou requête.
2. **Récupération des données** : Recherche dans le vector store.
3. **Augmentation du contenu** : Génération d'une réponse avec un LLM en utilisant les données récupérées.

---

### **2. Code complet : Exécution de la chaîne**

#### **Étape 1 : Dépendances**

Assurez-vous d'avoir les bonnes bibliothèques :

```bash
npm install langchain pinecone dotenv
```

Et configurez vos clés d'API dans un fichier `.env`.

---

#### **Étape 2 : Configuration initiale**

```typescript
import { PineconeClient } from "@pinecone-database/pinecone";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { OpenAIChat } from "langchain/llms/openai";
import { VectorStoreRetriever } from "langchain/vectorstores";
import { RetrievalQAChain } from "langchain/chains";
import dotenv from "dotenv";

dotenv.config();
```

---

#### **Étape 3 : Initialiser le vector store**

On utilise Pinecone comme base de données vectorielle.

```typescript
async function initializePinecone() {
  const pinecone = new PineconeClient();
  await pinecone.init({
    apiKey: process.env.PINECONE_API_KEY!,
    environment: process.env.PINECONE_ENVIRONMENT!,
  });
  return pinecone.Index(process.env.PINECONE_INDEX_NAME!);
}
```

---

#### **Étape 4 : Créer une chaîne RAG**

La chaîne combine un récupérateur (retriever) avec un modèle génératif pour créer une réponse augmentée.

```typescript
async function createRAGChain() {
  const pineconeIndex = await initializePinecone();

  // Configurer le récupérateur
  const retriever = new VectorStoreRetriever({
    vectorStore: pineconeIndex,
    embedding: new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY!,
    }),
    topK: 5, // Limite le nombre de documents récupérés
  });

  // Configurer le LLM (GPT-4 ou GPT-3.5)
  const llm = new OpenAIChat({
    openAIApiKey: process.env.OPENAI_API_KEY!,
    temperature: 0.7, // Ajuste la créativité
  });

  // Créer la chaîne RAG
  const ragChain = RetrievalQAChain.fromLLM(llm, retriever, {
    returnSourceDocuments: true, // Inclure les sources dans la réponse
  });

  return ragChain;
}
```

---

#### **Étape 5 : Exécuter la chaîne**

On récupère les données du vector store et génère une réponse augmentée.

```typescript
async function runRAGChain(query: string) {
  const ragChain = await createRAGChain();

  const result = await ragChain.call({
    query, // La question de l'utilisateur
  });

  console.log("Réponse générée :", result.text);

  if (result.sourceDocuments) {
    console.log("\nSources utilisées :");
    result.sourceDocuments.forEach((doc: any, i: number) => {
      console.log(`Source ${i + 1}: ${doc.metadata.content}`);
    });
  }
}

// Exemple d'exécution
const query = "Qu'est-ce que LangChain et comment fonctionne-t-il avec Pinecone ?";
runRAGChain(query).catch(console.error);
```

---

### **3. Résultat attendu**

#### **Exemple de réponse générée**

Lorsque vous exécutez la chaîne avec une question comme :

```text
Qu'est-ce que LangChain et comment fonctionne-t-il avec Pinecone ?
```

Vous obtiendrez une réponse augmentée :

```text
Réponse générée : 
LangChain est une bibliothèque qui permet de créer des chaînes complexes en orchestrant des modèles de langage et des outils externes. 
Elle s'intègre facilement avec Pinecone, une base de données vectorielle, pour fournir des systèmes RAG performants.

Sources utilisées :
Source 1: LangChain est une bibliothèque pour créer des chaînes pilotées par des modèles de langage.
Source 2: Pinecone est une base de données vectorielle utilisée pour stocker des embeddings.
Source 3: LangChain permet une intégration facile avec Pinecone pour les systèmes RAG.
```

---

### **4. Points importants**

1. **Récupération des sources** : La réponse générée inclut les documents récupérés, ce qui est essentiel pour la traçabilité.
2. **Personnalisation du LLM** : Ajustez les paramètres comme `temperature` ou `maxTokens` selon les besoins.
3. **Indexation préalable** : Assurez-vous que vos documents sont bien indexés dans Pinecone avant d'exécuter la chaîne.

---

### **5. Étapes suivantes**

- **Améliorer la récupération** : Enrichissez les métadonnées pour filtrer les résultats.
- **UI Frontend** : Intégrez cette chaîne dans une application Next.js.
- **Monitoring** : Suivez les performances avec des outils comme LangSmith.

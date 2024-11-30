---
title : Créer un vector store avec des embeddings
description : Créer un vector store avec des embeddings
---

Créer un **vector store** avec des **embeddings** est une étape cruciale pour construire des systèmes RAG (Récupération-Augmentation-Génération). Voici comment le faire dans **TypeScript** avec LangChain.

---

### **1. Dépendances**

Assurez-vous d'installer les bibliothèques nécessaires :

```bash
npm install langchain pinecone dotenv
```

Créez un fichier `.env` pour stocker les clés d'API.

```env
OPENAI_API_KEY=your_openai_api_key
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_ENVIRONMENT=your_pinecone_environment
PINECONE_INDEX_NAME=your_index_name
```

---

### **2. Concepts clés**

1. **Vector Store** : Une base de données qui stocke les vecteurs (embeddings) générés à partir de données.
2. **Embeddings** : Des représentations numériques de texte ou de données, utilisées pour mesurer les similarités.
3. **Pinecone** : Une solution populaire pour les vector stores.

---

### **3. Code : Création d’un Vector Store avec Pinecone**

Voici un exemple complet pour :

- Générer des embeddings à partir de texte.
- Les stocker dans Pinecone.

#### **Étape 1 : Importer les modules**

```typescript
import { PineconeClient } from "@pinecone-database/pinecone";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { VectorStoreRetriever } from "langchain/vectorstores";
import dotenv from "dotenv";

dotenv.config();
```

---

#### **Étape 2 : Configurer Pinecone**

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

#### **Étape 3 : Indexer les données**

```typescript
async function indexDocuments(documents: string[]) {
  const pineconeIndex = await initializePinecone();

  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY!,
  });

  const vectors = await Promise.all(
    documents.map(async (doc, i) => ({
      id: `doc-${i}`,
      values: await embeddings.embed(doc),
      metadata: { content: doc },
    }))
  );

  await pineconeIndex.upsert({
    vectors,
  });

  console.log("Documents indexés !");
}
```

---

#### **Étape 4 : Recherche des données**

Pour interroger le vector store, nous utilisons un **retriever**.

```typescript
async function searchQuery(query: string) {
  const pineconeIndex = await initializePinecone();

  const retriever = new VectorStoreRetriever({
    vectorStore: pineconeIndex,
    embedding: new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY!,
    }),
    topK: 5, // Récupère les 5 résultats les plus proches
  });

  const results = await retriever.getRelevantDocuments(query);

  results.forEach((result) => {
    console.log("Document trouvé :", result.metadata.content);
  });
}
```

---

#### **Étape 5 : Exécution**

Ajoutez une fonction principale pour tester l’indexation et la recherche.

```typescript
async function main() {
  const documents = [
    "LangChain est une bibliothèque pour créer des chaînes pilotées par des modèles de langage.",
    "Pinecone est une base de données vectorielle utilisée pour stocker des embeddings.",
    "LangChain permet une intégration facile avec Pinecone pour les systèmes RAG.",
  ];

  // Indexer les documents
  await indexDocuments(documents);

  // Effectuer une recherche
  const query = "Qu'est-ce que LangChain ?";
  await searchQuery(query);
}

main().catch(console.error);
```

---

### **4. Explications**

#### a. **Indexer les documents**

- Les documents sont convertis en embeddings à l'aide d'`OpenAIEmbeddings`.
- Ces embeddings sont ensuite stockés dans Pinecone avec un ID et des métadonnées.

#### b. **Recherche des documents**

- Les embeddings de la requête utilisateur sont comparés aux embeddings stockés.
- Les résultats les plus pertinents sont retournés.

---

### **5. Résultat attendu**

Lors de l'exécution :

1. Les documents sont indexés avec leurs embeddings.
2. Une recherche comme **"Qu'est-ce que LangChain ?"** renverra un document pertinent, comme :

```text
Document trouvé : LangChain est une bibliothèque pour créer des chaînes pilotées par des modèles de langage.
```

---

### **6. Étapes supplémentaires**

1. **Fragmentation des données** : Si les documents sont longs, utilisez un découpage pour des résultats plus précis.
2. **Autres vector stores** : Si vous ne souhaitez pas utiliser Pinecone, LangChain prend en charge d'autres options comme `Weaviate`, `FAISS` ou `Chroma`.
3. **Amélioration de la recherche** : Affinez les prompts ou combinez plusieurs récupérateurs pour de meilleures performances.

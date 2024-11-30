---
title : Récupération augmentation génération 
description : Récupération-augmentation-génération
---

La création d'une chaîne de **Récupération-Augmentation-Génération (RAG)** dans LangChain implique deux principales composantes :

1. **Récupération des données** : Utiliser un récupérateur (retriever) pour rechercher des informations pertinentes dans une base de données (ex. vecteurs).
2. **Génération augmentée** : Utiliser un modèle LLM pour générer une réponse augmentée par les données récupérées.

Voici une implémentation en TypeScript.

---

### **1. Préparation**

Assurez-vous d’avoir les dépendances nécessaires :

```bash
npm install langchain openai pinecone dotenv
```

Créez un fichier `.env` pour les clés d'API :

```env
OPENAI_API_KEY=your_openai_api_key
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_ENVIRONMENT=your_pinecone_environment
PINECONE_INDEX_NAME=your_index_name
```

---

### **2. Exemple complet**

```typescript
import { OpenAI } from "langchain/llms/openai";
import { PineconeClient } from "@pinecone-database/pinecone";
import { VectorStoreRetriever } from "langchain/vectorstores";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RetrievalAugmentedGenerationChain } from "langchain/chains";

// Fonction principale
async function main() {
  // 1. Initialiser le modèle OpenAI
  const llm = new OpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    temperature: 0.7, // Ajuste la créativité
  });

  // 2. Configurer Pinecone pour la récupération
  const pinecone = new PineconeClient();
  await pinecone.init({
    apiKey: process.env.PINECONE_API_KEY,
    environment: process.env.PINECONE_ENVIRONMENT,
  });

  const index = pinecone.Index(process.env.PINECONE_INDEX_NAME!);

  const retriever = new VectorStoreRetriever({
    vectorStore: index,
    embedding: new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    }),
    topK: 3, // Récupérer les 3 résultats les plus proches
  });

  // 3. Construire la chaîne RAG
  const ragChain = new RetrievalAugmentedGenerationChain({
    llm,
    retriever,
    promptTemplate: `
      Voici quelques informations récupérées : {retrievedData}.
      Basé sur cela, répondez à la question suivante : {question}.
    `,
  });

  // 4. Fournir une question pour tester la chaîne
  const question = "Quels sont les avantages de l'utilisation de LangChain ?";
  const result = await ragChain.call({ question });

  // 5. Afficher la réponse
  console.log("Réponse générée :", result.text);
}

main().catch((error) => {
  console.error("Erreur :", error);
});
```

---

### **3. Explications**

1. **LLM avec OpenAI** :
   - Utilise un modèle comme `text-davinci-003` ou `gpt-4` pour la génération de texte.

2. **Base de données Pinecone** :
   - Sert à stocker et récupérer des vecteurs. Vous pouvez créer des vecteurs à partir de vos données (par exemple, des documents texte).

3. **Récupérateur (Retriever)** :
   - Fournit un mécanisme pour rechercher les vecteurs les plus proches en fonction de l'entrée utilisateur (question).

4. **Chaîne RAG** :
   - Combine les informations récupérées avec un modèle LLM pour générer des réponses enrichies.

5. **Prompt template** :
   - Structure les entrées pour le modèle afin de guider la génération.

---

### **4. Données pour Pinecone**

#### Indexer des données dans Pinecone

Ajoutez des documents avant de les interroger.

```typescript
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeClient } from "@pinecone-database/pinecone";

async function indexDocuments(documents: string[]) {
  const pinecone = new PineconeClient();
  await pinecone.init({
    apiKey: process.env.PINECONE_API_KEY,
    environment: process.env.PINECONE_ENVIRONMENT,
  });

  const index = pinecone.Index(process.env.PINECONE_INDEX_NAME!);

  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  const vectors = await Promise.all(
    documents.map(async (doc, i) => ({
      id: `doc-${i}`,
      values: await embeddings.embed(doc),
      metadata: { content: doc },
    }))
  );

  await index.upsert({
    vectors,
  });

  console.log("Documents indexés !");
}

// Appel avec des documents exemples
indexDocuments([
  "LangChain est une bibliothèque pour construire des applications pilotées par des modèles de langage.",
  "Elle fournit des outils pour orchestrer des chaînes complexes.",
  "LangChain facilite la récupération d'informations et l'intégration avec des bases vectorielles.",
]);
```

---

### **5. Résultat attendu**

#### Entrée

```text
Quels sont les avantages de l'utilisation de LangChain ?
```

#### Sortie générée

```text
LangChain est utile pour construire des applications pilotées par des modèles de langage. Il fournit des outils pour orchestrer des chaînes et simplifie la récupération d'informations à partir de bases vectorielles comme Pinecone.
```

---

### **Étapes suivantes**

- **Ajouter des outils** : Comme un moteur de recherche ou une base de connaissances.
- **Personnaliser les prompts** : Pour un meilleur contrôle des réponses générées.
- **Gérer des données structurées** : Comme des tableaux ou des graphiques.

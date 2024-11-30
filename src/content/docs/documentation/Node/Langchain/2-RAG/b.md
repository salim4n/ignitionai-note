---
title : Fragmenter les données
description : Fragmenter les données
---

Fragmenter les données avant leur indexation est essentiel pour les systèmes RAG, surtout lorsqu'on travaille avec des bases vectorielles comme Pinecone. Cela permet de diviser des documents volumineux en fragments plus petits, ce qui facilite une récupération plus précise et efficace.

---

### **1. Pourquoi fragmenter les données ?**

- **Granularité** : Permet de chercher et récupérer des informations pertinentes au niveau du paragraphe ou de la phrase.
- **Limitation des contextes LLM** : Les modèles LLM comme GPT ont des limitations en termes de longueur de contexte. En fragmentant, vous réduisez le risque de dépassement.

---

### **2. Étapes pour fragmenter les données**

#### a. Diviser les documents en fragments

Cela peut être fait en découpant par :

- **Nombre de caractères** (par exemple, 512 caractères).
- **Nombre de tokens** (utile pour aligner avec les limitations des LLM).
- **Délimiteurs logiques** (comme les paragraphes ou les phrases).

#### b. Ajouter des métadonnées

Chaque fragment peut être associé à des métadonnées comme :

- L'identifiant du document source.
- Le numéro de section ou paragraphe.

---

### **3. Exemple TypeScript : Fragmentation de données**

Voici une méthode pour diviser un document en fragments basés sur des longueurs de caractères.

```typescript
function splitText(
  text: string,
  chunkSize: number = 500,
  overlap: number = 50
): string[] {
  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    const chunk = text.slice(start, end);
    chunks.push(chunk.trim());
    start += chunkSize - overlap; // Permet une légère superposition
  }

  return chunks;
}

// Exemple d'utilisation
const document = `
LangChain est une bibliothèque puissante pour construire des applications basées sur des modèles de langage. 
Elle permet l'orchestration de chaînes complexes et l'intégration avec des outils comme les bases vectorielles. 
Grâce à LangChain, vous pouvez facilement récupérer et augmenter des données avec des LLM.
`;

const chunks = splitText(document, 100, 20); // Divise en morceaux de 100 caractères avec un chevauchement de 20
console.log(chunks);
```

---

### **4. Ajouter des métadonnées et indexer dans Pinecone**

Une fois les fragments créés, vous pouvez les associer à des métadonnées et les indexer dans Pinecone.

#### Étape complète avec fragmentation et indexation

```typescript
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeClient } from "@pinecone-database/pinecone";

function splitText(
  text: string,
  chunkSize: number = 500,
  overlap: number = 50
): string[] {
  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    const chunk = text.slice(start, end);
    chunks.push(chunk.trim());
    start += chunkSize - overlap;
  }

  return chunks;
}

async function indexDocumentsWithFragments(documents: string[]) {
  const pinecone = new PineconeClient();
  await pinecone.init({
    apiKey: process.env.PINECONE_API_KEY,
    environment: process.env.PINECONE_ENVIRONMENT,
  });

  const index = pinecone.Index(process.env.PINECONE_INDEX_NAME!);

  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  for (const [docId, doc] of documents.entries()) {
    const fragments = splitText(doc, 500, 50);

    const vectors = await Promise.all(
      fragments.map(async (fragment, i) => ({
        id: `doc-${docId}-frag-${i}`,
        values: await embeddings.embed(fragment),
        metadata: { content: fragment, source: `doc-${docId}`, fragmentIndex: i },
      }))
    );

    await index.upsert({
      vectors,
    });
  }

  console.log("Fragments indexés avec succès !");
}

// Exemple d'utilisation
const documents = [
  "LangChain est une bibliothèque puissante pour construire des applications basées sur des modèles de langage.",
  "Elle permet l'orchestration de chaînes complexes et l'intégration avec des outils comme les bases vectorielles.",
];

indexDocumentsWithFragments(documents).catch(console.error);
```

---

### **5. Structure des données dans Pinecone**

Chaque vecteur dans Pinecone aura des métadonnées comme :

```json
{
  "id": "doc-0-frag-1",
  "values": [0.123, 0.456, ...],
  "metadata": {
    "content": "Elle permet l'orchestration de chaînes complexes et l'intégration avec des outils comme les bases vectorielles.",
    "source": "doc-0",
    "fragmentIndex": 1
  }
}
```

---

### **6. Recherche avec fragments**

Lorsque vous interrogez Pinecone, les fragments récupérés peuvent être combinés pour produire une réponse augmentée :

```typescript
const results = await retriever.getRelevantDocuments("Qu'est-ce que LangChain ?");
results.forEach((doc) => {
  console.log(`Source : ${doc.metadata.source}`);
  console.log(`Fragment : ${doc.metadata.content}`);
});
```

---

### **Étapes suivantes**

1. **Améliorer la logique de division** : Utilisez des bibliothèques comme `nltk` (en Python) ou des outils NLP pour fragmenter par phrases.
2. **Personnalisation des métadonnées** : Inclure des tags pour la source, les dates, ou autres informations utiles.
3. **Regroupement des résultats** : Implémenter un processus pour combiner les fragments récupérés dans une réponse cohérente.

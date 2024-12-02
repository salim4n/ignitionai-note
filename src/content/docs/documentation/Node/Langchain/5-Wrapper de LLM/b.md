---
title : Recherche augmentée (RAG) avec mémoire et Qwen
description : Recherche augmentée (RAG) avec mémoire et Qwen
---


### Cas d'usage avancé : **Recherche augmentée (RAG) avec mémoire et Qwen**

Dans ce cas d'usage, nous combinons :

1. **Qwen comme LLM** : Pour générer des réponses basées sur un contexte enrichi.
2. **Recherche augmentée (RAG)** : Utilisation d’un `VectorStoreRetriever` pour fournir des informations pertinentes.
3. **Mémoire hybride** : Mélange d’une mémoire tampon pour les messages récents et d’une mémoire vectorielle pour les recherches sémantiques.

---

### **Scénario**

Imaginez un chatbot éducatif qui aide les étudiants à poser des questions sur un cours. Le bot :

1. Récupère des informations pertinentes dans une base de données vectorielle (ex : documents PDF de cours).
2. Conserve l'historique récent pour maintenir le contexte.
3. Génère des réponses enrichies via Qwen.

---

### **Étapes et Code**

#### 1. **Configuration des dépendances**

Installez les dépendances nécessaires :

```bash
npm install @huggingface/inference langchain
npm install @huggingface/hub fs-extra dotenv
```

Ajoutez votre clé Hugging Face dans un fichier `.env` :

```plaintext
HUGGINGFACE_API_KEY=your_hf_token
```

---

#### 2. **Initialiser le Vector Store**

Créez une base vectorielle à partir de vos données textuelles. Ici, nous supposons que vous avez un fichier `data.txt` contenant le contenu des cours.

```typescript
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { HNSWLib } from "langchain/vectorstores";
import * as fs from "fs-extra";

async function createVectorStore() {
  const content = await fs.readFile("data.txt", "utf-8");
  const docs = [{ pageContent: content }];

  // Embeddings pour les vecteurs
  const embeddings = new OpenAIEmbeddings();

  // Création du Vector Store
  const vectorStore = await HNSWLib.fromDocuments(docs, embeddings);
  await vectorStore.save("vector_store");

  console.log("Vector store créé et sauvegardé !");
}

createVectorStore();
```

---

#### 3. **Configurer Qwen comme LLM**

Nous utilisons notre wrapper `QwenLLM` défini précédemment pour connecter le modèle.

```typescript
import { HfInference } from "@huggingface/inference";
import { BaseLLM } from "langchain/llms/base";

class QwenLLM extends BaseLLM {
  private client: HfInference;
  private model: string;

  constructor(config: { model: string; hfToken: string }) {
    super({});
    this.client = new HfInference(config.hfToken);
    this.model = config.model;
  }

  async _call(prompt: string): Promise<string> {
    let response = "";
    const stream = this.client.chatCompletionStream({
      model: this.model,
      messages: [{ role: "user", content: prompt }],
    });

    for await (const chunk of stream) {
      if (chunk.choices && chunk.choices.length > 0) {
        response += chunk.choices[0].delta.content;
      }
    }

    return response;
  }
}
```

---

#### 4. **Créer une chaîne avec recherche augmentée et mémoire**

Voici une chaîne qui combine Qwen, un `VectorStoreRetriever`, et une mémoire.

```typescript
import { ConversationChain, RetrievalQAChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";
import { HNSWLib } from "langchain/vectorstores";

// Initialiser Qwen
const qwen = new QwenLLM({
  model: "Qwen/Qwen2.5-72B-Instruct",
  hfToken: process.env.HUGGINGFACE_API_KEY!,
});

// Charger le vector store
async function loadVectorStore() {
  return await HNSWLib.load("vector_store", new OpenAIEmbeddings());
}

// Configurer la chaîne
async function createRAGChain() {
  const vectorStore = await loadVectorStore();

  // Configurer le retriever
  const retriever = vectorStore.asRetriever();

  // Mémoire tampon
  const memory = new BufferMemory({
    memoryKey: "history",
    returnMessages: true,
  });

  // Chaîne RAG
  const chain = new RetrievalQAChain({
    retriever: retriever,
    llm: qwen,
    memory: memory,
  });

  return chain;
}

// Exécuter une requête
async function runRAGChain() {
  const chain = await createRAGChain();

  // Questions utilisateur
  console.log("Question utilisateur 1...");
  let response = await chain.call({ query: "Qu'est-ce qu'une boucle for ?" });
  console.log("Bot :", response);

  console.log("Question utilisateur 2...");
  response = await chain.call({ query: "Peux-tu donner un exemple ?" });
  console.log("Bot :", response);
}

runRAGChain().catch(console.error);
```

---

### **Explications**

1. **Vector Store** :
   - Les documents sont stockés sous forme d'embeddings vectoriels pour une recherche rapide.
   - Le bot récupère des contextes pertinents à partir de cette base.

2. **LLM Qwen** :
   - Utilisé pour générer des réponses enrichies à partir des données récupérées.

3. **Mémoire** :
   - La mémoire tampon conserve les échanges récents pour que le bot réponde de manière contextuelle.

---

### **Cas pratiques étendus**

1. **Recherche documentaire académique** :
   - Indexez des livres ou des articles pour créer un assistant d’étude.

2. **Support client intelligent** :
   - Utilisez des logs d’assistance ou des guides techniques comme base documentaire.

3. **Assistant code/technique** :
   - Couplez des extraits de documentation technique pour fournir des explications détaillées.

---

### **Améliorations potentielles**

- Ajouter une mémoire vectorielle pour conserver les réponses importantes et les réutiliser plus tard.
- Utiliser des bases vectorielles comme **Pinecone** ou **Weaviate** pour gérer de gros volumes de données.
- Permettre à l'utilisateur de définir des préférences (ex : style de réponse, niveau de détail).

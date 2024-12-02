---
title: Approfondir l'utilisation de la mémoire
description: Approfondir l'utilisation de la mémoire
---




Approfondir l’utilisation de la mémoire avec LangChain peut se faire en explorant des cas avancés qui combinent plusieurs types de mémoire, des mécanismes de récupération contextuelle, ou encore des intégrations avec des bases de données ou des vector stores sophistiqués.

Voici une idée pour pousser plus loin l’utilisation de la mémoire :

---

## **Créer une mémoire hybride avec combinaison de types**

### **Concept**

- Utiliser plusieurs types de mémoire en parallèle :
  - **Résumé global** : pour garder une vue d’ensemble de la conversation.
  - **Historique détaillé** : pour conserver les messages récents.
  - **Recherche sémantique** : pour récupérer des informations contextuellement pertinentes.

Cela permet de gérer des conversations longues en maintenant un équilibre entre performance et pertinence.

---

### **Exemple d’implémentation : Mémoire hybride**

#### **Objectif**

Créer une chaîne conversationnelle qui :

1. Récupère le résumé global pour fournir du contexte général.
2. Récupère les messages récents pour conserver une dynamique conversationnelle.
3. Recherche dans un stockage vectoriel pour répondre à des questions spécifiques.

---

### **Code complet en TypeScript**

```typescript
import { ConversationSummaryMemory, BufferMemory, CombinedMemory } from "langchain/memory";
import { OpenAIChat } from "langchain/llms/openai";
import { ConversationChain } from "langchain/chains";
import { HNSWLib } from "langchain/vectorstores";
import { OpenAIEmbeddings } from "langchain/embeddings";
import * as path from "path";
import dotenv from "dotenv";

dotenv.config();

// Fonction pour configurer une mémoire hybride
async function createHybridMemory(llm: OpenAIChat) {
  // Mémoire basée sur un résumé global
  const summaryMemory = new ConversationSummaryMemory({ llm });

  // Mémoire tampon pour conserver l'historique récent
  const bufferMemory = new BufferMemory();

  // Mémoire vectorielle pour la recherche sémantique
  const vectorStore = await HNSWLib.fromExistingIndex(
    new OpenAIEmbeddings(),
    path.join(__dirname, "vector_store")
  );

  const vectorMemory = vectorStore.asRetriever();

  // Combinaison de toutes les mémoires
  const combinedMemory = new CombinedMemory({
    memories: [
      { memory: summaryMemory, memoryKey: "summary" },
      { memory: bufferMemory, memoryKey: "recent" },
      { memory: vectorMemory, memoryKey: "semantic" },
    ],
  });

  return combinedMemory;
}

// Initialiser le modèle
const llm = new OpenAIChat({
  openAIApiKey: process.env.OPENAI_API_KEY!,
  temperature: 0.7,
});

// Créer une chaîne conversationnelle avec mémoire hybride
async function createConversationChain() {
  const memory = await createHybridMemory(llm);

  const chain = new ConversationChain({
    llm,
    memory,
  });

  return chain;
}

// Exécuter une conversation
async function runHybridConversation() {
  const chain = await createConversationChain();

  console.log("Première question utilisateur...");
  await chain.call({ input: "Quel est le capital de la France ?" });

  console.log("\nDeuxième question utilisateur...");
  await chain.call({ input: "Peux-tu me rappeler ce que nous avons discuté ?" });

  console.log("\nQuestion sémantique...");
  const response = await chain.call({ input: "Y a-t-il des informations liées à l'Europe ?" });
  console.log("Bot :", response.response);
}

runHybridConversation().catch(console.error);
```

---

### **Fonctionnement détaillé**

1. **Résumé global** :
   - Utilise `ConversationSummaryMemory` pour créer un résumé synthétique des interactions.
   - Pratique pour les conversations longues où un historique complet serait coûteux.

2. **Historique récent** :
   - Utilise `BufferMemory` pour garder les derniers messages.
   - Maintient le fil de la conversation à court terme.

3. **Recherche vectorielle** :
   - Intègre un stockage vectoriel avec HNSWLib.
   - Permet de rechercher des informations pertinentes dans un large corpus ou des historiques passés.

4. **Combinaison** :
   - `CombinedMemory` agit comme un hub qui orchestre les différentes mémoires pour répondre aux besoins spécifiques.

---

### **Avantages**

- **Flexibilité** : Combine plusieurs approches pour une couverture complète.
- **Performance** : Évite d’envoyer tout l’historique au modèle grâce au résumé et à la recherche sémantique.
- **Réutilisabilité** : La recherche vectorielle permet d’interroger un historique même après plusieurs sessions.

---

### **Améliorations possibles**

- **Mémoire à long terme** : Connecter le stockage vectoriel à une base de données comme Pinecone, Weaviate ou un stockage SQL.
- **Multi-utilisateur** : Ajouter une logique pour différencier les conversations selon les utilisateurs (par ID ou session).
- **Personnalisation des résumés** : Utiliser des modèles spécialisés pour produire des résumés encore plus précis.

---

### **Cas pratiques pour approfondir**

1. **Chat d'assistance client** :
   - Conserver les interactions des utilisateurs dans une mémoire vectorielle pour anticiper les besoins récurrents.

2. **Assistant de recherche documentaire** :
   - Coupler la mémoire vectorielle à une base de données contenant des articles scientifiques.

3. **Application éducative** :
   - Maintenir un historique des questions posées par les étudiants et les résumer dans un format structuré.

---

En approfondissant cette approche, vous pouvez simuler une mémoire humaine qui mélange contexte immédiat, connaissances générales et récupération rapide de détails spécifiques

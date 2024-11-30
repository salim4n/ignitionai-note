---
title : Ajouter un StrOutputParser
description : Ajouter un StrOutputParser
---


Ajouter un **`StrOutputParser`** dans une chaîne RAG améliore la gestion de la sortie du modèle en s'assurant que le format des résultats est conforme aux attentes. Voici comment compléter une chaîne RAG pour inclure un **parseur de sortie textuelle**.

---

### **1. Pourquoi utiliser `StrOutputParser` ?**

- **Validation des résultats** : Assure que la sortie du LLM est bien structurée (ex. JSON, texte brut, etc.).
- **Transformation** : Convertit les résultats en un format spécifique avant leur utilisation.
- **Erreurs minimisées** : Gère les sorties inattendues.

---

### **2. Ajout d’un `StrOutputParser`**

Voici comment compléter la chaîne avec le `StrOutputParser`.

#### **Étape 1 : Importer et définir le parseur**

Ajoutez l'importation et la configuration nécessaires.

```typescript
import { StrOutputParser } from "langchain/schema/outputParser";
```

Le `StrOutputParser` est basique : il renvoie la sortie brute du modèle. Vous pouvez le remplacer par un parseur personnalisé si nécessaire.

```typescript
const outputParser = new StrOutputParser();
```

---

#### **Étape 2 : Mettre à jour la chaîne RAG**

Incluez le parseur dans la configuration de la chaîne.

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

  // Ajouter un parseur de sortie
  const ragChain = RetrievalQAChain.fromLLM(llm, retriever, {
    returnSourceDocuments: true, // Inclure les sources
    outputParser, // Ajouter le parseur ici
  });

  return ragChain;
}
```

---

#### **Étape 3 : Exécuter et parser la sortie**

Modifiez la fonction d’exécution pour inclure le traitement de la sortie.

```typescript
async function runRAGChain(query: string) {
  const ragChain = await createRAGChain();

  const result = await ragChain.call({
    query, // La question de l'utilisateur
  });

  // Utiliser le parseur sur la réponse
  const parsedOutput = await outputParser.parse(result.text);

  console.log("Réponse générée (parsée) :", parsedOutput);

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

Le `StrOutputParser` renverra la réponse sous forme de texte brut (ou dans le format attendu si vous utilisez un parseur plus complexe).

Exemple de sortie :

```text
Réponse générée (parsée) :
LangChain est une bibliothèque qui permet de créer des chaînes complexes en orchestrant des modèles de langage et des outils externes. Elle s'intègre facilement avec Pinecone.

Sources utilisées :
Source 1: LangChain est une bibliothèque pour créer des chaînes pilotées par des modèles de langage.
Source 2: Pinecone est une base de données vectorielle utilisée pour stocker des embeddings.
Source 3: LangChain permet une intégration facile avec Pinecone pour les systèmes RAG.
```

---

### **4. Étendre avec un parseur personnalisé**

Si vous avez besoin de sorties plus complexes (comme du JSON ou des tableaux), vous pouvez créer un parseur personnalisé :

```typescript
import { BaseOutputParser } from "langchain/schema/outputParser";

class JSONOutputParser extends BaseOutputParser {
  async parse(text: string): Promise<any> {
    try {
      return JSON.parse(text);
    } catch (error) {
      throw new Error("Échec de l'analyse JSON : " + error.message);
    }
  }

  getFormatInstructions(): string {
    return "Retournez la réponse sous forme de JSON valide.";
  }
}
```

Puis utilisez ce parseur dans la chaîne :

```typescript
const outputParser = new JSONOutputParser();
```

---

### **5. Points importants**

- **Validation** : Toujours vérifier que les réponses du modèle suivent le format attendu.
- **Debugging** : Si les sorties ne sont pas conformes, utilisez les instructions de format pour guider le modèle.
- **Personnalisation** : Adaptez le parseur aux besoins spécifiques de votre application.

---
title: Wrapper de LLM
description: Wrapper de LLM
---

Oui, il est possible d'utiliser **Qwen** de manière similaire avec LangChain, grâce à la flexibilité des modules **LLM** de LangChain. Le concept est de créer une classe personnalisée pour intégrer Qwen en tant que modèle LLM. Voici comment procéder :

---

## **Étape 1 : Intégrer Qwen avec LangChain**

LangChain n'a pas d'intégration native avec `@huggingface/inference` (pour Qwen), mais vous pouvez créer un wrapper personnalisé en utilisant l'API des LLMs.

---

### **Code d'intégration avec LangChain**

Voici un exemple d'implémentation pour utiliser Qwen via Hugging Face :

```typescript
import { BaseLLM } from "langchain/llms/base";
import { HfInference } from "@huggingface/inference";

interface QwenLLMConfig {
  model: string;
  hfToken: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
}

class QwenLLM extends BaseLLM {
  private client: HfInference;
  private model: string;
  private temperature: number;
  private maxTokens: number;
  private topP: number;

  constructor(config: QwenLLMConfig) {
    super({});
    this.client = new HfInference(config.hfToken);
    this.model = config.model;
    this.temperature = config.temperature || 0.7;
    this.maxTokens = config.maxTokens || 2048;
    this.topP = config.topP || 0.9;
  }

  _llmType(): string {
    return "qwen";
  }

  async _call(prompt: string, stop?: string[]): Promise<string> {
    let output = "";
    const stream = this.client.chatCompletionStream({
      model: this.model,
      messages: [{ role: "user", content: prompt }],
      temperature: this.temperature,
      max_tokens: this.maxTokens,
      top_p: this.topP,
    });

    for await (const chunk of stream) {
      if (chunk.choices && chunk.choices.length > 0) {
        const newContent = chunk.choices[0].delta.content;
        output += newContent;
      }
    }

    return output;
  }
}
```

---

### **Étape 2 : Utiliser Qwen dans une chaîne LangChain**

Vous pouvez maintenant utiliser cette classe comme toute autre instance LLM dans LangChain.

#### Exemple d'utilisation avec une chaîne simple

```typescript
import { LLMChain, PromptTemplate } from "langchain/chains";

// Initialiser le modèle Qwen
const qwen = new QwenLLM({
  model: "Qwen/Qwen2.5-72B-Instruct",
  hfToken: "YOUR_HF_TOKEN",
  temperature: 0.5,
  maxTokens: 1024,
});

// Définir un prompt
const prompt = new PromptTemplate({
  template: "You are an assistant. Answer this question: {question}",
  inputVariables: ["question"],
});

// Créer une chaîne
const chain = new LLMChain({
  llm: qwen,
  prompt: prompt,
});

// Appeler la chaîne
const response = await chain.call({ question: "What is the capital of France?" });

console.log(response.text);
```

---

## **Étape 3 : Support des flux (streaming)**

Si vous souhaitez garder le flux interactif, vous pouvez intégrer la gestion des streams directement dans une chaîne ou dans des interfaces.

### **Exemple : Streaming interactif**

Ajoutez un callback ou un gestionnaire à l’intérieur de `_call` dans `QwenLLM` pour recevoir les tokens en temps réel.

---

### **Cas d'usage avancés**

1. **Combinaison avec la mémoire** :
   - Utiliser `QwenLLM` dans une chaîne qui inclut une mémoire pour des dialogues riches.
2. **Vector Store RAG** :
   - Coupler Qwen avec un `VectorStoreRetriever` pour les tâches de recherche augmentée.
3. **Personnalisation des arrêts (stop sequences)** :
   - Ajouter des options pour gérer des séquences d'arrêt (`stop`) spécifiques selon vos cas d’usage.

---

Cette méthode permet d'exploiter la puissance de Qwen via LangChain tout en bénéficiant de l'écosystème riche de LangChain pour composer des chaînes, des pipelines ou des applications complexes

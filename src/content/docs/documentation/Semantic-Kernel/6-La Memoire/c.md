---
title : Exemple de RAG
description : Exemple de RAG
---


Voici un exemple pratique de **Retrieval-Augmented Generation (RAG)** utilisant **Semantic Kernel** en C#. Cet exemple montre comment répondre à une question utilisateur en recherchant dans une mémoire vectorielle intégrée (par exemple, une base de données d'articles ou de documentation technique).

---

### **Use Case : FAQ Technique avec Recherche et Génération**

L'objectif est de créer un système de FAQ où les utilisateurs posent des questions, et la réponse est générée à partir des documents indexés dans une mémoire vectorielle.

---

### **Étapes du Workflow**

1. **Indexer les documents** : Ajouter des articles dans la mémoire vectorielle.
2. **Récupérer les documents pertinents** : Chercher les documents les plus proches en utilisant une similarité sémantique.
3. **Générer une réponse** : Combiner les documents récupérés et la question de l'utilisateur pour générer une réponse avec un modèle IA.

---

### **Code Exemple**

#### **1. Configuration de Semantic Kernel**

Configurez le noyau avec un service de génération de texte (OpenAI ou Azure OpenAI) et une mémoire vectorielle.

```csharp
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Memory;
using Microsoft.SemanticKernel.CoreSkills;
using System;
using System.Linq;
using System.Threading.Tasks;

class Program
{
    static async Task Main(string[] args)
    {
        // Configuration du noyau
        var kernel = Kernel.Builder
            .WithOpenAITextCompletionService("gpt-4", "VOTRE_API_KEY")
            .WithMemoryStorage(new VolatileMemoryStore()) // Mémoire en mémoire vive
            .Build();

        // Ajout de contenu à la mémoire vectorielle
        await IndexDocuments(kernel);

        // Exemple de recherche et génération
        string question = "Comment fonctionne le RAG ?";
        var answer = await GenerateAnswer(kernel, question);
        Console.WriteLine($"Question : {question}");
        Console.WriteLine($"Réponse générée : {answer}");
    }

    // Indexation des documents
    static async Task IndexDocuments(IKernel kernel)
    {
        await kernel.Memory.SaveInformationAsync(
            collection: "technical-faq",
            text: "Le RAG (Retrieval-Augmented Generation) combine la récupération d'informations avec des modèles de génération de texte.",
            id: "doc1"
        );

        await kernel.Memory.SaveInformationAsync(
            collection: "technical-faq",
            text: "Il utilise souvent des bases vectorielles pour rechercher des informations pertinentes en fonction de la requête de l'utilisateur.",
            id: "doc2"
        );

        await kernel.Memory.SaveInformationAsync(
            collection: "technical-faq",
            text: "Les approches de RAG incluent des méthodes séquentielles, itératives et hybrides.",
            id: "doc3"
        );

        Console.WriteLine("Documents indexés dans la mémoire vectorielle.");
    }

    // Recherche et génération de réponse
    static async Task<string> GenerateAnswer(IKernel kernel, string question)
    {
        // Étape 1 : Rechercher des documents pertinents
        var memories = await kernel.Memory.SearchAsync(
            collection: "technical-faq",
            query: question,
            limit: 3 // Limiter à 3 résultats
        );

        // Étape 2 : Construire un contexte à partir des résultats
        var context = string.Join("\n", memories.Select(m => m.Metadata.Text));
        Console.WriteLine($"Contexte trouvé :\n{context}");

        // Étape 3 : Générer une réponse
        var semanticFunction = kernel.CreateSemanticFunction(@"
            Avec les informations suivantes :
            {{context}}
            
            Réponds de manière concise et claire à cette question :
            {{question}}
        ");

        var result = await kernel.RunAsync(
            new ContextVariables
            {
                ["context"] = context,
                ["question"] = question
            },
            semanticFunction
        );

        return result.Result;
    }
}
```

---

### **Explications**

#### **1. Indexation des documents**

Les documents sont ajoutés dans une collection nommée `technical-faq` à l'aide de la méthode `SaveInformationAsync`. Chaque document est identifié par un ID unique.

#### **2. Recherche des documents**

La recherche est effectuée avec `SearchAsync`, qui renvoie les documents les plus proches de la requête utilisateur.

#### **3. Génération de la réponse**

- Les documents pertinents sont combinés pour créer un **contexte**.
- Une **fonction sémantique** est utilisée pour générer une réponse en langage naturel à partir de ce contexte et de la question de l'utilisateur.

---

### **Exemple d'exécution**

#### **Entrée**

```plaintext
Question : Comment fonctionne le RAG ?
```

#### **Sortie**

```plaintext
Contexte trouvé :
Le RAG (Retrieval-Augmented Generation) combine la récupération d'informations avec des modèles de génération de texte.
Il utilise souvent des bases vectorielles pour rechercher des informations pertinentes en fonction de la requête de l'utilisateur.
Les approches de RAG incluent des méthodes séquentielles, itératives et hybrides.

Réponse générée : Le RAG combine la récupération d'informations dans des bases vectorielles avec des modèles de génération pour fournir des réponses précises. Il peut fonctionner de manière séquentielle, itérative ou hybride.
```

---

### **Extensions Possibles**

1. **Utiliser une mémoire persistante** : Remplacez `VolatileMemoryStore` par une solution comme Qdrant ou Pinecone pour une mémoire vectorielle durable.
2. **Ajouter des sources externes** : Intégrez des bases de données ou des API comme Azure Cognitive Search pour enrichir la recherche.
3. **Personnaliser le prompt** : Adapter la fonction sémantique pour des cas d'usage spécifiques, comme des réponses formelles ou créatives.

---

Cet exemple montre comment combiner récupération et génération dans **Semantic Kernel** pour créer un système RAG en **C#**. Cela peut être adapté pour des cas d'usage tels que les FAQ, l'assistance client, ou la documentation technique.

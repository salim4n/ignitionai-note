---
title : Types de RAG
description : Types de RAG
---

Dans **Semantic Kernel**, les types de **RAG (Retrieval-Augmented Generation)** se concentrent principalement sur l'intégration avec des **bases de données vectorielles**, des **index de recherche**, et la combinaison de la récupération avec des modèles d'IA pour générer des réponses enrichies. Voici les principaux types de RAG implémentables dans **C# avec Semantic Kernel** et comment les utiliser :

---

## **1. Types de RAG dans Semantic Kernel**

### **1.1 RAG séquentiel**

- **Principe** : Le noyau recherche les informations dans une base externe, puis les utilise comme contexte pour générer une réponse.
- **Étapes dans Semantic Kernel** :
  1. Configurez une **base de recherche vectorielle** ou utilisez des services comme Azure Cognitive Search.
  2. Implémentez un pipeline où les résultats récupérés alimentent le modèle génératif.
- **Exemple** :
  Vous pouvez connecter un plugin de recherche, comme une mémoire vectorielle, pour effectuer la récupération.

```csharp
var kernel = Kernel.Builder
    .WithOpenAITextCompletionService("gpt-4", "API_KEY")
    .WithMemoryStorage(new VolatileMemoryStore()) // Mémoire en mémoire vive
    .Build();

// Ajouter des documents à la mémoire
await kernel.Memory.SaveInformationAsync("knowledge-base", "doc1", "Le RAG combine récupération et génération.");

// Effectuer une recherche et générer une réponse
string query = "Qu'est-ce que le RAG ?";
var memories = await kernel.Memory.SearchAsync("knowledge-base", query, limit: 3);
string context = string.Join("\n", memories.Select(m => m.Metadata.Text));

var response = await kernel.RunAsync(
    query,
    kernel.CreateSemanticFunction($"Avec ce contexte : \n{context}\nRéponds à la question suivante : {{$input}}")
);

Console.WriteLine(response.Result);
```

---

### **1.2 RAG itératif**

- **Principe** : Après une première recherche, le modèle génératif affine la requête ou pose une nouvelle question pour récupérer d'autres informations.
- **Étapes dans Semantic Kernel** :
  1. Lancez une recherche initiale.
  2. Utilisez le résultat pour générer une nouvelle requête.
  3. Réitérez jusqu'à ce qu'une réponse complète soit obtenue.

#### Exemple de RAG itératif

```csharp
var query = "Comment implémenter le RAG ?";
string context = string.Empty;

// Recherche itérative
for (int i = 0; i < 3; i++)
{
    var memories = await kernel.Memory.SearchAsync("knowledge-base", query, limit: 3);
    context = string.Join("\n", memories.Select(m => m.Metadata.Text));

    // Affiner la requête
    var result = await kernel.RunAsync(
        query,
        kernel.CreateSemanticFunction($"Avec ces informations : \n{context}\nRéponds à la question ou clarifie : {{$input}}")
    );

    Console.WriteLine($"Itération {i + 1}: {result.Result}");
    query = "Affinez la recherche : " + result.Result; // Génère une nouvelle requête
}
```

---

### **1.3 RAG parallèle**

- **Principe** : Effectuez des recherches dans plusieurs bases ou types de sources, puis combinez les résultats pour enrichir la génération.
- **Étapes dans Semantic Kernel** :
  1. Configurez plusieurs instances de mémoire (vectorielle, Cognitive Search, etc.).
  2. Récupérez les données en parallèle.
  3. Fusionnez les résultats avant la génération.

#### Exemple de RAG parallèle

```csharp
var kernel = Kernel.Builder
    .WithOpenAITextCompletionService("gpt-4", "API_KEY")
    .WithMemoryStorage(new VolatileMemoryStore())
    .Build();

// Ajouter des informations à différentes bases
await kernel.Memory.SaveInformationAsync("tech-docs", "doc1", "Le RAG utilise des bases vectorielles.");
await kernel.Memory.SaveInformationAsync("research-papers", "doc2", "Le RAG peut être itératif ou séquentiel.");

// Recherche parallèle
var task1 = kernel.Memory.SearchAsync("tech-docs", query, limit: 3);
var task2 = kernel.Memory.SearchAsync("research-papers", query, limit: 3);
await Task.WhenAll(task1, task2);

var results = task1.Result.Concat(task2.Result);
string combinedContext = string.Join("\n", results.Select(r => r.Metadata.Text));

// Générer une réponse
var response = await kernel.RunAsync(
    query,
    kernel.CreateSemanticFunction($"Avec ces informations combinées : \n{combinedContext}\nRéponds à la question : {{$input}}")
);

Console.WriteLine(response.Result);
```

---

### **1.4 RAG hybride**

- **Principe** : Combinez des approches de recherche sémantique et de recherche basée sur des mots-clés (TF-IDF, BM25).
- **Étapes dans Semantic Kernel** :
  1. Intégrez un moteur de recherche traditionnel (par exemple, Azure Cognitive Search ou Elasticsearch).
  2. Associez les résultats avec ceux d'une mémoire vectorielle.

---

## **2. Intégration des Plugins Semantic Kernel avec RAG**

### **Plugins de mémoire vectorielle**

Les bases vectorielles sont fondamentales pour les RAG dans Semantic Kernel. Utilisez des intégrations comme :

- **Azure Cognitive Search** pour une recherche avancée.
- **Qdrant** ou **Pinecone** pour les bases vectorielles.

### **Exemple d'ajout de plugin mémoire vectorielle**

```csharp
var kernel = Kernel.Builder
    .WithOpenAITextCompletionService("gpt-4", "API_KEY")
    .WithMemoryStorage(new QdrantMemoryStore("QDRANT_API_KEY"))
    .Build();
```

### **Plugins de récupération externe**

Intégrez des moteurs comme :

- Bing Search API.
- Elasticsearch.

---

## **3. Résumé des types de RAG avec Semantic Kernel**

| **Type de RAG**        | **Principe**                              | **Cas d'usage**                         |
|-------------------------|------------------------------------------|-----------------------------------------|
| Séquentiel             | Recherche d'informations suivie d'une génération. | FAQ, support client, documentation.    |
| Itératif               | Recherche et génération avec raffinement. | Assistance complexe, recherches longues. |
| Parallèle              | Recherche dans plusieurs sources en parallèle. | Réponses multi-sources enrichies.       |
| Hybride                | Combinaison de recherche sémantique et par mots-clés. | Scénarios multi-domaines ou bases hétérogènes. |

---

Avec **Semantic Kernel**, vous avez la flexibilité d'adapter le type de RAG à vos besoins en tirant parti de ses capacités d'intégration avec des bases de données vectorielles, des moteurs de recherche et des modèles génératifs avancés.

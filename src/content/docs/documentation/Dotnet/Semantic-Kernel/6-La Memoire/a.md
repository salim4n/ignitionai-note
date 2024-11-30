---
title : Mémoire
description : Mémoire
---

Dans **Semantic Kernel**, la **mémoire** est un concept clé qui permet de créer des agents ou des systèmes intelligents capables de se rappeler des informations pour influencer leurs réponses et comportements. Cela facilite des interactions plus riches et contextuelles, où le système peut s’adapter à des besoins changeants ou maintenir un historique pertinent.

Voici une présentation des nombreux concepts liés à la **mémoire** dans Semantic Kernel :

---

## **1. Types de mémoire dans Semantic Kernel**

### **1.1 Mémoire de base**

- Permet de stocker et récupérer des données simples ou des entrées utilisateur.
- Utilisée pour conserver des informations persistantes sur un contexte donné (exemple : préférences utilisateur).

### **1.2 Mémoire vectorielle**

- Représente des informations sous forme d’embeddings (vecteurs).
- Utilisée pour rechercher des données similaires en fonction de la proximité dans l'espace vectoriel.
- Idéale pour travailler avec des informations textuelles riches (ex. : recherche sémantique, questions-réponses).

### **1.3 Mémoire contextuelle**

- Fournit une mémoire à court terme pour conserver des informations lors d’une session.
- Similaire à une mémoire de travail, elle est réinitialisée après une session ou un objectif atteint.

---

## **2. Fonctionnement de la mémoire vectorielle**

### **2.1 Embeddings**

Semantic Kernel utilise des modèles d’IA pour convertir des informations textuelles en embeddings vectoriels. Ces vecteurs sont ensuite stockés dans une base compatible, comme :

- SQLite (avec support des vecteurs).
- Redis (pour une approche distribuée).
- Azure Cognitive Search ou Pinecone (services spécialisés).

### **2.2 Utilisation typique**

1. **Stocker une donnée** :
   Les textes ou informations sont convertis en embeddings et sauvegardés.
2. **Rechercher dans la mémoire** :
   Une requête textuelle est également convertie en un embedding, et les vecteurs proches sont récupérés.

---

## **3. Ajouter une mémoire à Semantic Kernel**

Voici comment intégrer une mémoire dans un projet **C#** avec Semantic Kernel.

### **3.1 Initialisation de la mémoire vectorielle**

#### Exemple : Utilisation de SQLite

```csharp
using Microsoft.SemanticKernel.Memory;

// Configure une mémoire persistante avec SQLite
var memory = new VolatileMemoryStore();
kernel.UseMemory(memory);
```

#### Exemple : Intégration avec Azure Cognitive Search

```csharp
var memory = new AzureCognitiveSearchMemory(
    "<AzureSearchEndpoint>",
    "<AzureSearchApiKey>",
    "<IndexName>"
);
kernel.UseMemory(memory);
```

---

### **3.2 Ajouter des données dans la mémoire**

Ajoutez des informations importantes en fonction du contexte.

```csharp
await kernel.Memory.SaveInformationAsync(
    collection: "UserPreferences",
    text: "Salim préfère le café noir.",
    id: "User123"
);
```

---

### **3.3 Rechercher dans la mémoire**

Cherchez des données similaires en fonction d’une requête.

```csharp
var result = await kernel.Memory.SearchAsync(
    collection: "UserPreferences",
    query: "Quelles sont les préférences de Salim ?",
    limit: 1
);

foreach (var item in result)
{
    Console.WriteLine($"Résultat trouvé : {item.Metadata.Text}");
}
```

---

## **4. Cas d’usage avancés de la mémoire**

### **4.1 Historique des conversations**

- **But** : Améliorer les interactions utilisateur en maintenant un historique des échanges.
- **Exemple** : L’agent se souvient des questions posées précédemment et adapte ses réponses.

```csharp
await kernel.Memory.SaveInformationAsync(
    collection: "ChatHistory",
    text: "Utilisateur : Quels sont mes rendez-vous aujourd'hui ?",
    id: "Chat1"
);

var chatHistory = await kernel.Memory.SearchAsync(
    collection: "ChatHistory",
    query: "rendez-vous",
    limit: 3
);

foreach (var item in chatHistory)
{
    Console.WriteLine($"Message précédent : {item.Metadata.Text}");
}
```

---

### **4.2 Systèmes de recommandation**

- **But** : Suggérer des actions ou produits basés sur des préférences mémorisées.
- **Exemple** : Recommandation de films en fonction de l’historique utilisateur.

```csharp
await kernel.Memory.SaveInformationAsync(
    collection: "MoviePreferences",
    text: "Salim a aimé Inception et Interstellar.",
    id: "User123"
);

var recommendations = await kernel.Memory.SearchAsync(
    collection: "MoviePreferences",
    query: "films de science-fiction",
    limit: 5
);

foreach (var item in recommendations)
{
    Console.WriteLine($"Suggestion : {item.Metadata.Text}");
}
```

---

### **4.3 Planification et suivi**

- **But** : Utiliser la mémoire pour organiser des tâches, conserver des événements ou suivre l'état de projets.
- **Exemple** : Suivi d’un projet ou rappel des tâches en cours.

```csharp
await kernel.Memory.SaveInformationAsync(
    collection: "TaskTracking",
    text: "Finaliser la présentation du projet d’ici le 30 novembre.",
    id: "Task123"
);

var tasks = await kernel.Memory.SearchAsync(
    collection: "TaskTracking",
    query: "projet",
    limit: 1
);

foreach (var task in tasks)
{
    Console.WriteLine($"Tâche en cours : {task.Metadata.Text}");
}
```

---

## **5. Avantages et limites de la mémoire**

### **Avantages**

1. **Contextualisation accrue** : La mémoire permet des réponses plus riches et pertinentes.
2. **Personnalisation** : Les agents peuvent personnaliser leurs interactions en fonction des préférences stockées.
3. **Historique** : Maintenir un historique structuré des interactions ou des données.

### **Limites**

1. **Stockage et coûts** : Utiliser des bases de données externes (comme Redis ou Azure Search) peut engendrer des coûts.
2. **Confidentialité** : Il faut veiller à sécuriser les informations sensibles stockées dans la mémoire.
3. **Complexité** : Une gestion efficace de la mémoire peut devenir complexe dans des scénarios avancés.

---

## **6. Résultat attendu**

Avec une bonne gestion de la mémoire dans Semantic Kernel, les systèmes intelligents deviennent :

- Plus interactifs, grâce à l’historique conversationnel.
- Plus personnalisés, en tenant compte des préférences et contextes.
- Plus performants, grâce à une recherche vectorielle rapide et précise.

Vous pouvez désormais utiliser la mémoire pour développer des agents adaptatifs capables de fournir une expérience utilisateur de haute qualité.

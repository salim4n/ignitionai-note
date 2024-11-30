---
title : Délégation d'agent
description : Délégation d'agent
---

La **délégation d'agent** dans Semantic Kernel consiste à permettre à un agent de déléguer des sous-tâches à d'autres agents ou fonctions lorsqu'il ne peut pas accomplir une tâche par lui-même. Cela permet de créer des workflows complexes, où plusieurs agents collaborent pour atteindre un objectif global.

Voici un guide pour comprendre et mettre en œuvre la délégation d'agent.

---

## **1. Pourquoi utiliser la délégation d'agent ?**

- **Gestion de tâches complexes** : Lorsque la tâche principale peut être divisée en sous-tâches distinctes.
- **Répartition des responsabilités** : Chaque agent peut se concentrer sur des tâches spécifiques.
- **Réutilisation de fonctionnalités** : Les agents spécialisés peuvent être utilisés dans plusieurs scénarios.

---

## **2. Architecture de la délégation**

La délégation repose sur les composants suivants :

1. **Agent principal** : Celui qui reçoit la tâche globale et la décompose.
2. **Agents délégués** : Ceux qui exécutent des sous-tâches spécifiques.
3. **Planificateur ou logique d’orchestration** : Coordonne les appels entre les agents et compile les résultats.

---

## **3. Exemple : Un assistant personnel avec délégation**

Imaginons un agent principal qui doit répondre à des questions utilisateur. Pour accomplir cela, il délègue :

- La recherche d’informations à un **agent de recherche**.
- La planification d’événements à un **agent de calendrier**.

---

### **Étape 1 : Initialiser le noyau et les plugins**

Commencez par configurer les plugins nécessaires.

```csharp
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Orchestration;

var kernel = Kernel.Builder.Build();

// Importer des plugins pour chaque agent
var searchPlugin = kernel.ImportPlugin("SearchPlugin", "./Plugins/Search");
var calendarPlugin = kernel.ImportPlugin("CalendarPlugin", "./Plugins/Calendar");
```

---

### **Étape 2 : Créer les agents délégués**

Chaque agent délégué gère une tâche spécifique.

#### Agent de recherche

```csharp
var searchAgent = kernel.CreateSemanticFunction(
    "Pour répondre à cette question : {{input}}, utilise les capacités du plugin de recherche.",
    plugins: new[] { searchPlugin }
);
```

#### Agent de calendrier

```csharp
var calendarAgent = kernel.CreateSemanticFunction(
    "Pour planifier l'événement suivant : {{input}}, utilise les capacités du plugin calendrier.",
    plugins: new[] { calendarPlugin }
);
```

---

### **Étape 3 : Créer l’agent principal**

L'agent principal analyse la demande et délègue les sous-tâches aux agents appropriés.

```csharp
var mainAgent = kernel.CreateSemanticFunction(
    "Analyse la demande suivante : {{input}}. Si elle concerne une recherche, délègue au plugin SearchPlugin. Si elle concerne une planification, délègue au plugin CalendarPlugin."
);
```

---

### **Étape 4 : Ajouter une logique de délégation**

Utilisez la logique pour analyser le contexte et rediriger les tâches.

```csharp
var context = new ContextVariables();
context["input"] = "Quels sont les prochains événements cette semaine ?";

string userRequest = context["input"];
if (userRequest.Contains("événements") || userRequest.Contains("planifier"))
{
    // Délégation à l'agent de calendrier
    var calendarResponse = await kernel.RunAsync(context, calendarAgent);
    Console.WriteLine($"Réponse du calendrier : {calendarResponse}");
}
else
{
    // Délégation à l'agent de recherche
    var searchResponse = await kernel.RunAsync(context, searchAgent);
    Console.WriteLine($"Réponse de recherche : {searchResponse}");
}
```

---

## **4. Délégation avec un Planificateur**

Pour des tâches plus complexes, utilisez un planificateur pour orchestrer les appels.

#### Exemple : Agent principal avec un planificateur

1. **Créer un planificateur** :

```csharp
var planner = kernel.GetPlanner();
```

2. **Décomposer la tâche principale** :
Le planificateur identifie automatiquement les agents à appeler et dans quel ordre.

```csharp
var plan = await planner.CreatePlanAsync("Répondre à une question ou planifier un événement.");
```

3. **Ajouter des étapes dynamiques** :
Ajoutez des étapes en fonction des besoins.

```csharp
plan.AddStep("analyse", "Analyse de la demande", async (context) =>
{
    if (context["input"].Contains("événements") || context["input"].Contains("planifier"))
    {
        context["response"] = await kernel.RunAsync(context, calendarAgent);
    }
    else
    {
        context["response"] = await kernel.RunAsync(context, searchAgent);
    }
});
```

4. **Exécuter le plan** :
L’agent principal exécute le plan et compile les réponses.

```csharp
var finalResult = await kernel.RunAsync(context, plan);
Console.WriteLine($"Résultat final : {finalResult}");
```

---

## **5. Avantages de la délégation d’agent**

- **Modularité** : Les agents spécialisés sont indépendants et réutilisables.
- **Évolutivité** : Ajouter ou modifier des agents devient simple.
- **Clarté** : Les responsabilités sont clairement définies entre les agents.

---

## **6. Résultat attendu**

- Si l’utilisateur demande : *"Quels sont les prochains événements cette semaine ?"*, l’agent principal délègue la tâche à l’**agent de calendrier**.
- Si l’utilisateur demande : *"Quelles sont les actualités aujourd'hui ?"*, l’agent principal délègue la tâche à l’**agent de recherche**.

Chaque agent traite sa sous-tâche et renvoie le résultat à l'agent principal, qui compile une réponse finale pour l'utilisateur.

---

Avec ce modèle, vous pouvez créer des systèmes intelligents qui orchestrent plusieurs agents pour accomplir des tâches complexes et adaptatives.

---
title : Création d'un Agent
description : Création d'un Agent
---

Créer un **agent** dans **Semantic Kernel** implique d’assembler plusieurs éléments : un noyau, des plugins, des fonctions et une logique de gestion des objectifs. Cet agent pourra exécuter des tâches, enchaîner des actions, ou répondre à des requêtes utilisateur en utilisant des fonctionnalités prédéfinies ou générées dynamiquement.

Voici un guide complet pour créer un premier agent en **C#**.

---

### **1. Initialisation du noyau**

Le noyau est le cœur de l'agent. Il orchestre les fonctions et les plugins.

```csharp
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Orchestration;

var kernel = Kernel.Builder.Build();
```

---

### **2. Ajouter des plugins ou des fonctions**

Les plugins et fonctions offrent les capacités dont l'agent a besoin. Par exemple, on peut inclure un plugin pour manipuler du texte.

#### Ajouter un plugin depuis un fichier

```csharp
var textPlugin = kernel.ImportPlugin("TextPlugin", "./Plugins/TextPlugin");
```

#### Ajouter une fonction native

Créez une fonction C# pour que l’agent puisse effectuer des tâches personnalisées.

```csharp
using System;

kernel.CreateNativeFunction("ReverseText", async (context) =>
{
    string input = context["input"];
    char[] charArray = input.ToCharArray();
    Array.Reverse(charArray);
    return new string(charArray);
});
```

---

### **3. Créer une fonction d'invite (prompt)**

Les fonctions d'invite (ou prompt functions) permettent d'utiliser des modèles d'IA pour interagir en langage naturel.

#### Exemple : fonction pour résumer un texte

```csharp
var summarizeFunction = kernel.CreateSemanticFunction(
    "Résume le texte suivant en une phrase : {{input}}",
    functionConfig: new FunctionConfig
    {
        Description = "Résumé de texte"
    }
);
```

---

### **4. Configurer l’agent**

Un agent utilise le noyau et les fonctions pour interpréter des objectifs et exécuter des actions.

#### Exemple : Créer une fonction agent simple

Une fonction qui reçoit une commande utilisateur et exécute la tâche appropriée.

```csharp
var agentFunction = kernel.CreateSemanticFunction(
    "Pour répondre à la demande suivante : {{input}}, utilise une combinaison des plugins ou fonctions disponibles.",
    plugins: new[] { textPlugin, summarizeFunction }
);
```

---

### **5. Ajouter une logique d’orchestration**

L’agent peut traiter une requête en orchestrant plusieurs étapes.

#### Exemple : Appeler les plugins en fonction du contexte

```csharp
var context = new ContextVariables();
context["input"] = "Voici un texte à résumer.";

var result = await kernel.RunAsync(context, "SummarizeText");

Console.WriteLine($"Résultat de l'agent : {result}");
```

---

### **6. Étendre l’agent avec des planificateurs**

Pour gérer des tâches complexes nécessitant plusieurs étapes, ajoutez un planificateur.

#### Ajouter un planificateur

```csharp
var planner = kernel.GetPlanner();
var plan = await planner.CreatePlanAsync("Analyser un texte, puis le traduire.");
```

#### Ajouter des étapes dynamiques au plan

```csharp
plan.AddStep("analyse", "Analyse du texte", async (context) =>
{
    context["analysis"] = await textPlugin.InvokeAsync(context["input"]);
});

plan.AddStep("translate", "Traduction", async (context) =>
{
    var analysis = context["analysis"];
    context["translation"] = await kernel.RunAsync(
        new ContextVariables { ["input"] = analysis }, 
        "TranslatePlugin"
    );
});

await kernel.RunAsync(context, plan);
```

---

### **7. Exemple d’agent interactif**

#### Agent assistant personnel

Cet agent répond aux questions et exécute des actions (par exemple, envoyer un message ou gérer un calendrier).

1. **Ajouter des plugins** :

```csharp
var messagingPlugin = kernel.ImportPlugin("MessagingPlugin", "./Plugins/Messaging");
var calendarPlugin = kernel.ImportPlugin("CalendarPlugin", "./Plugins/Calendar");
```

2. **Créer l’agent** :

```csharp
var assistantAgent = kernel.CreateSemanticFunction(
    "Je suis votre assistant personnel. Que voulez-vous faire ?",
    plugins: new[] { messagingPlugin, calendarPlugin }
);
```

3. **Interaction utilisateur** :

```csharp
var userRequest = "Planifier une réunion demain à 15h.";
var context = new ContextVariables();
context["input"] = userRequest;

var assistantResponse = await kernel.RunAsync(context, assistantAgent);

Console.WriteLine($"Assistant : {assistantResponse}");
```

---

### **8. Résultat attendu**

L'agent :

- Comprend la commande utilisateur en langage naturel.
- Identifie les fonctions ou plugins nécessaires (par ex. calendrier).
- Exécute les actions pour répondre à la demande.
- Fournit une réponse sous une forme compréhensible pour l’utilisateur.

---

### **Résumé**

Créer un agent avec Semantic Kernel implique de :

1. Initialiser un noyau.
2. Ajouter des plugins ou fonctions personnalisées.
3. Configurer une logique d’orchestration.
4. Étendre l’agent avec des planificateurs pour des tâches complexes.

Avec ce guide, vous disposez des bases pour construire des agents intelligents, interactifs et polyvalents.

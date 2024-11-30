---
title : Agents
description : Agents
---

### **Présentation des Agents dans Semantic Kernel**

Les **agents** dans Semantic Kernel sont des composants intelligents qui permettent de **combiner plusieurs capacités d'IA** pour accomplir des tâches complexes. Un agent peut utiliser des fonctions IA, des plugins ou des planificateurs pour répondre à des demandes, accomplir des objectifs ou interagir avec des utilisateurs et des systèmes de manière autonome.

---

## **1. Qu’est-ce qu’un Agent ?**

Un agent est une entité logique qui :

- **Comprend un objectif ou une demande** (souvent en langage naturel).
- **Planifie ou sélectionne les actions nécessaires** pour répondre à cette demande.
- **Exécute les actions** en s’appuyant sur les plugins, les fonctions, ou d’autres outils.

Les agents sont conçus pour faciliter l’orchestration de tâches complexes en combinant les capacités disponibles dans Semantic Kernel.

---

## **2. Cas d’utilisation des Agents**

Les agents sont particulièrement utiles dans les scénarios suivants :

1. **Chatbots intelligents** : Interaction en langage naturel pour répondre aux questions ou guider un utilisateur.
2. **Orchestration de tâches** : Automatisation d'un processus impliquant plusieurs étapes et outils.
3. **Récupération d'informations** : Extraire et analyser des données provenant de plusieurs sources.
4. **Applications décisionnelles** : Aider à prendre des décisions basées sur des informations contextuelles.

---

## **3. Fonctionnement d’un Agent**

Un agent fonctionne en plusieurs étapes :

1. **Comprendre la demande** :
   L'agent interprète la requête, souvent en utilisant un modèle d'IA.

2. **Planifier une réponse** :
   Il identifie les étapes nécessaires pour atteindre l’objectif.

3. **Exécuter les actions** :
   L'agent appelle les fonctions ou plugins appropriés pour accomplir chaque étape.

4. **Fournir une réponse** :
   L'agent compile les résultats des actions en une réponse utilisateur.

---

## **4. Création d’un Agent**

### **Étape 1 : Initialisation du noyau**

L’agent est intégré dans le noyau avec les capacités nécessaires.

```csharp
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Orchestration;

var kernel = Kernel.Builder.Build();
```

### **Étape 2 : Ajouter des plugins et fonctions**

Les agents utilisent des plugins et des fonctions pour accomplir leurs tâches. Ajoutez-les au noyau :

```csharp
var textPlugin = kernel.ImportPlugin("TextPlugin", "./Plugins/TextPlugin");
var mathPlugin = kernel.ImportPlugin("MathPlugin", "./Plugins/MathPlugin");
```

### **Étape 3 : Implémenter un agent simple**

Créez une fonction ou une logique pour interpréter les demandes et appeler les plugins nécessaires.

```csharp
var agentFunction = kernel.CreateSemanticFunction(
    "Pour répondre à la question {{input}}, utilise le plugin TextPlugin ou MathPlugin selon le contexte."
);
```

---

## **5. Exemple : Un Agent de Conversion de Texte**

L’objectif est de créer un agent qui reçoit une demande comme : "Convertir ce texte en majuscules", et utilise les fonctions appropriées.

### **Étape 1 : Créer une fonction pour convertir du texte**

```csharp
var textConversionFunction = kernel.CreateSemanticFunction(
    "Convertir le texte suivant en majuscules : {{input}}",
    functionConfig: new FunctionConfig
    {
        Description = "Conversion de texte",
        Output = "Texte en majuscules"
    }
);
```

### **Étape 2 : Lier la fonction à l'agent**

Ajoutez cette fonction comme capacité de l’agent :

```csharp
kernel.RegisterFunction("TextConversion", textConversionFunction);
```

### **Étape 3 : Interagir avec l’agent**

Appelez l’agent avec une demande utilisateur :

```csharp
var context = new ContextVariables();
context["input"] = "Voici une phrase à convertir.";

var result = await kernel.RunAsync(context, "TextConversion");

Console.WriteLine($"Résultat de l'agent : {result}");
```

---

## **6. Intégration avec des Planificateurs**

Les agents peuvent être associés à des **planificateurs** pour gérer des tâches plus complexes :

- Un planificateur peut diviser un objectif complexe en étapes.
- L’agent peut exécuter ces étapes en utilisant les plugins et fonctions disponibles.

### **Exemple : Agent avec planificateur**

Supposons que l’agent doit analyser un texte, le traduire, puis résumer les résultats.

```csharp
var planner = kernel.GetPlanner();
var plan = await planner.CreatePlanAsync("Analyser et traduire un texte.");

// Ajouter des étapes dynamiques au plan
plan.AddStep("analyzeText", "Analyse du texte avec TextPlugin", async (context) =>
{
    var text = context["input"];
    context["analysis"] = await textPlugin.InvokeAsync(text);
});

plan.AddStep("translate", "Traduction du texte analysé", async (context) =>
{
    var analysis = context["analysis"];
    context["translation"] = await kernel.RunAsync(new ContextVariables { ["input"] = analysis }, "TranslatePlugin");
});

await kernel.RunAsync(context, plan);
```

---

## **7. Gestion avancée des Agents**

1. **Contextes dynamiques** :
   Les agents utilisent des variables de contexte pour suivre les données pendant l’exécution.

2. **Extensions multi-plugins** :
   Combinez plusieurs plugins ou fonctions pour créer un agent capable d’accomplir plusieurs types de tâches.

3. **Interactions en langage naturel** :
   Les agents peuvent utiliser un modèle GPT ou LLM pour interpréter des requêtes complexes et décider des actions à prendre.

---

## **8. Exemple d’application complète : Un assistant personnel**

Un agent peut intégrer :

- Un plugin de calendrier (pour planifier des événements).
- Un plugin de messagerie (pour envoyer des notifications).
- Un plugin de traduction (pour répondre en plusieurs langues).

### **Exemple d’implémentation**

```csharp
var kernel = Kernel.Builder
    .WithOpenAIChatCompletion("YOUR-API-KEY")
    .Build();

var calendarPlugin = kernel.ImportPlugin("Calendar", "./Plugins/CalendarPlugin");
var messagingPlugin = kernel.ImportPlugin("Messaging", "./Plugins/MessagingPlugin");

var assistantAgent = kernel.CreateSemanticFunction(
    "Je suis votre assistant. Que voulez-vous faire aujourd’hui ?",
    plugins: new[] { calendarPlugin, messagingPlugin }
);
```

---

Les agents dans **Semantic Kernel** permettent de développer des applications IA sophistiquées, adaptatives et interactives. Ils sont particulièrement puissants lorsqu’ils orchestrent plusieurs capacités via des planificateurs et des plugins, facilitant l’automatisation des tâches complexes.

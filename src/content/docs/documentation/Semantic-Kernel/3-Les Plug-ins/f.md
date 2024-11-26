---
title: Fonctions d'appel et de chaînage
description: Fonctions d'appel et de chaînage
---

Dans **Semantic Kernel**, les fonctions d'appel et de chaînage permettent d'orchestrer plusieurs tâches ou fonctions pour créer des workflows complexes. Cela est essentiel pour combiner les résultats d'une fonction et les passer à une autre, automatisant ainsi des processus multi-étapes.

---

## **1. Fonction d’appel directe**

Une fonction d’appel directe exécute une seule tâche en utilisant les données d’entrée fournies.

### **Exemple : Appel direct à une fonction**

Créons une fonction simple pour transformer un texte en majuscules :

```csharp
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Orchestration;

var kernel = Kernel.Builder.Build();

// Définir une fonction native
var uppercaseFunction = kernel.CreateSemanticFunction("Convertir en majuscules : {{input}}");

// Exécuter la fonction avec un paramètre
var result = await uppercaseFunction.InvokeAsync(new()
{
    ["input"] = "Ceci est un test."
});

Console.WriteLine(result); // Résultat : "CONVERTIR EN MAJUSCULES : CECI EST UN TEST."
```

---

## **2. Chaînage de fonctions**

Le chaînage vous permet d'exécuter une série de fonctions en séquence. La sortie d'une fonction devient l'entrée de la suivante.

### **Étape 1 : Créer plusieurs fonctions**

1. Une fonction pour transformer le texte en majuscules.
2. Une autre pour calculer la longueur du texte.

```csharp
var kernel = Kernel.Builder.Build();

// Fonction 1 : Transformer en majuscules
var uppercaseFunction = kernel.CreateSemanticFunction("Convertir en majuscules : {{input}}");

// Fonction 2 : Calculer la longueur
var lengthFunction = kernel.CreateSemanticFunction("La longueur du texte est : {{input.Length}}");
```

### **Étape 2 : Chaînage manuel**

Appeler chaque fonction séquentiellement :

```csharp
// Étape 1 : Convertir en majuscules
var step1Result = await uppercaseFunction.InvokeAsync(new()
{
    ["input"] = "Ceci est un exemple."
});

// Étape 2 : Calculer la longueur
var step2Result = await lengthFunction.InvokeAsync(new()
{
    ["input"] = step1Result.Result
});

Console.WriteLine(step2Result.Result);
// Résultat : "La longueur du texte est : 21"
```

---

## **3. Utilisation du moteur d’orchestration**

Le moteur d’orchestration permet de configurer des workflows complexes en combinant des compétences et des fonctions.

### **Étape 1 : Importer des compétences**

Les compétences (skills) sont des collections de fonctions logiques ou de modèles d’invite.

```csharp
var kernel = Kernel.Builder.Build();

// Charger des compétences natives ou définies dans des plugins
var textSkill = kernel.ImportSkillFromDirectory("Plugins", "TextSkill");
```

### **Étape 2 : Exécuter un pipeline**

Un pipeline enchaîne plusieurs compétences. Par exemple, résumer un texte, puis le traduire :

```csharp
// Compétences de résumé et de traduction
var summarizeSkill = kernel.ImportSkillFromDirectory("Plugins", "SummarySkill");
var translateSkill = kernel.ImportSkillFromDirectory("Plugins", "TranslateSkill");

// Texte d'entrée
var text = "Semantic Kernel est une bibliothèque puissante pour intégrer des modèles d'IA dans des applications modernes.";

// Étape 1 : Résumer le texte
var summary = await kernel.RunAsync(summarizeSkill["Summarize"], new()
{
    ["text"] = text,
    ["length"] = "50"
});

// Étape 2 : Traduire le résumé
var translation = await kernel.RunAsync(translateSkill["Translate"], new()
{
    ["input"] = summary.Result,
    ["language"] = "fr"
});

Console.WriteLine($"Texte résumé traduit : {translation}");
```

---

## **4. Chaînage dynamique avec le contexte**

Le **contexte** (context variables) permet de passer automatiquement les résultats d'une fonction à une autre sans écrire de code explicite pour chaque transition.

### **Exemple : Utilisation du contexte**

```csharp
var kernel = Kernel.Builder.Build();

// Créer deux fonctions
var uppercaseFunction = kernel.CreateSemanticFunction("Transforme en majuscules : {{input}}");
var lengthFunction = kernel.CreateSemanticFunction("Longueur du texte : {{input.Length}}");

// Définir un contexte initial
var context = new ContextVariables();
context["input"] = "Ceci est un test.";

// Chaînage dynamique
var result = await kernel.RunAsync(context, uppercaseFunction, lengthFunction);

Console.WriteLine(result.Result);
// Résultat : "Longueur du texte : 21"
```

---

## **5. Gestion avancée avec des workflows personnalisés**

Vous pouvez orchestrer des workflows plus complexes où des fonctions conditionnelles ou parallèles sont nécessaires.

### **Exemple : Workflow avec condition**

Si le texte dépasse une certaine longueur, un résumé est créé :

```csharp
var summarizeFunction = kernel.CreateSemanticFunction("Résumé : {{text}}");
var lengthCheckFunction = kernel.CreateSemanticFunction(@"
{{#if text.Length > 100}}
Résumé nécessaire : {{text}}
{{else}}
Pas besoin de résumé.
{{/if}}");

var context = new ContextVariables();
context["text"] = "Ceci est un texte relativement long qui pourrait nécessiter un résumé pour être compris rapidement.";

var decision = await lengthCheckFunction.InvokeAsync(context);

if (decision.Result.Contains("Résumé nécessaire"))
{
    var summary = await summarizeFunction.InvokeAsync(context);
    Console.WriteLine($"Résumé : {summary.Result}");
}
else
{
    Console.WriteLine("Résumé non nécessaire.");
}
```

---

## **6. Cas pratiques pour l’appel et le chaînage**

1. **Chatbot** : Enchaînez des fonctions pour comprendre une requête, la classer, et y répondre.
2. **Automatisation de documents** : Extraire des données, résumer, et envoyer un e-mail.
3. **Analyse de texte** : Enrichir un texte avec plusieurs fonctions : analyse de sentiments, résumé, traduction.
4. **Pipelines AI/ML** : Connecter des modèles pour prétraiter les données, les analyser, puis retourner les résultats.

Le chaînage rend **Semantic Kernel** particulièrement puissant pour des scénarios multi-étapes, permettant de développer des solutions robustes et dynamiques avec des modèles d'IA.

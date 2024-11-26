---
title: Implémentation de l'appel de fonction avec Semantic Kernel
description: Planificateur
---



### **Implémentation de l'appel de fonction avec Semantic Kernel**

Le planificateur dans **Semantic Kernel** peut non seulement générer des plans pour atteindre des objectifs, mais aussi exécuter des fonctions définies (natifs ou plugins) de manière orchestrée. Voici comment implémenter et appeler des fonctions via le planificateur.

---

## **1. Initialisation et configuration**

### **Étape 1 : Ajouter le planificateur au noyau**

Le planificateur doit être activé au moment de la configuration du noyau :

```csharp
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Planning;
using Microsoft.SemanticKernel.Orchestration;

var kernel = Kernel.Builder
    .WithPlanner() // Activer le planificateur
    .Build();
```

---

## **2. Création et enregistrement des fonctions**

Les fonctions peuvent être **natifs** ou **basées sur des invites** (prompt).

### **Exemple : Fonction native**

Voici une fonction native simple pour convertir du texte en majuscules :

```csharp
var uppercaseFunction = kernel.CreateSemanticFunction("Transforme en majuscules : {{input}}");
```

### **Exemple : Importer des plugins**

Vous pouvez importer un ensemble de fonctions en tant que plugin :

```csharp
var textSkill = kernel.ImportSkillFromDirectory("Plugins", "TextSkill");
```

---

## **3. Génération d’un plan basé sur un objectif**

Une fois que les fonctions ou plugins sont disponibles, un plan peut être généré dynamiquement en fonction d’un objectif utilisateur.

### **Exemple : Génération de plan**

Définissons un objectif :

```csharp
var goal = "Convertis ce texte en majuscules, puis donne-moi sa longueur.";

// Créer un plan basé sur l’objectif
var plan = await kernel.CreatePlanAsync(goal);

// Afficher les étapes du plan
Console.WriteLine("Plan généré :");
foreach (var step in plan.Steps)
{
    Console.WriteLine($"Étape : {step.Description}");
}
```

---

## **4. Exécution d’un plan**

Un plan peut être exécuté directement une fois généré.

### **Étape 1 : Fournir un contexte initial**

Le contexte contient les variables nécessaires au plan :

```csharp
var context = new ContextVariables();
context["input"] = "Ceci est un exemple de texte.";
```

### **Étape 2 : Exécuter le plan**

Exécutez le plan avec les variables fournies :

```csharp
var result = await kernel.RunAsync(context, plan);

// Afficher le résultat final
Console.WriteLine($"Résultat final : {result.Result}");
```

---

## **5. Chaînage explicite des fonctions**

Si vous préférez définir explicitement le chaînage des fonctions sans passer par un objectif généralisé, vous pouvez le faire comme suit :

### **Étape 1 : Définir les fonctions**

Définissons deux fonctions simples :

1. Transformer le texte en majuscules.
2. Calculer la longueur du texte.

```csharp
var uppercaseFunction = kernel.CreateSemanticFunction("Transforme en majuscules : {{input}}");
var lengthFunction = kernel.CreateSemanticFunction("La longueur du texte est : {{input.Length}}");
```

### **Étape 2 : Exécution séquentielle**

Enchaînez manuellement les fonctions :

```csharp
// Étape 1 : Convertir en majuscules
var step1Result = await uppercaseFunction.InvokeAsync(new()
{
    ["input"] = "Ceci est un test."
});

// Étape 2 : Calculer la longueur
var step2Result = await lengthFunction.InvokeAsync(new()
{
    ["input"] = step1Result.Result
});

Console.WriteLine($"Longueur du texte : {step2Result.Result}");
```

---

## **6. Gestion avancée des plans avec conditions**

### **Exemple : Ajouter des conditions**

Vous pouvez introduire des étapes conditionnelles dans le plan, comme vérifier si le texte dépasse une certaine longueur avant de le transformer :

```csharp
var lengthCheckFunction = kernel.CreateSemanticFunction(@"
{{#if input.Length > 100}}
Texte trop long, veuillez le résumer.
{{else}}
Texte acceptable.
{{/if}}");

var summarizeFunction = kernel.CreateSemanticFunction("Résumé : {{input}}");
var context = new ContextVariables();
context["input"] = "Voici un texte long nécessitant potentiellement un résumé.";

var decision = await lengthCheckFunction.InvokeAsync(context);

if (decision.Result.Contains("Texte trop long"))
{
    var summary = await summarizeFunction.InvokeAsync(context);
    Console.WriteLine($"Résumé : {summary.Result}");
}
else
{
    Console.WriteLine("Pas besoin de résumé.");
}
```

---

## **7. Scénarios pratiques**

1. **Traitement des documents** : Convertir un fichier en texte brut, le résumer, et traduire le résumé.
2. **Assistant virtuel** : Comprendre la requête de l'utilisateur, classer la tâche, et exécuter les actions nécessaires.
3. **Analyse des données** : Enchaîner plusieurs fonctions pour nettoyer, analyser et visualiser les données.
4. **Orchestration AI** : Connecter plusieurs modèles d’IA dans un workflow cohérent.

---

Avec le planificateur, **Semantic Kernel** vous permet de gérer des workflows complexes de manière dynamique et modulaire, en s'appuyant sur des compétences et fonctions définies ou importées. C'est un outil puissant pour automatiser des tâches tout en conservant une flexibilité exceptionnelle.

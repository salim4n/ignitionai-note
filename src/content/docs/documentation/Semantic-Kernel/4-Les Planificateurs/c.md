---
title: Les planificateurs de guidon
description: Les planificateurs de guidon
---


Les **planificateurs de guidon** dans **Semantic Kernel** sont une variante des planificateurs standards, conçus pour fournir un contrôle explicite sur le chaînage et l'exécution des étapes dans un plan. Ils permettent de spécifier les fonctions à utiliser et les paramètres à transmettre à chaque étape, tout en laissant une certaine flexibilité pour adapter les plans.

---

## **1. Qu'est-ce qu'un planificateur de guidon (Guided Planner) ?**

Contrairement à un planificateur autonome qui détermine dynamiquement les étapes nécessaires, un planificateur de guidon permet :

- De guider explicitement la sélection et le chaînage des fonctions.
- D’ajouter des contraintes et des règles spécifiques.
- D’exécuter des étapes personnalisées tout en bénéficiant de la puissance des modèles d'IA pour certaines décisions.

Ce type de planificateur est utile lorsque vous avez une idée claire du workflow mais que vous souhaitez déléguer certains aspects aux modèles.

---

## **2. Configuration d’un planificateur de guidon**

Pour utiliser un planificateur de guidon, commencez par l’activer dans votre noyau.

### **Étape 1 : Ajouter le planificateur au noyau**

```csharp
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Planning;
using Microsoft.SemanticKernel.Orchestration;

var kernel = Kernel.Builder
    .WithPlanner() // Activer le planificateur
    .Build();
```

### **Étape 2 : Ajouter des compétences**

Ajoutez ou importez les fonctions nécessaires, qui seront utilisées par le planificateur :

```csharp
var textSkill = kernel.ImportSkillFromDirectory("Plugins", "TextSkill");
var mathSkill = kernel.ImportSkillFromDirectory("Plugins", "MathSkill");
```

---

## **3. Création d’un plan guidé**

Avec un planificateur de guidon, vous définissez manuellement chaque étape du plan. Cela inclut les fonctions à appeler et les dépendances entre les étapes.

### **Exemple 1 : Plan simple guidé**

Dans cet exemple, nous définissons un workflow où :

1. Le texte est transformé en majuscules.
2. La longueur du texte est calculée.

```csharp
var plan = new Plan("Traitement du texte");

// Étape 1 : Transformer le texte en majuscules
plan.AddStep("uppercase", "Transforme le texte en majuscules", async (context) =>
{
    var input = context["input"];
    var result = input.ToUpper(); // Transformation locale
    context["uppercaseResult"] = result;
});

// Étape 2 : Calculer la longueur
plan.AddStep("calculateLength", "Calcule la longueur du texte", async (context) =>
{
    var input = context["uppercaseResult"];
    var length = input.Length.ToString();
    context["lengthResult"] = length;
});
```

---

### **Exécution d’un plan guidé**

Une fois le plan défini, vous pouvez l’exécuter en fournissant un contexte :

```csharp
var context = new ContextVariables();
context["input"] = "Ceci est un texte de test.";

// Exécuter le plan guidé
await plan.ExecuteAsync(context);

// Récupérer les résultats finaux
Console.WriteLine($"Texte en majuscules : {context["uppercaseResult"]}");
Console.WriteLine($"Longueur du texte : {context["lengthResult"]}");
```

---

## **4. Ajout de conditions et de logique dynamique**

Les plans guidés permettent d’ajouter des étapes conditionnelles ou des boucles logiques :

### **Exemple 2 : Plan avec conditions**

Ce plan vérifie si le texte dépasse une certaine longueur avant d’ajouter une étape de résumé.

```csharp
var plan = new Plan("Traitement avec vérification de longueur");

// Étape 1 : Calculer la longueur
plan.AddStep("calculateLength", "Calcule la longueur du texte", async (context) =>
{
    var input = context["input"];
    context["length"] = input.Length.ToString();
});

// Étape 2 : Vérifier la longueur
plan.AddStep("checkLength", "Vérifie si le texte est trop long", async (context) =>
{
    var length = int.Parse(context["length"]);
    if (length > 100)
    {
        context["action"] = "résumer";
    }
    else
    {
        context["action"] = "aucune action nécessaire";
    }
});

// Étape 3 : Ajouter un résumé si nécessaire
plan.AddConditionalStep("résumer", "Résumé automatique", async (context) =>
{
    var input = context["input"];
    context["summary"] = input.Substring(0, 100) + "..."; // Résumé simple
}, condition: context => context["action"] == "résumer");
```

### **Exécution**

```csharp
var context = new ContextVariables();
context["input"] = "Ceci est un texte très long nécessitant potentiellement un résumé en fonction de sa longueur.";

// Exécuter le plan
await plan.ExecuteAsync(context);

// Résultats conditionnels
Console.WriteLine($"Action choisie : {context["action"]}");
if (context.ContainsKey("summary"))
{
    Console.WriteLine($"Résumé : {context["summary"]}");
}
```

---

## **5. Applications pratiques**

Les planificateurs de guidon sont idéaux pour :

1. **Workflow semi-automatisé** : Lorsque des étapes spécifiques nécessitent une logique métier définie.
2. **Orchestration de tâches IA et non-IA** : Mélanger des appels à des modèles et des transformations locales.
3. **Gestion des erreurs et décisions humaines** : Ajouter des étapes où des interventions manuelles ou des validations sont nécessaires.

---

## **6. Avantages des planificateurs de guidon**

- **Contrôle explicite** : Vous pouvez gérer précisément les étapes.
- **Flexibilité** : Ajouter des conditions, des boucles, ou des étapes dynamiques.
- **Puissance combinée** : Intégrez les modèles d'IA avec des étapes purement logiques ou métier.

Le **planificateur de guidon** de Semantic Kernel est une solution puissante pour développer des workflows à la fois automatisés et supervisés, tout en tirant parti des capacités avancées des modèles d'IA.

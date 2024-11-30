---
title: Les planificateurs stepwise
description: Les planificateurs stepwise
---


La mise en œuvre des planificateurs **stepwise** dans **Semantic Kernel** permet d’exécuter des plans complexes de manière itérative, étape par étape, en adaptant dynamiquement le plan à chaque résultat intermédiaire. Cela est particulièrement utile pour des tâches nécessitant un ajustement continu ou des décisions contextuelles.

---

## **1. Qu’est-ce qu’un planificateur stepwise ?**

Un planificateur **stepwise** est une approche où chaque étape du plan est évaluée et exécutée avant de passer à la suivante. Ce processus est itératif :

- Chaque étape dépend du contexte mis à jour après la précédente.
- Le plan peut être modifié dynamiquement en fonction des résultats intermédiaires.

Cela permet :

- Une gestion fine des étapes.
- L’inclusion de conditions ou d’actions supplémentaires en fonction des résultats obtenus.

---

## **2. Configuration initiale**

Pour utiliser un planificateur stepwise, configurez d'abord votre noyau avec le planificateur activé.

### **Configuration du noyau avec le planificateur**

```csharp
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Planning;
using Microsoft.SemanticKernel.Orchestration;

var kernel = Kernel.Builder
    .WithPlanner()
    .Build();
```

---

## **3. Création et utilisation d’un plan stepwise**

Un plan stepwise s’exécute en plusieurs étapes où chaque étape est définie et mise à jour dynamiquement.

### **Exemple de plan stepwise : Traitement de texte**

Objectif : Transformer un texte, vérifier sa longueur, puis résumer si nécessaire.

### **Étape 1 : Définir un plan de base**

Créez un plan avec des étapes dynamiques :

```csharp
// Définir un objectif initial
var goal = "Transformer un texte et vérifier ses caractéristiques.";

// Générer un plan stepwise
var planner = kernel.GetPlanner();
var plan = await planner.CreateStepwisePlanAsync(goal);
```

### **Étape 2 : Ajouter des étapes dynamiques au plan**

Les étapes sont ajoutées et modifiées dynamiquement pendant l'exécution.

#### **Étape 2.1 : Ajouter une étape pour transformer le texte en majuscules**

```csharp
plan.AddStep("uppercase", "Transformer le texte en majuscules", async (context) =>
{
    var input = context["input"];
    context["uppercaseResult"] = input.ToUpper();
});
```

#### **Étape 2.2 : Ajouter une étape pour vérifier la longueur**

```csharp
plan.AddStep("checkLength", "Vérifier si la longueur dépasse 100 caractères", async (context) =>
{
    var input = context["uppercaseResult"];
    var length = input.Length;
    context["length"] = length.ToString();

    if (length > 100)
    {
        context["needsSummary"] = "true";
    }
    else
    {
        context["needsSummary"] = "false";
    }
});
```

#### **Étape 2.3 : Ajouter une étape conditionnelle pour résumer le texte**

```csharp
plan.AddConditionalStep("summarize", "Résumé du texte si nécessaire", async (context) =>
{
    var input = context["uppercaseResult"];
    context["summary"] = input.Substring(0, 100) + "...";
}, condition: context => context["needsSummary"] == "true");
```

---

## **4. Exécution itérative du plan**

Le plan est exécuté étape par étape, et chaque étape met à jour le contexte.

### **Initialisation du contexte**

Créez un contexte initial contenant l’entrée :

```csharp
var context = new ContextVariables();
context["input"] = "Ceci est un texte très long qui pourrait nécessiter un résumé si sa longueur dépasse 100 caractères.";
```

### **Exécution du plan**

Exécutez le plan et affichez les résultats étape par étape :

```csharp
var stepwiseResult = await kernel.RunAsync(context, plan);

Console.WriteLine("Plan exécuté étape par étape :");
foreach (var variable in stepwiseResult)
{
    Console.WriteLine($"{variable.Key} : {variable.Value}");
}

// Afficher les résultats finaux
if (context.ContainsKey("summary"))
{
    Console.WriteLine($"Résumé : {context["summary"]}");
}
else
{
    Console.WriteLine("Pas besoin de résumé.");
}
```

---

## **5. Scénarios avancés avec Stepwise**

### **5.1 : Chaînage dynamique des fonctions**

Vous pouvez utiliser les résultats d’une étape pour appeler une autre fonction dynamique.

```csharp
plan.AddStep("dynamicCall", "Appel conditionnel d'une fonction externe", async (context) =>
{
    if (context["needsSummary"] == "true")
    {
        var summarizeFunction = kernel.CreateSemanticFunction("Résumé : {{input}}");
        var result = await summarizeFunction.InvokeAsync(context["uppercaseResult"]);
        context["summary"] = result.Result;
    }
});
```

---

### **5.2 : Itérations pour atteindre un objectif**

Si un objectif nécessite plusieurs tentatives ou corrections, vous pouvez ajuster dynamiquement les étapes du plan :

```csharp
plan.AddStep("iterate", "Raffiner les résultats jusqu'à satisfaction", async (context) =>
{
    var iterations = int.Parse(context.GetOrDefault("iterations", "0"));
    if (iterations < 3 && !context.ContainsKey("resultSatisfactory"))
    {
        context["iterations"] = (iterations + 1).ToString();
        // Ajouter une étape supplémentaire au plan
        plan.AddStep($"adjust_{iterations}", $"Ajustement {iterations}", async (subContext) =>
        {
            // Exemple : transformer le texte différemment
            subContext["adjusted"] = subContext["input"] + " - ajusté.";
        });
    }
});
```

---

## **6. Applications des planificateurs Stepwise**

### **6.1 : Analyse de données**

- Nettoyage des données.
- Calculs itératifs pour identifier les erreurs ou anomalies.
- Résumer des rapports longs.

### **6.2 : Assistant virtuel**

- Interprétation progressive des intentions utilisateur.
- Réponses contextuelles basées sur des informations collectées étape par étape.

### **6.3 : Orchestration de pipelines IA**

- Appels séquentiels à des modèles d'IA avec ajustements itératifs (traduction, classification, etc.).
- Planification dynamique en fonction des résultats intermédiaires.

---

## **7. Avantages des planificateurs Stepwise**

1. **Flexibilité** : Adaptez les étapes du plan à chaque itération.
2. **Réutilisabilité** : Chaque étape est indépendante, facilitant son intégration dans d’autres workflows.
3. **Robustesse** : Gérez les erreurs ou ajustez les actions dynamiquement.

Les planificateurs **stepwise** offrent une approche puissante pour créer des workflows adaptatifs, idéaux pour des scénarios complexes ou changeants.

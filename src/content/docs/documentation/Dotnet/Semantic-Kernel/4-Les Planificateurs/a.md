---
title: Le planificateur
description: Le planificateur
---

Le **planificateur** dans **Semantic Kernel** est un composant clé qui facilite l'organisation et l'exécution des tâches complexes en automatisant la sélection et le chaînage des fonctions nécessaires pour atteindre un objectif donné. Il permet de déléguer la gestion de workflows à une intelligence orchestratrice, ce qui simplifie le développement de solutions basées sur des pipelines d'intelligence artificielle.

---

## **1. Qu'est-ce que le planificateur dans Semantic Kernel ?**

Le planificateur (Planner) est conçu pour :

- **Décomposer un objectif** en sous-tâches logiques.
- **Identifier les fonctions disponibles** (natifs ou plugins) dans le noyau.
- **Créer un plan** (workflow) en fonction des tâches et des dépendances identifiées.
- **Exécuter les plans** tout en ajustant dynamiquement leur exécution en fonction des résultats intermédiaires.

Cela est particulièrement utile dans des scénarios où plusieurs étapes ou décisions conditionnelles sont nécessaires pour accomplir une tâche.

---

## **2. Caractéristiques principales du planificateur**

1. **Découverte automatique des compétences (skills)** :
   Le planificateur peut explorer et utiliser les compétences enregistrées dans le noyau.

2. **Génération dynamique de plans** :
   Il crée un plan basé sur un objectif, en déterminant quelles fonctions doivent être appelées et dans quel ordre.

3. **Chaînage intelligent** :
   Les résultats intermédiaires peuvent être réutilisés pour enchaîner les fonctions.

4. **Répétabilité et flexibilité** :
   Les plans peuvent être sauvegardés, modifiés ou réutilisés pour différents scénarios.

---

## **3. Configuration d'un planificateur**

### **Étape 1 : Activer le planificateur**

Ajoutez le composant planificateur au noyau :

```csharp
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Planning;

var kernel = Kernel.Builder
    .WithPlanner() // Ajout du planificateur
    .Build();
```

### **Étape 2 : Ajouter des compétences**

Le planificateur s'appuie sur les fonctions disponibles dans le noyau. Vous devez importer ou enregistrer des compétences pour qu'elles soient utilisables par le planificateur.

```csharp
var textSkill = kernel.ImportSkillFromDirectory("Plugins", "TextSkill");
var mathSkill = kernel.ImportSkillFromDirectory("Plugins", "MathSkill");
```

---

## **4. Création de plans simples**

### **Exemple 1 : Plan basé sur un objectif**

Définir un objectif et laisser le planificateur trouver les étapes nécessaires :

```csharp
// Objectif utilisateur
var goal = "Résume ce texte et traduis-le en espagnol.";

// Génération automatique d'un plan
var plan = await kernel.CreatePlanAsync(goal);

// Afficher le plan généré
Console.WriteLine("Plan généré :");
foreach (var step in plan.Steps)
{
    Console.WriteLine($"Étape : {step.Description}");
}
```

---

## **5. Exécution d'un plan**

### **Étape 1 : Génération et exécution**

Une fois le plan généré, il peut être exécuté directement :

```csharp
// Exécuter le plan
var result = await kernel.RunAsync(plan);

// Résultat final
Console.WriteLine($"Résultat : {result}");
```

### **Étape 2 : Ajout de contexte**

Vous pouvez fournir des variables de contexte à l'exécution du plan :

```csharp
var context = new ContextVariables();
context["input"] = "Semantic Kernel simplifie l'intégration des IA dans les applications modernes.";

var plan = await kernel.CreatePlanAsync("Résume ce texte.");

var result = await kernel.RunAsync(context, plan);

Console.WriteLine($"Résumé : {result.Result}");
```

---

## **6. Cas d'utilisation du planificateur**

1. **Assistant personnel** : Gérer des requêtes complexes telles que *"Planifie mon voyage en tenant compte de mes préférences."*.
2. **Automatisation des tâches** : Chaîner des étapes comme *"Télécharger un document, l'analyser, puis envoyer un rapport."*.
3. **Gestion de projets** : Créer et exécuter des workflows pour des projets multi-étapes.
4. **Analyse de données** : Orchestrer un pipeline de traitement et d'analyse basé sur un objectif défini.

---

## **7. Avantages du planificateur**

- **Gain de temps** : Pas besoin de définir manuellement le chaînage des fonctions.
- **Flexibilité** : Les plans s’adaptent dynamiquement aux changements d’objectifs ou de résultats intermédiaires.
- **Évolutivité** : Gère facilement des workflows complexes avec de nombreuses dépendances.

---

Le planificateur de **Semantic Kernel** permet de simplifier la gestion de tâches complexes tout en exploitant la puissance des modèles d'IA et des compétences disponibles. Cela en fait un outil indispensable pour développer des solutions intégrées et dynamiques.

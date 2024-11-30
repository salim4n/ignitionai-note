---
title : Collaboration entre les Agents
description : Collaboration entre les Agents
---

La **collaboration entre les agents** dans **Semantic Kernel** permet à plusieurs agents de travailler ensemble pour accomplir des objectifs complexes. Chaque agent se spécialise dans une tâche particulière et communique avec d'autres pour partager des données ou déléguer des étapes.

---

## **1. Pourquoi favoriser la collaboration entre agents ?**

- **Division des responsabilités** : Chaque agent se concentre sur une tâche spécifique.
- **Réutilisation** : Les agents peuvent être intégrés dans différents workflows sans duplication de logique.
- **Modularité** : Les systèmes deviennent plus faciles à maintenir et à étendre.
- **Complexité gérable** : Les tâches complexes sont décomposées en sous-tâches simples gérées par différents agents.

---

## **2. Exemple d'architecture collaborative**

Imaginons une application où plusieurs agents collaborent pour organiser un voyage :

1. **Agent de recherche** : Cherche des vols et hôtels.
2. **Agent de budget** : Calcule les coûts et vérifie les limites budgétaires.
3. **Agent de calendrier** : Planifie les activités en fonction des disponibilités.

Le flux global pourrait ressembler à ceci :

- L'utilisateur demande : *"Planifie un voyage à Paris dans mon budget de 1000 €."*
- L'**agent principal** orchestre les sous-tâches :
  - Demande à l'agent de recherche de trouver des options.
  - Envoie les résultats à l'agent de budget pour validation.
  - Passe les options validées à l'agent de calendrier pour planifier.

---

## **3. Exemple de mise en œuvre**

### **Étape 1 : Initialiser les agents**

Chaque agent est une fonction spécialisée dans le noyau.

#### Agent de recherche

```csharp
var searchAgent = kernel.CreateSemanticFunction(
    "Pour trouver des options de voyage à {{destination}}, recherche les vols et hôtels disponibles.",
    plugins: new[] { "SearchPlugin" }
);
```

#### Agent de budget

```csharp
var budgetAgent = kernel.CreateSemanticFunction(
    "Pour un budget de {{budget}}, valide si les options suivantes sont faisables : {{options}}.",
    plugins: new[] { "FinancePlugin" }
);
```

#### Agent de calendrier

```csharp
var calendarAgent = kernel.CreateSemanticFunction(
    "Planifie les activités pour un voyage à {{destination}} avec les options validées suivantes : {{validatedOptions}}.",
    plugins: new[] { "CalendarPlugin" }
);
```

---

### **Étape 2 : Orchestration dans l'agent principal**

L'agent principal orchestre les interactions entre les agents.

```csharp
var context = new ContextVariables();
context["destination"] = "Paris";
context["budget"] = "1000";

Console.WriteLine("Demande utilisateur : Planifier un voyage à Paris avec un budget de 1000 €.");
```

#### Étape 1 : Rechercher les options

```csharp
context["options"] = await kernel.RunAsync(context, searchAgent);
Console.WriteLine($"Options trouvées : {context["options"]}");
```

#### Étape 2 : Valider le budget

```csharp
context["validatedOptions"] = await kernel.RunAsync(context, budgetAgent);
Console.WriteLine($"Options validées : {context["validatedOptions"]}");
```

#### Étape 3 : Planifier les activités

```csharp
var travelPlan = await kernel.RunAsync(context, calendarAgent);
Console.WriteLine($"Plan de voyage final : {travelPlan}");
```

---

### **4. Collaboration avec les planificateurs**

Les planificateurs permettent de rendre la collaboration entre agents plus dynamique et adaptative.

#### Exemple avec un planificateur

1. **Créer un planificateur global** :

```csharp
var planner = kernel.GetPlanner();
```

2. **Définir le plan collaboratif** :
Le planificateur gère automatiquement l'ordre des étapes et délègue les tâches.

```csharp
var travelPlan = await planner.CreatePlanAsync(
    "Planifie un voyage à Paris dans un budget de 1000 €.",
    new[] { searchAgent, budgetAgent, calendarAgent }
);
```

3. **Exécuter le plan** :

```csharp
var finalPlan = await kernel.RunAsync(context, travelPlan);
Console.WriteLine($"Plan de voyage finalisé : {finalPlan}");
```

---

## **5. Modèle avancé : Communication entre agents**

Les agents peuvent partager des données dynamiquement à travers des contextes partagés.

### Exemple de partage dynamique

#### Ajouter une étape pour ajuster le budget

Si l'agent de budget détecte une limite, il peut demander à l'agent principal de réévaluer les options :

```csharp
var adjustBudgetAgent = kernel.CreateSemanticFunction(
    "Les options trouvées dépassent le budget de {{budget}}. Trouve des alternatives moins coûteuses pour {{destination}}.",
    plugins: new[] { "SearchPlugin" }
);
```

#### Boucle de collaboration

```csharp
while (true)
{
    var budgetResult = await kernel.RunAsync(context, budgetAgent);
    if (budgetResult.Contains("dépasse le budget"))
    {
        Console.WriteLine("Réévaluation des options...");
        context["options"] = await kernel.RunAsync(context, adjustBudgetAgent);
    }
    else
    {
        context["validatedOptions"] = budgetResult;
        break;
    }
}
```

---

## **6. Avantages de la collaboration**

1. **Répartition intelligente des tâches** : Chaque agent utilise ses capacités spécifiques.
2. **Gestion des échecs** : Si un agent échoue, un autre peut compenser.
3. **Flexibilité et adaptation** : Les workflows peuvent être modifiés dynamiquement.
4. **Scalabilité** : Ajout d’agents spécialisés à mesure que les besoins évoluent.

---

## **7. Résultat attendu**

- L'utilisateur fait une requête générale, comme *"Planifie mon voyage à Paris."*
- L'agent principal analyse la demande et active les agents nécessaires (recherche, budget, calendrier).
- Chaque agent collabore pour produire un plan final adapté aux besoins.

Ce modèle assure une collaboration fluide entre des agents spécialisés, permettant de gérer des tâches complexes de manière efficace et évolutive.

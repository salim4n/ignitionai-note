---
title: Les modèles d'invite
description: Les modèles d'invite
---

Dans **Semantic Kernel**, les **modèles d'invite** (prompt templates) sont des structures textuelles dynamiques utilisées pour communiquer avec des modèles d'IA, comme GPT-3. Ils permettent de définir un format standard pour interagir avec les modèles, tout en intégrant des variables ou des instructions spécifiques.

---

## **1. Pourquoi utiliser des modèles d’invite ?**

- **Personnalisation** : Créez des prompts adaptés à vos besoins.
- **Réutilisabilité** : Simplifiez le processus en utilisant des modèles préconçus.
- **Consistance** : Maintenez une structure uniforme dans vos interactions avec l’IA.

---

## **2. Syntaxe d’un modèle d’invite**

Un modèle d'invite est un texte pouvant inclure des variables entourées de doubles accolades `{{ }}`. Par exemple :

```txt
Je suis un assistant IA. Vous avez dit : "{{userInput}}". Que puis-je faire pour vous ?
```

### **Paramètres dynamiques**

Vous pouvez injecter des valeurs dynamiques dans les prompts au moment de l’exécution.

Exemple :

```txt
Créer un résumé pour ce texte : "{{text}}". Longueur souhaitée : {{length}} mots.
```

---

## **3. Développement et utilisation de modèles d’invite**

### **Étape 1 : Créer un modèle d’invite en C#**

Dans Semantic Kernel, les modèles d’invite sont encapsulés dans des fonctions, qui peuvent être utilisées via un fichier ou un code directement.

#### Exemple : Création d’un modèle d’invite simple

```csharp
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Orchestration;

var kernel = Kernel.Builder.Build();

// Définir un modèle d’invite directement dans le code
string promptTemplate = "Créer un résumé pour ce texte : {{text}}";

// Créer une fonction à partir du modèle
var summarizeFunction = kernel.CreateSemanticFunction(promptTemplate);

// Utiliser la fonction avec des paramètres
var result = await summarizeFunction.InvokeAsync(new ContextVariables
{
    ["text"] = "Semantic Kernel est une bibliothèque pour intégrer des IA dans des applications modernes."
});

Console.WriteLine(result);
```

---

### **Étape 2 : Charger un modèle d’invite depuis un fichier**

Si votre prompt est complexe, vous pouvez le stocker dans un fichier `.txt`.

#### Exemple : Fichier de modèle d’invite

**Chemin : `Plugins/SummarySkill/Summarize.txt`**

```txt
Créer un résumé en {{length}} mots pour le texte suivant :
{{text}}
```

#### Charger et exécuter le modèle

```csharp
var kernel = Kernel.Builder
    .Configure(config => config.AddOpenAIChatCompletion("gpt-3.5-turbo", "your-api-key"))
    .Build();

// Charger le modèle depuis le fichier
var skill = kernel.ImportSkillFromDirectory("Plugins", "SummarySkill");

// Utiliser une fonction du modèle
var result = await kernel.RunAsync(skill["Summarize"], new()
{
    ["text"] = "Semantic Kernel permet d’automatiser les interactions avec des modèles d’IA.",
    ["length"] = "50"
});

Console.WriteLine($"Résumé : {result}");
```

---

### **Étape 3 : Combinaison de modèles avec des compétences**

Les modèles d'invite peuvent être enrichis par d'autres compétences pour créer des flux complexes. Par exemple :

- Extraction d'informations d'un document.
- Résumé puis traduction du texte.

#### Exemple : Pipeline de tâches

```csharp
var textSkill = kernel.ImportSkill(new TextSkill(), "TextSkill");
var summarizeSkill = kernel.ImportSkillFromDirectory("Plugins", "SummarySkill");

// Exécuter une combinaison de compétences
var summary = await kernel.RunAsync(summarizeSkill["Summarize"], new()
{
    ["text"] = "Semantic Kernel est une bibliothèque pour l'intégration des modèles d'IA.",
    ["length"] = "50"
});

var translated = await kernel.RunAsync(textSkill["Translate"], new()
{
    ["input"] = summary,
    ["language"] = "fr"
});

Console.WriteLine($"Résumé traduit : {translated}");
```

---

## **4. Gestion avancée des modèles d’invite**

### **a) Ajout de logique conditionnelle**

Vous pouvez inclure des conditions dans les prompts en fonction des besoins :

```txt
Si l’utilisateur a dit quelque chose de négatif, répondre avec empathie :
{{#if sentiment == "negative"}}
Je suis désolé d’entendre cela. Comment puis-je vous aider ?
{{else}}
Merci pour votre message ! Puis-je vous aider avec autre chose ?
{{/if}}
```

#### Utilisation en code

```csharp
var promptTemplate = @"
Si l’utilisateur a dit quelque chose de négatif, répondre avec empathie :
{{#if sentiment == 'negative'}}
Je suis désolé d’entendre cela. Comment puis-je vous aider ?
{{else}}
Merci pour votre message ! Puis-je vous aider avec autre chose ?
{{/if}}";

var sentimentFunction = kernel.CreateSemanticFunction(promptTemplate);

var result = await sentimentFunction.InvokeAsync(new()
{
    ["sentiment"] = "negative"
});

Console.WriteLine(result); // Affiche la réponse conditionnelle.
```

---

### **b) Utilisation de fonctions intégrées (mathématiques, temps, etc.)**

Ajoutez des compétences comme `MathSkill` ou `TimeSkill` dans vos prompts :

```txt
Aujourd'hui est le {{currentDate}}. Votre tâche est de compléter cela avant {{deadline}}.
```

#### Exécution avec des plugins

```csharp
var timeSkill = kernel.ImportSkill(new TimeSkill(), "TimeSkill");

var result = await kernel.RunAsync(new ContextVariables
{
    ["currentDate"] = await kernel.RunAsync(timeSkill["GetCurrentTime"]),
    ["deadline"] = "2024-12-01"
});

Console.WriteLine(result);
```

---

## **5. Meilleures pratiques pour les modèles d’invite**

1. **Soyez clair et concis** : Fournissez des instructions explicites pour obtenir des résultats précis.
2. **Utilisez des variables descriptives** : Identifiez clairement les entrées et sorties.
3. **Testez vos prompts** : Essayez différentes formulations pour optimiser les performances.
4. **Modularisez vos prompts** : Séparez les fonctionnalités complexes en plusieurs modèles ou fonctions.

---

## **6. Cas d'utilisation des modèles d'invite**

- **Résumé automatique** : Créez des résumés personnalisés de longs documents.
- **Chatbots intelligents** : Créez des assistants conversationnels capables de répondre à des scénarios spécifiques.
- **Automatisation de flux métier** : Générer des réponses basées sur des données métier.
- **Applications créatives** : Générer des poèmes, des histoires ou des textes formatés.

En utilisant les modèles d’invite de manière stratégique, vous pouvez tirer parti de la puissance des modèles d’IA tout en structurant leurs réponses pour qu’elles s’adaptent parfaitement à vos besoins.

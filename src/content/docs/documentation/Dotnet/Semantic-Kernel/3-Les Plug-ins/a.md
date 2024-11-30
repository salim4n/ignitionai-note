---
title : Plugins dans Semantic Kernel
description : Plugins dans Semantic Kernel
---

Dans **Semantic Kernel**, les **plugins** (ou **compétences**) sont des ensembles de fonctionnalités encapsulées que le noyau peut utiliser pour accomplir des tâches spécifiques. Ces plugins peuvent être **natifs** (écrits en C#) ou **fonctionnels** (scripts définis avec des modèles d'IA). Les plugins permettent de modulariser et d'étendre les capacités du noyau.

---

## **1. Types de Plugins dans Semantic Kernel**

### **a) Plugins natifs**

Les plugins natifs sont des classes C# qui exposent des fonctionnalités via des méthodes annotées. Ces méthodes peuvent être invoquées directement par le noyau.

**Exemple :** Un plugin pour effectuer des calculs simples.

```csharp
using Microsoft.SemanticKernel.SkillDefinition;

public class MathPlugin
{
    [SKFunction("Additionner deux nombres")]
    public string Add([SKParameter("x", "Premier nombre")] double x, [SKParameter("y", "Second nombre")] double y)
    {
        return (x + y).ToString();
    }
}
```

---

### **b) Plugins basés sur des modèles d'IA**

Ces plugins s'appuient sur des services d'IA comme OpenAI ou Azure OpenAI pour accomplir des tâches. Ils sont définis à l'aide de modèles (prompts) dans des fichiers texte.

**Exemple :** Un fichier `SummarizePlugin.txt` pour résumer un texte.

```
{{$input}}

Résume le texte ci-dessus en 50 mots ou moins.
```

Le noyau peut charger ce fichier comme un plugin fonctionnel.

---

### **c) Plugins hybrides**

Ce sont des combinaisons de plugins natifs et basés sur des modèles. Par exemple, un plugin natif peut appeler un service d'IA pour une tâche spécifique.

---

## **2. Ajouter un Plugin au Noyau**

### **a) Charger un Plugin natif**

Pour utiliser un plugin natif, vous l’importez dans le noyau à l’aide de la méthode `ImportSkill`.

```csharp
using Microsoft.SemanticKernel;

var kernel = Kernel.Builder.Build();

// Charger un plugin natif
var mathPlugin = kernel.ImportSkill(new MathPlugin(), "MathPlugin");

// Exécuter une méthode du plugin
var result = await kernel.RunAsync(mathPlugin["Add"], new()
{
    ["x"] = "5",
    ["y"] = "10"
});

Console.WriteLine($"Résultat : {result}");
```

---

### **b) Charger un Plugin basé sur un modèle IA**

Les plugins basés sur des modèles peuvent être définis dans des fichiers ou directement dans le code.

#### **Exemple avec un fichier**

1. Créez un fichier `Plugins/SummarizePlugin.txt` :

   ```
   {{$input}}

   Résume le texte ci-dessus en une phrase concise.
   ```

2. Chargez et utilisez le plugin :

   ```csharp
   using Microsoft.SemanticKernel;

   var kernel = Kernel.Builder
       .Configure(config =>
       {
           config.AddOpenAIChatCompletion("gpt-4", "your-openai-api-key");
       })
       .Build();

   // Charger le plugin basé sur un fichier
   var summarizePlugin = kernel.ImportSkillFromDirectory("Plugins", "SummarizePlugin");

   // Utiliser le plugin
   string text = "L'intelligence artificielle est un domaine en pleine expansion.";
   var summary = await kernel.RunAsync(summarizePlugin["SummarizePlugin"], new()
   {
       ["input"] = text
   });

   Console.WriteLine($"Résumé : {summary}");
   ```

#### **Exemple avec un modèle inline**

```csharp
var inlineSkill = kernel.CreateSemanticFunction(@"
{{$input}}

Résume le texte ci-dessus en une phrase concise.
", maxTokens: 100);

string text = "L'intelligence artificielle est un domaine en pleine expansion.";
var summary = await kernel.RunAsync(inlineSkill, new() { ["input"] = text });

Console.WriteLine($"Résumé : {summary}");
```

---

### **c) Combinaison de Plugins**

Vous pouvez combiner des plugins pour enchaîner des tâches. Par exemple, un plugin natif peut prétraiter les données avant qu'un plugin basé sur un modèle IA ne les utilise.

---

## **3. Organisation des Plugins**

Pour des projets complexes, les plugins peuvent être organisés dans des dossiers et chargés dynamiquement. Par exemple, tous les plugins de traitement de texte peuvent être regroupés sous un dossier `TextProcessing`.

---

## **4. Utilisations Avancées des Plugins**

- **Chaining** : Enchaîner plusieurs plugins pour des workflows complexes.
- **Dynamic Invocation** : Appeler des plugins dynamiquement en fonction des entrées.
- **Hybrid Reasoning** : Utiliser des plugins IA et natifs pour combiner logique métier et intelligence.

---

## **5. Exemple Complet : Workflow avec Plugins**

Supposons que nous voulons analyser un texte, le résumer et en tirer des mots-clés :

### **Plugin natif pour extraire les mots-clés**

```csharp
public class KeywordExtractor
{
    [SKFunction("Extraire des mots-clés")]
    public string ExtractKeywords([SKParameter("text", "Texte à analyser")] string text)
    {
        // Extraction basique de mots-clés (simulation)
        return string.Join(", ", text.Split(' ').Distinct());
    }
}
```

### **Pipeline combiné**

```csharp
using Microsoft.SemanticKernel;

var kernel = Kernel.Builder
    .Configure(config =>
    {
        config.AddOpenAIChatCompletion("gpt-4", "your-openai-api-key");
    })
    .Build();

// Charger les plugins
var summarizePlugin = kernel.ImportSkillFromDirectory("Plugins", "SummarizePlugin");
var keywordPlugin = kernel.ImportSkill(new KeywordExtractor(), "KeywordExtractor");

// Exemple de texte
string inputText = "L'intelligence artificielle est un domaine fascinant en pleine évolution.";

// Résumer le texte
var summary = await kernel.RunAsync(summarizePlugin["SummarizePlugin"], new()
{
    ["input"] = inputText
});

// Extraire les mots-clés du résumé
var keywords = await kernel.RunAsync(keywordPlugin["ExtractKeywords"], new()
{
    ["text"] = summary
});

Console.WriteLine($"Résumé : {summary}");
Console.WriteLine($"Mots-clés : {keywords}");
```

---

### **Conclusion**

Les plugins dans **Semantic Kernel** offrent une modularité et une flexibilité puissantes. Vous pouvez créer des plugins natifs pour des tâches métier spécifiques, des plugins basés sur des modèles IA pour des tâches cognitives, ou les combiner pour construire des workflows complexes.

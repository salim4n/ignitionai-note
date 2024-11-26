---
title : Développement de fonctions natives
description : Développement de fonctions natives
---

Le **développement de fonctions natives** dans **Semantic Kernel** consiste à créer des compétences (ou plugins) écrites en C# qui encapsulent des fonctionnalités spécifiques. Ces fonctions sont indépendantes des modèles d'IA et sont exécutées directement par le noyau. Elles permettent d'intégrer des traitements métier ou des tâches spécifiques dans votre pipeline d'intelligence artificielle.

---

## **1. Qu’est-ce qu’une fonction native dans Semantic Kernel ?**

Une **fonction native** est une méthode définie dans une classe, annotée avec des attributs fournis par Semantic Kernel pour exposer ses fonctionnalités. Ces fonctions sont invoquées par le noyau comme toute autre fonction d’invitation, mais elles n’impliquent pas l’utilisation d’un modèle IA.

**Exemple typique** : Une fonction qui effectue des calculs, manipule des fichiers, ou interagit avec une API externe.

---

## **2. Structure d’une fonction native**

Une fonction native est une méthode annotée par `[SKFunction]` et peut accepter des **paramètres nommés** via `[SKParameter]`.

### **Exemple : Fonction simple**

```csharp
using Microsoft.SemanticKernel.SkillDefinition;

public class MathSkill
{
    [SKFunction("Additionner deux nombres")]
    public string Add(
        [SKParameter("x", "Premier nombre à additionner")] double x,
        [SKParameter("y", "Second nombre à additionner")] double y)
    {
        return (x + y).ToString();
    }
}
```

- **[SKFunction]** : Indique que cette méthode est une fonction native exposée au noyau.
- **[SKParameter]** : Définit les paramètres de la fonction, leurs noms et descriptions.

---

## **3. Ajouter une fonction native au noyau**

Pour utiliser une fonction native dans le noyau, vous devez :

1. Instancier la classe contenant les fonctions.
2. L’importer dans le noyau avec `ImportSkill`.

### **Exemple : Ajouter et exécuter une fonction native**

```csharp
using Microsoft.SemanticKernel;

var kernel = Kernel.Builder.Build();

// Ajouter le plugin
var mathSkill = kernel.ImportSkill(new MathSkill(), "MathSkill");

// Exécuter la fonction
var result = await kernel.RunAsync(mathSkill["Add"], new()
{
    ["x"] = "5",
    ["y"] = "10"
});

Console.WriteLine($"Résultat : {result}");
```

---

## **4. Fonctions natives avancées**

### **a) Utilisation de dépendances**

Les fonctions natives peuvent utiliser des dépendances, comme des services externes ou des bases de données.

#### Exemple : Accéder à une API externe

```csharp
using Microsoft.SemanticKernel.SkillDefinition;
using System.Net.Http;
using System.Threading.Tasks;

public class WeatherSkill
{
    private readonly HttpClient _httpClient;

    public WeatherSkill(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    [SKFunction("Obtenir la météo actuelle pour une ville")]
    public async Task<string> GetWeatherAsync(
        [SKParameter("city", "Nom de la ville")] string city)
    {
        var response = await _httpClient.GetStringAsync($"https://api.weatherapi.com/v1/current.json?key=your-api-key&q={city}");
        return response;
    }
}
```

#### Ajout de la compétence au noyau

```csharp
var httpClient = new HttpClient();
var weatherSkill = new WeatherSkill(httpClient);

var kernel = Kernel.Builder.Build();
kernel.ImportSkill(weatherSkill, "WeatherSkill");

var result = await kernel.RunAsync(weatherSkill["GetWeatherAsync"], new()
{
    ["city"] = "Paris"
});

Console.WriteLine($"Météo : {result}");
```

---

### **b) Combinaison avec des fonctions IA**

Les fonctions natives peuvent être utilisées pour prétraiter ou post-traiter les données avant ou après une fonction IA.

#### Exemple : Prétraiter des données

```csharp
public class PreprocessingSkill
{
    [SKFunction("Nettoyer un texte pour une analyse IA")]
    public string CleanText(
        [SKParameter("input", "Texte à nettoyer")] string input)
    {
        // Exemple de nettoyage basique
        return input.Replace("\n", " ").Trim();
    }
}
```

#### Pipeline combiné

```csharp
var preprocessingSkill = kernel.ImportSkill(new PreprocessingSkill(), "PreprocessingSkill");
var iaFunction = kernel.CreateSemanticFunction("{{$input}} Résume ce texte en une phrase.");

// Nettoyage avant IA
var cleanedText = await kernel.RunAsync(preprocessingSkill["CleanText"], new() { ["input"] = "Texte avec \n des retours à la ligne." });

// Analyse IA après nettoyage
var result = await kernel.RunAsync(iaFunction, new() { ["input"] = cleanedText });

Console.WriteLine($"Résultat : {result}");
```

---

## **5. Organisation des fonctions natives**

Les fonctions natives peuvent être organisées en groupes logiques appelés **compétences** (skills). Chaque compétence est une classe qui encapsule un ensemble de fonctionnalités liées.

**Exemple : Compétence Mathématique**

```csharp
public class MathSkill
{
    [SKFunction("Additionner deux nombres")]
    public string Add(double x, double y) => (x + y).ToString();

    [SKFunction("Multiplier deux nombres")]
    public string Multiply(double x, double y) => (x * y).ToString();
}
```

Importer cette compétence :

```csharp
var mathSkill = kernel.ImportSkill(new MathSkill(), "MathSkill");

// Utiliser les deux fonctions
var addResult = await kernel.RunAsync(mathSkill["Add"], new() { ["x"] = "5", ["y"] = "10" });
var multiplyResult = await kernel.RunAsync(mathSkill["Multiply"], new() { ["x"] = "5", ["y"] = "10" });

Console.WriteLine($"Addition : {addResult}, Multiplication : {multiplyResult}");
```

---

## **6. Cas d’utilisation des fonctions natives**

- **Interfaçage avec des systèmes existants** : Accès aux bases de données, APIs, ou systèmes métier.
- **Prétraitement et validation** : Vérifier ou nettoyer les entrées avant de les transmettre à un modèle IA.
- **Calculs ou transformations rapides** : Effectuer des opérations qui ne nécessitent pas de traitement IA.
- **Extension du noyau** : Ajouter des fonctionnalités spécifiques non prises en charge par défaut.

---

En combinant des fonctions natives avec des modèles IA, **Semantic Kernel** vous permet de construire des pipelines intelligents et robustes, tout en exploitant des traitements personnalisés et des capacités d’apprentissage machine avancées.

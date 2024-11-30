---
title : Plugins prêts à l'emploi
description : Plugins prêts à l'emploi
---


Les **plugins prêts à l'emploi** dans **Semantic Kernel** sont des bibliothèques ou des ensembles de compétences préconçus qui encapsulent des fonctionnalités courantes, comme l'accès à des API, des transformations de données ou des utilitaires de texte. Ces plugins permettent de gagner du temps en intégrant rapidement des capacités standard à votre application.

---

## **1. Pourquoi utiliser des plugins prêts à l’emploi ?**

- **Gain de temps** : Pas besoin de réécrire des fonctionnalités courantes.
- **Facilité d’intégration** : Compatibilité native avec le noyau.
- **Personnalisation** : Vous pouvez étendre ou modifier ces plugins pour répondre à vos besoins.

---

## **2. Exemples de plugins prêts à l’emploi**

Semantic Kernel propose des plugins intégrés pour des tâches variées, notamment :

- **TextSkill** : Manipulations de texte (résumés, nettoyage, analyse).
- **TimeSkill** : Gestion du temps (formatage de dates, décalages horaires).
- **MathSkill** : Calculs mathématiques de base.
- **FileSkill** : Manipulation de fichiers.
- **EmailSkill** : Envoi d’emails (nécessite une configuration avec des API externes).

---

## **3. Comment utiliser un plugin prêt à l’emploi**

### **Étape 1 : Charger un plugin intégré**

Les plugins intégrés sont directement disponibles via le noyau. Par exemple, pour utiliser le plugin **TextSkill** :

```csharp
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.CoreSkills;

var kernel = Kernel.Builder.Build();

// Charger le plugin intégré TextSkill
var textSkill = kernel.ImportSkill(new TextSkill(), "TextSkill");

// Exécuter une fonction du plugin
var result = await kernel.RunAsync(textSkill["Uppercase"], new()
{
    ["input"] = "bonjour, comment ça va ?"
});

Console.WriteLine($"Résultat : {result}"); // Résultat : BONJOUR, COMMENT ÇA VA ?
```

---

### **Étape 2 : Importer un plugin externe depuis un répertoire**

Si un plugin est disponible sous forme de fichiers de prompt, comme un répertoire contenant des fichiers `.txt`, vous pouvez l'importer directement.

#### Structure du répertoire

```
/Plugins
    /ExampleSkill
        Summarize.txt
        Translate.txt
```

#### Charger et utiliser un plugin

```csharp
var kernel = Kernel.Builder
    .Configure(config =>
    {
        config.AddOpenAIChatCompletion("gpt-3.5-turbo", "your-api-key");
    })
    .Build();

// Charger le plugin depuis un répertoire
var exampleSkill = kernel.ImportSkillFromDirectory("Plugins", "ExampleSkill");

// Utiliser une fonction du plugin
var summary = await kernel.RunAsync(exampleSkill["Summarize"], new()
{
    ["input"] = "Semantic Kernel est une bibliothèque puissante pour l'intégration de l'IA."
});

Console.WriteLine($"Résumé : {summary}");
```

---

### **Étape 3 : Utiliser un plugin distant (API)**

Certains plugins exploitent des API externes (comme des services météo ou des bases de données). Ces plugins nécessitent souvent une configuration.

#### Exemple : Utilisation d’un plugin météo

```csharp
using Microsoft.SemanticKernel.SkillDefinition;
using System.Net.Http;
using System.Threading.Tasks;

public class WeatherPlugin
{
    private readonly HttpClient _httpClient;

    public WeatherPlugin(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    [SKFunction("Obtenir la météo actuelle")]
    public async Task<string> GetWeatherAsync(
        [SKParameter("city", "Nom de la ville")] string city)
    {
        var response = await _httpClient.GetStringAsync($"https://api.weatherapi.com/v1/current.json?key=your-api-key&q={city}");
        return response;
    }
}
```

#### Intégration avec le noyau

```csharp
var kernel = Kernel.Builder.Build();
var weatherPlugin = new WeatherPlugin(new HttpClient());

// Charger et utiliser le plugin
kernel.ImportSkill(weatherPlugin, "WeatherPlugin");

var result = await kernel.RunAsync(weatherPlugin["GetWeatherAsync"], new()
{
    ["city"] = "Paris"
});

Console.WriteLine($"Météo à Paris : {result}");
```

---

## **4. Liste des plugins intégrés importants**

### **a) TextSkill**

Ce plugin permet des manipulations courantes de texte :

- **Uppercase** : Convertit un texte en majuscules.
- **Lowercase** : Convertit un texte en minuscules.
- **Trim** : Supprime les espaces inutiles.
- **Concatenate** : Combine plusieurs chaînes.

#### Exemple

```csharp
var textSkill = kernel.ImportSkill(new TextSkill(), "TextSkill");

var concatenated = await kernel.RunAsync(textSkill["Concatenate"], new()
{
    ["input1"] = "Bonjour",
    ["input2"] = "le monde"
});

Console.WriteLine($"Concaténé : {concatenated}");
```

---

### **b) TimeSkill**

Ce plugin gère des tâches liées au temps :

- **AddToDate** : Ajoute un décalage (jours, heures) à une date.
- **GetCurrentTime** : Renvoie l'heure actuelle.

#### Exemple

```csharp
var timeSkill = kernel.ImportSkill(new TimeSkill(), "TimeSkill");

var currentTime = await kernel.RunAsync(timeSkill["GetCurrentTime"]);
Console.WriteLine($"Heure actuelle : {currentTime}");

var futureTime = await kernel.RunAsync(timeSkill["AddToDate"], new()
{
    ["input"] = "2024-01-01",
    ["days"] = "5"
});

Console.WriteLine($"Date future : {futureTime}");
```

---

## **5. Plugins disponibles dans la communauté**

### **a) Dépôt GitHub**

Consultez le dépôt GitHub officiel ou communautaire pour trouver des plugins préconçus :

- [Semantic Kernel GitHub](https://github.com/microsoft/semantic-kernel)

Certains plugins courants incluent :

- Génération de rapports.
- Résumés de documents PDF.
- Connexion à des API tierces.

### **b) Marketplace**

Des marketplaces de plugins ou des répertoires collaboratifs sont souvent utilisés pour partager des plugins (actuellement en cours de développement pour SK).

---

## **6. Cas d’utilisation courants**

- **Applications de productivité** : Résumer des textes ou combiner des notes.
- **Intégration d’API** : Accéder à des services comme la météo, des bases de données ou des services de traduction.
- **Automatisation** : Gérer des dates, manipuler des fichiers ou envoyer des emails.

En utilisant des **plugins prêts à l’emploi**, vous pouvez rapidement intégrer des fonctionnalités avancées dans votre application sans avoir à les développer de zéro, tout en conservant la flexibilité de les modifier selon vos besoins.

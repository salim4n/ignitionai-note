---
title : Ajouter un service IA au noyau
description : Ajouter un service IA au noyau
---



Pour ajouter un service d’intelligence artificielle (IA) au **Semantic Kernel**, vous devez configurer le noyau afin qu’il utilise un service spécifique, comme **OpenAI**, **Azure OpenAI**, ou un autre modèle personnalisé. Cette configuration permet d’intégrer le service et de l’utiliser pour des tâches comme la génération de texte, le traitement de langage naturel ou les calculs vectoriels.

---

### **Étapes pour ajouter un service IA au noyau**  

1. **Configurer le noyau** :
   Vous spécifiez le service IA que vous voulez utiliser en fournissant les informations nécessaires, comme les clés API, les noms de modèles, et les points de terminaison.

2. **Ajouter le service IA** :  
   Les services IA peuvent être ajoutés à l’aide de méthodes dédiées comme `AddOpenAIChatCompletion`, `AddAzureOpenAIChatCompletion`, ou d'autres méthodes similaires.

3. **Utiliser le service IA dans les compétences** :  
   Une fois le service ajouté, il peut être utilisé dans les compétences pour exécuter des tâches spécifiques.

---

### **Exemples de configuration pour différents services IA**

#### **1. Utilisation d'OpenAI**

```csharp
using Microsoft.SemanticKernel;

// Créer le noyau avec OpenAI
var kernel = Kernel.Builder
    .Configure(config =>
    {
        config.AddOpenAIChatCompletion(
            "gpt-4",           // Nom du modèle
            "your-openai-api-key"  // Clé API
        );
    })
    .Build();

// Exemple d'appel au modèle
string input = "Explique-moi ce qu'est le cloud computing.";
var response = await kernel.RunAsync(input);
Console.WriteLine(response);
```

---

#### **2. Utilisation d’Azure OpenAI**  

Azure OpenAI nécessite un point de terminaison spécifique et une clé API pour se connecter.

```csharp
using Microsoft.SemanticKernel;

// Créer le noyau avec Azure OpenAI
var kernel = Kernel.Builder
    .Configure(config =>
    {
        config.AddAzureOpenAIChatCompletion(
            "gpt-4",           // Nom du modèle
            "your-model-deployment-name", // Nom du déploiement
            "https://your-azure-endpoint.openai.azure.com", // Point de terminaison Azure
            "your-azure-api-key" // Clé API Azure
        );
    })
    .Build();

// Exemple d'appel au modèle
string input = "Donne-moi des idées pour un projet IA.";
var response = await kernel.RunAsync(input);
Console.WriteLine(response);
```

---

#### **3. Utilisation d’un service personnalisé**

Pour un modèle personnalisé, vous pouvez fournir un connecteur via l’interface `ITextCompletion`.

```csharp
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.AI.TextCompletion;

// Implémenter un service IA personnalisé
public class CustomAIService : ITextCompletion
{
    public async Task<string> CompleteAsync(string prompt, CancellationToken cancellationToken = default)
    {
        // Exemple de logique pour un modèle IA personnalisé
        return await Task.FromResult($"Réponse simulée pour : {prompt}");
    }
}

// Ajouter le service personnalisé au noyau
var kernel = Kernel.Builder
    .Configure(config =>
    {
        config.AddTextCompletionService("customAI", new CustomAIService());
    })
    .Build();

// Exemple d'utilisation
string input = "Qu'est-ce que le Machine Learning ?";
var response = await kernel.RunAsync(input);
Console.WriteLine(response);
```

---

### **Ajout de plusieurs services IA**

Vous pouvez configurer plusieurs services IA pour différentes tâches, par exemple, un service pour la génération de texte et un autre pour les calculs vectoriels.

```csharp
using Microsoft.SemanticKernel;

// Créer le noyau avec plusieurs services
var kernel = Kernel.Builder
    .Configure(config =>
    {
        // Ajouter OpenAI
        config.AddOpenAIChatCompletion("gpt-4", "openai-api-key");

        // Ajouter Azure OpenAI
        config.AddAzureOpenAIChatCompletion(
            "gpt-4", 
            "azure-model-deployment-name", 
            "https://azure-endpoint.openai.azure.com", 
            "azure-api-key"
        );
    })
    .Build();

// Exemple d'utilisation
string input = "Qu'est-ce que Semantic Kernel ?";
var response = await kernel.RunAsync(input);
Console.WriteLine(response);
```

---

### **Conclusion**

L’ajout d’un service IA au **Semantic Kernel** est une étape simple grâce aux connecteurs natifs du framework. Une fois configuré, vous pouvez utiliser le service pour des tâches avancées comme la génération de texte, l’analyse contextuelle, ou les calculs vectoriels, tout en l’intégrant dans vos compétences pour répondre à des besoins métier spécifiques.

---
title : Tester le noyau
description : Tester le noyau
---



Pour essayer le **Semantic Kernel**, il est préférable de créer un projet minimal en C# pour tester les capacités de base du noyau. Voici les étapes pour mettre en place un environnement et exécuter un exemple simple.

---

### **Étape 1 : Configuration du projet**

1. **Installer les outils nécessaires** :
   - Visual Studio ou Visual Studio Code.
   - .NET 6 ou .NET 7 SDK (minimum .NET 6).
   - Une clé API pour un service d'IA comme OpenAI ou Azure OpenAI.

2. **Créer un nouveau projet** :

   ```bash
   dotnet new console -n SemanticKernelDemo
   cd SemanticKernelDemo
   ```

3. **Ajouter les dépendances** :
   Installer le package NuGet **Microsoft.SemanticKernel**.

   ```bash
   dotnet add package Microsoft.SemanticKernel
   ```

---

### **Étape 2 : Implémentation simple**

Créez un fichier `Program.cs` avec le code suivant pour tester le noyau avec OpenAI.

#### **Code simple**

```csharp
using System;
using Microsoft.SemanticKernel;

class Program
{
    static async Task Main(string[] args)
    {
        // Configurer le noyau avec un modèle OpenAI
        var kernel = Kernel.Builder
            .Configure(config =>
            {
                config.AddOpenAIChatCompletion(
                    "gpt-3.5-turbo",          // Nom du modèle
                    "your-openai-api-key"     // Clé API OpenAI
                );
            })
            .Build();

        // Créer une tâche simple : générer une explication
        string input = "Explique-moi brièvement ce qu'est l'IA.";
        var response = await kernel.RunAsync(input);

        // Afficher la réponse
        Console.WriteLine("Réponse générée :");
        Console.WriteLine(response);
    }
}
```

---

### **Étape 3 : Exécuter le projet**

1. Compilez et exécutez le projet :

   ```bash
   dotnet run
   ```

2. Si tout est configuré correctement, le modèle OpenAI (par exemple, GPT-3.5) répondra avec une explication concise de l'IA.

---

### **Étape 4 : Ajouter une compétence personnalisée**

Pour tester les capacités de gestion des compétences du noyau, créez une **compétence native** simple.

#### **Ajouter une compétence**

Créez un fichier `MySkill.cs` :

```csharp
using Microsoft.SemanticKernel.SkillDefinition;

public class MySkill
{
    [SKFunction("Saluer une personne")]
    public string Greet([SKParameter("name", "Nom de la personne à saluer")] string name)
    {
        return $"Bonjour, {name} ! Ravi de te voir.";
    }
}
```

#### **Utiliser la compétence dans le noyau**

Modifiez `Program.cs` pour inclure cette compétence :

```csharp
using System;
using Microsoft.SemanticKernel;

class Program
{
    static async Task Main(string[] args)
    {
        // Configurer le noyau
        var kernel = Kernel.Builder.Build();

        // Enregistrer la compétence
        var mySkill = kernel.ImportSkill(new MySkill(), "MySkill");

        // Utiliser la compétence
        var result = await kernel.RunAsync(mySkill["Greet"], new()
        {
            ["name"] = "Salim"
        });

        Console.WriteLine("Réponse de la compétence :");
        Console.WriteLine(result);
    }
}
```

---

### **Étape 5 : Étendre avec des tâches plus complexes**

1. **Ajouter une mémoire sémantique** :
   Pour conserver des informations ou effectuer des recherches dans des données passées.
2. **Planifier des actions** :
   Tester les capacités de planification dynamique.
3. **Intégrer des services externes** :
   Par exemple, connecter le noyau à une API externe pour des tâches métiers.

---

### **Conclusion**

Avec cette approche, vous pouvez facilement tester les capacités du **Semantic Kernel**. Une fois à l’aise avec les exemples de base, vous pouvez explorer des fonctionnalités avancées comme les plans, la mémoire, et l’intégration de modèles hybrides.

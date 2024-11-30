---
title : Développement de fonction d'invite
description : Développement de fonction d'invite
---



Le **développement de fonction d'invite** (prompt engineering) dans **Semantic Kernel** consiste à créer des fonctions qui utilisent des modèles d'IA pour accomplir des tâches spécifiques. Ces fonctions peuvent être créées directement à partir de prompts (invitations) écrites en texte naturel. Semantic Kernel vous permet de développer ces fonctions via des fichiers ou du code inline.

---

## **1. Qu’est-ce qu’une fonction d’invite dans Semantic Kernel ?**

Une **fonction d'invite** est une méthode encapsulée dans le noyau qui utilise un prompt pour interagir avec un modèle d'IA. Ces fonctions sont définies par un texte d'invite contenant des instructions sur ce que le modèle doit accomplir. Par exemple :

```text
{{$input}}

Réponds à la question ci-dessus de manière concise et professionnelle.
```

---

## **2. Étapes pour créer une fonction d’invite**

### **a) Créer une fonction à partir d’un fichier**

1. **Créer le fichier d'invite**  
   Créez un fichier `.txt` contenant l’invite. Par exemple, `Plugins/AnswerQuestion.txt` :

   ```
   {{$input}}

   Réponds à la question ci-dessus de manière concise et professionnelle.
   ```

2. **Charger la fonction dans le noyau**  
   Ajoutez le fichier dans votre projet, puis chargez-le dans le noyau avec `ImportSkillFromDirectory` :

   ```csharp
   using Microsoft.SemanticKernel;

   var kernel = Kernel.Builder
       .Configure(config =>
       {
           config.AddOpenAIChatCompletion("gpt-3.5-turbo", "your-openai-api-key");
       })
       .Build();

   // Charger la fonction à partir du fichier
   var questionFunction = kernel.ImportSkillFromDirectory("Plugins", "AnswerQuestion");

   // Exécuter la fonction
   var result = await kernel.RunAsync(questionFunction["AnswerQuestion"], new()
   {
       ["input"] = "Qu'est-ce que l'intelligence artificielle ?"
   });

   Console.WriteLine($"Réponse : {result}");
   ```

---

### **b) Créer une fonction inline**

Vous pouvez aussi définir une fonction directement dans votre code sans utiliser de fichier.

```csharp
using Microsoft.SemanticKernel;

var kernel = Kernel.Builder
    .Configure(config =>
    {
        config.AddOpenAIChatCompletion("gpt-4", "your-openai-api-key");
    })
    .Build();

// Créer une fonction inline
var inlineFunction = kernel.CreateSemanticFunction(@"
{{$input}}

Réponds à la question ci-dessus avec des exemples si possible.
", maxTokens: 200);

// Exécuter la fonction
var result = await kernel.RunAsync(inlineFunction, new()
{
    ["input"] = "Comment fonctionne un réseau de neurones ?"
});

Console.WriteLine($"Réponse : {result}");
```

---

## **3. Personnalisation des fonctions d’invite**

### **a) Utiliser des paramètres personnalisés**

Vous pouvez ajouter des **paramètres dynamiques** à vos fonctions d'invite pour rendre les réponses plus adaptées.

Exemple : Ajouter une tonalité aux réponses (formelle, humoristique, etc.).

```csharp
using Microsoft.SemanticKernel.SkillDefinition;

public class CustomPromptSkill
{
    [SKFunction("Répondre avec une tonalité spécifique")]
    public string AnswerWithTone(
        [SKParameter("input", "La question à laquelle répondre")] string input,
        [SKParameter("tone", "Le ton souhaité pour la réponse")] string tone)
    {
        return $@"
        Question : {input}

        Réponds de manière {tone} à cette question.";
    }
}
```

Ajoutez cette compétence au noyau et utilisez-la :

```csharp
var kernel = Kernel.Builder.Build();

var customSkill = kernel.ImportSkill(new CustomPromptSkill(), "CustomPromptSkill");

var result = await kernel.RunAsync(customSkill["AnswerWithTone"], new()
{
    ["input"] = "Qu'est-ce que l'apprentissage supervisé ?",
    ["tone"] = "formelle"
});

Console.WriteLine($"Réponse : {result}");
```

---

### **b) Ajuster les paramètres du modèle**

Vous pouvez personnaliser les réponses en ajustant les paramètres comme `maxTokens`, `temperature` ou `topP`.

```csharp
var inlineFunction = kernel.CreateSemanticFunction(@"
{{$input}}

Fournis une réponse très détaillée à cette question.
", maxTokens: 500, temperature: 0.7, topP: 0.9);

var result = await kernel.RunAsync(inlineFunction, new()
{
    ["input"] = "Quels sont les avantages des modèles de langage comme GPT ?"
});

Console.WriteLine($"Réponse : {result}");
```

---

## **4. Meilleures pratiques pour écrire des invites**

1. **Soyez clair et concis** : Les modèles répondent mieux à des instructions explicites.

   ```text
   Explique les avantages des voitures électriques en 3 points clés.
   ```

2. **Fournissez un contexte** : Ajoutez des informations pour guider le modèle.

   ```text
   Imagine que tu es un expert en énergie durable. Explique comment les voitures électriques réduisent les émissions de CO2.
   ```

3. **Encadrez la réponse** : Donnez des instructions précises sur la structure.

   ```text
   Donne une liste numérotée des étapes nécessaires pour installer un panneau solaire.
   ```

4. **Testez et ajustez** : Essayez différentes variations pour obtenir des résultats optimaux.

---

## **5. Exemples de cas d’utilisation**

### **a) Générer des idées**

Prompt :  

```text
Génère 5 idées innovantes pour améliorer la productivité des équipes de développement logiciel.
```

### **b) Résumer un texte**

Prompt :  

```text
{{$input}}

Résumé : Résume le texte ci-dessus en 3 phrases.
```

### **c) Traduction contextuelle**

Prompt :  

```text
Traduis le texte suivant en français avec un ton formel :
{{$input}}
```

---

En suivant ces étapes, vous pouvez développer des fonctions d’invite puissantes et adaptées à vos besoins spécifiques dans **Semantic Kernel**. Ces fonctions permettent d'exploiter pleinement les capacités des modèles d'IA pour automatiser des tâches complexes et enrichir vos applications.

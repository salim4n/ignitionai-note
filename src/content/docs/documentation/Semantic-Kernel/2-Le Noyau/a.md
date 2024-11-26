---
title : Rôles et architecture du noyau
description : Rôles et architecture du noyau
---


Dans le **Semantic Kernel**, le **noyau** (ou *core*) est la partie centrale du framework qui gère l’interaction entre les différents composants. Il orchestre les modèles d’intelligence artificielle, les compétences et les systèmes de mémoire pour exécuter les tâches demandées. Voici une explication détaillée de ses responsabilités et de son architecture :  

---

### **Rôles principaux du noyau**  

1. **Orchestration des compétences** :  
   Le noyau est chargé de connecter et de coordonner les compétences (ou *skills*), qu’elles soient natives, basées sur des prompts ou hybrides. Il facilite l’exécution des fonctions associées et leur enchaînement.

2. **Gestion des modèles d’IA** :  
   - Interfacer avec les modèles d’IA (comme GPT ou d’autres LLMs).  
   - Préparer les prompts, envoyer les requêtes aux modèles, et interpréter les réponses.  

3. **Mémoire sémantique** :  
   Le noyau fournit un accès à une mémoire intégrée pour stocker et récupérer des informations contextuelles, en utilisant des index vectoriels ou d’autres bases de données pour rechercher des données similaires.  

4. **Planification dynamique** :  
   En fonction d’un objectif donné, le noyau peut planifier dynamiquement une séquence d’actions en combinant les compétences disponibles. Cela permet de résoudre des problèmes complexes sans intervention humaine.  

5. **Connexion aux systèmes externes** :  
   Le noyau agit comme une passerelle pour connecter les modèles d’IA à des services externes (API, bases de données, outils métier, etc.) grâce à des connecteurs.  

---

### **Principaux composants du noyau**  

1. **Kernel Configuration** :  
   - Permet de configurer le noyau avec des paramètres comme l’accès aux modèles (par exemple, OpenAI API key) ou des connecteurs (bases de données, stockage).  

2. **Kernel Skills Manager** :  
   - Gère l’enregistrement et l’utilisation des compétences.  
   - Permet au noyau de savoir quelles compétences sont disponibles et comment les appeler.  

3. **Kernel Memory** :  
   - Fournit une interface pour interagir avec la mémoire sémantique.  
   - Permet de stocker, rechercher et récupérer des informations en utilisant des embeddings (vecteurs générés par l’IA).  

4. **Kernel Planner** :  
   - Génère et exécute des plans dynamiques basés sur des objectifs définis par l’utilisateur.  
   - Combine des compétences et des appels à des modèles pour atteindre ces objectifs.  

5. **Kernel Connectors** :  
   - Facilite l’intégration avec des systèmes tiers, tels que des bases de données, des API REST, ou des services cloud comme Azure.  

6. **Kernel Pipeline** :  
   - Ordonne les appels et exécute les tâches en assurant la cohérence entre les entrées et sorties des différentes fonctions ou compétences.  

---

### **Exemple de fonctionnement du noyau**  

Supposons que vous voulez créer un chatbot qui génère des réponses en utilisant plusieurs sources :  

1. **Entrée utilisateur** :  
   L'utilisateur demande *"Comment configurer un compte Azure ?"*.  

2. **Rôle du noyau** :  
   - Cherche dans la **mémoire sémantique** pour voir si des informations sur "compte Azure" sont déjà disponibles.  
   - Utilise une **compétence basée sur un prompt** pour générer une réponse en appelant un modèle GPT.  
   - Si nécessaire, appelle une **compétence native** qui interroge une API Azure pour des informations spécifiques.  

3. **Sortie** :  
   Le noyau orchestre ces étapes et retourne une réponse claire et contextualisée à l'utilisateur.  

---

### **Code simple pour configurer et utiliser le noyau**  

```csharp
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Memory;

// Configurer le noyau
var kernel = Kernel.Builder
    .Configure(config =>
    {
        config.AddOpenAIChatCompletion("gpt-3.5-turbo", "your-api-key");
        config.AddMemoryStorage(new VolatileMemoryStore());
    })
    .Build();

// Enregistrer une compétence native
var skills = kernel.ImportSkill(new MyNativeSkill(), "NativeSkill");

// Utiliser une fonction du noyau
string userInput = "Explique-moi comment configurer un compte Azure.";
var response = await kernel.RunAsync(userInput, skills["ExplainAzureAccount"]);

// Afficher la réponse
Console.WriteLine(response);
```

---

### **Conclusion**  

Le **noyau** est l'élément central du **Semantic Kernel**. Il coordonne tous les composants, comme les compétences, les modèles d'IA, et la mémoire, pour fournir des solutions intelligentes et adaptées aux besoins des applications modernes.

---
title : Concepts clés du noyau semantic
description : Concepts clés du noyau semantic
---

Les composants clés du **Semantic Kernel** se répartissent en plusieurs catégories, chacun jouant un rôle essentiel pour intégrer l'IA générative dans des applications pratiques. Voici ces composants :  

---

### 1. **Compétences (Skills)**  

Les compétences sont des modules qui encapsulent des capacités spécifiques. Il en existe trois types principaux :  

- **Compétences natives** : Implémentées en C# ou dans un autre langage supporté. Elles exécutent une logique métier ou des appels à des API.  
- **Compétences basées sur des prompts** : Utilisent des modèles d'IA génératifs, comme OpenAI ou Azure OpenAI, en configurant des prompts spécifiques.  
- **Compétences hybrides** : Mélangent des capacités natives et génératives.  

Chaque compétence est exposée via des *fonctions*, qui peuvent être orchestrées dans des workflows.

---

### 2. **Modèles d'IA (AI Models)**  

Le noyau prend en charge des modèles d'intelligence artificielle pour :  

- Génération de texte (GPT, Codex, etc.).  
- Compréhension du langage naturel (NLU).  
- Manipulation d'autres types de modèles d'IA selon les besoins.  

SK agit comme une passerelle pour se connecter à des services comme **Azure OpenAI**, **OpenAI API** ou des modèles locaux.

---

### 3. **Planification (Planners)**  

Les planificateurs permettent d'orchestrer plusieurs fonctions pour résoudre des problèmes complexes.  

- **Planification dynamique** : Génère un plan à partir d'un objectif donné, en utilisant les fonctions disponibles.  
- **Exécution des plans** : Coordonne les appels entre les différentes fonctions (compétences) pour atteindre l’objectif de manière fluide.  

---

### 4. **Mémoire sémantique (Semantic Memory)**  

Ce composant permet de stocker et de récupérer des informations en combinant :  

- Des bases de données traditionnelles (relationnelles ou NoSQL).  
- Des index vectoriels pour rechercher des données basées sur leur similarité sémantique (par exemple, avec des embeddings).  

Cela permet de contextualiser les requêtes et d'améliorer les réponses des modèles.

---

### 5. **Connecteurs (Connectors)**  

Les connecteurs permettent à SK d'interagir avec des systèmes externes comme :  

- **API tierces** (par exemple, intégration avec des CRM, ERP).  
- **Services cloud** comme Azure Functions, Blob Storage, ou des bases de données externes.  
- **Bases de données vectorielles** pour la mémoire sémantique.

---

### 6. **Pipeline d'exécution**  

SK fournit un pipeline pour orchestrer :  

- La préparation des données d'entrée.  
- L'envoi des requêtes aux modèles.  
- La gestion des résultats, qu'ils soient textuels ou logiques.  

---

### 7. **Extensibilité et modularité**  

Chaque composant peut être étendu ou remplacé pour répondre aux besoins spécifiques d’une application. Vous pouvez :  

- Ajouter de nouvelles compétences.  
- Utiliser des modèles d'IA personnalisés.  
- Personnaliser la gestion des données et des workflows.  

---

### 8. **SDKs et intégrations**  

Le Semantic Kernel offre des **SDKs** pour faciliter l'utilisation dans différents environnements, notamment en **C#** et **Python**, et supporte l'intégration avec des outils comme **Azure Cognitive Services**, **Hugging Face**, ou **LangChain**.  

---

En combinant ces composants, SK simplifie la création d’applications intelligentes, robustes et réactives, tout en offrant aux développeurs une flexibilité et une extensibilité maximale.  

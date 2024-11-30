---
title: Reconnaître les bases de l'interface de suivi (Tracking UI) dans MLFlow
description: Reconnaître les bases de l'interface de suivi (Tracking UI) dans MLFlow
---

L'interface de suivi (Tracking UI) de MLFlow est un composant essentiel pour visualiser et analyser les expériences de machine learning. Elle permet aux utilisateurs de suivre, comparer et organiser les différentes exécutions d'entraînement et de test des modèles de manière centralisée.

### 1. **Qu'est-ce que le Tracking UI dans MLFlow ?**

Le **MLFlow Tracking UI** est une interface graphique qui permet de visualiser les expériences de machine learning enregistrées via MLFlow Tracking. Cette interface vous donne une vue d'ensemble des expériences, en affichant les informations telles que les paramètres utilisés, les métriques obtenues, les artefacts enregistrés (fichiers de modèle, graphiques, etc.) et les versions de code.

### 2. **Lancement du Tracking UI**

Pour accéder au **Tracking UI** de MLFlow, vous devez d'abord lancer l'interface à partir de votre terminal ou votre environnement de développement. Utilisez la commande suivante :

```bash
mlflow ui
```

Cela démarre un serveur web local accessible via votre navigateur, généralement à l'adresse `http://localhost:5000`.

### 3. **Exploration de l'interface de suivi**

L'interface est divisée en plusieurs sections, chacune offrant des fonctionnalités spécifiques pour analyser les expériences de machine learning.

#### a) **Vue d'ensemble des exécutions (Experiments Runs)**

La page principale du Tracking UI affiche toutes les **exécutions d'expériences** enregistrées dans un **projet** ou une série d'expériences. Vous verrez une liste d'exécutions, avec des colonnes indiquant :

- **Date de l'exécution**
- **Paramètres** (ex. : taux d'apprentissage, nombre d'itérations)
- **Métriques** (ex. : précision, RMSE)
- **Artefacts** (ex. : modèles enregistrés, fichiers de sortie)
- **Tags** (métadonnées supplémentaires associées aux exécutions)

Chaque ligne représente une exécution distincte, que vous pouvez cliquer pour voir les détails complets.

#### b) **Vue détaillée d'une exécution**

En cliquant sur une exécution spécifique, vous accédez à une page détaillant tous les aspects de cette exécution :

- **Paramètres (Params)** : Les hyperparamètres utilisés lors de l'entraînement, comme le taux d'apprentissage ou la taille des couches.
- **Métriques (Metrics)** : Les résultats quantitatifs de l'expérience, comme la précision, le rappel, la perte, etc.
- **Artefacts (Artifacts)** : Les fichiers enregistrés, y compris les modèles, les graphiques de performances, ou tout autre fichier produit.
- **Source** : La version de code (Git commit) associée à l'exécution, ainsi que le script Python utilisé.

#### c) **Comparaison des exécutions**

Le Tracking UI permet également de **comparer plusieurs exécutions** d'expériences en sélectionnant différentes lignes dans la liste des exécutions. Vous pouvez ainsi comparer les paramètres et les métriques pour voir quelle combinaison a donné les meilleurs résultats.

Exemple de comparaison :

- Vous pouvez comparer différentes valeurs de taux d'apprentissage pour voir comment cela affecte la précision ou l'erreur quadratique moyenne.
- Vous pouvez visualiser des graphiques de comparaison pour mieux comprendre les performances du modèle selon différentes configurations.

#### d) **Téléchargement et visualisation des artefacts**

Dans le cadre du suivi des expériences, MLFlow permet de stocker des fichiers comme les modèles, les graphiques de performance, et d'autres types de fichiers produits par les expériences. Vous pouvez **télécharger** ces artefacts ou les visualiser directement depuis l'interface.

### 4. **Personnalisation de l'interface de suivi**

Vous pouvez ajouter des **tags** et des **notes** aux exécutions pour mieux organiser vos expériences, notamment lorsque vous travaillez sur des projets de longue durée avec de nombreuses variantes de modèles.

```python
import mlflow

# Ajouter des tags
with mlflow.start_run() as run:
    mlflow.set_tag("modèle", "RandomForest")
    mlflow.set_tag("version", "v1.0")
```

### 5. **Conclusion**

L'interface de suivi (Tracking UI) de MLFlow est un outil central pour gérer et visualiser les expériences de machine learning. Elle offre une vue claire et facile d'accès des différentes exécutions d'entraînement et permet de comparer les résultats. En plus de suivre les hyperparamètres et les métriques, elle permet de stocker et de visualiser les artefacts produits par les expériences, ce qui en fait un outil puissant pour le suivi et la gestion des modèles dans un pipeline MLOps.

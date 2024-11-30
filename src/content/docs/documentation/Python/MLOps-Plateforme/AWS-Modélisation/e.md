---
title: Évaluer les modèles de machine learning
description: Évaluer les modèles de machine learning
---

L'évaluation des modèles de machine learning est une étape cruciale pour juger de leur efficacité et de leur adéquation par rapport à un problème donné. Elle permet de mesurer les performances du modèle en fonction de métriques spécifiques et d’identifier les domaines d'amélioration.

---

### 1. **Comprendre l’importance de l’évaluation des modèles**

- **Objectif de l’évaluation** : Assurer que le modèle est suffisamment performant et adapté au problème d'entreprise. Les métriques d'évaluation fournissent une base pour comparer différents modèles et sélectionner celui qui répond le mieux aux critères de performance.
- **Détection des biais** : L'évaluation peut révéler des biais dans les données ou le modèle, permettant ainsi de corriger les déséquilibres avant le déploiement.

### 2. **Méthodes d’évaluation courantes selon le type de problème**

#### a) **Problèmes de classification**

- **Métriques principales** :
  - **Exactitude (Accuracy)** : Proportion de prédictions correctes sur l'ensemble des prédictions.
  - **Précision et rappel (Precision & Recall)** : Mesures complémentaires de la performance. La précision évalue le taux de faux positifs tandis que le rappel mesure la capacité à identifier correctement les exemples positifs.
  - **F1-score** : Moyenne harmonique de la précision et du rappel, souvent utilisée pour les ensembles de données déséquilibrés.
  - **Courbe ROC et AUC (Area Under the Curve)** : L'AUC mesure la capacité du modèle à distinguer entre les classes. Plus l'AUC est proche de 1, meilleur est le modèle pour différencier les classes.

#### b) **Problèmes de régression**

- **Métriques principales** :
  - **Erreur quadratique moyenne (MSE)** : Moyenne des carrés des écarts entre les valeurs réelles et prédites.
  - **Erreur absolue moyenne (MAE)** : Moyenne des valeurs absolues des erreurs de prédiction.
  - **R² (Coefficient de détermination)** : Mesure la proportion de la variance des données expliquée par le modèle.

#### c) **Problèmes de clustering**

- **Métriques principales** :
  - **Indice de Rand ajusté** : Mesure la similarité entre les clusters prévus et attendus.
  - **Score de silhouette** : Évalue la cohésion au sein des clusters et la séparation entre eux.

---

### 3. **Évaluation des modèles avec AWS SageMaker**

AWS SageMaker facilite l’évaluation des modèles en fournissant des fonctionnalités d’évaluation intégrées qui peuvent être exploitées après l’entraînement.

#### a) **Utilisation de SageMaker Processing**

- **Description** : SageMaker Processing permet de réaliser l’évaluation directement sur les données test en appliquant les métriques définies.
- **Exécution** : Vous pouvez créer une étape de traitement pour effectuer des calculs d'évaluation après chaque exécution d’entraînement.

#### b) **Suivi avec SageMaker Model Monitor**

- **Modèle Monitor** : En production, Model Monitor permet de surveiller les dérives de performances du modèle en continu et d’alerter en cas de baisse significative des métriques.

---

### 4. **Exemple pratique de script d’évaluation sur SageMaker**

Pour exécuter une évaluation sur AWS SageMaker, un script de calcul de métriques peut être configuré pour s'exécuter automatiquement après l'entraînement.

1. **Exemple de code pour calculer les métriques de classification**

   ```python
   from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score

   def evaluate_model(y_true, y_pred, y_probs):
       metrics = {
           "accuracy": accuracy_score(y_true, y_pred),
           "precision": precision_score(y_true, y_pred),
           "recall": recall_score(y_true, y_pred),
           "f1_score": f1_score(y_true, y_pred),
           "roc_auc": roc_auc_score(y_true, y_probs)
       }
       return metrics

   # Exemple d'utilisation
   y_true = [0, 1, 0, 1]
   y_pred = [0, 1, 0, 0]
   y_probs = [0.3, 0.7, 0.4, 0.2]
   results = evaluate_model(y_true, y_pred, y_probs)
   print(results)
   ```

2. **Intégration avec SageMaker Processing Job**

   Ce script peut être intégré dans un SageMaker Processing Job pour évaluer automatiquement chaque modèle après l’entraînement et stocker les résultats dans un bucket S3.

---

### 5. **Utilisation d’AWS SageMaker Experiments pour le suivi des résultats**

AWS SageMaker Experiments vous permet de suivre et de comparer les métriques de plusieurs modèles en parallèle. Chaque essai ou entraînement est stocké dans Experiments avec ses métriques associées, permettant une vue d'ensemble claire des performances des modèles.

---

### Conclusion

L'évaluation de modèles est indispensable pour garantir leur fiabilité et pertinence. Que ce soit par des métriques standards de classification, de régression ou de clustering, ou par des fonctionnalités d’AWS SageMaker, la sélection de la bonne méthode d’évaluation et son application rigoureuse permettent de s'assurer que le modèle choisi répond aux besoins du problème tout en étant prêt pour la production.

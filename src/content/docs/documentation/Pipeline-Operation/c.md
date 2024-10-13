---
title: Créer des fonctions pour le workflow MLOps
description: Créer des fonctions pour le workflow MLOps
---

Dans cet objectif d'apprentissage, nous allons explorer comment construire des solutions MLOps (Machine Learning Operations) en Python en utilisant des fonctions. Nous allons aborder la création de fonctions pour effectuer des tâches courantes dans le cadre d'un workflow MLOps, notamment le prétraitement des données, l'entraînement de modèles, l'évaluation et le déploiement.

### 1. **Introduction aux solutions MLOps en Python**

MLOps est un ensemble de pratiques qui visent à automatiser et à améliorer la gestion des modèles de machine learning dans un environnement de production. L'utilisation de fonctions Python permet d'organiser le code, de le rendre réutilisable et d'améliorer sa lisibilité.

### 2. **Création de fonctions pour le workflow MLOps**

### a) **Chargement et prétraitement des données**

Nous allons commencer par définir une fonction pour charger et prétraiter des données. Supposons que nous travaillons avec un jeu de données CSV.

```python
import pandas as pd

def charger_donnees(fichier):
    """Charge les données à partir d'un fichier CSV et effectue un prétraitement de base."""
    # Charger le fichier CSV
    donnees = pd.read_csv(fichier)

    # Supprimer les colonnes manquantes
    donnees = donnees.dropna()

    # Retourner les données prétraitées
    return donnees

# Exemple d'utilisation
donnees = charger_donnees('donnees.csv')
print(donnees.head())

```

### b) **Fonction d'entraînement du modèle**

Après avoir chargé et prétraité les données, nous pouvons définir une fonction pour entraîner un modèle de machine learning. Utilisons **scikit-learn** pour cet exemple.

```python
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

def entrainer_modele(donnees, cible_colonne):
    """Entraîne un modèle de classification sur les données fournies."""
    # Séparer les caractéristiques et la cible
    X = donnees.drop(columns=[cible_colonne])
    y = donnees[cible_colonne]

    # Diviser les données en ensembles d'entraînement et de test
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Créer et entraîner le modèle
    modele = RandomForestClassifier()
    modele.fit(X_train, y_train)

    # Prédire sur l'ensemble de test
    y_pred = modele.predict(X_test)

    # Évaluer le modèle
    accuracy = accuracy_score(y_test, y_pred)
    return modele, accuracy

# Exemple d'utilisation
modele, precision = entrainer_modele(donnees, 'target_column')
print(f"Précision du modèle : {precision:.2f}")

```

### c) **Fonction d'évaluation du modèle**

Il est important de définir une fonction pour évaluer les performances du modèle sur des métriques pertinentes.

```python
from sklearn.metrics import classification_report

def evaluer_modele(modele, X_test, y_test):
    """Évalue le modèle et affiche le rapport de classification."""
    y_pred = modele.predict(X_test)
    rapport = classification_report(y_test, y_pred)
    return rapport

# Exemple d'utilisation
X_test, y_test = donnees.drop(columns=['target_column']), donnees['target_column']
rapport = evaluer_modele(modele, X_test, y_test)
print(rapport)

```

### 3. **Gestion du déploiement du modèle**

### a) **Fonction pour sauvegarder le modèle**

Nous allons maintenant créer une fonction qui permet de sauvegarder le modèle entraîné pour un déploiement ultérieur. Nous utiliserons **joblib** pour cela.

```python
import joblib

def sauvegarder_modele(modele, chemin):
    """Sauvegarde le modèle entraîné à l'emplacement spécifié."""
    joblib.dump(modele, chemin)

# Exemple d'utilisation
sauvegarder_modele(modele, 'modele_random_forest.joblib')

```

### b) **Fonction pour charger le modèle**

De même, il est utile d'avoir une fonction pour charger le modèle lorsque vous en avez besoin pour des prédictions.

```python
def charger_modele(chemin):
    """Charge un modèle préalablement sauvegardé."""
    return joblib.load(chemin)

# Exemple d'utilisation
modele_charge = charger_modele('modele_random_forest.joblib')

```

### 4. **Automatisation avec des scripts**

Pour automatiser le processus MLOps, vous pouvez créer un script Python principal qui appelle toutes ces fonctions de manière séquentielle.

```python
def main():
    # Charger les données
    donnees = charger_donnees('donnees.csv')

    # Entraîner le modèle
    modele, precision = entrainer_modele(donnees, 'target_column')
    print(f"Précision du modèle : {precision:.2f}")

    # Évaluer le modèle
    X_test, y_test = donnees.drop(columns=['target_column']), donnees['target_column']
    rapport = evaluer_modele(modele, X_test, y_test)
    print(rapport)

    # Sauvegarder le modèle
    sauvegarder_modele(modele, 'modele_random_forest.joblib')

if __name__ == "__main__":
    main()

```

### 5. **Conclusion**

Dans cet objectif d'apprentissage, nous avons construit des solutions MLOps en Python basées sur des fonctions. Nous avons vu comment créer des fonctions pour charger et prétraiter des données, entraîner un modèle, évaluer ses performances et gérer le déploiement. En structurant votre code de cette manière, vous pouvez créer des workflows MLOps modulaires et réutilisables qui facilitent la maintenance et l'évolutivité de vos projets de machine learning. Dans les étapes suivantes, vous pouvez explorer l'intégration de ces solutions avec des outils MLOps plus avancés, comme **MLflow**, **Kubeflow**, ou des services cloud comme **AWS SageMaker** ou **Google Vertex AI**.

---
title: Créer un projet MLFlow pour des exécutions répétables
description: Créer un projet MLFlow pour des exécutions répétables
---

Un **projet MLFlow** est une manière standardisée de structurer et d'exécuter des expériences de machine learning pour garantir la reproductibilité. En définissant un projet avec MLFlow, vous pouvez facilement partager votre code avec d'autres personnes et vous assurer que vos expériences peuvent être reproduites à l'identique, même après plusieurs mois. Cela est particulièrement important dans les pipelines MLOps pour automatiser et standardiser les flux de travail.

### 1. **Qu'est-ce qu'un projet MLFlow ?**

Un projet MLFlow est essentiellement une unité de code reproductible qui contient :

- **Un environnement** : Le projet spécifie l'environnement nécessaire pour exécuter le code (dépendances comme les bibliothèques Python).
- **Un point d'entrée** : Il définit les commandes ou scripts à exécuter.
- **Un format standard** : MLFlow utilise un fichier `MLproject` pour définir les détails de l'exécution du projet.

### 2. **Créer un projet MLFlow**

#### a) **Structurer le projet**

La première étape consiste à structurer votre répertoire de projet. Voici une structure de base :

```
my_mlflow_project/
│
├── MLproject          # Fichier de configuration du projet
├── conda.yaml         # Spécifie l'environnement conda avec les dépendances (ou requirements.txt pour pip)
├── train.py           # Script principal pour entraîner le modèle
└── data/              # Données nécessaires à l'entraînement
```

#### b) **Créer le fichier `MLproject`**

Le fichier `MLproject` décrit le projet MLFlow et spécifie comment il doit être exécuté. Voici un exemple de fichier `MLproject` :

```yaml
name: MyMLProject

conda_env: conda.yaml # Définit l'environnement Conda pour le projet

entry_points:
  main:
    parameters:
      learning_rate: { type: float, default: 0.01 }
      num_epochs: { type: int, default: 10 }
    command: "python train.py --learning_rate {learning_rate} --num_epochs {num_epochs}"
```

- **name** : Nom du projet.
- **conda_env** : Définit l'environnement Conda (vous pouvez aussi utiliser `pip` avec `requirements.txt`).
- **entry_points** : Spécifie le point d'entrée du projet. Ici, le script principal est `train.py` avec des paramètres comme `learning_rate` et `num_epochs`.

#### c) **Créer un environnement Conda**

Le fichier `conda.yaml` contient les dépendances nécessaires pour exécuter le projet dans un environnement Conda. Voici un exemple :

```yaml
name: my_mlflow_env
channels:
  - defaults
dependencies:
  - python=3.8
  - scikit-learn
  - pandas
  - pip
  - pip:
      - mlflow
```

#### d) **Écrire le script d'entraînement (`train.py`)**

Voici un exemple simple de script Python qui utilise les paramètres définis dans le fichier `MLproject` :

```python
import mlflow
import argparse
from sklearn.ensemble import RandomForestClassifier
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

def train_model(learning_rate, num_epochs):
    # Charger les données
    data = load_iris()
    X_train, X_test, y_train, y_test = train_test_split(data.data, data.target)

    # Entraîner un modèle simple
    clf = RandomForestClassifier(n_estimators=int(learning_rate * 100), max_depth=num_epochs)
    clf.fit(X_train, y_train)

    # Prédictions et évaluation
    y_pred = clf.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)

    # Enregistrer les métriques avec MLFlow
    mlflow.log_param("learning_rate", learning_rate)
    mlflow.log_param("num_epochs", num_epochs)
    mlflow.log_metric("accuracy", accuracy)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--learning_rate", type=float, default=0.01)
    parser.add_argument("--num_epochs", type=int, default=10)
    args = parser.parse_args()

    # Démarrer une exécution MLFlow
    with mlflow.start_run():
        train_model(args.learning_rate, args.num_epochs)
```

### 3. **Exécuter le projet MLFlow**

Après avoir configuré le projet et créé le script d'entraînement, vous pouvez exécuter le projet avec MLFlow à l'aide de la commande suivante :

```bash
mlflow run my_mlflow_project -P learning_rate=0.05 -P num_epochs=20
```

Ici, vous exécutez le projet en spécifiant les paramètres `learning_rate` et `num_epochs`.

### 4. **Gérer les versions du projet**

Le projet MLFlow peut être versionné dans un dépôt Git, et MLFlow peut exécuter une version spécifique du projet. Pour ce faire, vous pouvez exécuter un projet à partir d'un dépôt Git en spécifiant le commit ou la branche :

```bash
mlflow run https://github.com/mon-utilisateur/mon-repo-mlflow -P learning_rate=0.1
```

Cela garantit que vous exécutez une version précise du code, ce qui est essentiel pour la reproductibilité.

### 5. **Conclusion**

La création d'un projet MLFlow permet de structurer vos expériences de machine learning de manière reproductible. En utilisant un fichier `MLproject` et un environnement standardisé, vous pouvez exécuter vos expériences de manière cohérente et partager facilement votre code avec d'autres membres de l'équipe. Cela est essentiel dans un contexte MLOps, où l'automatisation, la traçabilité et la reproductibilité sont des priorités clés.

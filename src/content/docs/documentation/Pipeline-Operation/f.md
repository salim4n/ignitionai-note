---
title: Tutoriel Python Fire pour MLOps CLI
description: Tutoriel Python Fire pour MLOps CLI
---

## Introduction

Python Fire est une bibliothèque qui permet de créer automatiquement des interfaces en ligne de commande (CLI) à partir de n'importe quel objet Python. Dans ce tutoriel, nous allons voir comment utiliser Python Fire pour créer une CLI pour un projet MLOps.

## Installation de Python Fire

Pour commencer, installez Python Fire avec pip :

```bash
pip install fire

```

## Concepts de base de Python Fire

Python Fire convertit automatiquement les fonctions et les classes Python en commandes CLI. Voici un exemple simple :

```python
import fire

def hello(name="World"):
    return f"Hello {name}!"

if __name__ == '__main__':
    fire.Fire(hello)

```

Vous pouvez maintenant exécuter ce script comme ceci :

```bash
python script.py  # Affiche "Hello World!"
python script.py --name=Alice  # Affiche "Hello Alice!"

```

## Création d'une CLI MLOps avec Python Fire

Maintenant, créons une CLI plus complète pour un projet MLOps. Voici un exemple de script `mlops_cli.py` :

```python
import fire
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import joblib

class MLOpsCLI:
    def load_data(self, file_path):
        """Charger les données depuis un fichier CSV."""
        return pd.read_csv(file_path)

    def preprocess(self, data, target_column):
        """Prétraiter les données."""
        X = data.drop(target_column, axis=1)
        y = data[target_column]
        return train_test_split(X, y, test_size=0.2, random_state=42)

    def train(self, X_train, y_train, n_estimators=100):
        """Entraîner un modèle Random Forest."""
        model = RandomForestClassifier(n_estimators=n_estimators, random_state=42)
        model.fit(X_train, y_train)
        return model

    def evaluate(self, model, X_test, y_test):
        """Évaluer le modèle."""
        y_pred = model.predict(X_test)
        return accuracy_score(y_test, y_pred)

    def save_model(self, model, file_path):
        """Sauvegarder le modèle."""
        joblib.dump(model, file_path)

    def run_pipeline(self, data_file, target_column, model_file):
        """Exécuter le pipeline complet."""
        data = self.load_data(data_file)
        X_train, X_test, y_train, y_test = self.preprocess(data, target_column)
        model = self.train(X_train, y_train)
        accuracy = self.evaluate(model, X_test, y_test)
        self.save_model(model, model_file)
        return f"Pipeline completed. Model accuracy: {accuracy:.2f}"

if __name__ == '__main__':
    fire.Fire(MLOpsCI)

```

Vous pouvez maintenant utiliser cette CLI comme suit :

```bash
python mlops_cli.py load_data --file_path=data.csv
python mlops_cli.py run_pipeline --data_file=data.csv --target_column=target --model_file=model.joblib

```

## Exemples avancés

### Gestion des sous-commandes

Vous pouvez créer des sous-commandes en utilisant des classes imbriquées :

```python
class DataOps:
    def load(self, file_path):
        # ...

    def preprocess(self, data_file, output_file):
        # ...

class ModelOps:
    def train(self, data_file, model_file):
        # ...

    def evaluate(self, model_file, test_file):
        # ...

class MLOpsCI:
    def __init__(self):
        self.data = DataOps()
        self.model = ModelOps()

if __name__ == '__main__':
    fire.Fire(MLOpsCI)

```

Utilisation :

```bash
python mlops_cli.py data load --file_path=data.csv
python mlops_cli.py model train --data_file=processed_data.csv --model_file=model.joblib

```

### Ajout de documentation

Python Fire utilise les docstrings pour générer l'aide de la CLI :

```python
class MLOpsCI:
    """CLI pour les opérations MLOps."""

    def train(self, data_file, model_file):
        """
        Entraîne un modèle sur les données fournies.

        Args:
            data_file (str): Chemin vers le fichier de données d'entraînement.
            model_file (str): Chemin où sauvegarder le modèle entraîné.
        """
        # ...

```

## Bonnes pratiques

1. Utilisez des docstrings pour documenter vos fonctions et classes.
2. Organisez votre code en classes et méthodes logiques.
3. Utilisez des types d'annotations pour améliorer la clarté du code.
4. Gérez les erreurs et fournissez des messages d'erreur utiles.
5. Utilisez des valeurs par défaut sensées pour les paramètres optionnels.

## Intégration avec d'autres outils MLOps

Vous pouvez facilement intégrer votre CLI Fire avec d'autres outils MLOps :

```python
import mlflow

class MLOpsCI:
    def train_with_mlflow(self, data_file, model_file):
        with mlflow.start_run():
            # Logique d'entraînement ici
            mlflow.log_param("data_file", data_file)
            mlflow.log_artifact(model_file)

```

## Conclusion

Python Fire est un outil puissant pour créer rapidement des CLIs pour vos projets MLOps. Il permet de transformer facilement vos scripts et fonctions existants en commandes CLI, ce qui facilite l'automatisation et l'intégration de vos workflows MLOps.

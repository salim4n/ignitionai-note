---
title: Créer des outils CLI
description: CLI - Python
---

La création d'outils en ligne de commande (CLI) peut être une manière puissante et flexible d'automatiser et de faciliter des workflows dans le développement de **Machine Learning** (ML), en particulier pour les scénarios **MLOps**. Les **CLI tools** peuvent être utilisés pour entraîner des modèles, évaluer leurs performances, déployer des modèles, ou encore orchestrer des pipelines ML.

Voici comment vous pouvez créer des outils CLI en Python pour résoudre des problèmes de ML :

---

### 1. **Pourquoi les outils CLI sont utiles en Machine Learning**

- **Automatisation** : Ils permettent d’automatiser les processus d’entraînement, de déploiement et d’inférence sans nécessiter une interface graphique.
- **Flexibilité** : Les utilisateurs peuvent exécuter des scripts de ML avec différentes options et paramètres sans modifier le code.
- **MLOps** : Les CLIs sont essentiels pour les pipelines CI/CD et l'orchestration des tâches ML dans des environnements cloud ou des clusters distribués.

### 2. **Bibliothèques pour créer des outils CLI en Python**

Voici quelques bibliothèques Python populaires pour la création de CLIs :

- **argparse** (module standard Python) : Simple et intégré dans Python.
- **click** : Plus flexible, avec une syntaxe simplifiée.
- **typer** : Construit sur `click`, mais avec un support pour les types et des annotations plus modernes.

### 3. **Créer un outil CLI simple avec `argparse`**

Supposons que vous souhaitez créer un outil CLI pour entraîner un modèle ML, où l'utilisateur peut spécifier les hyperparamètres comme l'algorithme, le taux d'apprentissage, et le nombre d'epochs.

**Étape 1** : Créer un script Python pour entraîner un modèle avec **`argparse`**.

```python
import argparse
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

def train_model(algorithm, n_estimators, learning_rate, epochs):
    # Charger le dataset
    data = load_iris()
    X_train, X_test, y_train, y_test = train_test_split(data.data, data.target, test_size=0.2)

    # Entraîner un modèle basé sur l'algorithme spécifié
    if algorithm == 'random_forest':
        model = RandomForestClassifier(n_estimators=n_estimators)
    else:
        raise ValueError(f"Algorithme non supporté : {algorithm}")

    model.fit(X_train, y_train)

    # Évaluer les performances
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f'Précision du modèle : {accuracy}')

def main():
    # Initialiser argparse pour gérer les options en ligne de commande
    parser = argparse.ArgumentParser(description='Entraîner un modèle ML')

    parser.add_argument('--algorithm', type=str, default='random_forest', help="Algorithme d'entraînement (random_forest)")
    parser.add_argument('--n_estimators', type=int, default=100, help="Nombre d'estimators (Random Forest)")
    parser.add_argument('--learning_rate', type=float, default=0.01, help="Taux d'apprentissage (non utilisé ici)")
    parser.add_argument('--epochs', type=int, default=10, help="Nombre d'epochs d'entraînement (non utilisé ici)")

    args = parser.parse_args()

    # Appeler la fonction d'entraînement avec les paramètres fournis
    train_model(args.algorithm, args.n_estimators, args.learning_rate, args.epochs)

if __name__ == '__main__':
    main()

```

**Exécution en ligne de commande** :

```bash
python cli_train.py --algorithm random_forest --n_estimators 200 --epochs 20

```

Cela permet d’entraîner un modèle en spécifiant les paramètres directement en ligne de commande.

### 4. **Utilisation de `click` pour une CLI plus avancée**

**`click`** est une bibliothèque plus puissante et plus facile à utiliser que `argparse` pour créer des CLIs complexes.

**Étape 2** : Créer une CLI plus robuste avec **`click`**.

```python
import click
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

@click.command()
@click.option('--algorithm', default='random_forest', help="Algorithme d'entraînement (random_forest)")
@click.option('--n_estimators', default=100, help="Nombre d'estimators pour Random Forest")
@click.option('--learning_rate', default=0.01, help="Taux d'apprentissage (non utilisé ici)")
@click.option('--epochs', default=10, help="Nombre d'epochs d'entraînement (non utilisé ici)")
def train_model(algorithm, n_estimators, learning_rate, epochs):
    """Entraîner un modèle avec les options spécifiées en ligne de commande."""

    # Charger le dataset
    data = load_iris()
    X_train, X_test, y_train, y_test = train_test_split(data.data, data.target, test_size=0.2)

    # Entraîner un modèle basé sur l'algorithme spécifié
    if algorithm == 'random_forest':
        model = RandomForestClassifier(n_estimators=n_estimators)
    else:
        raise ValueError(f"Algorithme non supporté : {algorithm}")

    model.fit(X_train, y_train)

    # Évaluer les performances
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    click.echo(f'Précision du modèle : {accuracy}')

if __name__ == '__main__':
    train_model()

```

**Exécution** :

```bash
python cli_train.py --algorithm random_forest --n_estimators 150

```

Le module **`click`** fournit une interface plus élégante pour les CLIs avec des options de validation et des messages d'erreur clairs.

### 5. **Automatisation MLOps avec CLI**

Un outil CLI peut également être intégré dans un pipeline **CI/CD** pour automatiser des tâches de **MLOps**. Par exemple :

- **Intégration dans GitHub Actions** : Vous pouvez créer un workflow qui entraîne automatiquement un modèle chaque fois que de nouvelles données sont poussées dans le dépôt.
- **Pipeline CI/CD dans Jenkins** : Le script CLI peut être intégré dans Jenkins pour exécuter des tâches ML, comme l'évaluation et le déploiement de modèles.

---

### 6. **CLI pour le déploiement de modèles (Flask ou FastAPI)**

Vous pouvez également utiliser des outils CLI pour **déployer un modèle ML** sous forme de service d'API en utilisant des frameworks comme **Flask** ou **FastAPI**.

### Exemple avec FastAPI

```python
import click
from fastapi import FastAPI
from pydantic import BaseModel
from sklearn.datasets import load_iris
from sklearn.ensemble import RandomForestClassifier

# Créer une API avec FastAPI
app = FastAPI()

# Entraîner un modèle simple
data = load_iris()
model = RandomForestClassifier(n_estimators=100)
model.fit(data.data, data.target)

# Classe pour la structure des données en entrée
class InputData(BaseModel):
    features: list

# Endpoint pour faire des prédictions
@app.post('/predict')
def predict(input_data: InputData):
    prediction = model.predict([input_data.features])
    return {"prediction": int(prediction[0])}

@click.command()
@click.option('--host', default='127.0.0.1', help="Adresse de l'hôte")
@click.option('--port', default=8000, help="Port pour le déploiement")
def deploy_model(host, port):
    """Déployer un modèle ML sous forme d'API FastAPI."""
    import uvicorn
    uvicorn.run(app, host=host, port=port)

if __name__ == '__main__':
    deploy_model()

```

**Exécution** :

```bash
python cli_deploy.py --host 0.0.0.0 --port 8000

```

Cette CLI déploie un modèle via **FastAPI** en exposant un endpoint `/predict` pour faire des inférences.

### 7. **Avantages des outils CLI pour MLOps**

- **Automatisation des workflows** : Les outils CLI peuvent être utilisés dans des environnements cloud ou CI/CD pour automatiser des tâches comme l'entraînement, l'évaluation et le déploiement de modèles.
- **Flexibilité et reproductibilité** : Ils permettent aux ingénieurs de reproduire des workflows complexes avec des commandes simples.
- **Intégration dans des environnements cloud** : Les CLIs peuvent être utilisés avec des services comme **Azure ML**, **AWS Sagemaker**, ou **Google Cloud AI** pour interagir avec des modèles et des pipelines ML.

---

### Conclusion

Créer des outils en ligne de commande pour résoudre des problèmes de machine learning permet de rendre les workflows ML plus reproductibles et automatisés. Avec des bibliothèques comme **`argparse`**, **`click`**, et **`typer`**, il est facile de construire des interfaces puissantes pour la gestion des processus ML. Ces CLIs sont particulièrement utiles dans un contexte **MLOps**, où l'automatisation et l'intégration dans des pipelines CI/CD sont primordiales pour maintenir des

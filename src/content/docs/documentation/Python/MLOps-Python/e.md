---
title: CLI - Automatisation de workflows
description: CLI - Python
---

L'objectif **"Learn how CLI automation helps MLOps"** consiste à comprendre comment l'automatisation via des outils en ligne de commande (CLI - Command Line Interface) peut optimiser et accélérer les workflows en MLOps. Dans les pipelines MLOps, la gestion des modèles, le prétraitement des données, l'entraînement et le déploiement nécessitent souvent des tâches répétitives. L'automatisation de ces tâches via la CLI permet de les exécuter de manière fiable, reproductible et à grande échelle.

### 1. **Pourquoi l'automatisation en CLI est importante pour MLOps ?**

L’automatisation via CLI est essentielle en **MLOps** pour plusieurs raisons :

- **Réduction des erreurs humaines** : Automatiser des tâches complexes ou répétitives réduit le risque d'erreurs manuelles.
- **Reproductibilité** : L'automatisation garantit que les mêmes étapes sont suivies à chaque exécution, ce qui est crucial pour obtenir des résultats cohérents.
- **Accélération du cycle de développement** : Les scripts CLI permettent de lancer des entraînements de modèles, des tests, des validations, et des déploiements plus rapidement.
- **Intégration dans les pipelines CI/CD** : Les scripts CLI peuvent facilement être intégrés dans les pipelines de **Continuous Integration** (CI) et **Continuous Deployment** (CD), automatisant tout le processus de mise à jour, de test et de déploiement des modèles.

En résumé, l'automatisation par CLI améliore la productivité, permet une gestion efficace des ressources et permet un déploiement plus rapide et plus fiable des modèles en production.

---

### 2. **Exemples d'utilisation de CLI pour automatiser des tâches en MLOps**

Voici des exemples de tâches couramment automatisées en MLOps via la ligne de commande :

### a) **Automatisation de l'entraînement des modèles**

Un cas d'usage typique en MLOps consiste à lancer l'entraînement d'un modèle avec différents hyperparamètres ou sur différents jeux de données. Utiliser des scripts CLI permet de gérer ces différentes exécutions sans avoir à lancer manuellement les entraînements à chaque fois.

Exemple : Créer un script Python pour entraîner un modèle ML à partir de la ligne de commande :

```python
# train_model.py
import argparse
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import pickle

def train_model(output_path, n_estimators, max_depth):
    # Charger un dataset
    data = load_iris()
    X_train, X_test, y_train, y_test = train_test_split(data.data, data.target, test_size=0.2)

    # Entraîner le modèle
    model = RandomForestClassifier(n_estimators=n_estimators, max_depth=max_depth)
    model.fit(X_train, y_train)

    # Sauvegarder le modèle
    with open(output_path, 'wb') as f:
        pickle.dump(model, f)

    print(f"Modèle entraîné avec {n_estimators} arbres, profondeur max {max_depth}. Sauvegardé dans {output_path}.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Entraîner un modèle RandomForest')
    parser.add_argument('--output', type=str, required=True, help='Chemin pour sauvegarder le modèle')
    parser.add_argument('--n_estimators', type=int, default=100, help='Nombre d\\'arbres dans la forêt')
    parser.add_argument('--max_depth', type=int, default=None, help='Profondeur maximale des arbres')

    args = parser.parse_args()
    train_model(args.output, args.n_estimators, args.max_depth)

```

Lancer ce script depuis la ligne de commande permet d'ajuster les hyperparamètres sans modifier le code source :

```bash
python train_model.py --output model.pkl --n_estimators 150 --max_depth 10

```

### b) **Automatisation du prétraitement des données**

Le prétraitement des données est souvent une étape répétitive. Un script CLI permet d'automatiser cette étape pour garantir une cohérence dans la transformation des données avant l'entraînement.

Exemple : Script CLI pour normaliser et transformer les données avant l'entraînement :

```python
# preprocess_data.py
import argparse
import pandas as pd
from sklearn.preprocessing import StandardScaler

def preprocess(input_csv, output_csv):
    # Charger les données
    df = pd.read_csv(input_csv)

    # Appliquer une transformation (normalisation ici)
    scaler = StandardScaler()
    df[df.columns] = scaler.fit_transform(df[df.columns])

    # Sauvegarder les données transformées
    df.to_csv(output_csv, index=False)
    print(f"Données prétraitées et sauvegardées dans {output_csv}.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Prétraiter les données pour un modèle ML')
    parser.add_argument('--input_csv', type=str, required=True, help='Chemin du fichier CSV d\\'entrée')
    parser.add_argument('--output_csv', type=str, required=True, help='Chemin du fichier CSV de sortie')

    args = parser.parse_args()
    preprocess(args.input_csv, args.output_csv)

```

Lancer le script pour prétraiter les données :

```bash
python preprocess_data.py --input_csv raw_data.csv --output_csv processed_data.csv

```

### c) **Automatisation du déploiement des modèles**

Les modèles doivent être déployés sur des environnements de production pour être utilisés via des APIs ou dans des applications. Automatiser le déploiement via CLI permet de le rendre plus rapide et plus sûr.

Exemple : Déployer un modèle via un service cloud (exemple avec **AWS Sagemaker**) :

```python
# deploy_model.py
import argparse
import boto3
import sagemaker

def deploy_model(model_data, instance_type):
    session = sagemaker.Session()

    # Déploiement du modèle
    model = sagemaker.model.Model(
        model_data=model_data,
        role='IAM_ROLE',
        sagemaker_session=session
    )

    # Lancer le déploiement sur un endpoint
    predictor = model.deploy(initial_instance_count=1, instance_type=instance_type)
    print(f"Modèle déployé sur une instance {instance_type}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Déployer un modèle sur AWS Sagemaker')
    parser.add_argument('--model_data', type=str, required=True, help='Chemin du modèle dans S3')
    parser.add_argument('--instance_type', type=str, default='ml.m5.large', help='Type d\\'instance')

    args = parser.parse_args()
    deploy_model(args.model_data, args.instance_type)

```

Lancer ce script pour déployer le modèle sur une instance GPU dans AWS :

```bash
python deploy_model.py --model_data s3://path-to-model/model.tar.gz --instance_type ml.p2.xlarge

```

---

### 3. **Automatiser les tâches répétitives avec `make`**

Un outil puissant pour automatiser les tâches via CLI est **`make`**. Il est souvent utilisé pour orchestrer les étapes complexes, en définissant des règles simples pour exécuter des scripts et gérer les dépendances.

### Exemple de **Makefile** pour orchestrer plusieurs étapes en MLOps :

```makefile
# Makefile pour orchestrer les étapes du pipeline MLOps

# Prétraitement des données
preprocess:
    python preprocess_data.py --input_csv raw_data.csv --output_csv processed_data.csv

# Entraînement du modèle
train: preprocess
    python train_model.py --output model.pkl --n_estimators 150 --max_depth 10

# Déploiement du modèle
deploy: train
    python deploy_model.py --model_data s3://path-to-model/model.tar.gz --instance_type ml.m5.large

# Exécuter tout le pipeline
all: preprocess train deploy

```

Pour exécuter tout le pipeline :

```bash
make all

```

---

### 4. **Intégration avec les pipelines CI/CD**

Les scripts CLI peuvent facilement être intégrés dans des pipelines CI/CD comme **GitLab CI**, **Jenkins**, **GitHub Actions**, ou **CircleCI**. Cela permet d'automatiser tout le cycle de vie d'un modèle, de l'entraînement jusqu'au déploiement, à chaque mise à jour du code.

Exemple de pipeline CI/CD avec **GitLab CI** pour un workflow de MLOps :

```yaml
stages:
  - preprocess
  - train
  - deploy

preprocess_job:
  stage: preprocess
  script:
    - python preprocess_data.py --input_csv raw_data.csv --output_csv processed_data.csv
  artifacts:
    paths:
      - processed_data.csv

train_job:
  stage: train
  script:
    - python train_model.py --output model.pkl --n_estimators 150 --max_depth 10
  artifacts:
    paths:
      - model.pkl

deploy_job:
  stage: deploy
  script:
    - python deploy_model.py --model_data s3://path-to-model/model.pkl --instance_type ml.m5.large
```

Cela exécute automatiquement les étapes de prétraitement, d'entraînement et de déploiement dans un environnement contrôlé dès qu'il y a une mise à jour du code ou des données.

---

### 5. **Outils pour gérer des workflows plus complexes : Airflow, Luigi, ou DVC**

Pour des tâches plus complexes, où l'orchestration de plusieurs tâches interconnectées est nécessaire, des outils comme

**Airflow**, **Luigi**, ou **DVC** (Data Version Control) peuvent être utilisés pour créer des pipelines plus avancés.

- **Airflow** est utilisé pour planifier et surveiller les tâches MLOps à l'aide de DAGs (Directed Acyclic Graphs).
- **DVC** est utile pour gérer les versions des données et des modèles dans des pipelines CI/CD automatisés.

---

### Conclusion

**L'automatisation via CLI** est une composante essentielle en MLOps. Elle permet d'automatiser les tâches récurrentes, de garantir la reproductibilité des résultats et de s'intégrer parfaitement dans les pipelines CI/CD pour accélérer les workflows. Utiliser des outils comme `make`, GitLab CI, ou des scripts en Python rend le cycle de vie du modèle plus fluide et adaptable, permettant aux équipes ML de se concentrer sur l'amélioration continue des modèles plutôt que sur les tâches répétitives.

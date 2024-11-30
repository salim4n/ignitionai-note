---
title: Utiliser un registre avec un modèle et interagir avec celui-ci
description: Utiliser un registre avec un modèle et interagir avec celui-ci
---

Un **registre de modèles** est un composant clé dans MLOps, car il permet de gérer le cycle de vie des modèles de machine learning : de la création à l'entraînement, en passant par la validation, la mise en production, et les mises à jour. MLFlow propose un registre de modèles qui permet de stocker, versionner, annoter, approuver et déployer des modèles.

### 1. **Qu'est-ce qu'un registre de modèles ?**

Un registre de modèles est un dépôt centralisé où les modèles sont enregistrés après l'entraînement. Il vous permet de :

- Versionner les modèles.
- Suivre les métadonnées liées aux modèles (comme les métriques).
- Faciliter les tests et la mise en production.
- Gérer le déploiement des modèles.
- Mettre à jour ou rétrograder des modèles selon les versions.

Dans MLFlow, chaque modèle enregistré est organisé en différentes versions, et ces versions peuvent être associées à différents états tels que **"Staging"** (en test) ou **"Production"** (en service).

### 2. **Enregistrer un modèle dans le registre de modèles MLFlow**

Une fois que vous avez formé un modèle et que vous voulez l'enregistrer dans le registre, vous devez d'abord utiliser l'API MLFlow pour le stocker.

#### Exemple :

1. **Entraînez votre modèle** et enregistrez-le avec MLFlow.

```python
import mlflow
import mlflow.sklearn
from sklearn.ensemble import RandomForestClassifier
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split

# Charger les données
data = load_iris()
X_train, X_test, y_train, y_test = train_test_split(data.data, data.target)

# Entraîner un modèle RandomForest
clf = RandomForestClassifier()
clf.fit(X_train, y_train)

# Démarrer une exécution MLFlow
with mlflow.start_run() as run:
    mlflow.sklearn.log_model(clf, "model")  # Enregistrer le modèle localement avec MLFlow
    mlflow.log_param("model_type", "RandomForest")  # Enregistrer un paramètre
    mlflow.log_metric("accuracy", clf.score(X_test, y_test))  # Enregistrer une métrique

    # Enregistrer le modèle dans le registre
    model_uri = f"runs:/{run.info.run_id}/model"
    mlflow.register_model(model_uri, "IrisClassifierModel")
```

Ici, le modèle est enregistré dans le registre sous le nom **"IrisClassifierModel"**.

2. **Vérifier les versions du modèle** :

À chaque enregistrement, une nouvelle version du modèle est créée dans le registre, et vous pouvez suivre ces versions.

```python
from mlflow.tracking import MlflowClient

client = MlflowClient()
model_versions = client.search_model_versions("name='IrisClassifierModel'")
for version in model_versions:
    print(f"Version: {version.version}, Stage: {version.current_stage}")
```

### 3. **Gérer les modèles dans différents états**

Chaque version d'un modèle dans le registre peut être marquée avec un **"stage"** (état) pour gérer les phases du cycle de vie du modèle :

- **None** : Modèle nouvellement enregistré.
- **Staging** : Modèle en phase de test.
- **Production** : Modèle prêt pour la mise en production.
- **Archived** : Version archivée du modèle.

Vous pouvez modifier l'état d'une version du modèle en fonction de son cycle de vie.

#### Exemple de promotion d’un modèle en production :

```python
client.transition_model_version_stage(
    name="IrisClassifierModel",
    version=1,
    stage="Production"
)
```

### 4. **Interagir avec un modèle dans le registre**

Une fois le modèle enregistré dans le registre, vous pouvez le récupérer et interagir avec lui, par exemple pour faire des prédictions.

#### Charger un modèle à partir du registre :

Vous pouvez charger un modèle depuis le registre en spécifiant le nom du modèle et son état (par exemple, "Production").

```python
# Charger la version "Production" du modèle
model_name = "IrisClassifierModel"
model_version = "Production"
loaded_model = mlflow.pyfunc.load_model(model_uri=f"models:/{model_name}/{model_version}")

# Utiliser le modèle pour faire des prédictions
predictions = loaded_model.predict(X_test)
print(predictions)
```

### 5. **Utiliser des artefacts et suivre les modèles**

Le registre MLFlow stocke non seulement les modèles eux-mêmes, mais aussi des artefacts associés, comme les métriques de performance, les fichiers de configuration ou même des visualisations.

Vous pouvez ajouter des **artefacts** supplémentaires à une version de modèle pour un suivi plus complet de l'expérience :

```python
with mlflow.start_run():
    mlflow.log_artifact("confusion_matrix.png")  # Exemple d'ajout d'un graphique en artefact
```

### 6. **Déploiement des modèles enregistrés**

MLFlow permet de déployer les modèles dans différents environnements :

- **Localement** : pour tester ou valider avant la production.
- **Sur des services comme AWS SageMaker, Azure ML, ou Google AI Platform** pour une intégration en production à grande échelle.
- **Via des API** : en exposant un modèle en tant qu'API HTTP pour le servir en production.

Voici un exemple de commande MLFlow pour déployer un modèle sur AWS SageMaker :

```bash
mlflow sagemaker deploy -m models:/IrisClassifierModel/Production --region us-west-2 --mode create
```

### 7. **Conclusion**

L'utilisation du **registre de modèles** dans MLFlow permet de structurer le déploiement des modèles de manière systématique. Il vous permet de stocker, versionner, promouvoir et interagir avec les modèles de machine learning tout au long de leur cycle de vie, tout en assurant une traçabilité complète. Cela facilite l'automatisation, la reproductibilité et le contrôle des mises en production des modèles dans un environnement MLOps.

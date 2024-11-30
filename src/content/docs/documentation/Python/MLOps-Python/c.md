---
title: API et SDK - Azure
description: API et SDK - Azure
---

Dans cet objectif, nous allons nous concentrer sur l'utilisation des APIs HTTP existantes et des **SDKs** dans le contexte d'Azure pour le déploiement, la gestion et l'intégration des modèles de **Machine Learning** (ML) dans des workflows **MLOps**. Azure propose un écosystème robuste pour le ML, et nous allons explorer comment exploiter ces outils pour automatiser et orchestrer des pipelines ML à grande échelle.

### 1. **Introduction aux APIs HTTP et SDKs d'Azure pour le Machine Learning**

### **Azure Machine Learning Service**

Azure propose un service complet de Machine Learning appelé **Azure Machine Learning** qui offre à la fois des APIs HTTP et des SDKs pour gérer des tâches comme :

- Entraîner des modèles ML sur des machines locales ou dans le cloud.
- Suivre les expérimentations et les métriques.
- Déployer les modèles comme des endpoints HTTP pour l'inférence en temps réel.

### **Azure SDKs**

Le **SDK Azure Machine Learning** (Azure ML SDK) est une bibliothèque Python qui facilite l'interaction avec les services ML d'Azure. Il permet d'orchestrer tout le pipeline ML depuis la préparation des données, l'entraînement, le déploiement, jusqu'à la gestion des ressources cloud.

### 2. **Utilisation du SDK Azure pour des tâches MLOps**

Le **SDK Azure Machine Learning** permet de créer des workflows MLOps flexibles qui s'intègrent bien dans des pipelines CI/CD. Voici comment l'utiliser pour des tâches communes en MLOps.

### a) **Installation du SDK Azure ML**

Avant de commencer à utiliser le SDK Azure ML, vous devez l'installer avec la commande suivante :

```bash
pip install azureml-sdk

```

### b) **Configuration d'un Workspace Azure ML**

Un **workspace** est l'espace de travail centralisé pour gérer les ressources et les pipelines ML sur Azure.

**Exemple** : Créer un workspace Azure et configurer une session dans votre code Python.

```python
from azureml.core import Workspace

# Se connecter au workspace Azure
ws = Workspace.from_config()

# Visualiser les informations du workspace
print(f'Workspace: {ws.name}, Location: {ws.location}, Subscription: {ws.subscription_id}')

```

### c) **Entraîner un modèle avec le SDK Azure ML**

Vous pouvez utiliser le SDK pour entraîner un modèle sur des machines locales ou sur des instances de calcul dans le cloud.

**Exemple** : Entraîner un modèle scikit-learn sur Azure.

```python
from azureml.core import Experiment, ScriptRunConfig
from azureml.train.sklearn import SKLearn

# Définir l'expérience de ML
experiment = Experiment(ws, 'my-experiment')

# Définir la configuration d'entraînement
src = ScriptRunConfig(source_directory='.',
                      script='train.py',
                      compute_target='local')

# Lancer l'entraînement
run = experiment.submit(src)
run.wait_for_completion()

# Afficher les résultats de l'entraînement
print(run.get_metrics())

```

Le modèle est ensuite suivi et enregistré dans le workspace pour être déployé.

---

### **Déployer un modèle comme service web dans Azure (suite)**

Une fois le modèle entraîné, vous pouvez le déployer sur **Azure Container Instance (ACI)** en tant que **service web** accessible via une API HTTP. Voici comment procéder :

```python
from azureml.core.model import Model
from azureml.core.webservice import AciWebservice, Webservice
from azureml.core.model import InferenceConfig

# Charger le modèle enregistré depuis le workspace
model = Model(workspace=ws, name='my_model')

# Configurer l'environnement pour l'inférence
inference_config = InferenceConfig(entry_script="score.py", environment=myenv)

# Définir les ressources de déploiement (par exemple, Azure Container Instance)
aci_config = AciWebservice.deploy_configuration(cpu_cores=1, memory_gb=1, auth_enabled=True)

# Déployer le modèle comme un service web
service = Model.deploy(workspace=ws,
                       name='my-ml-service',
                       models=[model],
                       inference_config=inference_config,
                       deployment_config=aci_config)

# Attendre la fin du déploiement
service.wait_for_deployment(show_output=True)

# Vérifier l'état du service déployé
print(service.state)

```

Dans cet exemple :

- **`entry_script`** fait référence à un script Python `score.py`, qui contient la logique de prédiction utilisée lors des requêtes HTTP.
- **`environment`** spécifie les dépendances nécessaires à l'exécution du modèle (par exemple, `scikit-learn` ou `tensorflow`).
- **`AciWebservice.deploy_configuration`** permet de configurer les ressources de calcul pour le service (CPU, mémoire, etc.).

### **Faire des requêtes d'inférence sur le modèle déployé**

Une fois le modèle déployé comme service web, vous pouvez faire des prédictions en envoyant des requêtes POST à l'API HTTP.

**Exemple** : Envoyer une requête d'inférence à l'API du modèle déployé.

```python
import requests
import json

# URL du service déployé
scoring_uri = service.scoring_uri

# Les données à envoyer (en JSON)
input_data = json.dumps({
    'data': [[0.5, 1.2, 3.4]]  # Exemple de données d'entrée
})

# Les en-têtes de la requête
headers = {'Content-Type': 'application/json'}

# Envoyer la requête POST à l'API pour faire une prédiction
response = requests.post(scoring_uri, data=input_data, headers=headers)

# Afficher la réponse de l'API
print(response.json())

```

Cela envoie les données sous forme de requête JSON au service d'inférence. L'API répondra avec une prédiction basée sur le modèle déployé.

### 3. **Utilisation d'APIs HTTP Azure pour l'inférence**

Azure propose aussi des **APIs préconstruites** pour certaines tâches de Machine Learning comme la reconnaissance d'image, l'analyse de texte, et plus encore. Ces APIs vous permettent de profiter de modèles déjà entraînés pour des besoins courants sans avoir à construire et déployer vos propres modèles.

### a) **Exemple avec l'API de reconnaissance d'image (Azure Computer Vision)**

L'**API Azure Computer Vision** permet d'analyser des images et de détecter des objets, des visages, des textes, et plus encore.

**Exemple** : Utiliser l'API Azure Computer Vision pour détecter du texte dans une image.

```python
import requests

# URL de l'API Computer Vision
vision_api_url = "https://<region>.api.cognitive.microsoft.com/vision/v3.0/ocr"

# Les en-têtes avec la clé API d'Azure
headers = {
    'Ocp-Apim-Subscription-Key': 'votre_cle_api',
    'Content-Type': 'application/octet-stream'
}

# Charger l'image à analyser
with open('image.jpg', 'rb') as image_file:
    image_data = image_file.read()

# Envoyer la requête à l'API
response = requests.post(vision_api_url, headers=headers, data=image_data)

# Afficher la réponse JSON de l'API
print(response.json())

```

### b) **Utilisation d'autres APIs Azure**

En plus de **Computer Vision**, Azure propose de nombreuses autres APIs prêtes à l'emploi comme :

- **Azure Text Analytics API** : Pour l'analyse de texte, la détection des sentiments, et la reconnaissance d'entités.
- **Azure Face API** : Pour la détection et la reconnaissance faciale.

---

### 4. **Cas d'usage d'APIs et SDKs Azure en MLOps**

### a) **Déploiement continu (CI/CD) avec Azure ML et SDK**

En utilisant le **SDK Azure ML**, vous pouvez facilement intégrer les pipelines de ML dans vos pipelines CI/CD. Par exemple, un pipeline CI/CD peut :

- Exécuter des tests automatiques sur les modèles.
- Entraîner à nouveau un modèle lorsqu'il y a de nouvelles données.
- Déployer automatiquement les nouvelles versions des modèles sur des services web avec des endpoints API.

### b) **Suivi des expérimentations et gestion des modèles**

Le SDK permet également de suivre les expérimentations ML, y compris :

- La gestion des **hyperparamètres**.
- Le suivi des **métriques** comme la précision ou la perte.
- La gestion des **versions des modèles** pour s'assurer que la meilleure version est déployée.

---

### Conclusion

L'utilisation des **SDKs** et des **APIs HTTP** d'Azure vous permet de gérer tout le cycle de vie du Machine Learning, de l'entraînement des modèles au déploiement dans des pipelines MLOps. Le **SDK Azure Machine Learning** facilite l'automatisation et l'intégration dans les workflows CI/CD, tandis que les **APIs préconstruites** comme celles pour la vision par ordinateur ou l'analyse de texte vous permettent d'ajouter facilement des fonctionnalités de ML sans effort supplémentaire.

Azure propose une solution complète et flexible pour le déploiement et l'utilisation des modèles ML dans des environnements de production avec MLOps.

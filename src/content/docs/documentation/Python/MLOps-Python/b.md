---
title: API et SDK - Introduction
description: API et SDK
---

Cet objectif consiste à comprendre comment les **Software Development Kits (SDKs)** et les **APIs** facilitent l'intégration, le déploiement et l'automatisation des modèles de Machine Learning (ML) dans des pipelines **MLOps**. Les SDKs et APIs sont des outils essentiels qui permettent aux développeurs de communiquer avec des services ML, d'accéder aux modèles, de gérer les ressources, et de créer des pipelines automatisés.

### 1. **Introduction aux SDKs et APIs en MLOps**

### **Qu'est-ce qu'un SDK en Machine Learning ?**

Un **SDK (Software Development Kit)** est un ensemble d'outils et de bibliothèques fournis par un service ou une plateforme pour faciliter le développement d'applications et l'intégration des fonctionnalités ML. Par exemple, **AWS SageMaker SDK**, **Google Cloud AI SDK**, ou **Azure ML SDK** permettent de gérer des tâches telles que :

- L'entraînement des modèles sur le cloud
- L'hébergement et le déploiement de modèles
- L'orchestration des tâches ML

### **Qu'est-ce qu'une API en Machine Learning ?**

Une **API (Application Programming Interface)** permet aux développeurs de communiquer avec un service ou un système via des appels HTTP ou RESTful. En MLOps, cela signifie généralement interagir avec des services cloud ou des modèles ML déjà déployés. Les APIs peuvent être utilisées pour :

- Interroger un modèle (inférence)
- Gérer les données d'entraînement
- Déclencher des workflows d'entraînement et de déploiement

### 2. **Utilisation des SDKs pour le développement et le déploiement de modèles**

### a) **AWS SageMaker SDK**

**AWS SageMaker** est une plateforme cloud populaire qui fournit un SDK Python pour gérer tout le cycle de vie des modèles ML, de l'entraînement à la mise en production. Voici quelques tâches que le SageMaker SDK permet d’automatiser :

- **Entraînement de modèles sur des instances GPU ou CPU**
- **Déploiement des modèles via des endpoints API**
- **Suivi des métriques de performance**

**Exemple** : Entraîner et déployer un modèle avec **AWS SageMaker SDK** :

```python
import sagemaker
from sagemaker import get_execution_role
from sagemaker.tensorflow import TensorFlow

# Définir le rôle et la session SageMaker
role = get_execution_role()
session = sagemaker.Session()

# Configurer et lancer l'entraînement d'un modèle TensorFlow
estimator = TensorFlow(entry_point='train.py',
                       role=role,
                       instance_count=1,
                       instance_type='ml.m5.xlarge',
                       framework_version='2.3.0',
                       py_version='py37',
                       hyperparameters={'epochs': 10, 'batch_size': 32})

estimator.fit({'train': 's3://path/to/training/data'})

# Déployer le modèle comme un endpoint
predictor = estimator.deploy(initial_instance_count=1, instance_type='ml.m5.large')

# Utiliser le modèle pour faire des prédictions via l'API
result = predictor.predict({'input_data': [0.5, 1.2, 3.4]})
print(result)

```

### b) **Google Cloud AI SDK**

Google Cloud propose son propre SDK pour gérer des tâches ML via **AI Platform**. Il offre des fonctionnalités similaires, permettant l'entraînement, le déploiement, et la gestion des modèles à grande échelle.

```python
from google.cloud import aiplatform

# Initialiser le client AI Platform
aiplatform.init(project='my_project', location='us-central1')

# Entraîner un modèle
job = aiplatform.CustomJob.from_local_script(
    display_name='train-my-model',
    script_path='train.py',
    container_uri='gcr.io/cloud-aiplatform/training/tf-cpu.2-3',
    args=['--epochs', '5', '--batch_size', '32'],
    requirements_txt='requirements.txt'
)

# Exécuter l'entraînement
job.run()

# Déployer le modèle après l'entraînement
model = aiplatform.Model.upload(display_name='my_model', artifact_uri='path/to/model')
endpoint = model.deploy(machine_type='n1-standard-4')

```

### 3. **Créer et interagir avec des APIs pour les modèles de Machine Learning**

Les APIs facilitent l'accès aux modèles ML déployés et permettent l'inférence en production. Il existe plusieurs façons de créer et d'utiliser des APIs pour les modèles ML :

### a) **Créer une API pour un modèle ML avec Flask**

Vous pouvez facilement déployer un modèle ML via une API HTTP en utilisant un framework léger comme **Flask**.

**Exemple** : Créer une API Flask pour un modèle entraîné avec **scikit-learn** :

```python
# app.py
from flask import Flask, request, jsonify
import pickle

# Charger le modèle
with open('model.pkl', 'rb') as f:
    model = pickle.load(f)

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    # Extraire les données de la requête POST
    data = request.get_json(force=True)
    prediction = model.predict([data['input_data']])

    # Retourner la prédiction
    return jsonify({'prediction': prediction.tolist()})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

```

Lancer le serveur Flask et tester l'API :

```bash
$ python app.py

```

Faire une requête POST pour interroger le modèle :

```bash
$ curl -X POST <http://localhost:5000/predict> -H "Content-Type: application/json" -d '{"input_data": [0.5, 1.2, 3.4]}'

```

Réponse de l'API :

```json
{
  "prediction": [1]
}
```

### b) **Intégrer avec des APIs existantes**

De nombreux services cloud offrent des **APIs préconstruites** pour des tâches spécifiques de ML, comme la reconnaissance d'image ou le traitement du langage naturel. Vous pouvez interagir avec ces APIs pour intégrer rapidement des fonctionnalités avancées sans avoir à entraîner vos propres modèles.

- **Google Cloud Vision API** pour la reconnaissance d'image
- **AWS Comprehend** pour l'analyse de texte
- **Microsoft Azure Text Analytics API** pour la détection des sentiments

**Exemple** : Utiliser l'API Google Cloud Vision pour la reconnaissance d'image :

```python
from google.cloud import vision

# Initialiser le client API Vision
client = vision.ImageAnnotatorClient()

# Charger une image à analyser
with open('image.jpg', 'rb') as image_file:
    content = image_file.read()

image = vision.Image(content=content)

# Faire la requête pour détecter les objets
response = client.object_localization(image=image)
for obj in response.localized_object_annotations:
    print(f'{obj.name} (confidence: {obj.score})')

```

### 4. **SDKs et APIs populaires en MLOps**

Voici quelques SDKs et APIs populaires utilisés en MLOps pour l'entraînement, le déploiement et la gestion de modèles ML :

### a) **AWS SDK (Boto3)**

- **Tâches** : Entraînement et déploiement de modèles via SageMaker, gestion des ressources S3 pour les jeux de données, suivi des expérimentations.

### b) **Google Cloud AI SDK**

- **Tâches** : Entraînement et déploiement de modèles sur AI Platform, gestion des instances et des jobs ML.

### c) **Azure Machine Learning SDK**

- **Tâches** : Orchestration de pipelines ML, déploiement des modèles sur des conteneurs ou des endpoints API, gestion des ressources de calcul.

### d) **TensorFlow Serving API**

- **Tâches** : Déploiement de modèles TensorFlow pour une inference en production, gestion des modèles via REST ou gRPC.

### e) **FastAPI**

- **Tâches** : Création d’APIs performantes pour interroger des modèles ML avec un framework minimaliste et rapide.

### 5. **Cas d’usage de SDKs et APIs dans les pipelines MLOps**

### a) **Automatisation des workflows**

Les SDKs permettent de créer des workflows ML entièrement automatisés où les modèles peuvent être entraînés, testés, et déployés sans intervention manuelle. Ces workflows peuvent être orchestrés via des outils comme **Airflow** ou des pipelines CI/CD.

### b) **Gestion des versions de modèles**

Avec des SDKs comme **MLflow**, vous pouvez suivre les différentes versions des modèles, gérer les hyperparamètres et les métriques associées à chaque version, et automatiser le déploiement du meilleur modèle.

---

### Conclusion

Apprendre à utiliser les **SDKs** et les **APIs** en MLOps est crucial pour automatiser le cycle de vie des modèles ML. Que vous utilisiez des services cloud comme AWS, Google Cloud, ou Azure, ou que vous construisiez vos propres APIs avec Flask ou FastAPI, l'utilisation efficace de ces outils garantit que les workflows de Machine Learning sont reproductibles, automatisés, et facilement intégrables dans des systèmes existants.

La prochaine étape serait d'implémenter des solutions basées sur les SDKs et APIs et d'explorer comment les intégrer dans des pipelines MLOps en production.

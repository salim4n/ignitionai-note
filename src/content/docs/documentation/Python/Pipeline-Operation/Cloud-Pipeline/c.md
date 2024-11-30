---
title: Qu'est-ce que les pipelines cloud sur GCP ?
description: Qu'est-ce que les pipelines cloud sur GCP ?
---

Dans un environnement **MLOps** (Machine Learning Operations), les pipelines cloud permettent d'orchestrer et d'automatiser les différentes étapes du cycle de vie des modèles de machine learning : collecte et traitement des données, entraînement des modèles, validation et déploiement. **Google Cloud Platform (GCP)** propose une suite complète de services pour créer, gérer et déployer des pipelines MLOps efficaces et scalables.

Cet objectif d'apprentissage vise à composer des solutions en utilisant les pipelines cloud de **GCP** avec des services tels que **Vertex AI**, **Cloud Functions**, **Cloud Build**, **Cloud Composer**, et **Dataflow**.

### 1. **Services clés pour les pipelines MLOps sur GCP**

GCP offre plusieurs services pour mettre en place des pipelines de machine learning de bout en bout. Ces services couvrent toutes les étapes du développement, de l'entraînement au déploiement de modèles :

- **Vertex AI** : Une plateforme unifiée pour l'entraînement, l'orchestration et le déploiement de modèles.
- **Google Cloud Storage (GCS)** : Pour stocker et gérer les données d'entraînement, les modèles et les résultats.
- **Cloud Functions** : Pour l’automatisation des tâches sans gestion de serveurs.
- **Cloud Build** : Pour la gestion des pipelines CI/CD, incluant la construction, les tests et le déploiement des modèles.
- **Cloud Composer** (basé sur Apache Airflow) : Pour orchestrer des workflows MLOps complexes.
- **Google Kubernetes Engine (GKE)** : Pour déployer des modèles dans des conteneurs Docker.
- **Dataflow** : Pour le traitement des données en temps réel et par lots.

### 2. **Étapes pour composer une solution avec des pipelines cloud sur GCP**

### a) **Créer un pipeline avec Vertex AI**

**Vertex AI** est une plateforme unifiée pour créer, entraîner et déployer des modèles de machine learning. Elle offre des fonctionnalités pour orchestrer des workflows ML complexes, du prétraitement des données au déploiement des modèles, avec une intégration native des outils MLOps de Google.

1. **Préparer les données avec Vertex AI Pipelines**

Vertex AI permet de créer des pipelines ML qui automatisent toutes les étapes du flux de travail. Vous pouvez utiliser **Vertex Pipelines** pour gérer et automatiser ces étapes via **Kubeflow Pipelines**.

**Exemple de pipeline avec Vertex AI** :

```python
from kfp.v2 import compiler
from kfp.v2.dsl import pipeline, component, Input, Output

@component
def preprocess_data(input_data: Input[Dataset], output_data: Output[Dataset]):
    # Code pour prétraiter les données
    pass

@component
def train_model(input_data: Input[Dataset], output_model: Output[Model]):
    # Code pour entraîner le modèle
    pass

@pipeline(name="my-ml-pipeline")
def my_pipeline():
    preprocess_task = preprocess_data(input_data='gs://bucket/raw-data.csv')
    train_task = train_model(input_data=preprocess_task.outputs['output_data'])

compiler.Compiler().compile(pipeline_func=my_pipeline, package_path='ml_pipeline.json')

```

Cet exemple montre comment définir et compiler un pipeline avec des étapes de prétraitement des données et d'entraînement du modèle.

1. **Déployer et orchestrer un pipeline dans Vertex AI**

- Après avoir créé le pipeline, vous pouvez l'exécuter via **Vertex AI Pipelines**, qui gère les dépendances entre les différentes étapes et exécute le flux de travail sur GCP.

```bash
gcloud ai pipelines run \\
  --pipeline-name my-ml-pipeline \\
  --region us-central1 \\
  --parameter-file parameters.json

```

### b) **Automatiser les pipelines avec Google Cloud Build**

**Google Cloud Build** est utilisé pour configurer des pipelines CI/CD afin de gérer l'intégration et le déploiement continus des modèles de machine learning. Il peut être intégré à des dépôts **GitHub** ou **Cloud Source Repositories** pour déclencher des tâches à chaque modification du code ou des données.

1. **Créer un pipeline CI/CD avec Cloud Build**

Vous pouvez utiliser un fichier YAML pour définir les étapes de votre pipeline. Ce pipeline peut inclure l'entraînement du modèle, les tests et le déploiement sur Vertex AI.

**Exemple de fichier Cloud Build YAML** :

```yaml
steps:
  # Étape pour installer les dépendances
  - name: "gcr.io/cloud-builders/gcloud"
    args: ["pip", "install", "-r", "requirements.txt"]

  # Étape pour exécuter le script d'entraînement
  - name: "gcr.io/cloud-builders/gcloud"
    args: ["python3", "train_model.py"]

  # Étape pour déployer le modèle sur Vertex AI
  - name: "gcr.io/cloud-builders/gcloud"
    args: ["ai", "models", "upload", "--model-name", "my-model"]
```

Dans cet exemple, le pipeline entraîne un modèle puis le déploie automatiquement sur **Vertex AI** pour l'inférence.

1. **Déclencher des pipelines automatiquement**

Vous pouvez configurer **Cloud Build Triggers** pour exécuter automatiquement le pipeline lorsqu'il y a un nouveau commit sur le dépôt Git.

### c) **Utiliser Google Cloud Functions pour automatiser certaines tâches**

**Cloud Functions** est un service de calcul sans serveur qui peut être utilisé pour déclencher automatiquement des tâches spécifiques dans un pipeline MLOps, comme le prétraitement des données ou le lancement de l'entraînement lorsqu'il y a un nouvel ensemble de données.

1. **Déclencher un travail de machine learning avec une Cloud Function**

Exemple d’une Cloud Function qui déclenche un travail Vertex AI lorsque de nouvelles données sont téléchargées dans un bucket **Google Cloud Storage (GCS)** :

```python
from google.cloud import aiplatform

def trigger_ml_job(event, context):
    # Initialisation du client Vertex AI
    client = aiplatform.PipelineJob(
        project="my-project",
        location="us-central1",
        display_name="triggered-ml-job",
        template_path="gs://my-pipeline-templates/ml_pipeline.json"
    )

    # Exécuter le pipeline
    client.run()

```

Cette fonction est déclenchée chaque fois qu'un nouveau fichier est ajouté à GCS, ce qui lance l'exécution d'un pipeline d'entraînement sur Vertex AI.

### d) **Orchestrer des workflows avec Cloud Composer (Airflow)**

**Google Cloud Composer**, basé sur **Apache Airflow**, permet de créer et d'orchestrer des workflows complexes pour les pipelines de machine learning. Vous pouvez définir des DAGs (Directed Acyclic Graphs) pour automatiser des pipelines entiers, intégrant des services comme **Dataflow**, **BigQuery**, et **Vertex AI**.

1. **Exemple de DAG avec Cloud Composer pour un pipeline MLOps**

```python
from airflow import DAG
from airflow.providers.google.cloud.operators.vertex_ai import CreateCustomJobOperator
from airflow.utils.dates import days_ago

default_args = {
    'start_date': days_ago(1),
    'retries': 2,
}

with DAG('vertex_ai_ml_pipeline', default_args=default_args, schedule_interval=None) as dag:

    # Définir une tâche d'entraînement sur Vertex AI
    train_model = CreateCustomJobOperator(
        task_id='train_model',
        project_id='my-project',
        region='us-central1',
        display_name='training-job',
        worker_pool_specs=[
            {
                'machine_spec': {
                    'machine_type': 'n1-standard-4',
                },
                'replica_count': 1,
                'container_spec': {
                    'image_uri': 'gcr.io/my-project/my-training-image',
                }
            }
        ]
    )

    train_model

```

Ce **DAG** crée une tâche d'entraînement sur Vertex AI et peut être planifié pour s'exécuter à des moments spécifiques ou déclenché manuellement.

### e) **Gérer les données et pipelines avec Google Cloud Storage et Dataflow**

**Google Cloud Storage (GCS)** et **Dataflow** sont souvent utilisés pour gérer les données et les pipelines dans un workflow MLOps. **Dataflow** est un service entièrement géré pour le traitement des données en temps réel ou par lots, tandis que **GCS** est utilisé pour stocker les ensembles de données d'entraînement, les modèles, et les résultats.

1. **Stocker les données et modèles avec GCS**

GCS est utilisé pour stocker les fichiers d'entraînement, les sorties de modèles, et les artefacts de pipeline. Les pipelines ML peuvent interagir avec ces fichiers stockés sur GCS via Vertex AI ou Dataflow.

1. **Traitement des données avec Dataflow**

**Dataflow** est un service basé sur **Apache Beam** qui peut être utilisé pour le traitement de données à grande échelle avant ou après l’entraînement de vos modèles. Vous pouvez l’intégrer à un pipeline MLOps pour automatiser des tâches comme l’ingestion et le nettoyage des données.

---

### Conclusion

En utilisant **Google Cloud Platform (GCP)**, vous pouvez composer des solutions MLOps évolutives, flexibles et automatisées. L'intégration de services comme **Vertex AI**, **Cloud Build**, **Cloud Functions**, et **Cloud Composer** permet de créer des pipelines de machine learning de bout en bout, du prétraitement des données à l'entraînement des modèles, en passant par le déploiement

---
title: Qu'est-ce que les pipelines cloud dans Azure ?
description: Qu'est-ce que les pipelines cloud dans Azure ?
---

Dans un environnement **MLOps** (Machine Learning Operations), l'utilisation des pipelines cloud est essentielle pour automatiser et orchestrer les workflows de **développement**, **entraînement**, **test**, et **déploiement** des modèles de machine learning. Microsoft **Azure** propose une suite complète de services permettant de construire, déployer et gérer des pipelines pour le machine learning.

Cet objectif d'apprentissage se concentre sur la manière d'utiliser les technologies de pipelines cloud d'Azure pour créer des solutions automatisées et scalables.

### 1. **Concepts clés des pipelines cloud dans Azure**

Un **pipeline cloud** est un flux de travail qui intègre plusieurs étapes allant de la collecte de données à l'entraînement et au déploiement des modèles. Sur Azure, cela inclut :

- **Azure Machine Learning** : Permet de créer des expériences d'entraînement et des pipelines de machine learning.
- **Azure DevOps** : Intégration continue et déploiement continu (CI/CD) pour automatiser le processus de développement et de déploiement des applications et modèles.
- **Azure Data Factory** : Service d'orchestration de données qui permet de gérer les flux de données et de préparer les ensembles de données pour le machine learning.
- **Azure Pipelines** : Pour l'automatisation des tâches CI/CD, et l'intégration des processus DevOps avec le ML.

### 2. **Étapes pour composer une solution avec des pipelines cloud sur Azure**

### a) **Créer un espace de travail Azure Machine Learning**

Avant de commencer à créer des pipelines, il est important de configurer un **espace de travail** Azure Machine Learning, qui sera le point central pour gérer vos expériences ML, stocker les modèles, suivre les métriques, et orchestrer les pipelines.

1. Connectez-vous à votre **portail Azure**.
2. Créez un espace de travail Azure Machine Learning :
   - Accédez à **Azure Machine Learning** et cliquez sur **Créer un espace de travail**.
   - Configurez les paramètres de votre espace de travail (nom, région, abonnement, etc.).
3. Vous pouvez également créer cet espace de travail via la ligne de commande Azure CLI :

   ```bash
   az ml workspace create --name ml_workspace --resource-group ml_rg --location eastus

   ```

### b) **Développer un pipeline de machine learning**

**Azure Machine Learning Pipelines** est un service qui permet de créer et d'automatiser des workflows d'entraînement et de déploiement de modèles ML.

1. **Configurer les composants du pipeline**
   - **Environnements d'entraînement** : Définir les environnements (par exemple, clusters GPU) pour entraîner vos modèles.
   - **Données** : Préparer et ingérer les données avec des services comme **Azure Data Factory**.
   - **Étapes de traitement** : Utiliser des scripts Python, des modèles pré-entraînés, ou des notebooks pour traiter les données et entraîner les modèles.
2. **Exemple de création d'un pipeline de machine learning avec Python** :

   ```python
   from azureml.core import Workspace, Dataset, Environment, Experiment
   from azureml.pipeline.core import Pipeline, PipelineData
   from azureml.pipeline.steps import PythonScriptStep

   # Se connecter à l'espace de travail
   ws = Workspace.from_config()

   # Créer un environnement de calcul
   compute_target = ws.compute_targets['gpu-cluster']

   # Charger un dataset
   dataset = Dataset.get_by_name(ws, 'training_data')

   # Créer un environnement d'exécution pour le pipeline
   env = Environment.get(ws, name='AzureML-TensorFlow-2.4-GPU')

   # Spécifier l'endroit où stocker les données
   output_data = PipelineData("output_data", datastore=ws.get_default_datastore())

   # Étape d'entraînement du modèle
   train_step = PythonScriptStep(
       name="Train Model",
       script_name="train.py",
       compute_target=compute_target,
       inputs=[dataset.as_named_input('input_data')],
       outputs=[output_data],
       source_directory="./scripts",
       environment=env
   )

   # Construire et soumettre le pipeline
   pipeline = Pipeline(workspace=ws, steps=[train_step])
   experiment = Experiment(workspace=ws, name="train_pipeline")
   run = experiment.submit(pipeline)
   run.wait_for_completion(show_output=True)

   ```

   Ici, nous avons :

   - Déployé un pipeline qui exécute un script Python `train.py` pour entraîner un modèle de machine learning.
   - Utilisé un cluster GPU pour l'entraînement.
   - Géré les données via **Azure Datastore**.

### c) **Automatiser le déploiement avec Azure DevOps et Azure Pipelines**

Pour un pipeline **CI/CD**, Azure Pipelines permet d'automatiser le processus d'intégration et de déploiement des modèles de machine learning. Vous pouvez utiliser **GitHub** ou **Azure Repos** pour le contrôle de version et intégrer les déploiements automatisés.

1. **Configurer un pipeline CI/CD dans Azure DevOps** :
   - Créez un nouveau projet dans **Azure DevOps**.
   - Configurez votre **Azure Pipeline** pour déclencher l'entraînement de modèles à partir de nouveaux commits ou pull requests.
2. **Exemple de fichier YAML pour un pipeline Azure ML** :

   ```yaml
   trigger:
     branches:
       include:
         - main

   pool:
     vmImage: "ubuntu-latest"

   steps:
     - task: UsePythonVersion@0
       inputs:
         versionSpec: "3.x"

     - script: |
         pip install azureml-sdk
         python train.py
       displayName: "Run Training Script"

     - task: PublishBuildArtifacts@1
       inputs:
         PathtoPublish: "outputs"
         ArtifactName: "Model"
   ```

Ce pipeline Azure :

- S’exécute à chaque commit sur la branche principale.
- Entraîne un modèle via le script Python `train.py`.
- Publie les artefacts (comme les modèles) pour un déploiement ou une utilisation ultérieure.

### d) **Utiliser Azure Data Factory pour l'orchestration des données**

**Azure Data Factory (ADF)** est un service d'orchestration qui vous permet de déplacer et transformer des données à grande échelle. Vous pouvez intégrer ADF dans votre pipeline pour automatiser la collecte et la préparation des données.

1. **Créer un pipeline de traitement des données avec ADF** :
   - Configurez des **pipelines de transformation** pour ingérer les données de sources variées (bases de données, fichiers CSV, etc.) et les préparer pour l’entraînement du modèle.
2. **Exemple de pipeline ADF pour charger des données dans Azure Blob Storage** :
   - Configurez un **Pipeline** dans **ADF Studio** pour lire des données depuis une base de données SQL, les transformer, et les envoyer vers un **Azure Blob Storage** pour le modèle ML.

### e) **Déployer les modèles sur Azure avec Azure Kubernetes Service (AKS)**

Une fois le modèle entraîné, il peut être déployé sous forme de service web sur **Azure Kubernetes Service (AKS)** pour le rendre accessible via une **API REST**.

1. **Déployer un modèle sur AKS** :
   - Vous pouvez utiliser un **inférence cluster AKS** pour déployer des modèles ML en production.
2. **Exemple de déploiement d'un modèle sur AKS** :

   ```python
   from azureml.core.model import Model
   from azureml.core.webservice import AksWebservice, Webservice
   from azureml.core.compute import AksCompute, ComputeTarget

   # Récupérer le modèle à partir de l'espace de travail
   model = Model(workspace=ws, name='best_model')

   # Configurer le service AKS
   aks_target = ComputeTarget(workspace=ws, name='aks-cluster')
   aks_config = AksWebservice.deploy_configuration(cpu_cores=1, memory_gb=2)

   # Déployer le modèle
   service = Model.deploy(workspace=ws,
                          name='model-service',
                          models=[model],
                          deployment_config=aks_config,
                          deployment_target=aks_target)

   service.wait_for_deployment(show_output=True)
   print(service.scoring_uri)

   ```

Ce code permet de :

- Déployer un modèle préalablement enregistré sur un cluster AKS.
- Exposer le modèle via une **API REST** pour effectuer des prédictions à la demande.

---

### Conclusion

L’utilisation de la technologie de pipeline Cloud d’Azure permet de **composer des solutions scalables** pour le **machine learning** en automatisant chaque étape, du traitement des données à la gestion des modèles et au déploiement. En utilisant des outils comme **Azure Machine Learning**, **Azure DevOps**, **Azure Data Factory**, et **Azure Kubernetes Service (AKS)**, vous pouvez orchestrer l'ensemble de vos pipelines MLOps tout en garantissant une flexibilité et une scalabilité optimales.

Ces solutions vous permettent de :

- **Automatiser** le cycle de vie du machine learning (entraînement, test, déploiement).
- **Orchestrer les pipelines** de données et de machine learning dans le cloud.
- **Déployer des modèles** en production via AKS ou des services web.
- **Suivre et versionner** vos modèles et pipelines pour une gestion plus efficace.

Ces pipelines sont au cœur des systèmes de machine learning modernes en production, où les processus doivent être automatisés et hautement reproductibles

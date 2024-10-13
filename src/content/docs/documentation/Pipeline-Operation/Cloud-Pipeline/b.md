---
title: Qu'est-ce que les pipelines cloud sur AWS ?
description: Qu'est-ce que les pipelines cloud sur AWS ?
---

### Objectif d'apprentissage : **Composer des solutions en utilisant la technologie de pipeline Cloud avec AWS**

Dans un environnement **MLOps** (Machine Learning Operations), l'utilisation des pipelines cloud permet d'automatiser et d'orchestrer les différentes étapes du développement, de l'entraînement et du déploiement des modèles de machine learning. **Amazon Web Services (AWS)** offre une suite complète de services qui permettent de construire, déployer et gérer des pipelines de machine learning de manière efficace et scalable.

Cet objectif d'apprentissage vise à composer des solutions en utilisant la technologie de pipeline Cloud d'**AWS**, notamment avec des services comme **SageMaker**, **AWS Lambda**, **CodePipeline**, et **Step Functions**.

### 1. **Services clés pour les pipelines MLOps sur AWS**

AWS propose plusieurs services qui peuvent être intégrés pour construire un pipeline de machine learning. Ces services couvrent toutes les étapes du cycle de vie du machine learning, du traitement des données à l'entraînement, au test, et au déploiement des modèles :

- **Amazon SageMaker** : Une plateforme complète pour entraîner et déployer des modèles de machine learning.
- **AWS Lambda** : Pour exécuter du code sans gestion de serveurs et automatiser certaines étapes des pipelines.
- **AWS CodePipeline** : Pour l'automatisation des déploiements avec CI/CD.
- **AWS Step Functions** : Pour orchestrer les workflows des pipelines.
- **Amazon S3** : Pour stocker et gérer les données d'entraînement et les modèles.
- **Amazon ECS / EKS** : Pour le déploiement des modèles à l'échelle en utilisant des conteneurs.

### 2. **Étapes pour composer une solution avec des pipelines cloud sur AWS**

### a) **Créer un pipeline avec Amazon SageMaker**

**Amazon SageMaker** permet d’automatiser l’entraînement, la validation, le test et le déploiement des modèles de machine learning. SageMaker Pipelines permet de créer des workflows MLOps sur mesure.

1. **Configurer SageMaker Studio et Notebook**
   - Créez un espace de travail dans **SageMaker Studio** pour gérer vos expériences.
   - Utilisez des **notebooks Jupyter** pour préparer vos données, entraîner les modèles et les déployer.
2. **Construire un pipeline de machine learning avec SageMaker**

   - Vous pouvez créer un pipeline qui inclut plusieurs étapes comme la préparation des données, l'entraînement et l'évaluation des modèles, et le déploiement automatique des modèles validés.

   **Exemple de pipeline SageMaker** :

   ```python
   from sagemaker.workflow.steps import ProcessingStep, TrainingStep
   from sagemaker.workflow.pipeline import Pipeline
   from sagemaker.processing import ScriptProcessor
   from sagemaker.estimator import Estimator

   # Configurer un processeur pour le prétraitement des données
   processor = ScriptProcessor(
       image_uri='683313688378.dkr.ecr.us-west-2.amazonaws.com/sagemaker-scikit-learn:0.23-1-cpu-py3',
       role=role,
       instance_count=1,
       instance_type='ml.m5.xlarge'
   )

   # Étape de prétraitement des données
   step_process = ProcessingStep(
       name='ProcessData',
       processor=processor,
       inputs=[ProcessingInput(source='s3://input-data/', destination='/opt/ml/processing/input')],
       outputs=[ProcessingOutput(destination='s3://processed-data/', source='/opt/ml/processing/output')],
       code='scripts/process.py'
   )

   # Configurer un modèle SageMaker
   estimator = Estimator(
       image_uri='683313688378.dkr.ecr.us-west-2.amazonaws.com/sagemaker-xgboost:1.2-1',
       role=role,
       instance_count=1,
       instance_type='ml.m5.xlarge',
       output_path='s3://model-output/'
   )

   # Étape d'entraînement du modèle
   step_train = TrainingStep(
       name='TrainModel',
       estimator=estimator,
       inputs={'train': step_process.properties.ProcessingOutputConfig.Outputs['output'].S3Output.S3Uri}
   )

   # Créer un pipeline
   pipeline = Pipeline(
       name='MySageMakerPipeline',
       steps=[step_process, step_train]
   )

   # Exécuter le pipeline
   pipeline.upsert(role_arn=role)
   execution = pipeline.start()

   ```

Dans cet exemple, nous avons un pipeline SageMaker avec :

- Une étape de **prétraitement** des données.
- Une étape d'**entraînement** d’un modèle XGBoost.
- Le pipeline s'exécute de manière orchestrée via SageMaker Pipelines.

### b) **Automatiser les pipelines avec AWS CodePipeline**

**AWS CodePipeline** permet d'automatiser le déploiement continu (CI/CD) des modèles ML. Vous pouvez l'intégrer à **SageMaker** pour automatiser la mise à jour et le déploiement des modèles à chaque changement de code ou de données.

1. **Créer un pipeline avec AWS CodePipeline**

   Utilisez **CodePipeline** pour intégrer un processus CI/CD autour de votre modèle de machine learning. Le pipeline peut être déclenché lorsqu'il y a de nouveaux commits sur un dépôt **GitHub** ou **CodeCommit**.

   **Exemple de configuration CodePipeline** :

   - Créez un dépôt dans **CodeCommit** ou connectez un dépôt **GitHub**.
   - Configurez un **Build Project** avec **AWS CodeBuild** pour exécuter vos scripts de formation de modèle (entraînement avec SageMaker, tests).
   - Ajoutez une étape de **déploiement** pour publier automatiquement les modèles sur **SageMaker** ou un autre service d’inférence (EKS, Lambda).

2. **Fichier YAML pour CodePipeline** :

   ```yaml
   version: 0.2
   phases:
     install:
       runtime-versions:
         python: 3.7
       commands:
         - pip install sagemaker pandas scikit-learn
     build:
       commands:
         - python train_model.py
         - aws sagemaker create-model --model-name my-model --primary-container
           Image='683313688378.dkr.ecr.us-west-2.amazonaws.com/sagemaker-xgboost:1.2-1'
   ```

### c) **Utiliser AWS Step Functions pour orchestrer les workflows**

**AWS Step Functions** est un service qui permet d'orchestrer des workflows et d'automatiser chaque étape d’un pipeline. Vous pouvez l'utiliser pour organiser un flux de travail complexe, impliquant des services comme **Lambda**, **SageMaker**, et **S3**.

1. **Exemple de workflow MLOps avec AWS Step Functions**

   - Étape 1 : Prétraitement des données avec **AWS Lambda**.
   - Étape 2 : Entraînement du modèle avec **SageMaker**.
   - Étape 3 : Déploiement du modèle sur **SageMaker Endpoint** ou **Lambda**.

   **Exemple de définition JSON d'un workflow AWS Step Functions** :

   ```json
   {
     "StartAt": "PreprocessData",
     "States": {
       "PreprocessData": {
         "Type": "Task",
         "Resource": "arn:aws:lambda:us-west-2:123456789012:function:PreprocessData",
         "Next": "TrainModel"
       },
       "TrainModel": {
         "Type": "Task",
         "Resource": "arn:aws:sagemaker:us-west-2:action:CreateTrainingJob",
         "Next": "DeployModel"
       },
       "DeployModel": {
         "Type": "Task",
         "Resource": "arn:aws:sagemaker:us-west-2:action:CreateEndpoint",
         "End": true
       }
     }
   }
   ```

   Ce workflow Step Functions orchestre un pipeline MLOps avec les étapes de prétraitement, d’entraînement et de déploiement.

### d) **Utiliser Amazon S3 et AWS Lambda pour automatiser le stockage et le traitement des données**

**Amazon S3** est un service de stockage cloud utilisé pour stocker les ensembles de données d'entraînement et les modèles. Vous pouvez également utiliser **AWS Lambda** pour automatiser certaines étapes, comme le déclenchement de l'entraînement lorsque de nouvelles données sont ajoutées à S3.

1. **Automatiser avec AWS Lambda** :

   - Configurez un déclencheur S3 pour exécuter un **Lambda** qui lance un travail d’entraînement SageMaker lorsque de nouveaux fichiers de données sont ajoutés à un bucket S3.

   **Exemple de Lambda pour déclencher un travail SageMaker** :

   ```python
   import boto3

   def lambda_handler(event, context):
       sagemaker = boto3.client('sagemaker')

       response = sagemaker.create_training_job(
           TrainingJobName='MyTrainingJob',
           AlgorithmSpecification={'TrainingImage': '683313688378.dkr.ecr.us-west-2.amazonaws.com/sagemaker-xgboost:1.2-1', 'TrainingInputMode': 'File'},
           RoleArn='arn:aws:iam::123456789012:role/SageMakerRole',
           InputDataConfig=[{'ChannelName': 'train', 'DataSource': {'S3DataSource': {'S3Uri': 's3://my-bucket/train'}}}],
           OutputDataConfig={'S3OutputPath': 's3://my-bucket/output/'},
           ResourceConfig={'InstanceType': 'ml.m5.xlarge', 'InstanceCount': 1, 'VolumeSizeInGB': 50},
   StoppingCondition={'MaxRuntimeInSeconds': 3600}
   )
      return response

   ```

Ce **Lambda** déclenche l'entraînement du modèle chaque fois que de nouvelles données arrivent dans le bucket **S3** spécifié.

### e) **Déployer des modèles sur Amazon EKS ou ECS**

Pour un déploiement à grande échelle, vous pouvez utiliser **Amazon EKS** (Elastic Kubernetes Service) ou **Amazon ECS** (Elastic Container Service) pour héberger vos modèles dans des conteneurs Docker.

- **EKS** : Utilisez Kubernetes pour gérer vos clusters de déploiement.
- **ECS** : Utilisez des conteneurs Docker gérés par AWS pour déployer des modèles de manière scalable.

1. **Déploiement avec Amazon EKS** :

- Entraînez le modèle sur SageMaker, exportez-le dans un conteneur Docker, et déployez-le sur un cluster Kubernetes géré par EKS.

---

### Conclusion

L’utilisation de la technologie de pipeline cloud d’AWS permet de **composer des solutions MLOps scalables et automatisées**, avec une orchestration complète des tâches, de la collecte des données à la mise en production des modèles. Les services d’AWS comme **SageMaker**, **Step Functions**, **CodePipeline**, et **Lambda** offrent des solutions flexibles pour chaque étape du pipeline de machine learning, tout en garantissant une grande capacité d'évolutivité et d’automatisation.

Les principaux avantages de ces pipelines cloud sont :

- **Automatisation des workflows MLOps** pour réduire les erreurs humaines.
- **Scalabilité** pour traiter des données massives et entraîner des modèles rapidement.
- **Facilité d'intégration** avec des outils de DevOps pour un déploiement continu.
- **Optimisation des coûts** grâce à l'utilisation des services à la demande, comme Lambda ou SageMaker.

---
title: Identifier et implémenter une solution d'ingestion de données
description: Identifier et implémenter une solution d'ingestion de données
---

Dans le cadre de MLOps, l’ingestion de données est cruciale pour intégrer efficacement les données dans des pipelines de machine learning, permettant ainsi d'alimenter les modèles avec des données fraîches et pertinentes. Voici comment identifier et mettre en place une solution d’ingestion de données sur AWS et Azure.

### 1. **Identifier une solution d’ingestion de données**

Avant de sélectionner une solution, il est essentiel de considérer :

- **Les sources de données** : fichiers CSV, bases de données SQL/NoSQL, API, données en streaming.
- **Le volume et la fréquence des données** : ingestion par lots (batch) ou en continu (streaming).
- **Le format et la structure des données** : JSON, XML, Parquet, etc.

En MLOps, on utilise souvent les outils suivants pour l’ingestion de données :

- **AWS** : AWS Glue, Kinesis Data Streams, AWS Data Pipeline.
- **Azure** : Azure Data Factory, Azure Event Hubs, et Azure Data Lake.

### 2. **Solutions d'ingestion de données sur AWS**

#### a) **Ingestion par lots (Batch) avec AWS Glue**

**AWS Glue** est un service ETL (Extract, Transform, Load) serverless pour préparer les données. Glue peut récupérer des données de S3, de bases de données RDS, ou de Redshift et transformer les données avant de les envoyer dans votre pipeline de machine learning.

1. **Configurer un job Glue** pour extraire les données depuis des fichiers CSV dans S3, effectuer une transformation de données, et les enregistrer dans un autre bucket S3 ou une base de données relationnelle.

   Exemple de code Glue pour extraire et transformer un CSV :

   ```python
   import sys
   from awsglue.transforms import *
   from awsglue.utils import getResolvedOptions
   from pyspark.context import SparkContext
   from awsglue.context import GlueContext
   from awsglue.job import Job

   args = getResolvedOptions(sys.argv, ['JOB_NAME'])
   sc = SparkContext()
   glueContext = GlueContext(sc)
   spark = glueContext.spark_session
   job = Job(glueContext)
   job.init(args['JOB_NAME'], args)

   # Charger les données de S3
   datasource0 = glueContext.create_dynamic_frame.from_catalog(database = "mydb", table_name = "mytable")

   # Transformation (exemple : filtrer les lignes)
   applymapping1 = ApplyMapping.apply(frame = datasource0, mappings = [("column1", "string", "column1", "string")])

   # Enregistrer le résultat
   glueContext.write_dynamic_frame.from_options(frame = applymapping1, connection_type = "s3", connection_options = {"path": "s3://my-output-bucket"}, format = "csv")
   job.commit()
   ```

#### b) **Ingestion en continu (Streaming) avec Kinesis**

**Amazon Kinesis Data Streams** permet de capturer et traiter des données en temps réel, idéales pour les flux de données comme les journaux, les données IoT ou les interactions utilisateur.

1. **Créer un flux Kinesis** qui capture les données en temps réel depuis une source.
2. **Configurer une application de streaming** pour consommer et transformer les données avant de les stocker dans S3, Redshift, ou DynamoDB pour un traitement supplémentaire dans SageMaker.

### 3. **Solutions d'ingestion de données sur Azure**

#### a) **Ingestion par lots avec Azure Data Factory (ADF)**

**Azure Data Factory** est une solution ETL cloud permettant de gérer des workflows de données.

1. **Créer un pipeline ADF** pour extraire les données depuis un stockage Azure Blob, SQL Database, ou des sources externes.
2. **Utiliser les activités de transformation** pour préparer les données, puis les écrire dans Azure Data Lake ou un Data Warehouse pour les modèles ML.

Exemple de processus dans ADF :

- **Copier les données** d'une base de données SQL vers un Data Lake.
- **Nettoyer les données** en utilisant Data Flow, en transformant les colonnes ou en normalisant les valeurs.

#### b) **Ingestion en continu avec Azure Event Hubs**

**Azure Event Hubs** permet d'ingérer des données en streaming, les rendant disponibles pour le traitement en temps réel.

1. **Configurer un Event Hub** pour capturer les données de streaming.
2. **Utiliser un service de traitement comme Azure Stream Analytics** ou **Apache Spark** pour consommer ces données et les transformer avant qu’elles ne soient stockées pour un traitement ML.

### 4. **Implémentation dans un pipeline MLOps**

Les données ingérées doivent être intégrées dans votre pipeline MLOps, par exemple via un service comme Amazon SageMaker Pipelines ou Azure Machine Learning Pipelines :

- **SageMaker Pipelines** : Configurez un pipeline pour ingérer automatiquement les données depuis S3 ou Redshift, les transformer, et les envoyer pour l’entraînement.
- **Azure ML Pipelines** : Utilisez des étapes de Data Factory et de traitement Spark pour intégrer les données de Data Lake vers Azure ML pour le modèle d'entraînement.

### 5. **Exemple d’ingestion en continu et d’utilisation dans SageMaker avec Kinesis**

Voici un exemple d'ingestion en continu en capturant les données via **Kinesis** et en les envoyant pour l’entraînement dans **SageMaker** :

1. **Créer un flux Kinesis** pour ingérer les données en temps réel.
2. **Configurer une application Kinesis Analytics** ou **AWS Lambda** pour transformer les données et les écrire dans un bucket S3.
3. **Déclencher un job SageMaker** pour entraîner un modèle dès que de nouvelles données sont disponibles.

```python
import boto3

# Configurer l'application Kinesis pour l'ingestion
kinesis = boto3.client('kinesis')
response = kinesis.put_record(
    StreamName='mystream',
    Data=b'{"name": "value"}',
    PartitionKey='partitionkey'
)

# SageMaker déclenche un entraînement quand de nouvelles données arrivent
sagemaker = boto3.client('sagemaker')
sagemaker.create_training_job(
    TrainingJobName='MyTrainingJob',
    AlgorithmSpecification={'TrainingImage': 'algorithme-image', 'TrainingInputMode': 'File'},
    RoleArn='role-arn',
    InputDataConfig=[{'ChannelName': 'train', 'DataSource': {'S3DataSource': {'S3Uri': 's3://bucket/'}}}],
    OutputDataConfig={'S3OutputPath': 's3://output/'},
)
```

### Conclusion

La mise en place d'une solution d’ingestion de données solide est essentielle pour alimenter en continu votre pipeline MLOps avec des données récentes et fiables. En fonction des besoins de votre application (par lots ou en continu), AWS et Azure offrent des solutions de data ingestion adaptées aux exigences du machine learning.

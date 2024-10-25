---
title: Identifier et mettre en œuvre une solution de transformation de données
description: Identifier et mettre en œuvre une solution de transformation de données
---

La transformation de données est une étape clé en MLOps pour structurer, nettoyer, et préparer les données avant de les utiliser pour entraîner, valider ou tester des modèles de machine learning. Dans cet objectif, nous allons voir comment identifier les besoins de transformation, puis mettre en place une solution sur des plateformes comme **AWS** et **Azure**.

### 1. **Comprendre les besoins de transformation de données pour MLOps**

En MLOps, les transformations de données incluent :

- **Nettoyage des données** : traiter les valeurs manquantes ou aberrantes, normaliser et standardiser les valeurs.
- **Agrégation et réduction** : combiner ou réduire des ensembles de données.
- **Transformation de format** : convertir les données en formats adaptés (par exemple, de CSV en Parquet).
- **Feature Engineering** : création de nouvelles caractéristiques (features) basées sur les données brutes, comme les vecteurs de texte ou les caractéristiques temporelles.

### 2. **Solutions de transformation de données sur AWS**

#### a) **AWS Glue pour ETL (Extract, Transform, Load)**

**AWS Glue** est un service ETL serverless conçu pour transformer des données à grande échelle. Glue permet d'utiliser des scripts Python ou PySpark pour effectuer des transformations complexes.

1. **Configurer un job Glue** :
   - Dans la console Glue, créez un _job ETL_ pour extraire les données de S3, les transformer, et les sauvegarder dans un autre bucket ou dans Redshift.
2. **Écrire le script de transformation en PySpark** :

   - Exemple : Supposons que vous devez nettoyer des valeurs manquantes et transformer des colonnes numériques en données standardisées :

   ```python
   import sys
   from awsglue.transforms import *
   from awsglue.utils import getResolvedOptions
   from pyspark.context import SparkContext
   from awsglue.context import GlueContext
   from awsglue.dynamicframe import DynamicFrame
   import pyspark.sql.functions as F

   args = getResolvedOptions(sys.argv, ['JOB_NAME'])
   sc = SparkContext()
   glueContext = GlueContext(sc)

   # Charger les données depuis S3
   datasource = glueContext.create_dynamic_frame.from_catalog(database="mydatabase", table_name="mytable")

   # Convertir en DataFrame pour transformation Spark
   df = datasource.toDF()

   # Nettoyer les valeurs manquantes
   df_cleaned = df.na.fill({"column1": "default_value"})

   # Standardiser une colonne numérique
   df_transformed = df_cleaned.withColumn("scaled_column", (df["numeric_column"] - F.mean(df["numeric_column"])) / F.stddev(df["numeric_column"]))

   # Convertir en DynamicFrame et sauvegarder
   transformed_data = DynamicFrame.fromDF(df_transformed, glueContext, "transformed_data")
   glueContext.write_dynamic_frame.from_options(transformed_data, connection_type="s3", connection_options={"path": "s3://my-output-bucket"}, format="parquet")
   ```

3. **Automatiser la transformation avec des triggers** :
   - Utilisez des déclencheurs pour exécuter des jobs Glue en réponse à des événements, comme l’arrivée de nouvelles données dans S3.

#### b) **AWS Lambda pour transformations légères**

Pour des transformations légères et rapides, **AWS Lambda** est une solution pratique et peu coûteuse.

1. **Créer une fonction Lambda** qui réagit à l’arrivée de nouvelles données dans un bucket S3.
2. **Implémenter le code de transformation** directement dans le script Lambda pour, par exemple, nettoyer ou agréger les données avant de les enregistrer dans un autre emplacement.

Exemple Lambda pour transformer des données JSON et les écrire dans S3 :

```python
import json
import boto3

s3 = boto3.client('s3')

def lambda_handler(event, context):
    # Récupérer l'objet depuis S3
    bucket = event['Records'][0]['s3']['bucket']['name']
    key = event['Records'][0]['s3']['object']['key']

    obj = s3.get_object(Bucket=bucket, Key=key)
    data = json.loads(obj['Body'].read())

    # Transformation des données
    transformed_data = transform(data)

    # Enregistrer les données transformées dans un autre bucket
    transformed_key = "transformed/" + key
    s3.put_object(Body=json.dumps(transformed_data), Bucket=bucket, Key=transformed_key)

def transform(data):
    # Exemple de transformation
    return {k: v.upper() for k, v in data.items()}
```

### 3. **Solutions de transformation de données sur Azure**

#### a) **Azure Data Factory pour transformations ETL**

**Azure Data Factory (ADF)** est le service ETL d'Azure, similaire à Glue, qui permet de construire et d'automatiser des pipelines de données.

1. **Créer un pipeline ADF** pour extraire les données de Blob Storage, appliquer les transformations, et charger les données transformées dans Data Lake ou SQL Database.
2. **Utiliser des Data Flows** : ADF intègre des Data Flows, permettant de créer des transformations visuelles (par exemple, jointures, filtrage, agrégation, et normalisation).

   Exemple de flux dans ADF :

   - **Source** : fichier CSV dans Azure Blob Storage.
   - **Transformation** : jointure avec une autre table SQL, filtrage des valeurs manquantes, normalisation de colonnes numériques.
   - **Destination** : stockage des données transformées dans Data Lake ou Data Warehouse.

#### b) **Azure Databricks pour transformations avancées**

**Azure Databricks** permet d’effectuer des transformations de données avancées à l’aide de Spark.

1. **Créer un cluster Databricks** et charger les données depuis Azure Data Lake ou Blob Storage.
2. **Utiliser Spark pour transformer les données** :

   - Par exemple, pour appliquer des transformations de nettoyage, des opérations de feature engineering ou des transformations de séries temporelles.

   Exemple Spark sur Databricks :

   ```python
   # Lecture des données depuis Azure Data Lake
   df = spark.read.format("parquet").load("path_to_data")

   # Transformation : suppression des valeurs nulles et normalisation
   df_cleaned = df.na.drop()
   df_normalized = df_cleaned.withColumn("scaled_column", (df_cleaned["column"] - F.mean(df_cleaned["column"])) / F.stddev(df_cleaned["column"]))

   # Sauvegarde des données transformées
   df_normalized.write.format("parquet").save("path_to_transformed_data")
   ```

### 4. **Solutions multiplateformes : DVC et Airflow pour la gestion des transformations**

Pour une gestion plus flexible des transformations de données, **DVC (Data Version Control)** et **Apache Airflow** sont souvent utilisés.

#### a) **DVC pour la version des transformations de données**

DVC permet de suivre les versions des transformations de données en suivant les fichiers intermédiaires dans un processus de transformation.

1. **Enregistrer une transformation** dans DVC pour s'assurer que les données intermédiaires sont versionnées et réutilisables :
   ```bash
   dvc run -n preprocess -d data/raw.csv -o data/preprocessed.csv \
       python preprocess.py
   ```

#### b) **Apache Airflow pour orchestrer des pipelines de transformation**

Airflow permet de créer des DAGs (Directed Acyclic Graphs) pour automatiser les tâches de transformation et les exécuter selon des dépendances.

1. **Configurer un DAG Airflow** pour orchestrer des étapes de transformation :
   - Par exemple, extraire des données de S3, appliquer une transformation PySpark, puis sauvegarder les données dans Data Lake.

### 5. **Meilleures pratiques pour les transformations de données**

- **Automatiser les pipelines de transformation** pour qu'ils se déclenchent lorsque de nouvelles données arrivent ou selon une planification.
- **Versionner les transformations** avec des outils comme DVC ou Delta Lake pour garantir la reproductibilité.
- **Monitorer les transformations** afin de détecter tout problème ou toute donnée anormale qui pourrait affecter les modèles.
- **Utiliser des formats de stockage optimisés** (Parquet, ORC) pour réduire les coûts de stockage et améliorer les performances des transformations.

### Conclusion

Les solutions comme **AWS Glue** et **Azure Data Factory**, associées à des services de calcul comme **Lambda** ou **Databricks**, offrent des outils puissants pour transformer les données dans des pipelines MLOps. Ces transformations permettent de préparer des données cohérentes et de haute qualité, essentielles pour des modèles de machine learning performants et fiables.

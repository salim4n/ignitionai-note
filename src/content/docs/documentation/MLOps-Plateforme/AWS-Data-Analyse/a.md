---
title: Assainir et préparer les données pour le modélisation
description: Assainir et préparer les données pour le modélisation
---

L'assainissement et la préparation des données sont des étapes cruciales dans la création de modèles de machine learning. La qualité des données affecte directement les performances des modèles, et il est donc essentiel de s'assurer que les données sont propres, cohérentes et prêtes pour l'entraînement.

---

### 1. **Étapes clés de l'assainissement et préparation des données**

#### a) **Nettoyage des données**

- **Suppression des valeurs manquantes** : Pour les colonnes avec trop de valeurs manquantes, elles peuvent être supprimées. Sinon, on peut imputer ces valeurs avec des techniques comme la moyenne, la médiane ou des valeurs spécifiques.
- **Gestion des valeurs aberrantes** : Détecter et traiter les valeurs qui s'écartent de manière significative du reste des données.
- **Standardisation et normalisation** : Ces processus permettent d’uniformiser les valeurs numériques, surtout lorsque les variables ont des échelles très différentes.

#### b) **Transformation des variables**

- **Encodage des variables catégorielles** : Convertir les données catégorielles en représentations numériques avec des méthodes comme l’encodage One-Hot, qui est compatible avec la plupart des algorithmes de machine learning.
- **Feature Engineering** : Création de nouvelles caractéristiques utiles (par exemple, créer une variable "âge" à partir de la date de naissance).

#### c) **Fractionnement des données**

- **Division en ensembles d'entraînement, validation et test** : Séparer les données en différents ensembles permet d'éviter le surapprentissage et de s'assurer que le modèle généralise bien.

---

### 2. **Nettoyage et préparation des données avec AWS : services et outils**

Sur AWS, plusieurs services peuvent être utilisés pour ces étapes :

#### a) **AWS Glue pour le nettoyage de données**

- Glue permet d’écrire des scripts de nettoyage en **PySpark**, ce qui le rend idéal pour traiter de grandes quantités de données dans S3.

- **Script PySpark pour le nettoyage des données avec Glue :**

  ```python
  import pyspark.sql.functions as F

  # Charger les données dans Glue
  datasource = glueContext.create_dynamic_frame.from_catalog(database="my_database", table_name="my_table")
  df = datasource.toDF()

  # Remplacer les valeurs manquantes
  df = df.fillna({'column_with_nan': 'default_value'})

  # Suppression des lignes avec des valeurs nulles dans certaines colonnes
  df = df.na.drop(subset=["important_column"])

  # Suppression des valeurs aberrantes en utilisant des quantiles
  quantiles = df.approxQuantile("numeric_column", [0.01, 0.99], 0.05)
  df = df.filter((df["numeric_column"] >= quantiles[0]) & (df["numeric_column"] <= quantiles[1]))

  # Sauvegarder les données nettoyées dans S3
  glueContext.write_dynamic_frame.from_options(frame=df, connection_type="s3", connection_options={"path": "s3://cleaned_data_bucket"}, format="parquet")
  ```

#### b) **Amazon SageMaker Processing pour le nettoyage et la préparation des données**

- Avec SageMaker Processing, il est possible de créer des jobs de nettoyage et de transformation en utilisant des scripts Python. SageMaker Processing est idéal pour exécuter des traitements de nettoyage et de préparation en parallèle.

- **Utilisation de SageMaker Processing pour nettoyer les données :**

  ```python
  import sagemaker
  from sagemaker.processing import ScriptProcessor

  # Configurer un ScriptProcessor pour exécuter des scripts de nettoyage en Python
  processor = ScriptProcessor(
      image_uri="YOUR_ECR_IMAGE_URI",
      role="YOUR_IAM_ROLE",
      instance_count=1,
      instance_type="ml.m5.xlarge",
  )

  # Définir un script de nettoyage et de transformation des données
  processor.run(
      code="data_cleaning_script.py",
      inputs=[sagemaker.processing.ProcessingInput(source="s3://raw-data-bucket", destination="/opt/ml/processing/input")],
      outputs=[sagemaker.processing.ProcessingOutput(source="/opt/ml/processing/output", destination="s3://cleaned-data-bucket")]
  )
  ```

- **Script Python de nettoyage des données** (`data_cleaning_script.py`), à exécuter avec le ScriptProcessor :

  ```python
  import pandas as pd
  import os

  # Charger les données
  input_data_path = "/opt/ml/processing/input/data.csv"
  df = pd.read_csv(input_data_path)

  # Nettoyer les données
  df.dropna(subset=["important_column"], inplace=True)  # Supprimer les lignes avec des valeurs nulles
  df["category_column"] = df["category_column"].astype("category").cat.codes  # Encodage numérique des variables catégorielles

  # Sauvegarder les données nettoyées
  output_data_path = "/opt/ml/processing/output/cleaned_data.csv"
  df.to_csv(output_data_path, index=False)
  ```

#### c) **Data Wrangler pour l'assainissement et la préparation visuelle des données**

- **Amazon SageMaker Data Wrangler** fournit une interface visuelle permettant de sélectionner les données, de les nettoyer et de les transformer sans avoir à écrire de code. Data Wrangler est particulièrement utile pour des transformations rapides et interactives.

---

### 3. **Meilleures pratiques pour l'assainissement et la préparation des données**

- **Automatiser les étapes de nettoyage** : Utiliser AWS Glue ou SageMaker Processing pour automatiser les étapes répétitives de nettoyage et préparation.
- **Utiliser des types de données optimisés** : Par exemple, les types Parquet et ORC dans S3 sont optimisés pour le stockage et la lecture, ce qui est utile pour des volumes de données élevés.
- **Versionner les jeux de données** : Utilisez un service comme **AWS DMS** pour versionner les données transformées, ce qui permet de reproduire facilement les étapes de nettoyage.
- **Assurer la traçabilité des transformations** : Utilisez un pipeline ou un DAG Airflow pour suivre et documenter chaque étape de transformation.

---

### Conclusion

L’assainissement et la préparation des données sur AWS sont essentiels pour garantir que les modèles reçoivent des données cohérentes et de haute qualité. En utilisant des outils comme **AWS Glue**, **SageMaker Processing**, et **Data Wrangler**, il est possible de mettre en place un pipeline de données robuste qui assure un nettoyage efficace et une préparation optimisée.

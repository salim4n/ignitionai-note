---
title: Feature Engineering
description: Feature Engineering
---

Le Feature Engineering consiste à créer de nouvelles variables à partir des données brutes pour améliorer les performances de modèles de machine learning. Ces transformations enrichissent les données, rendant les caractéristiques plus pertinentes et adaptées aux algorithmes d'apprentissage.

---

### 1. **Étapes clés du Feature Engineering**

#### a) **Encodage des variables catégorielles**

- Les modèles de machine learning nécessitent des données numériques. Les colonnes catégorielles doivent donc être transformées.
- **Encodage One-Hot** : Crée une colonne binaire pour chaque catégorie. Idéal pour des colonnes avec peu de valeurs distinctes.
- **Encodage Ordinal** : Transforme les valeurs en nombres entiers (ex : ["Bas", "Moyen", "Haut"] devient [0, 1, 2]).

#### b) **Transformation des variables temporelles**

- Extraire les composants comme l’année, le mois, la saison, le jour de la semaine, ou encore l’heure à partir des dates peut améliorer les modèles basés sur des tendances temporelles.
- **Exemple** : Transformer une colonne de date (`"2023-10-21"`) en colonnes séparées pour l’année (2023), le mois (10), et le jour (21).

#### c) **Interaction entre caractéristiques**

- Créer de nouvelles colonnes en combinant plusieurs caractéristiques d'origine.
- **Exemple** : Si vous avez des colonnes pour la longueur et la largeur d’un objet, créez une colonne pour l’aire (`longueur * largeur`).

#### d) **Binning et Discrétisation**

- Utilisé pour transformer des variables continues en catégories (bins). Par exemple, un âge peut être transformé en catégories (enfant, adolescent, adulte, senior).
- **Discrétisation** : Découper les valeurs continues en intervalles de même longueur ou fréquence.

#### e) **Fonctions mathématiques et statistiques**

- Appliquer des transformations comme le logarithme, la racine carrée, ou la standardisation permet de réduire les écarts d’échelle ou d’améliorer la distribution des données.
- Calcul de statistiques sur plusieurs colonnes pour créer des nouvelles colonnes (ex : moyenne mobile sur les valeurs passées).

---

### 2. **Réalisation du Feature Engineering sur AWS**

Sur AWS, plusieurs outils permettent d’effectuer du Feature Engineering de manière fluide, que ce soit via des scripts ou des interfaces visuelles.

#### a) **Amazon SageMaker Data Wrangler pour le Feature Engineering interactif**

- Data Wrangler propose une interface sans code qui facilite les étapes de transformation et de création de nouvelles colonnes.
- **Fonctionnalités** : Encodage, binning, création de colonnes de dates, calcul de statistiques et transformation de colonnes.

#### b) **Feature Engineering avec SageMaker Processing et PySpark**

- **SageMaker Processing** permet d'exécuter des scripts de transformation sur des données massives, en utilisant des frameworks comme Pandas ou PySpark.
- **Exemple** : Création de nouvelles caractéristiques sur un jeu de données dans SageMaker Processing avec Pandas.

  ```python
  import pandas as pd

  # Charger les données
  df = pd.read_csv("/opt/ml/processing/input/data.csv")

  # Encodage One-Hot
  df = pd.get_dummies(df, columns=["categorie_colonne"])

  # Création de caractéristiques temporelles
  df["annee"] = pd.to_datetime(df["date_colonne"]).dt.year
  df["mois"] = pd.to_datetime(df["date_colonne"]).dt.month

  # Création de caractéristiques d'interaction
  df["aire"] = df["longueur"] * df["largeur"]

  # Sauvegarde des données traitées
  df.to_csv("/opt/ml/processing/output/data_featured.csv", index=False)
  ```

#### c) **AWS Glue et AWS Glue DataBrew**

- **Glue DataBrew** offre un espace visuel pour appliquer et enregistrer des transformations de données. Il est idéal pour le nettoyage et le Feature Engineering à partir d’ensembles de données complexes.
- **AWS Glue** permet également d’utiliser PySpark pour des transformations avancées et du Feature Engineering, surtout pour des pipelines ETL automatisés.

---

### 3. **Meilleures pratiques de Feature Engineering**

- **Automatiser et versionner les transformations** : Conservez les versions des transformations et caractéristiques créées pour les reproduire ou ajuster selon les besoins.
- **Éviter le surengagement des caractéristiques** : Ajouter trop de nouvelles caractéristiques peut entraîner un surapprentissage, surtout avec des modèles de faible capacité.
- **Evaluer l’impact de chaque caractéristique** : Utilisez des techniques de sélection de caractéristiques ou d’importance des variables pour ne conserver que celles qui améliorent significativement le modèle.

---

### Exemple d’utilisation du Feature Engineering pour des projets de Machine Learning

1. **Prévision de la demande** : Enrichir des données de ventes avec des caractéristiques temporelles (saison, jour de la semaine), et des interactions entre caractéristiques (prix \* quantité vendue).
2. **Détection de fraude** : Utiliser les historiques pour calculer des moyennes, des écarts-types ou des compteurs de transactions pour identifier des transactions inhabituelles.

---

### Conclusion

Le Feature Engineering est une étape essentielle pour exploiter les données brutes de manière optimale. En utilisant des services comme **SageMaker Data Wrangler**, **SageMaker Processing**, **AWS Glue** et **Glue DataBrew**, AWS offre une suite complète pour créer, gérer et automatiser des pipelines de Feature Engineering qui renforcent la qualité des modèles de machine learning.

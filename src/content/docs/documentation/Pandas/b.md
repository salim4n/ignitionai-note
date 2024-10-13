---
title: Usage basique de Pandas
description: Usage basique de Pandas
---

### 1. Introduction à Pandas

**Pandas** est une bibliothèque Python qui permet de manipuler et d'analyser facilement des données structurées (en tableaux). Les deux structures de données principales de Pandas sont :

- **Series** : un tableau à une dimension (similaire à une colonne dans une feuille Excel).
- **DataFrame** : un tableau à deux dimensions (lignes et colonnes), similaire à une feuille de calcul.

### 2. Installation et importation de Pandas

Avant de commencer, assure-toi que Pandas est installé sur ton environnement. Si ce n'est pas le cas, installe-le avec :

```bash
pip install pandas

```

Ensuite, importe Pandas dans ton script Python :

```python
import pandas as pd

```

### 3. Création de Series et DataFrames

### a) **Créer une Series**

Une **Series** est un tableau à une seule dimension avec des étiquettes d'index associées à chaque valeur.

```python
# Créer une Series à partir d'une liste
s = pd.Series([10, 20, 30, 40], index=['a', 'b', 'c', 'd'])
print(s)

```

Sortie :

```
a    10
b    20
c    30
d    40
dtype: int64

```

### b) **Créer un DataFrame**

Un **DataFrame** est une table de données à deux dimensions, similaire à une feuille de calcul avec des lignes et des colonnes.

```python
# Créer un DataFrame à partir d'un dictionnaire
data = {
    'Nom': ['Alice', 'Bob', 'Charlie'],
    'Âge': [25, 30, 35],
    'Ville': ['Paris', 'Lyon', 'Marseille']
}

df = pd.DataFrame(data)
print(df)

```

Sortie :

```
       Nom  Âge      Ville
0    Alice   25      Paris
1      Bob   30       Lyon
2  Charlie   35  Marseille

```

### 4. Lecture et écriture de fichiers CSV

Pandas est couramment utilisé pour lire et écrire des fichiers CSV. Voici les opérations de base :

### a) **Lire un fichier CSV**

Pour charger un fichier CSV dans un DataFrame :

```python
df = pd.read_csv('chemin_vers_fichier.csv')
print(df.head())  # Affiche les 5 premières lignes

```

### b) **Écrire un DataFrame dans un fichier CSV**

Après avoir manipulé ou analysé des données, tu peux enregistrer le DataFrame dans un fichier CSV :

```python
df.to_csv('fichier_sortie.csv', index=False)

```

### 5. Exploration des données dans un DataFrame

### a) **Obtenir des informations de base**

Pandas permet d'explorer rapidement la structure de tes données avec des méthodes comme :

- **`df.head()`** : Affiche les premières lignes.
- **`df.tail()`** : Affiche les dernières lignes.
- **`df.info()`** : Donne des informations sur la structure du DataFrame (colonnes, types de données, mémoire).
- **`df.describe()`** : Retourne des statistiques descriptives pour les colonnes numériques (moyenne, écart-type, etc.).

Exemple :

```python
print(df.head())    # Affiche les premières lignes
print(df.info())    # Affiche des informations sur les colonnes
print(df.describe())  # Affiche des statistiques descriptives

```

### b) **Accéder aux colonnes et lignes**

Tu peux accéder à des colonnes spécifiques ou filtrer certaines lignes du DataFrame :

- **Accéder à une colonne** :
  ```python
  print(df['Nom'])  # Affiche la colonne 'Nom'

  ```
- **Accéder à plusieurs colonnes** :
  ```python
  print(df[['Nom', 'Âge']])  # Affiche les colonnes 'Nom' et 'Âge'

  ```
- **Accéder à une ligne spécifique** :
  Utilise **`loc`** pour accéder à une ligne par son label ou **`iloc`** pour y accéder par son index.
      ```python
      print(df.loc[0])    # Première ligne (par label)
      print(df.iloc[2])   # Troisième ligne (par index)

      ```

### c) **Filtrage des lignes selon des conditions**

Pandas permet de filtrer les lignes qui respectent une condition.

Exemple : Filtrer les lignes où l’âge est supérieur à 30 :

```python
print(df[df['Âge'] > 30])

```

### 6. Manipulation des données dans un DataFrame

### a) **Ajouter une colonne**

Tu peux facilement ajouter une nouvelle colonne au DataFrame en assignant une série de valeurs.

```python
# Ajouter une colonne "Score"
df['Score'] = [85, 90, 88]
print(df)

```

### b) **Supprimer des colonnes ou des lignes**

Utilise **`drop()`** pour supprimer des colonnes ou des lignes.

- Supprimer une colonne :
  ```python
  df = df.drop('Score', axis=1)

  ```
- Supprimer une ligne :
  ```python
  df = df.drop(0, axis=0)  # Supprime la première ligne (index 0)

  ```

### c) **Remplacer des valeurs manquantes (NaN)**

Les jeux de données réels contiennent souvent des valeurs manquantes (NaN). Pandas propose des méthodes pour les gérer :

```python
# Remplacer les NaN par une valeur donnée (par exemple 0)
df['Âge'] = df['Âge'].fillna(0)

```

### 7. Opérations courantes avec Pandas

### a) **GroupBy et agrégation**

Tu peux regrouper les données selon une ou plusieurs colonnes, puis effectuer des calculs d'agrégation sur les groupes (somme, moyenne, etc.).

Exemple : Calculer la moyenne d’âge par ville :

```python
grouped = df.groupby('Ville')['Âge'].mean()
print(grouped)

```

### b) **Tri des données**

Tu peux trier les données d’un DataFrame selon une colonne :

```python
# Trier le DataFrame par âge de manière décroissante
df_sorted = df.sort_values(by='Âge', ascending=False)
print(df_sorted)

```

### c) **Manipulation des chaînes de caractères**

Pandas facilite la manipulation des chaînes dans les colonnes de texte à l'aide de la propriété **`str`**.

```python
# Convertir les noms en majuscules
df['Nom'] = df['Nom'].str.upper()

# Vérifier si une ville contient la lettre "a"
df['Contient_A'] = df['Ville'].str.contains('a')
print(df)

```

### 8. Sauvegarde et exportation des données

### a) **Sauvegarder dans un fichier CSV**

Après avoir manipulé tes données, tu peux sauvegarder le DataFrame dans un fichier CSV.

```python
df.to_csv('output.csv', index=False)

```

### b) **Sauvegarder dans un fichier Excel**

Tu peux également sauvegarder un DataFrame dans un fichier Excel.

```python
df.to_excel('output.xlsx', index=False)

```

### 9. Conclusion : Apprendre l'usage de base de Pandas

Voici un résumé des principales fonctionnalités de **Pandas** que tu devrais maîtriser dans un premier temps pour être efficace :

- **Lecture de fichiers CSV** : Importer et exporter des fichiers CSV pour travailler avec des données réelles.
- **Création de DataFrames** : Créer des tableaux structurés à partir de différentes sources de données (listes, dictionnaires, fichiers).
- **Exploration des données** : Utiliser des méthodes comme `head()`, `info()`, et `describe()` pour obtenir des informations utiles sur tes données.
- **Accès aux lignes et colonnes** : Manipuler les données de manière ciblée, filtrer les lignes selon des conditions.
- **Modification des données** : Ajouter ou supprimer des colonnes, remplacer des valeurs manquantes.
- **GroupBy et tri** : Agréger et trier les données pour des analyses plus poussées.

**Pandas** est une bibliothèque puissante et flexible, et cette introduction te donne les bases pour explorer et manipuler des données efficacement.

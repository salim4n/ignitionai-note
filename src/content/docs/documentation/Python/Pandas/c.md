---
title: Charger et exporter des données avec Pandas
description: Charger et exporter des données avec Pandas
---

### 1. Charger des données dans Pandas

Pandas offre une large gamme de fonctions pour importer des données provenant de divers formats. Voici les principales méthodes d'importation.

### a) **Charger des fichiers CSV**

Le format CSV (Comma Separated Values) est l'un des plus utilisés pour stocker et échanger des données tabulaires. Pandas propose une méthode simple pour lire des fichiers CSV avec **`pd.read_csv()`**.

```python
import pandas as pd

# Charger un fichier CSV
df = pd.read_csv('chemin_vers_fichier.csv')
print(df.head())  # Affiche les 5 premières lignes

```

### Paramètres utiles :

- **`sep`** : Si ton fichier utilise un autre séparateur (par exemple, un point-virgule), tu peux spécifier le séparateur.
  ```python
  df = pd.read_csv('chemin_vers_fichier.csv', sep=';')

  ```
- **`header`** : Spécifie la ligne contenant les en-têtes de colonnes (par défaut la première ligne).
  ```python
  df = pd.read_csv('chemin_vers_fichier.csv', header=0)

  ```
- **`na_values`** : Indique les valeurs à considérer comme NaN (valeurs manquantes).
  ```python
  df = pd.read_csv('chemin_vers_fichier.csv', na_values=['NULL', 'NA'])

  ```

### b) **Charger des fichiers Excel**

Les fichiers Excel sont également largement utilisés pour stocker des données. Tu peux charger des feuilles de calcul Excel en utilisant **`pd.read_excel()`**.

```python
# Charger une feuille de calcul Excel
df = pd.read_excel('chemin_vers_fichier.xlsx', sheet_name='Feuille1')
print(df.head())

```

### Paramètres utiles :

- **`sheet_name`** : Tu peux spécifier le nom ou l'indice de la feuille à lire. Si tu ne spécifies pas ce paramètre, Pandas chargera la première feuille par défaut.
- **`usecols`** : Sélectionner des colonnes spécifiques à charger.
  ```python
  df = pd.read_excel('fichier.xlsx', usecols="A:C")  # Charge seulement les colonnes A à C

  ```

### c) **Charger des fichiers JSON**

Les fichiers JSON (JavaScript Object Notation) sont couramment utilisés pour représenter des objets de données structurées.

```python
# Charger un fichier JSON
df = pd.read_json('chemin_vers_fichier.json')
print(df.head())

```

### Paramètres utiles :

- **`orient`** : Si le format JSON est structuré d'une certaine manière, tu peux utiliser ce paramètre pour indiquer le format (par exemple, `records`, `split`, etc.).
  ```python
  df = pd.read_json('chemin_vers_fichier.json', orient='records')

  ```

### d) **Charger des données à partir de SQL**

Pandas peut se connecter à des bases de données SQL (MySQL, SQLite, PostgreSQL, etc.) et charger des données directement via une requête SQL avec la méthode **`pd.read_sql()`**.

```python
import sqlite3

# Connexion à une base de données SQLite
conn = sqlite3.connect('chemin_vers_base_de_donnees.db')

# Lire une table ou une requête SQL
df = pd.read_sql('SELECT * FROM nom_table', conn)
print(df.head())

```

### Paramètres utiles :

- **`chunksize`** : Tu peux lire les données par morceaux (chunks) si la table SQL est très volumineuse.
  ```python
  for chunk in pd.read_sql('SELECT * FROM nom_table', conn, chunksize=1000):
      print(chunk.head())

  ```

### e) **Charger des données à partir d'une API ou d'Internet**

Il est également possible de charger des données directement depuis une URL, notamment pour des fichiers CSV ou JSON disponibles en ligne.

```python
# Charger un fichier CSV à partir d'une URL
url = 'https://url_vers_fichier.csv'
df = pd.read_csv(url)
print(df.head())

# Charger un fichier JSON à partir d'une API ou d'une URL
url_json = 'https://url_vers_fichier.json'
df = pd.read_json(url_json)
print(df.head())

```

### 2. Exporter des données avec Pandas

Une fois que tu as manipulé et analysé tes données dans Pandas, tu souhaites probablement les exporter pour les partager ou les réutiliser dans un autre environnement. Voici comment exporter tes **DataFrames** vers différents formats.

### a) **Exporter vers un fichier CSV**

Le format CSV est l'un des plus simples et des plus utilisés pour partager des données.

```python
# Exporter un DataFrame dans un fichier CSV
df.to_csv('fichier_sortie.csv', index=False)

```

### Paramètres utiles :

- **`index`** : Si tu veux exclure l'index des lignes du DataFrame, utilise `index=False`.
- **`sep`** : Pour changer le séparateur par défaut (par exemple, utiliser un point-virgule `;` au lieu d'une virgule `,`).
  ```python
  df.to_csv('fichier_sortie.csv', sep=';', index=False)

  ```

### b) **Exporter vers un fichier Excel**

Si tu veux exporter tes données dans un fichier Excel, Pandas le supporte avec **`to_excel()`**.

```python
# Exporter un DataFrame dans un fichier Excel
df.to_excel('fichier_sortie.xlsx', sheet_name='Feuille1', index=False)

```

### Paramètres utiles :

- **`sheet_name`** : Spécifie le nom de la feuille de calcul dans laquelle tu veux sauvegarder les données.
- **`startrow`** : Indique la ligne à partir de laquelle commencer à écrire les données dans la feuille de calcul.

### c) **Exporter vers un fichier JSON**

Pour exporter un DataFrame en format JSON :

```python
# Exporter un DataFrame dans un fichier JSON
df.to_json('fichier_sortie.json', orient='records')

```

### Paramètres utiles :

- **`orient`** : Choisir l'orientation du format JSON (`split`, `records`, `index`, `columns`, etc.).

### d) **Exporter vers SQL**

Pour exporter des données dans une base de données SQL, utilise la méthode **`to_sql()`**.

```python
# Connexion à une base de données SQLite
conn = sqlite3.connect('chemin_vers_base_de_donnees.db')

# Exporter un DataFrame dans une table SQL
df.to_sql('nom_table', conn, if_exists='replace', index=False)

```

### Paramètres utiles :

- **`if_exists`** : Spécifie ce qu'il faut faire si la table existe déjà (`replace`, `append`, `fail`).

### 3. Utilisation avancée : Charger des données avec des chunks (morceaux)

Lorsque tu travailles avec des fichiers volumineux, il peut être nécessaire de charger les données en **chunks** (morceaux). Cela permet de limiter la mémoire utilisée et de traiter les données par étapes.

```python
# Lire un fichier CSV en morceaux (chunk)
chunk_size = 1000
for chunk in pd.read_csv('fichier_volumineux.csv', chunksize=chunk_size):
    print(chunk.head())  # Traiter chaque morceau indépendamment

```

Cela est particulièrement utile pour les bases de données volumineuses ou les fichiers CSV massifs.

### 4. Conclusion : Importation et exportation de données avec Pandas

Voici un résumé des principales opérations d'importation et d'exportation dans Pandas :

### Importer des données :

- **`read_csv()`** : Lire des fichiers CSV.
- **`read_excel()`** : Lire des fichiers Excel.
- **`read_json()`** : Lire des fichiers JSON.
- **`read_sql()`** : Lire des données depuis une base de données SQL.
- **Charger des données depuis une URL** : Charger des fichiers CSV ou JSON directement depuis Internet.

### Exporter des données :

- **`to_csv()`** : Sauvegarder des DataFrames dans des fichiers CSV.
- **`to_excel()`** : Exporter des données dans des fichiers Excel.
- **`to_json()`** : Exporter des données au format JSON.
- **`to_sql()`** : Exporter des données vers une base de données SQL.

Ces fonctionnalités permettent à **Pandas** d’être un outil extrêmement puissant pour la gestion des données, que ce soit pour charger des données à partir de différentes sources, les manipuler ou les exporter vers des formats adaptés à tes besoins.

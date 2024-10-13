---
title: Manipuler des données dans un DataFrame
description: Manipuler des données dans un DataFrame
---

### 1. Sélection et accès aux données dans un DataFrame

### a) **Sélection de colonnes**

Tu peux sélectionner une ou plusieurs colonnes d'un DataFrame.

- **Sélectionner une colonne** :

  ```python
  df['Nom']

  ```

- **Sélectionner plusieurs colonnes** :

  ```python
  df[['Nom', 'Âge']]

  ```

### b) **Sélection de lignes**

Il existe plusieurs méthodes pour sélectionner des lignes dans un DataFrame :

- **Sélection par index (iloc)** : Pour sélectionner par position.

  ```python
  df.iloc[0]  # Première ligne

  ```

- **Sélection par étiquette (loc)** : Pour sélectionner par nom d'index.

  ```python
  df.loc[0]  # Ligne avec l'index 0

  ```

- **Sélection par condition** : Pour filtrer des lignes selon une condition.

  ```python
  df[df['Âge'] > 30]  # Lignes où l'âge est supérieur à 30

  ```

### c) **Accéder à des sous-ensembles de données (slicing)**

- **Sélectionner une plage de lignes** :

  ```python
  df[2:5]  # Lignes 2 à 4

  ```

- **Sélectionner des lignes et colonnes spécifiques** :

  ```python
  df.loc[0:2, ['Nom', 'Âge']]  # Lignes 0 à 2 et colonnes 'Nom' et 'Âge'

  ```

### 2. Modification des données dans un DataFrame

### a) **Ajouter une nouvelle colonne**

Tu peux ajouter une nouvelle colonne en assignant des valeurs à celle-ci.

```python
df['Salaire'] = [50000, 60000, 55000]  # Ajouter une colonne 'Salaire'

```

### b) **Modifier des valeurs dans un DataFrame**

Tu peux directement modifier des valeurs dans un DataFrame en accédant à une cellule spécifique.

- **Modifier une cellule** :

  ```python
  df.loc[0, 'Âge'] = 26  # Modifier l'âge de la première ligne

  ```

- **Modifier une colonne entière** :

  ```python
  df['Âge'] = df['Âge'] + 1  # Augmenter l'âge de chaque personne de 1

  ```

### c) **Supprimer des colonnes ou des lignes**

Pandas permet de supprimer des colonnes ou des lignes avec la méthode **`drop()`**.

- **Supprimer une colonne** :

  ```python
  df = df.drop('Salaire', axis=1)  # Supprimer la colonne 'Salaire'

  ```

- **Supprimer une ligne** :

  ```python
  df = df.drop(0, axis=0)  # Supprimer la première ligne

  ```

### 3. Manipulation des chaînes de caractères

### a) **Opérations de base sur les colonnes de type chaîne**

Pandas permet de manipuler facilement des colonnes contenant des chaînes de caractères en utilisant la propriété **`.str`**.

- **Mettre en majuscules** :

  ```python
  df['Nom'] = df['Nom'].str.upper()  # Convertir tous les noms en majuscules

  ```

- **Vérifier la présence d'un motif** :

  ```python
  df['Ville'].str.contains('Paris')  # Vérifier si 'Paris' est présent dans la colonne 'Ville'

  ```

- **Remplacer une sous-chaîne** :

  ```python
  df['Nom'] = df['Nom'].str.replace('ALICE', 'Alicia')  # Remplacer 'ALICE' par 'Alicia'

  ```

### 4. Gestion des valeurs manquantes

Les valeurs manquantes sont courantes dans les jeux de données. Pandas fournit plusieurs méthodes pour les gérer.

### a) **Détecter les valeurs manquantes**

Pour vérifier si une colonne ou un DataFrame contient des valeurs manquantes (NaN) :

```python
df.isna()  # Renvoie un DataFrame booléen indiquant la présence de NaN
df.isna().sum()  # Nombre de valeurs manquantes par colonne

```

### b) **Remplacer les valeurs manquantes**

Tu peux remplacer les valeurs manquantes par une autre valeur, comme 0 ou la moyenne de la colonne.

- **Remplacer par une valeur spécifique** :

  ```python
  df['Âge'] = df['Âge'].fillna(0)  # Remplacer les NaN dans la colonne 'Âge' par 0

  ```

- **Remplacer par la moyenne** :

  ```python
  df['Âge'] = df['Âge'].fillna(df['Âge'].mean())  # Remplacer les NaN par la moyenne de la colonne 'Âge'

  ```

### c) **Supprimer les lignes avec des valeurs manquantes**

Si tu veux supprimer les lignes contenant des valeurs manquantes :

```python
df = df.dropna()  # Supprimer toutes les lignes avec des valeurs manquantes

```

### 5. Fusionner et combiner des DataFrames

Tu peux combiner des DataFrames avec des méthodes comme **`merge()`**, **`concat()`**, et **`join()`**.

### a) **Concaténer des DataFrames**

Concaténer deux DataFrames verticalement ou horizontalement.

```python
# Concaténer deux DataFrames verticalement
df_concat = pd.concat([df1, df2], axis=0)  # Ajouter des lignes

```

### b) **Fusionner des DataFrames**

Pour effectuer une jointure (similaire à SQL), utilise **`merge()`**.

```python
# Fusionner deux DataFrames sur une colonne commune
df_merged = pd.merge(df1, df2, on='Nom', how='inner')  # Fusion interne (jointure)

```

### 6. GroupBy et agrégation

### a) **Regrouper les données par une colonne**

La méthode **`groupby()`** permet de regrouper les données selon une ou plusieurs colonnes et d'effectuer des calculs d'agrégation.

```python
# Calculer la moyenne d'âge par ville
df_grouped = df.groupby('Ville')['Âge'].mean()
print(df_grouped)

```

### b) **Appliquer plusieurs fonctions d'agrégation**

Tu peux appliquer plusieurs fonctions d'agrégation à la fois (comme la somme, la moyenne, le maximum, etc.).

```python
df_grouped = df.groupby('Ville').agg({'Âge': ['mean', 'sum'], 'Salaire': 'max'})
print(df_grouped)

```

### 7. Trier les données

Pandas permet de trier un DataFrame par une ou plusieurs colonnes avec **`sort_values()`**.

- **Trier par une colonne** :

  ```python
  df_sorted = df.sort_values(by='Âge', ascending=False)  # Trier par âge décroissant

  ```

- **Trier par plusieurs colonnes** :

  ```python
  df_sorted = df.sort_values(by=['Ville', 'Âge'], ascending=[True, False])  # Trier par ville, puis âge décroissant

  ```

### 8. Appliquer des fonctions personnalisées avec `apply()`

La méthode **`apply()`** permet d'appliquer des fonctions personnalisées à des colonnes ou des lignes de DataFrame.

### a) **Appliquer une fonction sur une colonne**

```python
# Appliquer une fonction qui double l'âge
df['Âge'] = df['Âge'].apply(lambda x: x * 2)

```

### b) **Appliquer une fonction sur les lignes**

Si tu veux appliquer une fonction à chaque ligne, utilise l'argument `axis=1`.

```python
# Appliquer une fonction qui combine le nom et la ville pour chaque ligne
df['Nom_Ville'] = df.apply(lambda row: row['Nom'] + ' - ' + row['Ville'], axis=1)

```

### 9. Pivot tables

Une **pivot table** est un outil puissant pour résumer et réorganiser les données dans un DataFrame.

### a) **Créer une pivot table**

```python
pivot = df.pivot_table(values='Salaire', index='Ville', columns='Nom', aggfunc='mean')
print(pivot)

```

### Conclusion : Manipulation des données avec Pandas

En résumé, voici les principales compétences de manipulation des données que tu devrais maîtriser :

- Sélectionner et filtrer des colonnes et des lignes.
- Ajouter, modifier ou supprimer des colonnes et des lignes.
- Gérer les valeurs manquantes.
- Fusionner et concaténer des DataFrames.
- Grouper et agréger les données avec **`groupby()`**.
- Appliquer des fonctions personnalisées avec **`apply()`**.
- Créer et utiliser des tables pivots.

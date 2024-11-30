---

title: Introduction à Pandas
description: Introduction à Pandas

---

### 1. Introduction à Pandas

**Pandas** est une bibliothèque Python utilisée pour la manipulation et l'analyse des données, principalement via ses deux structures de données principales :

- **`Series`** : Une colonne de données.
- **`DataFrame`** : Une table de données à deux dimensions (lignes et colonnes).

Pour installer Pandas :

```bash
pip install pandas

```

Ensuite, importe la bibliothèque :

```python
import pandas as pd

```

### 2. Création de DataFrames

Un **DataFrame** est une structure bidimensionnelle avec des axes (lignes et colonnes). Chaque colonne peut contenir des types de données différents (entiers, chaînes, flottants, etc.).

### a) À partir d’un dictionnaire

La manière la plus simple de créer un DataFrame est d’utiliser un **dictionnaire** où les clés sont les noms des colonnes et les valeurs sont les listes de données correspondantes.

```python
data = {
    'Nom': ['Alice', 'Bob', 'Charlie'],
    'Âge': [25, 30, 35],
    'Ville': ['Paris', 'Lyon', 'Marseille']
}

df = pd.DataFrame(data)
print(df)

```

Cela produira un DataFrame comme ceci :

```
       Nom  Âge      Ville
0    Alice   25      Paris
1      Bob   30       Lyon
2  Charlie   35  Marseille

```

### b) À partir d’une liste de listes

Un autre moyen est d’utiliser une liste de listes et de spécifier les noms de colonnes.

```python
data = [
    ['Alice', 25, 'Paris'],
    ['Bob', 30, 'Lyon'],
    ['Charlie', 35, 'Marseille']
]

df = pd.DataFrame(data, columns=['Nom', 'Âge', 'Ville'])
print(df)

```

### c) À partir d'un fichier CSV

Il est très courant de charger des données à partir d’un fichier CSV. Pandas facilite cette opération.

```python
df = pd.read_csv('chemin_vers_fichier.csv')
print(df.head())  # Affiche les 5 premières lignes

```

### 3. Exploration d’un DataFrame

Une fois le DataFrame créé, voici quelques fonctions couramment utilisées pour l'explorer.

### a) Afficher les premières lignes

Pour voir les premières ou dernières lignes d’un DataFrame :

```python
print(df.head())   # Affiche les 5 premières lignes
print(df.tail(3))  # Affiche les 3 dernières lignes

```

### b) Obtenir des informations générales

Pour obtenir une vue d’ensemble de la structure des données, Pandas propose des méthodes comme :

- **`df.shape`** : Retourne le nombre de lignes et de colonnes.
- **`df.info()`** : Affiche des informations sur le type de données de chaque colonne.
- **`df.describe()`** : Donne des statistiques descriptives pour les colonnes numériques (moyenne, écart-type, etc.).

```python
print(df.shape)      # Affiche (3, 3)
print(df.info())     # Affiche des infos sur le DataFrame
print(df.describe()) # Affiche des stats descriptives des colonnes numériques

```

### 4. Accéder aux données dans un DataFrame

### a) Accès aux colonnes

Tu peux accéder à une colonne d'un DataFrame de différentes manières :

```python
# Accéder à une colonne sous forme de Series
print(df['Nom'])

# Accéder à plusieurs colonnes
print(df[['Nom', 'Ville']])

```

### b) Accès aux lignes

Pour accéder aux lignes d'un DataFrame, tu peux utiliser les méthodes **`loc`** (basé sur les labels) et **`iloc`** (basé sur les indices).

```python
# Accéder à la première ligne avec loc (label basé)
print(df.loc[0])

# Accéder à la première ligne avec iloc (index basé)
print(df.iloc[0])

# Slicing pour plusieurs lignes
print(df.iloc[0:2])  # Lignes de l’indice 0 à 1

```

### c) Filtrage des données

Le filtrage des lignes selon des conditions est très pratique avec Pandas. Utilise des conditions pour filtrer les données.

```python
# Filtrer les lignes où l'âge est supérieur à 28
print(df[df['Âge'] > 28])

# Filtrer les lignes où la ville est Paris
print(df[df['Ville'] == 'Paris'])

```

### 5. Modification des données

### a) Ajouter des colonnes

Tu peux ajouter une nouvelle colonne en assignant des valeurs à celle-ci.

```python
# Ajouter une colonne "Score" avec des valeurs
df['Score'] = [85, 90, 88]
print(df)

```

### b) Supprimer des colonnes ou des lignes

Utilise **`drop()`** pour supprimer des colonnes ou des lignes.

```python
# Supprimer la colonne "Score"
df = df.drop('Score', axis=1)

# Supprimer la ligne à l'index 0
df = df.drop(0, axis=0)

```

### c) Remplacer les valeurs manquantes (NaN)

Les valeurs manquantes sont souvent présentes dans les jeux de données réels. Pandas offre plusieurs méthodes pour gérer ces valeurs.

```python
# Remplacer les NaN par une valeur spécifique
df['Âge'] = df['Âge'].fillna(0)  # Remplacer les NaN par 0

```

### d) Modification en place

Il est souvent nécessaire de modifier les données existantes, par exemple pour mettre à jour les valeurs d’une colonne :

```python
# Ajouter 5 à l'âge de chaque personne
df['Âge'] = df['Âge'] + 5

```

### 6. Opérations sur les données

### a) GroupBy

La méthode **`groupby()`** est utilisée pour grouper les données selon une ou plusieurs colonnes et appliquer des opérations d'agrégation (somme, moyenne, etc.).

```python
# Groupement par "Ville" et moyenne d'âge
grouped = df.groupby('Ville')['Âge'].mean()
print(grouped)

```

### b) Tri

Tu peux trier les données d'un DataFrame avec la méthode **`sort_values()`** :

```python
# Trier par la colonne "Âge"
df_sorted = df.sort_values(by='Âge', ascending=False)
print(df_sorted)

```

### 7. Opérations sur les chaînes de caractères

Pandas permet de manipuler les chaînes de caractères dans les colonnes de type texte via la propriété **`str`**.

```python
# Convertir les noms en majuscules
df['Nom'] = df['Nom'].str.upper()

# Vérifier si les villes contiennent une sous-chaîne
df['Ville_Contient_S'] = df['Ville'].str.contains('s')
print(df)

```

### 8. Opérations avec les dates

Pandas permet également de travailler avec les dates de manière efficace. Il est souvent nécessaire de convertir une colonne en format **datetime** pour effectuer des opérations temporelles.

```python
# Convertir une colonne en type datetime
df['Date'] = pd.to_datetime(df['Date'])

# Extraire l'année
df['Année'] = df['Date'].dt.year

```

### 9. Sauvegarder un DataFrame

Après avoir manipulé et analysé un DataFrame, il est courant de vouloir l'exporter dans un fichier.

### a) Sauvegarder en CSV

```python
df.to_csv('fichier_sortie.csv', index=False)

```

### b) Sauvegarder en Excel

```python
df.to_excel('fichier_sortie.xlsx', index=False)

```

### 10. Conclusion : Apprendre les DataFrames avec Pandas

**Pandas DataFrames** sont des structures extrêmement puissantes pour manipuler des données tabulaires en Python. Leur souplesse et l'énorme gamme de fonctions qu'ils offrent pour l'exploration, la modification, et l'analyse de données en font un outil indispensable pour la science des données, le machine learning, et le traitement de données à grande échelle.

### Points clés à retenir :

- **Création et exploration des DataFrames** : Manipuler des données sous forme de tableaux à deux dimensions.
- **Accès aux données** : Utilisation des méthodes `loc` et `iloc` pour accéder aux lignes et colonnes.
- **Filtrage, tri et agrégation** : Application d'opérations pour nettoyer et transformer les données.
- **Manipulation de chaînes et dates** : Outils intégrés pour gérer efficacement les données textuelles et temporelles.

En maîtrisant les **DataFrames**, tu auras les bases solides pour aborder l’analyse de données avancée et travailler sur des projets de machine learning ou des études statistiques.

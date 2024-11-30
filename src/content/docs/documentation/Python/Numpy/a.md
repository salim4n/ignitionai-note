---
title: Introduction à Numpy
description: Introduction à Numpy
---

### 1. Introduction à NumPy

**NumPy** (Numerical Python) est une bibliothèque qui permet de manipuler des **tableaux multidimensionnels** (arrays) et fournit une grande variété de **fonctions mathématiques** pour effectuer des calculs efficaces sur ces tableaux. NumPy est largement utilisé en science des données, machine learning, et dans d'autres domaines où des calculs numériques rapides et optimisés sont nécessaires.

### 2. Installation de NumPy

Pour commencer, il faut installer la bibliothèque NumPy si ce n’est pas déjà fait :

```bash
pip install numpy

```

Ensuite, dans tes scripts Python, importe NumPy :

```python
import numpy as np

```

### 3. Les tableaux NumPy (ndarray)

Le cœur de NumPy est son objet **ndarray**, qui représente des **tableaux multidimensionnels** d'éléments du même type. Contrairement aux listes Python, les tableaux NumPy sont plus rapides et consomment moins de mémoire.

### a) Créer des tableaux NumPy

Il existe plusieurs façons de créer un tableau NumPy :

1. **À partir de listes ou tuples** :

   ```python
   # Créer un tableau 1D
   arr = np.array([1, 2, 3, 4])
   print(arr)  # Affiche : [1 2 3 4]

   # Créer un tableau 2D
   arr_2d = np.array([[1, 2], [3, 4]])
   print(arr_2d)  # Affiche : [[1 2] [3 4]]

   ```

2. **Avec des fonctions NumPy** :

   - **`np.zeros()`** : Créer un tableau rempli de zéros.
   - **`np.ones()`** : Créer un tableau rempli de uns.
   - **`np.arange()`** : Créer un tableau avec une séquence d'entiers.
   - **`np.linspace()`** : Créer un tableau avec des valeurs espacées de manière égale sur un intervalle.

   Exemple :

   ```python
   arr_zeros = np.zeros((2, 3))  # Tableau 2x3 rempli de zéros
   arr_range = np.arange(0, 10, 2)  # Tableau avec une séquence de 0 à 10 (pas de 2)

   ```

### b) Les attributs importants d’un tableau NumPy

Voici quelques attributs utiles pour explorer un tableau NumPy :

- **`ndarray.shape`** : Retourne les dimensions du tableau (ex. : `(2, 3)` pour un tableau 2x3).
- **`ndarray.size`** : Nombre total d’éléments dans le tableau.
- **`ndarray.ndim`** : Retourne le nombre de dimensions du tableau (1D, 2D, etc.).
- **`ndarray.dtype`** : Type des éléments du tableau.

Exemple :

```python
arr = np.array([[1, 2, 3], [4, 5, 6]])
print(arr.shape)  # Affiche : (2, 3)
print(arr.size)   # Affiche : 6
print(arr.ndim)   # Affiche : 2 (dimensions)
print(arr.dtype)  # Affiche : int64 (type des éléments)

```

### 4. Manipulation des tableaux NumPy

### a) Accès aux éléments

L'accès aux éléments d'un tableau NumPy fonctionne de manière similaire à l'accès aux éléments dans une liste Python, mais avec une syntaxe plus puissante pour les tableaux multidimensionnels.

Exemple :

```python
arr = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])

# Accéder à un élément spécifique
print(arr[0, 1])  # Affiche 2 (élément à la première ligne, deuxième colonne)

# Slicing (extraire une sous-partie)
sub_arr = arr[1:, :2]  # Extrait les lignes à partir de l’indice 1 et les deux premières colonnes
print(sub_arr)  # Affiche : [[4 5], [7 8]]

```

### b) Modification des tableaux

Les tableaux NumPy peuvent être modifiés en modifiant directement les éléments via leurs indices ou en utilisant des fonctions.

```python
arr[0, 0] = 100  # Modifier l'élément en (0,0)
print(arr)  # Affiche : [[100 2 3], [4 5 6], [7 8 9]]

```

### c) Opérations arithmétiques

NumPy permet de réaliser des **opérations arithmétiques vectorisées** sur des tableaux de manière élément par élément (élément-wise) :

- **Addition, soustraction, multiplication, division** :

  ```python
  arr = np.array([1, 2, 3])
  print(arr + 10)  # Affiche : [11 12 13]
  print(arr * 2)   # Affiche : [2 4 6]

  ```

- **Addition et multiplication de tableaux** :
  Si les tableaux ont les mêmes dimensions, les opérations sont effectuées élément par élément :
  ```python
  arr1 = np.array([1, 2, 3])
  arr2 = np.array([4, 5, 6])
  print(arr1 + arr2) # Affiche : [5 7 9]
  print(arr1 \* arr2) # Affiche : [4 10 18]

      ```

### d) Fonctions universelles (ufunc)

NumPy propose une large gamme de **fonctions universelles** pour appliquer des opérations mathématiques sur les tableaux.

- **`np.sqrt()`** : Racine carrée
- **`np.exp()`** : Exponentielle
- **`np.log()`** : Logarithme naturel
- **`np.mean()`** : Moyenne
- **`np.sum()`** : Somme des éléments

Exemple :

```python
arr = np.array([1, 4, 9, 16])
sqrt_arr = np.sqrt(arr)  # Racine carrée de chaque élément
print(sqrt_arr)  # Affiche : [1. 2. 3. 4.]

```

### 5. Reshape et Broadcasting

### a) Reshape

La méthode **`reshape()`** permet de changer la forme (dimensions) d’un tableau sans en modifier les données.

Exemple :

```python
arr = np.arange(6)  # Tableau de 0 à 5
arr_reshaped = arr.reshape((2, 3))  # Reshape en tableau 2x3
print(arr_reshaped)  # Affiche : [[0 1 2], [3 4 5]]

```

### b) Broadcasting

Le **broadcasting** permet à NumPy d’effectuer des opérations entre des tableaux de différentes formes en étendant automatiquement leurs dimensions pour qu’ils correspondent.

Exemple :

```python
arr1 = np.array([1, 2, 3])
arr2 = np.array([[1], [2], [3]])  # Tableau 3x1
result = arr1 + arr2
print(result)  # Affiche : [[2 3 4], [3 4 5], [4 5 6]]

```

### 6. Statistiques avec NumPy

NumPy offre de nombreuses fonctions pour des calculs statistiques rapides :

- **`np.mean()`** : Moyenne
- **`np.median()`** : Médiane
- **`np.std()`** : Écart-type
- **`np.min()` et `np.max()`** : Minimum et maximum
- **`np.sum()`** : Somme des éléments
- **`np.cumsum()`** : Somme cumulée

Exemple :

```python
arr = np.array([1, 2, 3, 4, 5])
print(np.mean(arr))  # Affiche : 3.0
print(np.std(arr))   # Affiche : 1.4142135623730951 (écart-type)

```

### 7. Conclusion : Apprendre NumPy

NumPy est une bibliothèque incontournable pour le calcul numérique. En apprenant à manipuler ses tableaux et à utiliser ses fonctions, tu peux travailler avec des **données volumineuses**, optimiser des calculs mathématiques, et préparer des pipelines pour le machine learning, l’analyse de données, ou la modélisation scientifique.

### Résumé des concepts clés :

- **Tableaux NumPy** : Création, manipulation, et exploration.
- **Opérations arithmétiques** : Element-wise et vectorisées.
- **Fonctions universelles** : Calculs mathématiques optimisés.
- **Reshape et Broadcasting** : Manipulation flexible des dimensions.
- **Statistiques** : Outils statistiques intégrés.

---
title: Manipulation des tableaux NumPy
description: Manipulation des tableaux NumPy
---

### 1. Création et manipulation de tableaux NumPy

### a) **Créer des tableaux NumPy**

La bibliothèque NumPy offre plusieurs fonctions pour créer des tableaux :

- **À partir d'une liste** :

  ```python
  import numpy as np

  arr = np.array([1, 2, 3, 4])
  print(arr)

  ```

- **Tableau de zéros ou de uns** :

  ```python
  zeros_array = np.zeros((2, 3))  # Tableau 2x3 de zéros
  ones_array = np.ones((2, 3))    # Tableau 2x3 de uns

  ```

- **Tableau avec une plage de valeurs (comme `range()` en Python)** :

  ```python
  arr_range = np.arange(0, 10, 2)  # De 0 à 10 avec un pas de 2
  print(arr_range)

  ```

- **Tableau avec des valeurs aléatoires** :

  ```python
  random_array = np.random.rand(3, 3)  # Tableau 3x3 avec des valeurs aléatoires entre 0 et 1

  ```

- **Tableau avec des valeurs espacées linéairement** :

  ```python
  linspace_array = np.linspace(0, 1, 5)  # 5 valeurs entre 0 et 1

  ```

### b) **Dimensions d'un tableau**

- **Vérifier la forme (shape)** :

  ```python
  print(arr.shape)  # Retourne un tuple des dimensions du tableau

  ```

- **Modifier la forme (reshape)** :

  ```python
  reshaped_array = arr.reshape(2, 2)  # Change la forme en un tableau 2x2

  ```

### c) **Accès aux éléments (indexation)**

- **Accéder à un élément** :

  ```python
  print(arr[0])  # Premier élément

  ```

- **Accéder à une sous-partie (slicing)** :

  ```python
  print(arr[1:3])  # Éléments de l'index 1 à 2

  ```

- **Accéder aux éléments d'un tableau multidimensionnel** :

  ```python
  matrix = np.array([[1, 2], [3, 4], [5, 6]])
  print(matrix[0, 1])  # Accéder à l'élément à la première ligne, deuxième colonne

  ```

### d) **Modification d'éléments**

Tu peux modifier les valeurs d'un tableau de manière similaire à l'indexation.

```python
arr[0] = 10  # Modifier la première valeur

```

### 2. Opérations arithmétiques sur des tableaux

NumPy permet d'effectuer des opérations arithmétiques élémentaires directement sur les tableaux, de manière très efficace, sans boucles explicites.

### a) **Opérations de base sur les tableaux**

- **Addition, soustraction, multiplication, division** :

  ```python
  arr1 = np.array([1, 2, 3])
  arr2 = np.array([4, 5, 6])

  print(arr1 + arr2)  # Additionne les éléments
  print(arr1 - arr2)  # Soustraction
  print(arr1 * arr2)  # Multiplication élément par élément
  print(arr1 / arr2)  # Division élément par élément

  ```

- **Opérations scalaires** :
  Tu peux effectuer des opérations avec des scalaires (un seul nombre appliqué à tout le tableau).
  ```python
  print(arr1 \* 2) # Multiplie chaque élément par 2

      ```

### b) **Fonctions universelles (ufuncs)**

NumPy propose des fonctions mathématiques appliquées élément par élément à tout un tableau.

- **Fonctions mathématiques courantes** :

  ```python
  arr = np.array([1, 2, 3])

  print(np.sqrt(arr))  # Racine carrée
  print(np.exp(arr))   # Exponentielle
  print(np.log(arr))   # Logarithme

  ```

- **Somme, produit, minimum, maximum** :

  ```python
  print(np.sum(arr))    # Somme des éléments
  print(np.prod(arr))   # Produit des éléments
  print(np.min(arr))    # Minimum
  print(np.max(arr))    # Maximum

  ```

### 3. Filtrage et sélection conditionnelle

NumPy permet également de filtrer les éléments d'un tableau en fonction de conditions.

### a) **Sélection par conditions**

Tu peux filtrer un tableau en appliquant des conditions logiques.

- **Sélection d'éléments selon une condition** :

  ```python
  arr = np.array([1, 2, 3, 4, 5])
  filtered_arr = arr[arr > 3]  # Sélectionne les éléments supérieurs à 3
  print(filtered_arr)

  ```

- **Modifier les valeurs basées sur une condition** :

  ```python
  arr[arr < 3] = 0  # Mettre à 0 les éléments inférieurs à 3

  ```

### b) **Opérateurs logiques combinés**

Tu peux utiliser plusieurs conditions avec des opérateurs logiques.

```python
arr = np.array([1, 2, 3, 4, 5])
filtered_arr = arr[(arr > 2) & (arr < 5)]  # Sélectionne les éléments entre 2 et 5
print(filtered_arr)

```

### 4. Agrégation et statistiques

NumPy propose des fonctions d'agrégation et de statistiques pour résumer les données dans un tableau.

### a) **Fonctions statistiques de base**

- **Moyenne, variance, écart-type** :

  ```python
  print(np.mean(arr))   # Moyenne
  print(np.var(arr))    # Variance
  print(np.std(arr))    # Écart-type

  ```

- **Médiane, quartiles** :

  ```python
  print(np.median(arr))  # Médiane
  print(np.percentile(arr, 25))  # Premier quartile

  ```

### b) **Somme cumulative et produit cumulatif**

Les sommes et produits cumulatifs permettent de calculer les sommes/produits successifs le long d'un axe.

```python
arr = np.array([1, 2, 3, 4])
print(np.cumsum(arr))  # Somme cumulative
print(np.cumprod(arr))  # Produit cumulatif

```

### 5. Manipulation des tableaux (réorganisation et combinaison)

### a) **Changer la forme d'un tableau**

- **Reshape** :
  Tu peux modifier la forme d'un tableau sans changer ses données.
  ```python
  arr = np.array([1, 2, 3, 4, 5, 6])
  reshaped_arr = arr.reshape(2, 3) # Tableau 2x3
  print(reshaped_arr)

      ```

### b) **Fusionner des tableaux (concatenation)**

- **Concaténation le long d'un axe** :
  Tu peux combiner des tableaux ensemble.
  ```python
  arr1 = np.array([[1, 2], [3, 4]])
  arr2 = np.array([[5, 6]])

      # Concaténer verticalement (axis=0)
      combined_arr = np.concatenate((arr1, arr2), axis=0)
      print(combined_arr)

      ```

- **Empiler des tableaux verticalement ou horizontalement** :

  ```python
  # Empiler verticalement
  stacked_vertically = np.vstack((arr1, arr2))
  print(stacked_vertically)

  # Empiler horizontalement
  stacked_horizontally = np.hstack((arr1, arr2.T))  # Remarque: arr2 doit être transposé pour s'aligner
  print(stacked_horizontally)

  ```

### c) **Transposer des tableaux**

La transposition change l'orientation des axes d'un tableau, utile pour les opérations matricielles.

```python
arr = np.array([[1, 2], [3, 4]])
transposed_arr = arr.T  # Transpose le tableau
print(transposed_arr)

```

### 6. Copies et vues

Il est important de comprendre la différence entre une **copie** et une **vue** d'un tableau en NumPy.

### a) **Vue (view)** :

Une vue est une nouvelle référence à un tableau original. Les modifications apportées à une vue affectent l'original.

```python
arr = np.array([1, 2, 3])
view_arr = arr[0:2]
view_arr[0] = 100
print(arr)  # L'original est modifié

```

### b) **Copie (copy)** :

Une copie crée un nouvel objet indépendant. Les modifications apportées à la copie n'affectent pas l'original.

```python
copy_arr = arr.copy()
copy_arr[0] = 999
print(arr)  # L'

original n'est pas modifié

```

### Conclusion : Opérations courantes sur les tableaux NumPy

- Créer, indexer et manipuler des tableaux.
- Effectuer des opérations arithmétiques et appliquer des fonctions mathématiques.
- Filtrer les tableaux en fonction de conditions logiques.
- Résumer les données avec des fonctions d'agrégation.
- Modifier la forme et combiner des tableaux.

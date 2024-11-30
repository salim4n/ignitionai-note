---
title : Créer des objets tensoriels
description : Créer des objets tensoriels
---

TensorFlow fournit une variété de fonctions pour créer des objets tensoriels, qui sont des structures de données multidimensionnelles utilisées pour stocker et manipuler des données dans les calculs de machine learning. Voici quelques-unes des fonctions les plus couramment utilisées pour créer des objets tensoriels :

[basic-tensors.ipynb](https://prod-files-secure.s3.us-west-2.amazonaws.com/11b5a9db-0d61-41fc-9598-c7c6b5db565c/115a8851-90a6-4fbe-94db-fa8efae53ffd/C2_W1_Lab_1_basic-tensors.ipynb)

### 1. `tf.constant`

Cette fonction crée un tenseur constant à partir d'une valeur donnée.

```python
import tensorflow as tf

# Créer un tenseur constant
tensor_constant = tf.constant([1, 2, 3, 4, 5])
print(tensor_constant)

```

### 2. `tf.Variable`

Cette fonction crée un tenseur variable, qui peut être modifié pendant l'entraînement.

```python
# Créer un tenseur variable
tensor_variable = tf.Variable([1, 2, 3, 4, 5])
print(tensor_variable)

```

### 3. `tf.zeros`

Cette fonction crée un tenseur rempli de zéros.

```python
# Créer un tenseur rempli de zéros
tensor_zeros = tf.zeros([3, 3])
print(tensor_zeros)

```

### 4. `tf.ones`

Cette fonction crée un tenseur rempli de uns.

```python
# Créer un tenseur rempli de uns
tensor_ones = tf.ones([3, 3])
print(tensor_ones)

```

### 5. `tf.fill`

Cette fonction crée un tenseur rempli d'une valeur spécifiée.

```python
# Créer un tenseur rempli d'une valeur spécifiée
tensor_fill = tf.fill([3, 3], 7)
print(tensor_fill)

```

### 6. `tf.random.normal`

Cette fonction crée un tenseur rempli de valeurs tirées d'une distribution normale.

```python
# Créer un tenseur rempli de valeurs tirées d'une distribution normale
tensor_normal = tf.random.normal([3, 3])
print(tensor_normal)

```

### 7. `tf.random.uniform`

Cette fonction crée un tenseur rempli de valeurs tirées d'une distribution uniforme.

```python
# Créer un tenseur rempli de valeurs tirées d'une distribution uniforme
tensor_uniform = tf.random.uniform([3, 3])
print(tensor_uniform)

```

### 8. `tf.eye`

Cette fonction crée une matrice identité.

```python
# Créer une matrice identité
tensor_eye = tf.eye(3)
print(tensor_eye)

```

### 9. `tf.range`

Cette fonction crée un tenseur contenant une séquence de nombres.

```python
# Créer un tenseur contenant une séquence de nombres
tensor_range = tf.range(10)
print(tensor_range)

```

### 10. `tf.linspace`

Cette fonction crée un tenseur contenant une séquence de nombres uniformément espacés.

```python
# Créer un tenseur contenant une séquence de nombres uniformément espacés
tensor_linspace = tf.linspace(0.0, 1.0, 10)
print(tensor_linspace)

```

### 11. `tf.concat`

Cette fonction concatène une liste de tenseurs le long d'une dimension spécifiée.

```python
# Créer des tenseurs à concaténer
tensor_a = tf.constant([1, 2, 3])
tensor_b = tf.constant([4, 5, 6])

# Concaténer les tenseurs
tensor_concat = tf.concat([tensor_a, tensor_b], axis=0)
print(tensor_concat)

```

### 12. `tf.stack`

Cette fonction empile une liste de tenseurs le long d'une nouvelle dimension.

```python
# Créer des tenseurs à empiler
tensor_a = tf.constant([1, 2, 3])
tensor_b = tf.constant([4, 5, 6])

# Empiler les tenseurs
tensor_stack = tf.stack([tensor_a, tensor_b], axis=0)
print(tensor_stack)

```

### Exemple complet

Voici un exemple complet montrant comment utiliser certaines de ces fonctions pour créer des objets tensoriels :

```python
import tensorflow as tf

# Créer un tenseur constant
tensor_constant = tf.constant([1, 2, 3, 4, 5])
print("Tensor constant:", tensor_constant)

# Créer un tenseur variable
tensor_variable = tf.Variable([1, 2, 3, 4, 5])
print("Tensor variable:", tensor_variable)

# Créer un tenseur rempli de zéros
tensor_zeros = tf.zeros([3, 3])
print("Tensor zeros:", tensor_zeros)

# Créer un tenseur rempli de uns
tensor_ones = tf.ones([3, 3])
print("Tensor ones:", tensor_ones)

# Créer un tenseur rempli d'une valeur spécifiée
tensor_fill = tf.fill([3, 3], 7)
print("Tensor fill:", tensor_fill)

# Créer un tenseur rempli de valeurs tirées d'une distribution normale
tensor_normal = tf.random.normal([3, 3])
print("Tensor normal:", tensor_normal)

# Créer un tenseur rempli de valeurs tirées d'une distribution uniforme
tensor_uniform = tf.random.uniform([3, 3])
print("Tensor uniform:", tensor_uniform)

# Créer une matrice identité
tensor_eye = tf.eye(3)
print("Tensor eye:", tensor_eye)

# Créer un tenseur contenant une séquence de nombres
tensor_range = tf.range(10)
print("Tensor range:", tensor_range)

# Créer un tenseur contenant une séquence de nombres uniformément espacés
tensor_linspace = tf.linspace(0.0, 1.0, 10)
print("Tensor linspace:", tensor_linspace)

# Créer des tenseurs à concaténer
tensor_a = tf.constant([1, 2, 3])
tensor_b = tf.constant([4, 5, 6])

# Concaténer les tenseurs
tensor_concat = tf.concat([tensor_a, tensor_b], axis=0)
print("Tensor concat:", tensor_concat)

# Créer des tenseurs à empiler
tensor_a = tf.constant([1, 2, 3])
tensor_b = tf.constant([4, 5, 6])

# Empiler les tenseurs
tensor_stack = tf.stack([tensor_a, tensor_b], axis=0)
print("Tensor stack:", tensor_stack)

```

Ces fonctions permettent de créer et de manipuler des objets tensoriels de manière flexible et efficace, ce qui est essentiel pour les calculs de machine learning et les opérations de traitement de données.
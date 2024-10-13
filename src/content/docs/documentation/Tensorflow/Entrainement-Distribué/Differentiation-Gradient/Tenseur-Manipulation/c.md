---
title: Évaluation des variables et modification des types de données
description: Évaluation des variables et modification des types de données
---

L'évaluation des variables et la modification des types de données sont des opérations courantes dans le développement de modèles de machine learning et dans la manipulation de données en général. Voici comment vous pouvez effectuer ces opérations en utilisant TensorFlow et NumPy.

### Évaluation des variables

En TensorFlow, vous pouvez évaluer des variables en utilisant la méthode `.numpy()` pour convertir un tenseur en un tableau NumPy, ou en utilisant `tf.Session` dans le mode basé sur les graphes.

```python
import tensorflow as tf

# Créer une variable TensorFlow
variable = tf.Variable([1, 2, 3, 4, 5])

# Évaluer la variable en mode d'exécution immédiate
print(variable.numpy())  # Output: [1 2 3 4 5]

# En mode basé sur les graphes (TensorFlow 1.x)
# with tf.Session() as sess:
#     sess.run(tf.global_variables_initializer())
#     print(sess.run(variable))  # Output: [1 2 3 4 5]

```

### En utilisant NumPy

En NumPy, les variables sont généralement des tableaux NumPy, et vous pouvez les évaluer directement.

```python
import numpy as np

# Créer un tableau NumPy
array = np.array([1, 2, 3, 4, 5])

# Évaluer le tableau
print(array)  # Output: [1 2 3 4 5]

```

### Modification des types de données

### En utilisant TensorFlow

Vous pouvez modifier le type de données d'un tenseur TensorFlow en utilisant la méthode `tf.cast`.

```python
import tensorflow as tf

# Créer un tenseur TensorFlow
tensor = tf.constant([1, 2, 3, 4, 5], dtype=tf.int32)

# Modifier le type de données du tenseur
tensor_float = tf.cast(tensor, dtype=tf.float32)
print(tensor_float)  # Output: tf.Tensor([1. 2. 3. 4. 5.], shape=(5,), dtype=float32)

```

### En utilisant NumPy

Vous pouvez modifier le type de données d'un tableau NumPy en utilisant la méthode `.astype`.

```python
import numpy as np

# Créer un tableau NumPy
array = np.array([1, 2, 3, 4, 5], dtype=np.int32)

# Modifier le type de données du tableau
array_float = array.astype(np.float32)
print(array_float)  # Output: [1. 2. 3. 4. 5.]

```

### Exemple complet

Voici un exemple complet montrant comment évaluer des variables et modifier les types de données en utilisant TensorFlow et NumPy.

```python
import tensorflow as tf
import numpy as np

# Évaluation des variables en utilisant TensorFlow
variable = tf.Variable([1, 2, 3, 4, 5])
print("TensorFlow variable:", variable.numpy())  # Output: [1 2 3 4 5]

# Modification des types de données en utilisant TensorFlow
tensor = tf.constant([1, 2, 3, 4, 5], dtype=tf.int32)
tensor_float = tf.cast(tensor, dtype=tf.float32)
print("TensorFlow tensor (float):", tensor_float)  # Output: tf.Tensor([1. 2. 3. 4. 5.], shape=(5,), dtype=float32)

# Évaluation des variables en utilisant NumPy
array = np.array([1, 2, 3, 4, 5])
print("NumPy array:", array)  # Output: [1 2 3 4 5]

# Modification des types de données en utilisant NumPy
array_float = array.astype(np.float32)
print("NumPy array (float):", array_float)  # Output: [1. 2. 3. 4. 5.]

```

### Conclusion

L'évaluation des variables et la modification des types de données sont des opérations courantes et essentielles dans le développement de modèles de machine learning et dans la manipulation de données. En utilisant TensorFlow et NumPy, vous pouvez facilement évaluer des variables et modifier les types de données pour répondre aux besoins spécifiques de vos applications.
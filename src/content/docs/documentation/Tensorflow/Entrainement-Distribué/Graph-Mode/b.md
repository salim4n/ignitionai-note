---
title : Utilisation de décorateurs et de tf.autograph
description : Utilisation de décorateurs et de tf.autograph
---

L'utilisation de décorateurs et de `tf.autograph` permet de convertir facilement du code en mode eager en code basé sur des graphes dans TensorFlow. Cela peut être particulièrement utile pour tirer parti des optimisations de performance offertes par le mode graphique tout en conservant la simplicité et la lisibilité du mode eager.

### Introduction à `tf.function`

Le décorateur `tf.function` est une fonctionnalité clé de TensorFlow qui permet de convertir une fonction Python en un graphe de calcul TensorFlow. Cela permet d'optimiser et de paralléliser les opérations, tout en conservant la simplicité du code en mode eager.

### Utilisation de `tf.function`

Voici un exemple de l'utilisation de `tf.function` pour convertir une fonction en mode eager en une fonction basée sur des graphes :

```python
import tensorflow as tf

# Définir une fonction en mode eager
def eager_function(x, y):
    return tf.matmul(x, y)

# Convertir la fonction en mode eager en une fonction basée sur des graphes
@tf.function
def graph_function(x, y):
    return tf.matmul(x, y)

# Exécuter la fonction en mode eager
x = tf.constant([[1.0, 2.0], [3.0, 4.0]])
y = tf.constant([[5.0, 6.0], [7.0, 8.0]])
result_eager = eager_function(x, y)
print("Eager mode result:", result_eager)

# Exécuter la fonction basée sur des graphes
result_graph = graph_function(x, y)
print("Graph mode result:", result_graph)

```

### Utilisation de `tf.autograph`

`tf.autograph` est une bibliothèque qui convertit automatiquement le code Python en code TensorFlow compatible avec les graphes. Elle est utilisée sous le capot par `tf.function`, mais vous pouvez également l'utiliser directement pour des cas plus avancés.

### Exemple complet

Voici un exemple complet montrant comment utiliser `tf.function` pour convertir une fonction en mode eager en une fonction basée sur des graphes, et comment utiliser `tf.autograph` pour des cas plus avancés :

```python
import tensorflow as tf

# Définir une fonction en mode eager
def eager_function(x, y):
    return tf.matmul(x, y)

# Convertir la fonction en mode eager en une fonction basée sur des graphes
@tf.function
def graph_function(x, y):
    return tf.matmul(x, y)

# Exécuter la fonction en mode eager
x = tf.constant([[1.0, 2.0], [3.0, 4.0]])
y = tf.constant([[5.0, 6.0], [7.0, 8.0]])
result_eager = eager_function(x, y)
print("Eager mode result:", result_eager)

# Exécuter la fonction basée sur des graphes
result_graph = graph_function(x, y)
print("Graph mode result:", result_graph)

# Utilisation de tf.autograph pour des cas plus avancés
from tensorflow.python.autograph.core import converter

def advanced_function(x, y):
    result = tf.zeros_like(x)
    for i in range(x.shape[0]):
        result = result + tf.matmul(x[i:i+1], y[i:i+1])
    return result

# Convertir la fonction avancée en une fonction basée sur des graphes
advanced_graph_function = converter.convert(advanced_function)

# Exécuter la fonction avancée basée sur des graphes
result_advanced_graph = advanced_graph_function(x, y)
print("Advanced graph mode result:", result_advanced_graph)

```

### Conclusion

L'utilisation de décorateurs comme `tf.function` et de `tf.autograph` permet de convertir facilement du code en mode eager en code basé sur des graphes. Cela permet de tirer parti des optimisations de performance offertes par le mode graphique tout en conservant la simplicité et la lisibilité du mode eager. Utilisez `tf.function` pour les cas courants et `tf.autograph` pour les cas plus avancés.
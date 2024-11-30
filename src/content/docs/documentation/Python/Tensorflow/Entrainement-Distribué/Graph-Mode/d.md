---
title: Utilisation du mode graphique
description: Utilisation du mode graphique
---

La génération de code basé sur des graphes dans TensorFlow permet de définir et d'exécuter des graphes de calcul, ce qui offre des avantages significatifs en termes de performance, d'optimisation, de portabilité et de déploiement. Dans ce tutoriel, nous allons explorer comment générer du code basé sur des graphes en utilisant TensorFlow, en mettant l'accent sur l'utilisation de décorateurs comme `tf.function` et des outils comme `tf.autograph`.

## Introduction

### Mode Eager vs Mode Graphique

Le mode eager est le mode par défaut dans TensorFlow 2.x, où les opérations sont exécutées immédiatement lorsqu'elles sont appelées. Le mode graphique, en revanche, permet de définir un graphe de calcul complet avant de l'exécuter. Cela offre des optimisations de performance et des fonctionnalités avancées pour le déploiement et la distribution des calculs.

## Génération de code basé sur des graphes

### Utilisation de `tf.function`

Le décorateur `tf.function` est une fonctionnalité clé de TensorFlow qui permet de convertir une fonction Python en un graphe de calcul TensorFlow. Cela permet d'optimiser et de paralléliser les opérations tout en conservant la simplicité et la lisibilité du code en mode eager.

### Exemple de base

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

### Exemple avancé

```python
import tensorflow as tf
from tensorflow.python.autograph.core import converter

# Définir une fonction avancée en mode eager
def advanced_function(x, y):
    result = tf.zeros_like(x)
    for i in range(x.shape[0]):
        result = result + tf.matmul(x[i:i+1], y[i:i+1])
    return result

# Convertir la fonction avancée en une fonction basée sur des graphes
advanced_graph_function = converter.convert(advanced_function)

# Exécuter la fonction avancée basée sur des graphes
x = tf.constant([[1.0, 2.0], [3.0, 4.0]])
y = tf.constant([[5.0, 6.0], [7.0, 8.0]])
result_advanced_graph = advanced_graph_function(x, y)
print("Advanced graph mode result:", result_advanced_graph)

```

## Avantages du mode graphique

### 1. Optimisation des performances

Le mode graphique permet à TensorFlow d'analyser le graphe de calcul complet et d'appliquer des optimisations telles que la fusion d'opérations, l'élimination des opérations redondantes, et la parallélisation des opérations.

### 2. Portabilité et déploiement

Le mode graphique facilite l'exportation et le déploiement de modèles. Les graphes de calcul peuvent être enregistrés et exécutés dans des environnements de production sans nécessiter de code Python.

```python
# Sauvegarder le modèle en mode graphique
model.save('my_model.h5')

# Charger le modèle en mode graphique
loaded_model = tf.keras.models.load_model('my_model.h5')

```

### 3. Parallélisation et distribution

Le mode graphique est mieux adapté pour la parallélisation et la distribution des calculs sur plusieurs dispositifs (CPU, GPU, TPU). TensorFlow peut automatiquement répartir les opérations sur les dispositifs disponibles pour maximiser les performances.

```python
# Définir un graphe de calcul pour la distribution
@tf.function
def distributed_function(x, y):
    return tf.matmul(x, y)

# Exécuter le graphe sur plusieurs dispositifs
strategy = tf.distribute.MirroredStrategy()
with strategy.scope():
    x = tf.constant([[1.0, 2.0], [3.0, 4.0]])
    y = tf.constant([[5.0, 6.0], [7.0, 8.0]])
    result = distributed_function(x, y)
    print(result)

```

## Conclusion

La génération de code basé sur des graphes avec TensorFlow offre de nombreux avantages en termes de performance, d'optimisation, de portabilité et de déploiement. Utilisez le décorateur `tf.function` pour convertir facilement du code en mode eager en code basé sur des graphes, et utilisez `tf.autograph` pour des cas plus avancés nécessitant une conversion manuelle. Le mode graphique est particulièrement utile pour les applications de production et les environnements nécessitant des performances optimales.
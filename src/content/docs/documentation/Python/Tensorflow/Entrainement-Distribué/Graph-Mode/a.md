---
title : Modes d'exécution
description : Modes d'exécution
---

[Google Colab](https://colab.research.google.com/github/https-deeplearning-ai/tensorflow-3-public/blob/main/Course%202%20-%20Custom%20Training%20loops%2C%20Gradients%20and%20Distributed%20Training/Week%203%20-%20Autograph/C2_W3_Lab_2-graphs-for-complex-code.ipynb)

TensorFlow offre deux modes principaux pour exécuter des calculs : le mode graphique (Graph Mode) et le mode eager (Eager Mode). Chacun de ces modes a ses propres avantages et inconvénients, et le choix entre les deux dépend de vos besoins spécifiques. Dans ce tutoriel, nous allons explorer quand il est préférable d'utiliser le mode graphique par rapport au mode eager.

## Introduction

### Mode Eager

Le mode eager est le mode par défaut dans TensorFlow 2.x. Il permet d'exécuter les opérations TensorFlow de manière impérative, ce qui signifie que les opérations sont exécutées immédiatement lorsqu'elles sont appelées. Cela rend le code plus intuitif et plus facile à déboguer.

### Mode Graphique

Le mode graphique, utilisé principalement dans TensorFlow 1.x, permet de définir un graphe de calcul avant de l'exécuter. Ce graphe peut être optimisé pour des performances accrues et peut être exécuté sur différents dispositifs (CPU, GPU, TPU).

## Quand utiliser le mode graphique ?

### 1. Optimisation des performances

Le mode graphique permet des optimisations de performance plus avancées. TensorFlow peut analyser le graphe de calcul complet et appliquer des optimisations telles que la fusion d'opérations, l'élimination des opérations redondantes, et la parallélisation des opérations.

```python
import tensorflow as tf

# Définir un graphe de calcul
@tf.function
def graph_mode_function(x, y):
    return tf.matmul(x, y)

# Exécuter le graphe
x = tf.constant([[1.0, 2.0], [3.0, 4.0]])
y = tf.constant([[5.0, 6.0], [7.0, 8.0]])
result = graph_mode_function(x, y)
print(result)

```

### 2. Exportation et déploiement de modèles

Le mode graphique est souvent préféré pour l'exportation et le déploiement de modèles. Les graphes de calcul peuvent être enregistrés et exécutés dans des environnements de production sans nécessiter de code Python. Cela est particulièrement utile pour les applications mobiles et les services en ligne.

```python
# Sauvegarder le modèle en mode graphique
model.save('my_model.h5')

# Charger le modèle en mode graphique
loaded_model = tf.keras.models.load_model('my_model.h5')

```

### 3. Parallélisation et distribution

Le mode graphique est mieux adapté pour la parallélisation et la distribution des calculs sur plusieurs dispositifs. TensorFlow peut automatiquement répartir les opérations sur plusieurs CPU, GPU, ou TPU pour maximiser les performances.

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

## Quand utiliser le mode eager ?

### 1. Débogage et développement

Le mode eager est plus intuitif et plus facile à déboguer. Les opérations sont exécutées immédiatement, ce qui permet de voir les résultats intermédiaires et de déboguer plus facilement.

```python
# Mode eager pour le débogage
x = tf.constant([[1.0, 2.0], [3.0, 4.0]])
y = tf.constant([[5.0, 6.0], [7.0, 8.0]])
result = tf.matmul(x, y)
print(result)

```

### 2. Prototypage rapide

Le mode eager est idéal pour le prototypage rapide et l'expérimentation. Vous pouvez écrire du code TensorFlow comme vous écririez du code Python standard, ce qui facilite l'itération rapide et les tests.

```python
# Prototypage rapide en mode eager
x = tf.random.normal([2, 2])
y = tf.random.normal([2, 2])
result = tf.matmul(x, y)
print(result)

```

### 3. Utilisation de boucles et de conditions

Le mode eager permet d'utiliser des boucles et des conditions de manière plus naturelle, ce qui peut être plus difficile à gérer en mode graphique.

```python
# Utilisation de boucles en mode eager
x = tf.constant([[1.0, 2.0], [3.0, 4.0]])
y = tf.constant([[5.0, 6.0], [7.0, 8.0]])
result = tf.zeros_like(x)
for i in range(x.shape[0]):
    result = result + tf.matmul(x[i:i+1], y[i:i+1])
print(result)

```

## Conclusion

Le choix entre le mode graphique et le mode eager dépend de vos besoins spécifiques. Le mode graphique est préféré pour les optimisations de performance, l'exportation et le déploiement de modèles, et la parallélisation et la distribution des calculs. Le mode eager est plus adapté pour le débogage, le prototypage rapide, et l'utilisation de boucles et de conditions.

En résumé, utilisez le mode graphique pour les applications de production et les environnements nécessitant des performances optimales, et utilisez le mode eager pour le développement, le débogage, et le prototypage rapide.
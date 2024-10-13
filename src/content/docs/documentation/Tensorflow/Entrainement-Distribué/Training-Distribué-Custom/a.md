---
title : Entraînement distribué
description : Entraînement distribué
---

## GPU Strategy Exemple

[Google Colab](https://colab.research.google.com/github/https-deeplearning-ai/tensorflow-3-public/blob/main/Course%202%20-%20Custom%20Training%20loops%2C%20Gradients%20and%20Distributed%20Training/Week%204%20-%20Distribution%20Strategy/C2_W4_Lab_2_multi-GPU-mirrored-strategy.ipynb)

## TPU Strategy Exemple

[Google Colab](https://colab.research.google.com/github/https-deeplearning-ai/tensorflow-3-public/blob/main/Course%202%20-%20Custom%20Training%20loops%2C%20Gradients%20and%20Distributed%20Training/Week%204%20-%20Distribution%20Strategy/C2_W4_Lab_3_using-TPU-strategy.ipynb#scrollTo=tmv6p137kgob)

[Google Colab](https://colab.research.google.com/github/tensorflow/docs/blob/master/site/en/guide/tpu.ipynb?hl=fr#scrollTo=tuOe1ymfHZPu)

## Multi-workers Exemple

[Google Colab](https://colab.research.google.com/github/tensorflow/docs/blob/master/site/en/tutorials/distribute/multi_worker_with_keras.ipynb?hl=fr)

## One Device Strategy Exemple

[Google Colab](https://colab.research.google.com/github/https-deeplearning-ai/tensorflow-3-public/blob/main/Course%202%20-%20Custom%20Training%20loops%2C%20Gradients%20and%20Distributed%20Training/Week%204%20-%20Distribution%20Strategy/C2_W4_Lab_4_one-device-strategy.ipynb)


Le **distributed training** (entraînement distribué) est une technique avancée qui permet d'entraîner des modèles de machine learning sur plusieurs dispositifs (CPU, GPU, TPU) ou machines de manière coordonnée. Cette approche est particulièrement utile pour les modèles complexes et les grands ensembles de données, car elle permet de réduire le temps d'entraînement et d'améliorer les performances.

### Différences entre l'entraînement distribué et l'entraînement régulier

### 1. **Ressources de calcul**

- **Entraînement régulier** : Utilise un seul dispositif (CPU, GPU) pour entraîner le modèle.
- **Entraînement distribué** : Utilise plusieurs dispositifs (CPU, GPU, TPU) ou machines pour entraîner le modèle en parallèle.

### 2. **Temps d'entraînement**

- **Entraînement régulier** : Le temps d'entraînement peut être long pour les modèles complexes et les grands ensembles de données.
- **Entraînement distribué** : Réduit le temps d'entraînement en parallélisant les calculs sur plusieurs dispositifs ou machines.

### 3. **Gestion des données**

- **Entraînement régulier** : Les données sont traitées séquentiellement sur un seul dispositif.
- **Entraînement distribué** : Les données peuvent être partitionnées et traitées en parallèle sur plusieurs dispositifs, ce qui nécessite une gestion plus complexe des données.

### 4. **Synchronisation**

- **Entraînement régulier** : Pas de besoin de synchronisation entre les dispositifs.
- **Entraînement distribué** : Nécessite une synchronisation entre les dispositifs pour agréger les gradients et mettre à jour les poids du modèle. Cela peut être fait de manière synchrone (tous les dispositifs attendent que tous les autres aient terminé avant de mettre à jour les poids) ou asynchrone (les dispositifs mettent à jour les poids dès qu'ils ont terminé leur calcul).

### 5. **Complexité de l'implémentation**

- **Entraînement régulier** : Plus simple à implémenter car il n'y a pas besoin de gérer la communication entre les dispositifs.
- **Entraînement distribué** : Plus complexe à implémenter en raison de la nécessité de gérer la communication et la synchronisation entre les dispositifs.

### Types d'entraînement distribué

### 1. **Data Parallelism (Parallélisme de données)**

- **Description** : Les données sont partitionnées et distribuées sur plusieurs dispositifs. Chaque dispositif calcule les gradients pour sa partition de données, et les gradients sont ensuite agrégés pour mettre à jour les poids du modèle.
- **Avantages** : Simple à implémenter et efficace pour les modèles qui ne nécessitent pas de communication fréquente entre les dispositifs.
- **Inconvénients** : Peut nécessiter une grande quantité de mémoire pour stocker les poids du modèle sur chaque dispositif.

### 2. **Model Parallelism (Parallélisme de modèle)**

- **Description** : Le modèle est partitionné et distribué sur plusieurs dispositifs. Chaque dispositif est responsable de calculer une partie du modèle.
- **Avantages** : Permet d'entraîner des modèles très grands qui ne tiennent pas dans la mémoire d'un seul dispositif.
- **Inconvénients** : Plus complexe à implémenter et nécessite une communication fréquente entre les dispositifs.

### Exemple de code pour l'entraînement distribué avec TensorFlow

Voici un exemple simple de l'entraînement distribué avec TensorFlow en utilisant le parallélisme de données :

```python
import tensorflow as tf
from tensorflow.keras import layers

# Définir une stratégie de distribution
strategy = tf.distribute.MirroredStrategy()

# Créer et compiler le modèle dans le contexte de la stratégie
with strategy.scope():
    model = tf.keras.Sequential([
        layers.Conv2D(32, (3, 3), activation='relu', input_shape=(28, 28, 1)),
        layers.MaxPooling2D((2, 2)),
        layers.Flatten(),
        layers.Dense(128, activation='relu'),
        layers.Dense(10)
    ])

    model.compile(optimizer='adam',
                  loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True),
                  metrics=['accuracy'])

# Préparer les données
(x_train, y_train), (x_test, y_test) = tf.keras.datasets.mnist.load_data()
x_train, x_test = x_train / 255.0, x_test / 255.0
x_train = x_train[..., tf.newaxis]
x_test = x_test[..., tf.newaxis]

# Entraîner le modèle
model.fit(x_train, y_train, epochs=5, validation_data=(x_test, y_test))

```

### Conclusion

L'entraînement distribué est une technique puissante pour accélérer l'entraînement des modèles de machine learning en utilisant plusieurs dispositifs ou machines. Il permet de réduire le temps d'entraînement et d'améliorer les performances, mais il est plus complexe à implémenter en raison de la nécessité de gérer la communication et la synchronisation entre les dispositifs. Les types d'entraînement distribué incluent le parallélisme de données et le parallélisme de modèle, chacun ayant ses propres avantages et inconvénients.
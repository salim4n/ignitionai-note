---
title : Utilisation de la stratégie MirroredStrategy
description : Utilisation de la stratégie MirroredStrategy
---

L'utilisation de la stratégie `MirroredStrategy` de TensorFlow permet d'entraîner un modèle sur plusieurs GPU sur le même dispositif. Cette stratégie synchronise les calculs sur tous les GPU disponibles, ce qui permet d'accélérer l'entraînement en parallélisant les opérations.

Voici un exemple complet de l'utilisation de la stratégie `MirroredStrategy` pour entraîner un modèle sur plusieurs GPU :

### Étape 1 : Importer les bibliothèques nécessaires

Tout d'abord, assurez-vous d'importer les bibliothèques nécessaires.

```python
import tensorflow as tf
from tensorflow.keras import layers
```

### Étape 2 : Définir la stratégie de distribution

Définissez une stratégie de distribution en utilisant `MirroredStrategy`.

```python
strategy = tf.distribute.MirroredStrategy()
```

### Étape 3 : Définir et compiler le modèle dans le contexte de la stratégie

Définissez et compilez votre modèle dans le contexte de la stratégie de distribution.

```python
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

```

### Étape 4 : Préparer les données

Préparez vos données d'entraînement et de test. Pour cet exemple, nous utiliserons le jeu de données MNIST.

```python
(x_train, y_train), (x_test, y_test) = tf.keras.datasets.mnist.load_data()
x_train, x_test = x_train / 255.0, x_test / 255.0
x_train = x_train[..., tf.newaxis]
x_test = x_test[..., tf.newaxis]

```

### Étape 5 : Entraîner le modèle

Entraînez votre modèle en utilisant la stratégie de distribution.

```python
model.fit(x_train, y_train, epochs=5, validation_data=(x_test, y_test))

```

### Code complet

Voici le code complet pour définir un modèle, préparer les données, définir la stratégie de distribution `MirroredStrategy`, et entraîner le modèle sur plusieurs GPU.

```python
import tensorflow as tf
from tensorflow.keras import layers

# Définir la stratégie de distribution
strategy = tf.distribute.MirroredStrategy()

# Définir et compiler le modèle dans le contexte de la stratégie
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

### Explication

1. **Stratégie de distribution** : La stratégie `MirroredStrategy` est utilisée pour synchroniser les calculs sur tous les GPU disponibles sur le même dispositif.
2. **Contexte de la stratégie** : Le modèle est défini et compilé dans le contexte de la stratégie de distribution en utilisant `with strategy.scope()`.
3. **Préparation des données** : Les données d'entraînement et de test sont préparées et normalisées.
4. **Entraînement du modèle** : Le modèle est entraîné en utilisant la méthode `fit`, et les calculs sont distribués sur tous les GPU disponibles.

En utilisant cette approche, vous pouvez tirer parti de plusieurs GPU pour accélérer l'entraînement de votre modèle.
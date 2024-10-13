---
title : Créer un callback personnalisé
description : Créer un callback personnalisé et l'assigner à l'entraînement d'un modèle en TensorFlow/Keras
---

Créer un callback personnalisé et l'assigner à l'entraînement d'un modèle en TensorFlow/Keras est une tâche courante pour ajouter des fonctionnalités spécifiques au processus d'entraînement. Voici un exemple de création d'un callback personnalisé et de son utilisation lors de l'entraînement d'un modèle.

### Étape 1 : Importer les bibliothèques nécessaires

Tout d'abord, assurez-vous d'importer les bibliothèques nécessaires.

```python
import tensorflow as tf
from tensorflow.keras import layers
from tensorflow.keras.callbacks import Callback

```

### Étape 2 : Définir le callback personnalisé

Définissez une classe de callback personnalisée en héritant de `tf.keras.callbacks.Callback`. Vous pouvez surcharger les méthodes `on_epoch_end`, `on_batch_end`, `on_train_begin`, etc., pour ajouter des fonctionnalités spécifiques.

```python
class CustomCallback(Callback):
    def on_epoch_end(self, epoch, logs=None):
        print(f"End of epoch {epoch}, loss: {logs['loss']}, accuracy: {logs['accuracy']}")

    def on_train_begin(self, logs=None):
        print("Training is about to begin.")

    def on_train_end(self, logs=None):
        print("Training has ended.")

```

### Étape 3 : Définir et compiler le modèle

Définissez et compilez votre modèle. Pour cet exemple, nous utiliserons un modèle simple avec quelques couches de convolution et de dense.

```python
class SimpleModel(tf.keras.Model):
    def __init__(self):
        super(SimpleModel, self).__init__()
        self.conv1 = layers.Conv2D(32, (3, 3), activation='relu')
        self.flatten = layers.Flatten()
        self.dense1 = layers.Dense(128, activation='relu')
        self.dense2 = layers.Dense(10)

    def call(self, inputs):
        x = self.conv1(inputs)
        x = self.flatten(x)
        x = self.dense1(x)
        return self.dense2(x)

# Instancier le modèle
model = SimpleModel()

# Compiler le modèle
model.compile(optimizer='adam',
              loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True),
              metrics=['accuracy'])

```

### Étape 4 : Préparer les données

Préparez vos données d'entraînement et de test. Pour cet exemple, nous utiliserons le jeu de données MNIST.

```python
(x_train, y_train), (x_test, y_test) = tf.keras.datasets.mnist.load_data()
x_train, x_test = x_train / 255.0, x_test / 255.0

```

### Étape 5 : Entraîner le modèle avec le callback

Entraînez votre modèle en utilisant le callback personnalisé.

```python
custom_callback = CustomCallback()

model.fit(x_train, y_train, epochs=5, batch_size=32, callbacks=[custom_callback])

```

### Code complet

Voici le code complet pour définir un callback personnalisé, définir et compiler un modèle, préparer les données, et entraîner le modèle avec le callback.

```python
import tensorflow as tf
from tensorflow.keras import layers
from tensorflow.keras.callbacks import Callback

# Définir le callback personnalisé
class CustomCallback(Callback):
    def on_epoch_end(self, epoch, logs=None):
        print(f"End of epoch {epoch}, loss: {logs['loss']}, accuracy: {logs['accuracy']}")

    def on_train_begin(self, logs=None):
        print("Training is about to begin.")

    def on_train_end(self, logs=None):
        print("Training has ended.")

# Définir le modèle
class SimpleModel(tf.keras.Model):
    def __init__(self):
        super(SimpleModel, self).__init__()
        self.conv1 = layers.Conv2D(32, (3, 3), activation='relu')
        self.flatten = layers.Flatten()
        self.dense1 = layers.Dense(128, activation='relu')
        self.dense2 = layers.Dense(10)

    def call(self, inputs):
        x = self.conv1(inputs)
        x = self.flatten(x)
        x = self.dense1(x)
        return self.dense2(x)

# Instancier le modèle
model = SimpleModel()

# Compiler le modèle
model.compile(optimizer='adam',
              loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True),
              metrics=['accuracy'])

# Préparer les données
(x_train, y_train), (x_test, y_test) = tf.keras.datasets.mnist.load_data()
x_train, x_test = x_train / 255.0, x_test / 255.0

# Entraîner le modèle avec le callback
custom_callback = CustomCallback()

model.fit(x_train, y_train, epochs=5, batch_size=32, callbacks=[custom_callback])

```

Ce code montre comment créer un callback personnalisé pour afficher des messages à la fin de chaque époque et au début et à la fin de l'entraînement. Vous pouvez adapter ce code pour ajouter d'autres fonctionnalités spécifiques à vos besoins.
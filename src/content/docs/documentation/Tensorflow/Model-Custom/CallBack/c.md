---
title : Utiliser un callback ModelCheckpoint
description : Utiliser un callback ModelCheckpoint pour sauvegarder les paramètres du modèle pendant l'entraînement
---


Utiliser un objet `ModelCheckpoint` pour sauvegarder les paramètres du modèle pendant l'entraînement est une pratique courante pour s'assurer que vous pouvez récupérer le meilleur modèle en cas d'interruption ou pour une évaluation ultérieure. Voici comment vous pouvez le faire en utilisant TensorFlow et Keras.

### Étape 1 : Importer les bibliothèques nécessaires

Tout d'abord, assurez-vous d'importer les bibliothèques nécessaires.

```python
import tensorflow as tf
from tensorflow.keras import layers
from tensorflow.keras.callbacks import ModelCheckpoint

```

### Étape 2 : Définir le modèle

Définissez votre modèle. Pour cet exemple, nous utiliserons un modèle simple avec quelques couches de convolution et de dense.

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

```

### Étape 3 : Instancier et compiler le modèle

Instanciez et compilez votre modèle.

```python
model = SimpleModel()

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

### Étape 5 : Définir le callback ModelCheckpoint

Définissez un objet `ModelCheckpoint` pour sauvegarder le modèle à des intervalles réguliers ou lorsque certaines conditions sont remplies.

```python
checkpoint = ModelCheckpoint(filepath='best_model.h5',
                             save_best_only=True,
                             monitor='val_loss',
                             mode='min',
                             verbose=1)

```

### Étape 6 : Entraîner le modèle avec le callback

Entraînez votre modèle en utilisant le callback `ModelCheckpoint`.

```python
model.fit(x_train, y_train, epochs=5, batch_size=32, validation_split=0.2, callbacks=[checkpoint])

```

### Code complet

Voici le code complet pour définir un modèle, préparer les données, définir un callback `ModelCheckpoint`, et entraîner le modèle avec ce callback.

```python
import tensorflow as tf
from tensorflow.keras import layers
from tensorflow.keras.callbacks import ModelCheckpoint

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

# Définir le callback ModelCheckpoint
checkpoint = ModelCheckpoint(filepath='best_model.h5',
                             save_best_only=True,
                             monitor='val_loss',
                             mode='min',
                             verbose=1)

# Entraîner le modèle avec le callback
model.fit(x_train, y_train, epochs=5, batch_size=32, validation_split=0.2, callbacks=[checkpoint])

```

### Explication des paramètres de ModelCheckpoint

- `filepath` : Le chemin où le modèle sera sauvegardé.
- `save_best_only` : Si `True`, seul le meilleur modèle (en termes de la métrique surveillée) sera sauvegardé.
- `monitor` : La métrique à surveiller pour déterminer le meilleur modèle.
- `mode` : Le mode de surveillance ('min' pour minimiser la métrique, 'max' pour maximiser la métrique).
- `verbose` : Le niveau de verbosité (0 pour silencieux, 1 pour afficher les messages).

En utilisant ce callback, vous pouvez vous assurer que le meilleur modèle est sauvegardé pendant l'entraînement, ce qui peut être très utile pour éviter de perdre des progrès en cas d'interruption ou pour une évaluation ultérieure.
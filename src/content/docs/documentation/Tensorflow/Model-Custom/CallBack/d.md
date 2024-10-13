---
title: Utiliser un callback EarlyStopping
description: Utiliser un callback EarlyStopping pour arrêter l'entraînement du modèle lorsque la performance sur les données de validation ne s'améliore plus
---

L'utilisation du callback `EarlyStopping` est une technique courante pour éviter le surapprentissage (overfitting) en arrêtant l'entraînement du modèle lorsque la performance sur les données de validation ne s'améliore plus. Voici comment vous pouvez le faire en utilisant TensorFlow et Keras.

### Étape 1 : Importer les bibliothèques nécessaires

Tout d'abord, assurez-vous d'importer les bibliothèques nécessaires.

```python
import tensorflow as tf
from tensorflow.keras import layers
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint

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

### Étape 5 : Définir les callbacks EarlyStopping et ModelCheckpoint

Définissez un objet `EarlyStopping` pour arrêter l'entraînement lorsque la performance sur les données de validation ne s'améliore plus, et un objet `ModelCheckpoint` pour sauvegarder le meilleur modèle.

```python
early_stopping = EarlyStopping(monitor='val_loss', patience=3, restore_best_weights=True)
checkpoint = ModelCheckpoint(filepath='best_model.h5', save_best_only=True, monitor='val_loss', mode='min', verbose=1)

```

### Étape 6 : Entraîner le modèle avec les callbacks

Entraînez votre modèle en utilisant les callbacks `EarlyStopping` et `ModelCheckpoint`.

```python
model.fit(x_train, y_train, epochs=50, batch_size=32, validation_split=0.2, callbacks=[early_stopping, checkpoint])

```

### Code complet

Voici le code complet pour définir un modèle, préparer les données, définir les callbacks `EarlyStopping` et `ModelCheckpoint`, et entraîner le modèle avec ces callbacks.

```python
import tensorflow as tf
from tensorflow.keras import layers
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint

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

# Définir les callbacks EarlyStopping et ModelCheckpoint
early_stopping = EarlyStopping(monitor='val_loss', patience=3, restore_best_weights=True)
checkpoint = ModelCheckpoint(filepath='best_model.h5', save_best_only=True, monitor='val_loss', mode='min', verbose=1)

# Entraîner le modèle avec les callbacks
model.fit(x_train, y_train, epochs=50, batch_size=32, validation_split=0.2, callbacks=[early_stopping, checkpoint])

```

### Explication des paramètres de EarlyStopping

- `monitor` : La métrique à surveiller pour déterminer l'arrêt prématuré (par exemple, `val_loss`).
- `patience` : Le nombre d'époques sans amélioration après lesquelles l'entraînement sera arrêté.
- `restore_best_weights` : Si `True`, les poids du modèle seront restaurés à ceux de l'époque où la meilleure valeur de la métrique surveillée a été observée.

### Explication des paramètres de ModelCheckpoint

- `filepath` : Le chemin où le modèle sera sauvegardé.
- `save_best_only` : Si `True`, seul le meilleur modèle (en termes de la métrique surveillée) sera sauvegardé.
- `monitor` : La métrique à surveiller pour déterminer le meilleur modèle.
- `mode` : Le mode de surveillance ('min' pour minimiser la métrique, 'max' pour maximiser la métrique).
- `verbose` : Le niveau de verbosité (0 pour silencieux, 1 pour afficher les messages).

En utilisant ces callbacks, vous pouvez éviter le surapprentissage et sauvegarder le meilleur modèle pendant l'entraînement.
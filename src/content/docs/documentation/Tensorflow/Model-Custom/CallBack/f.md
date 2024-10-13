---
title : Utiliser un callback ReduceLROnPlateau
description : Utiliser un callback ReduceLROnPlateau pour réduire le taux d'apprentissage lorsque la performance sur les données de validation ne s'améliore plus
---

Pour détecter le surapprentissage (overfitting) pendant l'entraînement d'un modèle, vous pouvez créer un callback personnalisé qui surveille les métriques de performance sur les données d'entraînement et de validation. Si la performance sur les données de validation commence à se dégrader alors que la performance sur les données d'entraînement continue de s'améliorer, cela peut indiquer un surapprentissage.

Voici un exemple de callback personnalisé pour détecter le surapprentissage :

### Étape 1 : Importer les bibliothèques nécessaires

Tout d'abord, assurez-vous d'importer les bibliothèques nécessaires.

```python
import tensorflow as tf
from tensorflow.keras import layers
from tensorflow.keras.callbacks import Callback
```

### Étape 2 : Définir le callback personnalisé

Définissez une classe de callback personnalisée en héritant de `tf.keras.callbacks.Callback`. Vous pouvez surcharger les méthodes `on_epoch_end` pour surveiller les métriques de performance.

```python
class OverfittingCallback(Callback):
    def __init__(self, patience=3, delta=0.01):
        super(OverfittingCallback, self).__init__()
        self.patience = patience
        self.delta = delta
        self.best_val_loss = None
        self.wait = 0

    def on_epoch_end(self, epoch, logs=None):
        logs = logs or {}
        val_loss = logs.get('val_loss')
        train_loss = logs.get('loss')

        if self.best_val_loss is None:
            self.best_val_loss = val_loss
        elif val_loss > self.best_val_loss + self.delta:
            self.wait += 1
            if self.wait >= self.patience:
                print(f"Overfitting detected at epoch {epoch}. Stopping training.")
                self.model.stop_training = True
        else:
            self.wait = 0
            self.best_val_loss = val_loss

        print(f"End of epoch {epoch}, train_loss: {train_loss}, val_loss: {val_loss}, wait: {self.wait}")
```

### Étape 3 : Définir le modèle

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

### Étape 4 : Instancier et compiler le modèle

Instanciez et compilez votre modèle.

```python
model = SimpleModel()

model.compile(optimizer='adam',
              loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True),
              metrics=['accuracy'])
```

### Étape 5 : Préparer les données

Préparez vos données d'entraînement et de test. Pour cet exemple, nous utiliserons le jeu de données MNIST.

```python
(x_train, y_train), (x_test, y_test) = tf.keras.datasets.mnist.load_data()
x_train, x_test = x_train / 255.0, x_test / 255.0
```

### Étape 6 : Entraîner le modèle avec le callback personnalisé

Entraînez votre modèle en utilisant le callback personnalisé pour détecter le surapprentissage.

```python
overfitting_callback = OverfittingCallback(patience=3, delta=0.01)

model.fit(x_train, y_train, epochs=50, batch_size=32, validation_split=0.2, callbacks=[overfitting_callback])
```

### Code complet

Voici le code complet pour définir un modèle, préparer les données, définir le callback personnalisé pour détecter le surapprentissage, et entraîner le modèle avec ce callback.

```python
import tensorflow as tf
from tensorflow.keras import layers
from tensorflow.keras.callbacks import Callback

# Définir le callback personnalisé pour détecter le surapprentissage
class OverfittingCallback(Callback):
    def __init__(self, patience=3, delta=0.01):
        super(OverfittingCallback, self).__init__()
        self.patience = patience
        self.delta = delta
        self.best_val_loss = None
        self.wait = 0

    def on_epoch_end(self, epoch, logs=None):
        logs = logs or {}
        val_loss = logs.get('val_loss')
        train_loss = logs.get('loss')

        if self.best_val_loss is None:
            self.best_val_loss = val_loss
        elif val_loss > self.best_val_loss + self.delta:
            self.wait += 1
            if self.wait >= self.patience:
                print(f"Overfitting detected at epoch {epoch}. Stopping training.")
                self.model.stop_training = True
        else:
            self.wait = 0
            self.best_val_loss = val_loss

        print(f"End of epoch {epoch}, train_loss: {train_loss}, val_loss: {val_loss}, wait: {self.wait}")

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

# Entraîner le modèle avec le callback personnalisé
overfitting_callback = OverfittingCallback(patience=3, delta=0.01)

model.fit(x_train, y_train, epochs=50, batch_size=32, validation_split=0.2, callbacks=[overfitting_callback])
```

### Explication des paramètres du callback

- `patience` : Le nombre d'époques sans amélioration après lesquelles l'entraînement sera arrêté.
- `delta` : La tolérance pour déterminer si la perte de validation a augmenté de manière significative.
- `best_val_loss` : La meilleure perte de validation observée jusqu'à présent.
- `wait` : Le nombre d'époques consécutives sans amélioration de la perte de validation.

En utilisant ce callback personnalisé, vous pouvez détecter le surapprentissage et arrêter l'entraînement prématurément pour éviter de surajuster le modèle aux données d'entraînement.
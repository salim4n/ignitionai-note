---
title: Modèle personnalisé en utilisant une classe Python
description: Modèle personnalisé en utilisant une classe Python
---

### Étape 1 : Importer les bibliothèques nécessaires

Tout d'abord, assurez-vous d'importer les bibliothèques nécessaires.

```python
import tensorflow as tf
from tensorflow.keras import layers
```

### Étape 2 : Définir la classe du modèle

Ensuite, vous devez définir une classe qui hérite de `tf.keras.Model`. Cette classe doit inclure une méthode `__init__` pour initialiser les couches du modèle et une méthode `call` pour définir le flux de données à travers le modèle.

```python
class MyModel(tf.keras.Model):
    def __init__(self):
        super(MyModel, self).__init__()
        self.dense1 = layers.Dense(64, activation='relu')
        self.dense2 = layers.Dense(64, activation='relu')
        self.dense3 = layers.Dense(10)

    def call(self, inputs):
        x = self.dense1(inputs)
        x = self.dense2(x)
        return self.dense3(x)
```

### Étape 3 : Instancier et compiler le modèle

Ensuite, vous pouvez instancier votre modèle et le compiler avec une fonction de perte et un optimiseur.

```python
model = MyModel()

model.compile(optimizer='adam',
              loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True),
              metrics=['accuracy'])

```

### Étape 4 : Préparer les données

Préparez vos données d'entraînement et de test. Par exemple, vous pouvez utiliser le jeu de données MNIST.

```python
(x_train, y_train), (x_test, y_test) = tf.keras.datasets.mnist.load_data()
x_train, x_test = x_train / 255.0, x_test / 255.0

```

### Étape 5 : Entraîner le modèle

Entraînez votre modèle avec les données préparées.

```python
model.fit(x_train, y_train, epochs=5)

```

### Étape 6 : Évaluer le modèle

Évaluez votre modèle sur les données de test.

```python
model.evaluate(x_test, y_test)

```

### Code complet

Voici le code complet pour définir, compiler, entraîner et évaluer un modèle personnalisé en utilisant une classe Python qui hérite de `tf.keras.Model`.

```python
import tensorflow as tf
from tensorflow.keras import layers

class MyModel(tf.keras.Model):
    def __init__(self):
        super(MyModel, self).__init__()
        self.dense1 = layers.Dense(64, activation='relu')
        self.dense2 = layers.Dense(64, activation='relu')
        self.dense3 = layers.Dense(10)

    def call(self, inputs):
        x = self.dense1(inputs)
        x = self.dense2(x)
        return self.dense3(x)

# Instancier le modèle
model = MyModel()

# Compiler le modèle
model.compile(optimizer='adam',
              loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True),
              metrics=['accuracy'])

# Préparer les données
(x_train, y_train), (x_test, y_test) = tf.keras.datasets.mnist.load_data()
x_train, x_test = x_train / 255.0, x_test / 255.0

# Entraîner le modèle
model.fit(x_train, y_train, epochs=5)

# Évaluer le modèle
model.evaluate(x_test, y_test)

```

Ce tutoriel vous montre comment définir un modèle personnalisé en utilisant une classe Python qui hérite de `tf.keras.Model`, comment compiler, entraîner et évaluer ce modèle. Vous pouvez adapter ce code pour d'autres types de modèles et de jeux de données selon vos besoins.
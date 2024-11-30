---
title: Construire un réseau résiduel
description: Construire un réseau résiduel
---

[Google Colab](https://colab.research.google.com/github/https-deeplearning-ai/tensorflow-3-public/blob/main/Course%201%20-%20Custom%20Models%2C%20Layers%20and%20Loss%20Functions/Week%204%20-%20Models/C1_W4_Lab_2_resnet-example.ipynb)

Construire un réseau résiduel (ResNet) en définissant une classe de modèle personnalisée est une excellente manière de comprendre et d'implémenter des architectures de réseaux de neurones plus complexes. Un réseau résiduel utilise des connexions de saut (skip connections) pour permettre aux gradients de circuler plus facilement à travers le réseau, ce qui aide à entraîner des réseaux plus profonds.

Voici un guide étape par étape pour construire un réseau résiduel en utilisant une classe de modèle personnalisée en TensorFlow.

### Étape 1 : Importer les bibliothèques nécessaires

Tout d'abord, assurez-vous d'importer les bibliothèques nécessaires.

```python
import tensorflow as tf
from tensorflow.keras import layers
```

### Étape 2 : Définir le bloc résiduel

Un bloc résiduel est une unité de base d'un réseau résiduel. Il comprend généralement deux couches de convolution avec des connexions de saut.

```python
class ResidualBlock(tf.keras.layers.Layer):
    def __init__(self, filters, strides=1):
        super(ResidualBlock, self).__init__()
        self.conv1 = layers.Conv2D(filters, (3, 3), strides=strides, padding='same')
        self.bn1 = layers.BatchNormalization()
        self.conv2 = layers.Conv2D(filters, (3, 3), strides=1, padding='same')
        self.bn2 = layers.BatchNormalization()

        if strides > 1:
            self.downsample = tf.keras.Sequential([
                layers.Conv2D(filters, (1, 1), strides=strides, padding='same'),
                layers.BatchNormalization()
            ])
        else:
            self.downsample = lambda x: x

    def call(self, inputs, training=False):
        residual = self.downsample(inputs)

        x = self.conv1(inputs)
        x = self.bn1(x, training=training)
        x = tf.nn.relu(x)

        x = self.conv2(x)
        x = self.bn2(x, training=training)

        x += residual
        return tf.nn.relu(x)

```

### Étape 3 : Définir le modèle ResNet

Ensuite, définissez la classe du modèle ResNet en utilisant les blocs résiduels.

```python
class ResNet(tf.keras.Model):
    def __init__(self, num_classes=10):
        super(ResNet, self).__init__()
        self.conv1 = layers.Conv2D(64, (3, 3), strides=1, padding='same')
        self.bn1 = layers.BatchNormalization()
        self.block1 = ResidualBlock(64, strides=1)
        self.block2 = ResidualBlock(128, strides=2)
        self.block3 = ResidualBlock(256, strides=2)
        self.block4 = ResidualBlock(512, strides=2)
        self.global_pool = layers.GlobalAveragePooling2D()
        self.fc = layers.Dense(num_classes)

    def call(self, inputs, training=False):
        x = self.conv1(inputs)
        x = self.bn1(x, training=training)
        x = tf.nn.relu(x)

        x = self.block1(x, training=training)
        x = self.block2(x, training=training)
        x = self.block3(x, training=training)
        x = self.block4(x, training=training)

        x = self.global_pool(x)
        return self.fc(x)

```

### Étape 4 : Instancier et compiler le modèle

Instanciez et compilez le modèle avec une fonction de perte et un optimiseur.

```python
model = ResNet(num_classes=10)

model.compile(optimizer='adam',
              loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True),
              metrics=['accuracy'])

```

### Étape 5 : Préparer les données

Préparez vos données d'entraînement et de test. Par exemple, vous pouvez utiliser le jeu de données CIFAR-10.

```python
(x_train, y_train), (x_test, y_test) = tf.keras.datasets.cifar10.load_data()
x_train, x_test = x_train / 255.0, x_test / 255.0

```

### Étape 6 : Entraîner le modèle

Entraînez votre modèle avec les données préparées.

```python
model.fit(x_train, y_train, epochs=10, batch_size=64)

```

### Étape 7 : Évaluer le modèle

Évaluez votre modèle sur les données de test.

```python
model.evaluate(x_test, y_test)

```

### Code complet

Voici le code complet pour définir, compiler, entraîner et évaluer un réseau résiduel en utilisant une classe de modèle personnalisée.

```python
import tensorflow as tf
from tensorflow.keras import layers

class ResidualBlock(tf.keras.layers.Layer):
    def __init__(self, filters, strides=1):
        super(ResidualBlock, self).__init__()
        self.conv1 = layers.Conv2D(filters, (3, 3), strides=strides, padding='same')
        self.bn1 = layers.BatchNormalization()
        self.conv2 = layers.Conv2D(filters, (3, 3), strides=1, padding='same')
        self.bn2 = layers.BatchNormalization()

        if strides > 1:
            self.downsample = tf.keras.Sequential([
                layers.Conv2D(filters, (1, 1), strides=strides, padding='same'),
                layers.BatchNormalization()
            ])
        else:
            self.downsample = lambda x: x

    def call(self, inputs, training=False):
        residual = self.downsample(inputs)

        x = self.conv1(inputs)
        x = self.bn1(x, training=training)
        x = tf.nn.relu(x)

        x = self.conv2(x)
        x = self.bn2(x, training=training)

        x += residual
        return tf.nn.relu(x)

class ResNet(tf.keras.Model):
    def __init__(self, num_classes=10):
        super(ResNet, self).__init__()
        self.conv1 = layers.Conv2D(64, (3, 3), strides=1, padding='same')
        self.bn1 = layers.BatchNormalization()
        self.block1 = ResidualBlock(64, strides=1)
        self.block2 = ResidualBlock(128, strides=2)
        self.block3 = ResidualBlock(256, strides=2)
        self.block4 = ResidualBlock(512, strides=2)
        self.global_pool = layers.GlobalAveragePooling2D()
        self.fc = layers.Dense(num_classes)

    def call(self, inputs, training=False):
        x = self.conv1(inputs)
        x = self.bn1(x, training=training)
        x = tf.nn.relu(x)

        x = self.block1(x, training=training)
        x = self.block2(x, training=training)
        x = self.block3(x, training=training)
        x = self.block4(x, training=training)

        x = self.global_pool(x)
        return self.fc(x)

# Instancier le modèle
model = ResNet(num_classes=10)

# Compiler le modèle
model.compile(optimizer='adam',
              loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True),
              metrics=['accuracy'])

# Préparer les données
(x_train, y_train), (x_test, y_test) = tf.keras.datasets.cifar10.load_data()
x_train, x_test = x_train / 255.0, x_test / 255.0

# Entraîner le modèle
model.fit(x_train, y_train, epochs=10, batch_size=64)

# Évaluer le modèle
model.evaluate(x_test, y_test)

```

Ce tutoriel vous montre comment construire un réseau résiduel en utilisant une classe de modèle personnalisée en TensorFlow. Vous pouvez adapter ce code pour d'autres types de modèles et de jeux de données selon vos besoins.
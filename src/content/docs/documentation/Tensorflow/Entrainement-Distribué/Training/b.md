---
title: Implémenter des boucles d'entraînement personnalisées avec tf.GradientTape
description: Implémenter des boucles d'entraînement personnalisées
---

Implémenter des boucles d'entraînement personnalisées en utilisant `tf.GradientTape` vous permet de contrôler chaque étape du processus d'entraînement de manière explicite. Cela peut être utile pour ajouter des métriques personnalisées, utiliser des méthodes d'optimisation avancées, ou manipuler les gradients.

Voici un exemple complet de l'implémentation d'une boucle d'entraînement personnalisée en utilisant `tf.GradientTape` :

### Étape 1 : Importer les bibliothèques nécessaires

Tout d'abord, assurez-vous d'importer les bibliothèques nécessaires.

```python
import tensorflow as tf
from tensorflow.keras import layers, losses, optimizers, metrics

```

### Étape 2 : Définir le modèle

Définissez un modèle simple pour l'exemple. Pour cet exemple, nous utiliserons un modèle avec quelques couches de convolution et de dense.

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

### Étape 3 : Initialiser les variables et les objets nécessaires

Définissez la fonction de perte, l'optimiseur et les métriques.

```python
# Instancier le modèle
model = SimpleModel()

# Définir la fonction de perte
loss_fn = losses.SparseCategoricalCrossentropy(from_logits=True)

# Définir l'optimiseur
optimizer = optimizers.Adam()

# Définir les métriques
train_loss = metrics.Mean(name='train_loss')
train_accuracy = metrics.SparseCategoricalAccuracy(name='train_accuracy')

```

### Étape 4 : Préparer les données

Préparez vos données d'entraînement et de test. Pour cet exemple, nous utiliserons le jeu de données MNIST.

```python
(x_train, y_train), (x_test, y_test) = tf.keras.datasets.mnist.load_data()
x_train, x_test = x_train / 255.0, x_test / 255.0
x_train = x_train[..., tf.newaxis]
x_test = x_test[..., tf.newaxis]

# Créer un dataset TensorFlow
train_dataset = tf.data.Dataset.from_tensor_slices((x_train, y_train)).shuffle(60000).batch(32)

```

### Étape 5 : Définir la fonction de pas d'entraînement

Définissez une fonction `train_step` qui utilise `tf.GradientTape` pour enregistrer les opérations et calculer les gradients.

```python
@tf.function
def train_step(images, labels):
    with tf.GradientTape() as tape:
        predictions = model(images, training=True)
        loss = loss_fn(labels, predictions)
    gradients = tape.gradient(loss, model.trainable_variables)
    optimizer.apply_gradients(zip(gradients, model.trainable_variables))

    train_loss(loss)
    train_accuracy(labels, predictions)

```

### Étape 6 : Implémenter la boucle d'entraînement

Implémentez la boucle d'entraînement en utilisant la fonction `train_step`.

```python
# Nombre d'époques
epochs = 5

for epoch in range(epochs):
    for images, labels in train_dataset:
        train_step(images, labels)

    template = 'Epoch {}, Loss: {}, Accuracy: {}'
    print(template.format(epoch + 1, train_loss.result(), train_accuracy.result() * 100))

    # Réinitialiser les métriques pour la prochaine époque
    train_loss.reset_states()
    train_accuracy.reset_states()

```

### Étape 7 : Évaluer le modèle

Définissez une fonction `test_step` pour évaluer le modèle sur les données de validation.

```python
@tf.function
def test_step(images, labels):
    predictions = model(images, training=False)
    loss = loss_fn(labels, predictions)

    train_loss(loss)
    train_accuracy(labels, predictions)

# Créer un dataset TensorFlow pour la validation
val_dataset = tf.data.Dataset.from_tensor_slices((x_test, y_test)).batch(32)

for images, labels in val_dataset:
    test_step(images, labels)

template = 'Test Loss: {}, Test Accuracy: {}'
print(template.format(train_loss.result(), train_accuracy.result() * 100))

```

### Code complet

Voici le code complet pour implémenter une boucle d'entraînement personnalisée en utilisant `tf.GradientTape` :

```python
import tensorflow as tf
from tensorflow.keras import layers, losses, optimizers, metrics

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

# Définir la fonction de perte
loss_fn = losses.SparseCategoricalCrossentropy(from_logits=True)

# Définir l'optimiseur
optimizer = optimizers.Adam()

# Définir les métriques
train_loss = metrics.Mean(name='train_loss')
train_accuracy = metrics.SparseCategoricalAccuracy(name='train_accuracy')

# Préparer les données
(x_train, y_train), (x_test, y_test) = tf.keras.datasets.mnist.load_data()
x_train, x_test = x_train / 255.0, x_test / 255.0
x_train = x_train[..., tf.newaxis]
x_test = x_test[..., tf.newaxis]

# Créer un dataset TensorFlow
train_dataset = tf.data.Dataset.from_tensor_slices((x_train, y_train)).shuffle(60000).batch(32)

# Définir la fonction de pas d'entraînement
@tf.function
def train_step(images, labels):
    with tf.GradientTape() as tape:
        predictions = model(images, training=True)
        loss = loss_fn(labels, predictions)
    gradients = tape.gradient(loss, model.trainable_variables)
    optimizer.apply_gradients(zip(gradients, model.trainable_variables))

    train_loss(loss)
    train_accuracy(labels, predictions)

# Implémenter la boucle d'entraînement
epochs = 5

for epoch in range(epochs):
    for images, labels in train_dataset:
        train_step(images, labels)

    template = 'Epoch {}, Loss: {}, Accuracy: {}'
    print(template.format(epoch + 1, train_loss.result(), train_accuracy.result() * 100))

    # Réinitialiser les métriques pour la prochaine époque
    train_loss.reset_states()
    train_accuracy.reset_states()

# Définir la fonction de pas de test
@tf.function
def test_step(images, labels):
    predictions = model(images, training=False)
    loss = loss_fn(labels, predictions)

    train_loss(loss)
    train_accuracy(labels, predictions)

# Créer un dataset TensorFlow pour la validation
val_dataset = tf.data.Dataset.from_tensor_slices((x_test, y_test)).batch(32)

# Évaluer le modèle
for images, labels in val_dataset:
    test_step(images, labels)

template = 'Test Loss: {}, Test Accuracy: {}'
print(template.format(train_loss.result(), train_accuracy.result() * 100))

```

### Conclusion

En utilisant `tf.GradientTape`, vous pouvez contrôler chaque étape du processus d'entraînement de manière explicite. Cela vous permet d'ajouter des fonctionnalités spécifiques, comme des métriques personnalisées, des méthodes d'optimisation avancées, ou des manipulations de gradients. Cette approche offre une grande flexibilité pour personnaliser et optimiser l'entraînement de vos modèles de machine learning.
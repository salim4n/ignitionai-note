---
title : Custom Training Loop
description : Custom Training Loop
---

[Google Colab](https://colab.research.google.com/github/https-deeplearning-ai/tensorflow-3-public/blob/main/Course%202%20-%20Custom%20Training%20loops%2C%20Gradients%20and%20Distributed%20Training/Week%202%20-%20Simple%20Custom%20Training/C2_W2_Lab_2_training-categorical.ipynb)

Un **custom training loop** (boucle d'entraînement personnalisée) en TensorFlow vous permet de contrôler chaque étape du processus d'entraînement de manière explicite. Cela peut être utile pour des besoins spécifiques, comme l'ajout de métriques personnalisées, l'utilisation de méthodes d'optimisation avancées, ou la manipulation des gradients.

Voici les étapes typiques d'une boucle d'entraînement personnalisée :

1. **Initialisation des variables et des objets nécessaires** :
    - Définir le modèle.
    - Définir la fonction de perte.
    - Définir l'optimiseur.
    - Définir les métriques.
2. **Préparation des données** :
    - Charger et prétraiter les données d'entraînement et de validation.
3. **Boucle d'entraînement** :
    - Pour chaque époque :
        - Pour chaque lot de données :
            - Calculer les prédictions du modèle.
            - Calculer la perte.
            - Calculer les gradients.
            - Appliquer les gradients à l'optimiseur.
            - Mettre à jour les métriques.
    - Afficher les résultats à la fin de chaque époque.
4. **Évaluation du modèle** :
    - Évaluer le modèle sur les données de validation.

### Exemple complet

Voici un exemple complet d'une boucle d'entraînement personnalisée en utilisant TensorFlow :

```python
import tensorflow as tf
from tensorflow.keras import layers, losses, optimizers, metrics

# Étape 1 : Initialisation des variables et des objets nécessaires

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

model = SimpleModel()

# Définir la fonction de perte
loss_fn = losses.SparseCategoricalCrossentropy(from_logits=True)

# Définir l'optimiseur
optimizer = optimizers.Adam()

# Définir les métriques
train_loss = metrics.Mean(name='train_loss')
train_accuracy = metrics.SparseCategoricalAccuracy(name='train_accuracy')

# Étape 2 : Préparation des données

# Charger et prétraiter les données
(x_train, y_train), (x_test, y_test) = tf.keras.datasets.mnist.load_data()
x_train, x_test = x_train / 255.0, x_test / 255.0
x_train = x_train[..., tf.newaxis]
x_test = x_test[..., tf.newaxis]

# Créer un dataset TensorFlow
train_dataset = tf.data.Dataset.from_tensor_slices((x_train, y_train)).shuffle(60000).batch(32)

# Étape 3 : Boucle d'entraînement

@tf.function
def train_step(images, labels):
    with tf.GradientTape() as tape:
        predictions = model(images, training=True)
        loss = loss_fn(labels, predictions)
    gradients = tape.gradient(loss, model.trainable_variables)
    optimizer.apply_gradients(zip(gradients, model.trainable_variables))

    train_loss(loss)
    train_accuracy(labels, predictions)

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

# Étape 4 : Évaluation du modèle

# Créer un dataset TensorFlow pour la validation
val_dataset = tf.data.Dataset.from_tensor_slices((x_test, y_test)).batch(32)

@tf.function
def test_step(images, labels):
    predictions = model(images, training=False)
    loss = loss_fn(labels, predictions)

    train_loss(loss)
    train_accuracy(labels, predictions)

for images, labels in val_dataset:
    test_step(images, labels)

template = 'Test Loss: {}, Test Accuracy: {}'
print(template.format(train_loss.result(), train_accuracy.result() * 100))

```

### Explication des étapes

1. **Initialisation des variables et des objets nécessaires** :
    - Nous définissons un modèle simple avec quelques couches de convolution et de dense.
    - Nous définissons la fonction de perte (`SparseCategoricalCrossentropy`).
    - Nous définissons l'optimiseur (`Adam`).
    - Nous définissons les métriques (`Mean` pour la perte et `SparseCategoricalAccuracy` pour l'exactitude).
2. **Préparation des données** :
    - Nous chargeons et prétraitons les données MNIST.
    - Nous créons un dataset TensorFlow pour l'entraînement en utilisant `tf.data.Dataset`.
3. **Boucle d'entraînement** :
    - Nous définissons une fonction `train_step` qui utilise `tf.GradientTape` pour enregistrer les opérations et calculer les gradients.
    - Nous appliquons les gradients à l'optimiseur.
    - Nous mettons à jour les métriques de perte et d'exactitude.
    - Nous exécutons la boucle d'entraînement pour chaque époque et chaque lot de données.
    - Nous affichons les résultats à la fin de chaque époque et réinitialisons les métriques pour la prochaine époque.
4. **Évaluation du modèle** :
    - Nous créons un dataset TensorFlow pour la validation.
    - Nous définissons une fonction `test_step` pour évaluer le modèle sur les données de validation.
    - Nous exécutons la boucle d'évaluation et affichons les résultats.

En utilisant une boucle d'entraînement personnalisée, vous pouvez contrôler chaque étape du processus d'entraînement et ajouter des fonctionnalités spécifiques selon vos besoins.
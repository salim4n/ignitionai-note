---
title: Implémenter une boucle d'entraînement personnalisée avec TensorFlow Datasets
description: Implémenter une boucle d'entraînement personnalisée avec TensorFlow Datasets
---

Dans ce cours, nous allons apprendre à implémenter une boucle d'entraînement personnalisée en utilisant des données provenant de TensorFlow Datasets (TFDS). TensorFlow Datasets est une bibliothèque qui facilite l'accès à une vaste collection de jeux de données prêts à l'emploi pour l'apprentissage automatique.

## Prérequis

Avant de commencer, assurez-vous d'avoir installé les bibliothèques suivantes :

- TensorFlow
- TensorFlow Datasets

Vous pouvez les installer en utilisant pip :

```bash
pip install tensorflow tensorflow-datasets

```

## Étape 1 : Importer les bibliothèques nécessaires

Commencez par importer les bibliothèques nécessaires :

```python
import tensorflow as tf
import tensorflow_datasets as tfds

```

## Étape 2 : Charger les données

Nous allons utiliser le jeu de données MNIST pour cet exemple. Chargez les données en utilisant TFDS :

```python
# Charger le jeu de données MNIST
(ds_train, ds_test), ds_info = tfds.load(
    'mnist',
    split=['train', 'test'],
    shuffle_files=True,
    as_supervised=True,
    with_info=True,
)

```

## Étape 3 : Préparer les données

Nous devons préparer les données pour l'entraînement. Cela inclut la normalisation des images et la création de lots (batches) :

```python
def normalize_img(image, label):
    """Normalise les images dans la plage [0, 1]."""
    return tf.cast(image, tf.float32) / 255.0, label

# Appliquer la normalisation et créer des lots
ds_train = ds_train.map(normalize_img, num_parallel_calls=tf.data.AUTOTUNE)
ds_train = ds_train.cache()
ds_train = ds_train.shuffle(ds_info.splits['train'].num_examples)
ds_train = ds_train.batch(128)
ds_train = ds_train.prefetch(tf.data.AUTOTUNE)

ds_test = ds_test.map(normalize_img, num_parallel_calls=tf.data.AUTOTUNE)
ds_test = ds_test.batch(128)
ds_test = ds_test.cache()
ds_test = ds_test.prefetch(tf.data.AUTOTUNE)

```

## Étape 4 : Définir le modèle

Nous allons définir un modèle simple pour la classification des images MNIST :

```python
model = tf.keras.models.Sequential([
    tf.keras.layers.Flatten(input_shape=(28, 28, 1)),
    tf.keras.layers.Dense(128, activation='relu'),
    tf.keras.layers.Dense(10)
])

```

## Étape 5 : Définir la fonction de perte et l'optimiseur

Nous allons utiliser la fonction de perte Sparse Categorical Crossentropy et l'optimiseur Adam :

```python
loss_object = tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True)
optimizer = tf.keras.optimizers.Adam()

```

## Étape 6 : Définir les fonctions de perte et de précision

Nous avons besoin de fonctions pour calculer la perte et la précision :

```python
def loss(model, x, y, training):
    y_ = model(x, training=training)
    return loss_object(y_true=y, y_pred=y_)

def grad(model, inputs, targets):
    with tf.GradientTape() as tape:
        loss_value = loss(model, inputs, targets, training=True)
    return loss_value, tape.gradient(loss_value, model.trainable_variables)

```

## Étape 7 : Implémenter la boucle d'entraînement personnalisée

Nous allons maintenant implémenter la boucle d'entraînement personnalisée :

```python
# Fonction d'entraînement
def train(model, dataset, epochs):
    for epoch in range(epochs):
        for step, (x_batch_train, y_batch_train) in enumerate(dataset):
            loss_value, grads = grad(model, x_batch_train, y_batch_train)
            optimizer.apply_gradients(zip(grads, model.trainable_variables))

            if step % 200 == 0:
                print(f"Epoch {epoch + 1}, Step {step}, Loss: {loss_value.numpy()}")

# Entraîner le modèle
train(model, ds_train, epochs=5)

```

## Étape 8 : Évaluer le modèle

Enfin, nous allons évaluer le modèle sur le jeu de données de test :

```python
# Fonction d'évaluation
def evaluate(model, dataset):
    loss_aggregator = tf.keras.metrics.Mean()
    accuracy_aggregator = tf.keras.metrics.SparseCategoricalAccuracy()

    for x, y in dataset:
        y_pred = model(x, training=False)
        loss_aggregator.update_state(loss(model, x, y, training=False))
        accuracy_aggregator.update_state(y, y_pred)

    print(f"Test Loss: {loss_aggregator.result().numpy()}")
    print(f"Test Accuracy: {accuracy_aggregator.result().numpy() * 100}%")

# Évaluer le modèle
evaluate(model, ds_test)

```

## Conclusion

Dans ce cours, nous avons appris à implémenter une boucle d'entraînement personnalisée en utilisant des données provenant de TensorFlow Datasets. Nous avons chargé et préparé les données, défini un modèle, et implémenté une boucle d'entraînement personnalisée. Enfin, nous avons évalué le modèle sur le jeu de données de test.

Cette approche vous donne un contrôle total sur le processus d'entraînement et vous permet de personnaliser chaque étape selon vos besoins.
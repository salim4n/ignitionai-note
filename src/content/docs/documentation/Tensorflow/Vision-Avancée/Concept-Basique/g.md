---
title : Implémentation d'un classificateur d'images
description : Classification d'images
---

L'apprentissage par transfert est une technique puissante qui permet de réutiliser les connaissances apprises par un modèle pré-entraîné sur une grande quantité de données pour améliorer les performances sur une nouvelle tâche de classification d'images. Dans ce tutoriel, nous allons implémenter un classificateur d'images en utilisant l'apprentissage par transfert avec TensorFlow et Keras.

## Étape 1 : Préparation des données

Pour ce tutoriel, nous allons utiliser un jeu de données simple contenant des images de chats et de chiens. Vous pouvez utiliser le jeu de données de chats et de chiens de Kaggle ou tout autre jeu de données approprié.

### Chargement et prétraitement des données

```python
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator

# Chemin vers les données
train_dir = 'path_to_train_data'
val_dir = 'path_to_val_data'

# Paramètres de prétraitement
img_height, img_width = 224, 224
batch_size = 32

# Générateurs de données
train_datagen = ImageDataGenerator(rescale=1./255, validation_split=0.2)
val_datagen = ImageDataGenerator(rescale=1./255)

train_generator = train_datagen.flow_from_directory(
    train_dir,
    target_size=(img_height, img_width),
    batch_size=batch_size,
    class_mode='categorical',
    subset='training'
)

val_generator = val_datagen.flow_from_directory(
    val_dir,
    target_size=(img_height, img_width),
    batch_size=batch_size,
    class_mode='categorical'
)

```

## Étape 2 : Chargement du modèle pré-entraîné

Nous allons utiliser un modèle pré-entraîné comme VGG16, qui a été entraîné sur le jeu de données ImageNet. Nous allons remplacer les couches supérieures du modèle par de nouvelles couches adaptées à notre tâche de classification.

```python
from tensorflow.keras.applications import VGG16
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Dense, Flatten, Dropout

# Charger le modèle VGG16 pré-entraîné sans les couches supérieures
base_model = VGG16(weights='imagenet', include_top=False, input_shape=(img_height, img_width, 3))

# Ajouter des couches supérieures pour la nouvelle tâche
x = base_model.output
x = Flatten()(x)
x = Dense(256, activation='relu')(x)
x = Dropout(0.5)(x)
predictions = Dense(2, activation='softmax')(x)

# Créer le modèle final
model = Model(inputs=base_model.input, outputs=predictions)

# Geler les couches du modèle pré-entraîné
for layer in base_model.layers:
    layer.trainable = False

# Compiler le modèle
model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

# Afficher le résumé du modèle
model.summary()

```

## Étape 3 : Entraînement du modèle

Nous allons entraîner le modèle sur les données de formation et évaluer ses performances sur les données de validation.

```python
history = model.fit(
    train_generator,
    steps_per_epoch=len(train_generator),
    epochs=10,
    validation_data=val_generator,
    validation_steps=len(val_generator)
)

```

## Étape 4 : Fine-tuning (ajustement fin)

Après avoir entraîné les couches supérieures, nous pouvons dégeler certaines ou toutes les couches du modèle pré-entraîné et les entraîner avec un taux d'apprentissage plus faible pour améliorer les performances.

```python
# Décongeler les couches du modèle pré-entraîné
for layer in base_model.layers:
    layer.trainable = True

# Compiler le modèle avec un taux d'apprentissage plus faible
model.compile(optimizer=tf.keras.optimizers.Adam(1e-5), loss='categorical_crossentropy', metrics=['accuracy'])

# Entraîner le modèle complet
history = model.fit(
    train_generator,
    steps_per_epoch=len(train_generator),
    epochs=10,
    validation_data=val_generator,
    validation_steps=len(val_generator)
)

```

## Étape 5 : Évaluation du modèle

Nous allons évaluer le modèle sur les données de validation et afficher les résultats.

```python
val_loss, val_accuracy = model.evaluate(val_generator, steps=len(val_generator))
print(f'Validation Loss: {val_loss}')
print(f'Validation Accuracy: {val_accuracy}')

```

## Étape 6 : Visualisation des résultats

Nous allons visualiser les résultats de la classification sur quelques images de test.

```python
import matplotlib.pyplot as plt

def visualize_results(model, val_generator):
    images, labels = next(val_generator)
    predictions = model.predict(images)

    plt.figure(figsize=(12, 12))
    for i in range(4):
        plt.subplot(2, 2, i + 1)
        plt.imshow(images[i])
        plt.axis('off')
        plt.title(f'Predicted: {np.argmax(predictions[i])}, Actual: {np.argmax(labels[i])}')

    plt.show()

visualize_results(model, val_generator)

```

## Conclusion

Dans ce tutoriel, nous avons implémenté un classificateur d'images en utilisant l'apprentissage par transfert avec TensorFlow et Keras. Nous avons préparé les données, chargé un modèle pré-entraîné, ajouté de nouvelles couches supérieures, entraîné le modèle, effectué un fine-tuning, évalué les performances du modèle et visualisé les résultats. L'apprentissage par transfert est une technique puissante qui permet de réutiliser les connaissances apprises par un modèle pré-entraîné pour améliorer les performances sur une nouvelle tâche de classification d'images.
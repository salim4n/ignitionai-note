---
title: AutoEncoder CNN - Fashion MNIST
description: AutoEncoder CNN - Fashion MNIST
---

Voici comment vous pouvez construire un **AutoEncoder CNN (Convolutional Neural Network)** sur le dataset **Fashion MNIST**, qui contient des images de vêtements et d'accessoires. L'AutoEncoder basé sur des couches convolutionnelles est plus adapté pour capturer les caractéristiques spatiales des images.

### 1. Importer les bibliothèques nécessaires

Commencez par importer les bibliothèques requises pour construire et entraîner le modèle.

```python
import tensorflow as tf
from tensorflow.keras import layers, models
import matplotlib.pyplot as plt
import numpy as np

```

### 2. Charger et préparer les données Fashion MNIST

Le dataset **Fashion MNIST** contient des images en niveaux de gris de taille 28x28 pixels. Nous allons normaliser les images pour avoir des valeurs entre [0, 1].

```python
# Charger le dataset Fashion MNIST
(x_train, _), (x_test, _) = tf.keras.datasets.fashion_mnist.load_data()

# Normaliser les images pour avoir des valeurs entre [0, 1]
x_train = x_train.astype('float32') / 255.
x_test = x_test.astype('float32') / 255.

# Ajouter une dimension de canal (grayscale -> 1 canal)
x_train = np.expand_dims(x_train, axis=-1)
x_test = np.expand_dims(x_test, axis=-1)

# Afficher la forme des données
print(x_train.shape)  # (60000, 28, 28, 1)
print(x_test.shape)   # (10000, 28, 28, 1)

```

### 3. Construire l'architecture du CNN AutoEncoder

Un **AutoEncoder CNN** se compose de deux parties :

- **Encodeur** : Utilise des couches convolutionnelles pour encoder les caractéristiques.
- **Décodeur** : Utilise des couches de convolution transposée (ou upsampling) pour reconstruire l'image originale.

### Encodeur

L'encodeur va réduire progressivement la taille de l'image tout en capturant les caractéristiques importantes.

### Décodeur

Le décodeur va reconstruire l'image à partir de la représentation latente en augmentant progressivement la taille.

```python
def build_cnn_autoencoder():
    # Encodeur
    input_img = layers.Input(shape=(28, 28, 1))

    x = layers.Conv2D(32, (3, 3), activation='relu', padding='same')(input_img)
    x = layers.MaxPooling2D((2, 2), padding='same')(x)

    x = layers.Conv2D(64, (3, 3), activation='relu', padding='same')(x)
    x = layers.MaxPooling2D((2, 2), padding='same')(x)

    x = layers.Conv2D(128, (3, 3), activation='relu', padding='same')(x)
    encoded = layers.MaxPooling2D((2, 2), padding='same')(x)

    # Décodeur
    x = layers.Conv2D(128, (3, 3), activation='relu', padding='same')(encoded)
    x = layers.UpSampling2D((2, 2))(x)

    x = layers.Conv2D(64, (3, 3), activation='relu', padding='same')(x)
    x = layers.UpSampling2D((2, 2))(x)

    x = layers.Conv2D(32, (3, 3), activation='relu', padding='same')(x)
    x = layers.UpSampling2D((2, 2))(x)

    decoded = layers.Conv2D(1, (3, 3), activation='sigmoid', padding='same')(x)  # Sigmoid pour avoir des valeurs entre [0, 1]

    # Modèle complet AutoEncoder
    autoencoder = models.Model(input_img, decoded)
    return autoencoder

```

### 4. Compiler le modèle

Nous compilons l'AutoEncoder en utilisant l'optimiseur `adam` et la perte `mse` (Mean Squared Error) pour mesurer la différence entre les images originales et reconstruites.

```python
autoencoder = build_cnn_autoencoder()

# Compilation du modèle
autoencoder.compile(optimizer='adam', loss='mse', metrics=['accuracy'])

# Afficher le résumé du modèle
autoencoder.summary()

```

### 5. Entraîner le modèle

Entraînons maintenant l'AutoEncoder sur le dataset Fashion MNIST pour 50 époques.

```python
history = autoencoder.fit(
    x_train, x_train,  # Les images originales servent aussi de cibles
    epochs=50,
    batch_size=256,
    shuffle=True,
    validation_data=(x_test, x_test)
)

```

### 6. Visualiser les résultats

Une fois l'entraînement terminé, vous pouvez visualiser les images originales et les images reconstruites par l'AutoEncoder.

```python
# Faire des prédictions sur les images du jeu de test
decoded_images = autoencoder.predict(x_test)

# Affichage des images originales et reconstruites
n = 10  # Nombre d'images à afficher
plt.figure(figsize=(20, 4))
for i in range(n):
    # Images originales
    ax = plt.subplot(2, n, i + 1)
    plt.imshow(x_test[i].reshape(28, 28), cmap='gray')
    plt.axis('off')

    # Images reconstruites
    ax = plt.subplot(2, n, i + 1 + n)
    plt.imshow(decoded_images[i].reshape(28, 28), cmap='gray')
    plt.axis('off')
plt.show()

```

### Conclusion

Avec cet **AutoEncoder CNN**, vous pouvez efficacement encoder et décoder des images Fashion MNIST. Ce type de réseau est idéal pour capturer les motifs locaux et les relations spatiales dans les images, ce qui le rend beaucoup plus puissant qu'un AutoEncoder basé sur des couches denses (fully connected).

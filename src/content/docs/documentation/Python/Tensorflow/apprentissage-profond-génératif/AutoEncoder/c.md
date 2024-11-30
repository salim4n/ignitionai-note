---
title: AutoEncoder - MNIST
description: AutoEncoder - MNIST
---

Pour construire un **AutoEncoder** sur le dataset **MNIST**, suivez ces étapes détaillées.

### 1. Importer les bibliothèques nécessaires

Nous commencerons par importer les bibliothèques indispensables comme TensorFlow, NumPy, et Matplotlib pour la visualisation.

```python
import tensorflow as tf
from tensorflow.keras import layers, models
import numpy as np
import matplotlib.pyplot as plt

```

### 2. Charger et préparer les données MNIST

Le dataset **MNIST** contient des images de chiffres manuscrits. Nous allons charger ces images, les normaliser à l'échelle [0,1], et les redimensionner pour qu'elles soient adaptées à l'architecture de l'AutoEncoder.

```python
# Charger le dataset MNIST
(x_train, _), (x_test, _) = tf.keras.datasets.mnist.load_data()

# Normaliser les images à une échelle [0, 1]
x_train = x_train.astype('float32') / 255.
x_test = x_test.astype('float32') / 255.

# Reshaper les données pour qu'elles soient compatibles avec un réseau de neurones convolutif
x_train = np.reshape(x_train, (len(x_train), 28, 28, 1))
x_test = np.reshape(x_test, (len(x_test), 28, 28, 1))

```

### 3. Construire l'architecture de l'AutoEncoder

Un AutoEncoder se compose de deux parties :

- **L'encodeur** : Il réduit la dimensionnalité des données.
- **Le décodeur** : Il reconstruit les données à partir de la représentation comprimée.

### Encodeur

L'encodeur prend une image en entrée, applique des convolutions et du pooling pour réduire sa taille.

```python
def build_autoencoder():
    # Partie encodeur
    encoder_input = layers.Input(shape=(28, 28, 1))
    x = layers.Conv2D(32, (3, 3), activation='relu', padding='same')(encoder_input)
    x = layers.MaxPooling2D((2, 2), padding='same')(x)
    x = layers.Conv2D(16, (3, 3), activation='relu', padding='same')(x)
    encoder_output = layers.MaxPooling2D((2, 2), padding='same')(x)

    # Partie décodeur
    x = layers.Conv2D(16, (3, 3), activation='relu', padding='same')(encoder_output)
    x = layers.UpSampling2D((2, 2))(x)
    x = layers.Conv2D(32, (3, 3), activation='relu', padding='same')(x)
    x = layers.UpSampling2D((2, 2))(x)
    decoder_output = layers.Conv2D(1, (3, 3), activation='sigmoid', padding='same')(x)

    # Modèle AutoEncoder complet
    autoencoder = models.Model(encoder_input, decoder_output)
    return autoencoder

```

### 4. Compiler le modèle

Pour entraîner le modèle, nous devons le compiler avec un optimiseur (`adam`), une fonction de perte (ici `mse`, erreur quadratique moyenne), et une métrique (`accuracy` pour la précision).

```python
autoencoder = build_autoencoder()

# Compilation du modèle
autoencoder.compile(optimizer='adam', loss='mse')

```

### 5. Entraîner le modèle

Nous allons maintenant entraîner le modèle sur le jeu de données d'entraînement. Ici, nous formons le modèle sur 10 époques.

```python
autoencoder.fit(x_train, x_train,
                epochs=10,
                batch_size=256,
                shuffle=True,
                validation_data=(x_test, x_test))

```

### 6. Visualiser les résultats

Après l'entraînement, nous pouvons visualiser comment l'AutoEncoder a reconstruit les images à partir de leur version comprimée.

```python
# Prédictions sur le jeu de test
decoded_images = autoencoder.predict(x_test)

# Affichage de quelques images originales et reconstruites
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

Vous venez de construire un **AutoEncoder** sur MNIST qui est capable de compresser et de reconstruire des images. L'AutoEncoder peut être utilisé pour diverses tâches comme la réduction de dimensionnalité, la génération d'images, ou la détection d'anomalies.

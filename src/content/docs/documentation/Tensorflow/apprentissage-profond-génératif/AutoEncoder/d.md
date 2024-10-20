---
title: AutoEncoder DNN - MNIST
description: AutoEncoder DNN - MNIST
---

Pour construire un **AutoEncoder DNN (Deep Neural Network)** sur le dataset **MNIST**, nous allons créer un réseau entièrement connecté (fully connected) pour encoder et décoder les images. Voici comment procéder étape par étape.

### 1. Importer les bibliothèques nécessaires

Nous allons commencer par importer TensorFlow et d'autres bibliothèques utiles.

```python
import tensorflow as tf
from tensorflow.keras import layers, models
import numpy as np
import matplotlib.pyplot as plt

```

### 2. Charger et préparer les données MNIST

Le dataset MNIST contient des images de chiffres manuscrits. Nous allons charger ces images et les normaliser à une échelle [0, 1].

```python
# Charger le dataset MNIST
(x_train, _), (x_test, _) = tf.keras.datasets.mnist.load_data()

# Normaliser les images entre [0, 1]
x_train = x_train.astype('float32') / 255.
x_test = x_test.astype('float32') / 255.

# Aplatir les images (28x28 pixels) en vecteurs de 784 dimensions pour le DNN
x_train = x_train.reshape((len(x_train), np.prod(x_train.shape[1:])))
x_test = x_test.reshape((len(x_test), np.prod(x_test.shape[1:])))

```

### 3. Construire l'architecture du DNN AutoEncoder

L'AutoEncoder DNN a deux parties :

- **Encodeur** : Réduit la dimensionnalité de l'entrée.
- **Décodeur** : Reconstruit l'image originale à partir de la représentation comprimée.

### Encodeur

Nous allons construire un encodeur avec des couches denses (fully connected) pour réduire progressivement la dimensionnalité.

### Décodeur

Le décodeur inverse ce processus en augmentant progressivement la dimension jusqu'à retrouver la taille originale de l'image.

```python
def build_dnn_autoencoder():
    # Encodeur
    input_img = layers.Input(shape=(784,))
    encoded = layers.Dense(128, activation='relu')(input_img)
    encoded = layers.Dense(64, activation='relu')(encoded)
    encoded = layers.Dense(32, activation='relu')(encoded)

    # Décodeur
    decoded = layers.Dense(64, activation='relu')(encoded)
    decoded = layers.Dense(128, activation='relu')(decoded)
    decoded = layers.Dense(784, activation='sigmoid')(decoded)  # Sigmoid pour avoir des valeurs entre [0, 1]

    # Modèle AutoEncoder complet
    autoencoder = models.Model(input_img, decoded)
    return autoencoder

```

### 4. Compiler le modèle

Nous compilons le modèle avec l'optimiseur `adam`, la fonction de perte `mse` (Mean Squared Error), et une métrique pour suivre la progression (`accuracy`).

```python
autoencoder = build_dnn_autoencoder()

# Compilation du modèle
autoencoder.compile(optimizer='adam', loss='mse', metrics=['accuracy'])

```

### 5. Entraîner le modèle

Entraînons maintenant le modèle sur le jeu de données MNIST pour 50 époques.

```python
history = autoencoder.fit(
    x_train, x_train,  # L'entrée et la cible sont les mêmes (les images elles-mêmes)
    epochs=50,
    batch_size=256,
    shuffle=True,
    validation_data=(x_test, x_test)
)

```

### 6. Visualiser les résultats

Après l'entraînement, vous pouvez visualiser les images originales et les images reconstruites par l'AutoEncoder.

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

Vous avez maintenant construit et entraîné un **AutoEncoder DNN** sur le dataset **MNIST**. Ce type de réseau peut être utilisé pour la compression d'images, la réduction de dimension, ou encore pour la détection d'anomalies. En ajustant la taille des couches cachées dans l'encodeur et le décodeur, vous pouvez contrôler la quantité d'information compressée dans l'AutoEncoder.

---
title: Noisy CNN AutoEncoder - Fashion MNIST
description: Noisy CNN AutoEncoder - Fashion MNIST
---

Un **Noisy CNN AutoEncoder** est une variante de l'AutoEncoder classique où l'on introduit du bruit dans les images d'entrée afin que l'AutoEncoder apprenne à éliminer ce bruit et à reconstruire des images nettes. Cela peut être particulièrement utile pour des tâches telles que la débruitage d'images.

Voici comment construire un **Noisy CNN AutoEncoder** en utilisant le dataset **Fashion MNIST**.

### 1. Importer les bibliothèques nécessaires

```python
import tensorflow as tf
from tensorflow.keras import layers, models
import numpy as np
import matplotlib.pyplot as plt

```

### 2. Charger et préparer les données Fashion MNIST

On va ajouter du bruit aux images pour simuler des images bruitées. Le bruit est généralement du bruit gaussien ajouté aux valeurs de pixels.

```python
# Charger le dataset Fashion MNIST
(x_train, _), (x_test, _) = tf.keras.datasets.fashion_mnist.load_data()

# Normaliser les images pour avoir des valeurs entre [0, 1]
x_train = x_train.astype('float32') / 255.
x_test = x_test.astype('float32') / 255.

# Ajouter une dimension de canal (grayscale -> 1 canal)
x_train = np.expand_dims(x_train, axis=-1)
x_test = np.expand_dims(x_test, axis=-1)

# Ajouter du bruit gaussien aux images
noise_factor = 0.5
x_train_noisy = x_train + noise_factor * np.random.normal(loc=0.0, scale=1.0, size=x_train.shape)
x_test_noisy = x_test + noise_factor * np.random.normal(loc=0.0, scale=1.0, size=x_test.shape)

# Clip les valeurs entre 0 et 1
x_train_noisy = np.clip(x_train_noisy, 0., 1.)
x_test_noisy = np.clip(x_test_noisy, 0., 1.)

# Afficher quelques exemples d'images bruitées
n = 10
plt.figure(figsize=(20, 2))
for i in range(n):
    ax = plt.subplot(1, n, i+1)
    plt.imshow(x_train_noisy[i].reshape(28, 28), cmap='gray')
    plt.axis('off')
plt.show()

```

### 3. Construire l'architecture du Noisy CNN AutoEncoder

Nous allons utiliser une architecture CNN similaire à celle d'un AutoEncoder classique, mais cette fois avec des images bruitées en entrée.

```python
def build_noisy_cnn_autoencoder():
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

    # Modèle AutoEncoder
    autoencoder = models.Model(input_img, decoded)
    return autoencoder

```

### 4. Compiler et entraîner le modèle

Nous allons entraîner l'AutoEncoder pour reconstruire les images originales à partir des images bruitées.

```python
# Construire le modèle
autoencoder = build_noisy_cnn_autoencoder()

# Compilation du modèle
autoencoder.compile(optimizer='adam', loss='mse', metrics=['accuracy'])

# Entraîner l'AutoEncoder avec les images bruitées en entrée
history = autoencoder.fit(
    x_train_noisy, x_train,  # Entrée bruitée et image d'origine comme cible
    epochs=50,
    batch_size=256,
    shuffle=True,
    validation_data=(x_test_noisy, x_test)
)

```

### 5. Visualiser les résultats

Après l'entraînement, vous pouvez visualiser comment l'AutoEncoder reconstruit les images originales à partir des images bruitées.

```python
# Prédictions sur les images bruitées du jeu de test
decoded_images = autoencoder.predict(x_test_noisy)

# Affichage des images bruitées et des images reconstruites
n = 10
plt.figure(figsize=(20, 4))
for i in range(n):
    # Images bruitées
    ax = plt.subplot(3, n, i + 1)
    plt.imshow(x_test_noisy[i].reshape(28, 28), cmap='gray')
    plt.axis('off')

    # Images reconstruites
    ax = plt.subplot(3, n, i + 1 + n)
    plt.imshow(decoded_images[i].reshape(28, 28), cmap='gray')
    plt.axis('off')

    # Images originales
    ax = plt.subplot(3, n, i + 1 + 2*n)
    plt.imshow(x_test[i].reshape(28, 28), cmap='gray')
    plt.axis('off')
plt.show()

```

### Conclusion

Ce **Noisy CNN AutoEncoder** prend en entrée des images bruitées et apprend à reconstruire des images non bruitées. C'est une technique puissante pour la réduction du bruit et la débruitage d'images, en utilisant des architectures CNN pour capturer les caractéristiques spatiales des images.

---
title: Créer un Variational AutoEncoder (VAE)
description: Créer un Variational AutoEncoder (VAE)
---

Un **Variational AutoEncoder (VAE)** est une variante d'AutoEncoder qui apprend à générer de nouvelles données similaires à celles de l'ensemble d'entraînement en imposant une distribution probabiliste sur l'espace latent. En VAE, l'objectif est d'apprendre une représentation latente distribuée de manière gaussienne, ce qui permet de générer des échantillons aléatoires depuis cet espace latent pour créer de nouvelles images.

Voici comment construire et entraîner un **VAE** avec TensorFlow/Keras :

### 1. Importer les bibliothèques nécessaires

```python
import tensorflow as tf
from tensorflow.keras import layers, models
import numpy as np
import matplotlib.pyplot as plt

```

### 2. Charger et préparer les données (Fashion MNIST)

Nous allons utiliser le dataset **Fashion MNIST** pour entraîner notre VAE.

```python
# Charger le dataset Fashion MNIST
(x_train, _), (x_test, _) = tf.keras.datasets.fashion_mnist.load_data()

# Normaliser les images pour avoir des valeurs entre [0, 1] et ajouter une dimension de canal (grayscale -> 1 canal)
x_train = x_train.astype('float32') / 255.
x_test = x_test.astype('float32') / 255.
x_train = np.expand_dims(x_train, axis=-1)
x_test = np.expand_dims(x_test, axis=-1)

```

### 3. Architecture du VAE

Le VAE se compose de trois parties :

1. **Encodeur** : Il mappe les images d'entrée vers une distribution latente.
2. **Rééchantillonnage** : Une étape qui applique une technique appelée "reparameterization trick" pour échantillonner les points de l'espace latent.
3. **Décodeur** : Il reconstruit les images à partir des points latents.

### a. Fonction de rééchantillonnage

Nous échantillonnons depuis une distribution normale en utilisant le "reparameterization trick".

```python
def sampling(args):
    z_mean, z_log_var = args
    batch = tf.shape(z_mean)[0]
    dim = tf.shape(z_mean)[1]
    epsilon = tf.keras.backend.random_normal(shape=(batch, dim))  # Bruit gaussien
    return z_mean + tf.exp(0.5 * z_log_var) * epsilon

```

### b. Construire l'encodeur

L'encodeur encode les images en un vecteur latent (avec une moyenne et une variance log).

```python
latent_dim = 2  # Taille de l'espace latent

# Encodeur
input_img = layers.Input(shape=(28, 28, 1))
x = layers.Conv2D(32, (3, 3), activation='relu', padding='same')(input_img)
x = layers.MaxPooling2D((2, 2), padding='same')(x)
x = layers.Conv2D(64, (3, 3), activation='relu', padding='same')(x)
x = layers.MaxPooling2D((2, 2), padding='same')(x)
x = layers.Flatten()(x)
x = layers.Dense(16, activation='relu')(x)

# Variables latentes
z_mean = layers.Dense(latent_dim)(x)
z_log_var = layers.Dense(latent_dim)(x)

# Échantillonnage
z = layers.Lambda(sampling, output_shape=(latent_dim,))([z_mean, z_log_var])

```

### c. Construire le décodeur

Le décodeur reconstruit les images à partir des vecteurs latents échantillonnés.

```python
# Décodeur
latent_inputs = layers.Input(shape=(latent_dim,))
x = layers.Dense(7 * 7 * 64, activation='relu')(latent_inputs)
x = layers.Reshape((7, 7, 64))(x)
x = layers.Conv2DTranspose(64, (3, 3), activation='relu', padding='same')(x)
x = layers.UpSampling2D((2, 2))(x)
x = layers.Conv2DTranspose(32, (3, 3), activation='relu', padding='same')(x)
x = layers.UpSampling2D((2, 2))(x)
decoded_img = layers.Conv2DTranspose(1, (3, 3), activation='sigmoid', padding='same')(x)

```

### d. Construire le modèle VAE

Nous créons ensuite le modèle VAE complet, qui comprend l'encodeur, la rééchantillonnage et le décodeur.

```python
# Modèle encodeur
encoder = models.Model(input_img, [z_mean, z_log_var, z], name='encoder')

# Modèle décodeur
decoder = models.Model(latent_inputs, decoded_img, name='decoder')

# VAE
output = decoder(encoder(input_img)[2])  # On passe z dans le décodeur
vae = models.Model(input_img, output, name='vae')

```

### 4. Définir la fonction de perte

La perte du VAE combine deux termes :

1. **Perte de reconstruction** : Erreur entre l'image d'entrée et l'image reconstruite.
2. **Perte KL divergence** : Divergence entre la distribution latente apprise et une distribution normale standard.

```python
# Perte de reconstruction (entropie croisée binaire)
reconstruction_loss = tf.keras.losses.binary_crossentropy(input_img, output)
reconstruction_loss *= 28 * 28  # Multiplier par la taille de l'image
reconstruction_loss = tf.reduce_mean(reconstruction_loss)

# Perte KL divergence
kl_loss = 1 + z_log_var - tf.square(z_mean) - tf.exp(z_log_var)
kl_loss = tf.reduce_sum(kl_loss, axis=-1)
kl_loss *= -0.5
kl_loss = tf.reduce_mean(kl_loss)

# Perte totale
vae_loss = reconstruction_loss + kl_loss
vae.add_loss(vae_loss)

```

### 5. Compiler et entraîner le modèle

Nous compilons ensuite le modèle et l'entraînons.

```python
vae.compile(optimizer='adam')
vae.fit(x_train, x_train, epochs=50, batch_size=128, validation_data=(x_test, x_test))

```

### 6. Générer des images à partir de l'espace latent

Pour générer de nouvelles images, vous pouvez échantillonner aléatoirement depuis l'espace latent.

```python
# Générer des images depuis l'espace latent
def plot_latent_images(decoder, n=30, figsize=15):
    # Créer un quadrillage de l'espace latent
    grid_x = np.linspace(-2, 2, n)
    grid_y = np.linspace(-2, 2, n)

    figure = np.zeros((28 * n, 28 * n))
    for i, yi in enumerate(grid_y):
        for j, xi in enumerate(grid_x):
            z_sample = np.array([[xi, yi]])
            x_decoded = decoder.predict(z_sample)
            digit = x_decoded[0].reshape(28, 28)
            figure[i * 28: (i + 1) * 28, j * 28: (j + 1) * 28] = digit

    plt.figure(figsize=(figsize, figsize))
    plt.imshow(figure, cmap='Greys_r')
    plt.show()

# Affichage des images générées
plot_latent_images(decoder)

```

### Conclusion

Ce **Variational AutoEncoder (VAE)** est un puissant générateur de nouvelles images, en apprenant à comprimer les données dans un espace latent, puis à les reconstruire avec un décodeur. L'auto-encodeur variationnel est souvent utilisé dans des applications de génération d'images et de compression de données.

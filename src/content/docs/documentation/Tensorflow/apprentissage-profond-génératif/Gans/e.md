---
title: Construire un DCGAN sur Fashion MNIST
description: Construire un DCGAN sur Fashion MNIST
---

Un DCGAN (Deep Convolutional Generative Adversarial Network) est une variante des GAN qui utilise des réseaux de neurones convolutionnels pour générer des images. Dans cet exemple, nous allons construire un DCGAN qui génère des images à partir du jeu de données Fashion MNIST.

### Étapes pour construire un DCGAN

1. **Préparer les données**
2. **Définir le modèle du générateur**
3. **Définir le modèle du discriminateur**
4. **Construire le modèle DCGAN**
5. **Entraîner le DCGAN**
6. **Visualiser les résultats**

### 1. Préparer les Données

Nous allons charger et prétraiter le jeu de données Fashion MNIST.

```python
import numpy as np
import matplotlib.pyplot as plt
from tensorflow.keras.datasets import fashion_mnist

# Charger le jeu de données
(X_train, _), (_, _) = fashion_mnist.load_data()
X_train = X_train / 255.0  # Normaliser les images entre 0 et 1
X_train = np.expand_dims(X_train, axis=-1)  # Ajouter une dimension pour les canaux

```

### 2. Définir le Modèle du Générateur

Le générateur transforme un vecteur de bruit aléatoire en une image.

```python
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Reshape, Conv2DTranspose, BatchNormalization, LeakyReLU

def build_generator(latent_dim):
    model = Sequential()
    model.add(Dense(256 * 7 * 7, activation='relu', input_dim=latent_dim))
    model.add(Reshape((7, 7, 256)))
    model.add(BatchNormalization(momentum=0.8))

    model.add(Conv2DTranspose(128, kernel_size=3, strides=2, padding='same'))
    model.add(BatchNormalization(momentum=0.8))
    model.add(LeakyReLU(alpha=0.2))

    model.add(Conv2DTranspose(64, kernel_size=3, strides=2, padding='same'))
    model.add(BatchNormalization(momentum=0.8))
    model.add(LeakyReLU(alpha=0.2))

    model.add(Conv2DTranspose(1, kernel_size=3, padding='same', activation='tanh'))

    return model

latent_dim = 100  # Dimension du bruit
generator = build_generator(latent_dim)

```

### 3. Définir le Modèle du Discriminateur

Le discriminateur détermine si une image est réelle ou générée.

```python
from tensorflow.keras.layers import Conv2D, Flatten

def build_discriminator(img_shape):
    model = Sequential()
    model.add(Conv2D(64, kernel_size=3, strides=2, input_shape=img_shape, padding='same'))
    model.add(LeakyReLU(alpha=0.2))

    model.add(Conv2D(128, kernel_size=3, strides=2, padding='same'))
    model.add(LeakyReLU(alpha=0.2))

    model.add(Flatten())
    model.add(Dense(1, activation='sigmoid'))  # Classification binaire
    return model

img_shape = (28, 28, 1)
discriminator = build_discriminator(img_shape)

# Compiler le discriminateur
discriminator.compile(loss='binary_crossentropy', optimizer='adam', metrics=['accuracy'])

```

### 4. Construire le Modèle DCGAN

Le modèle DCGAN combine le générateur et le discriminateur.

```python
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input

discriminator.trainable = False  # Le discriminateur ne sera pas entraîné lors de l'entraînement du DCGAN
dcgan_input = Input(shape=(latent_dim,))
generated_image = generator(dcgan_input)
dcgan_output = discriminator(generated_image)
dcgan = Model(dcgan_input, dcgan_output)

# Compiler le DCGAN
dcgan.compile(loss='binary_crossentropy', optimizer='adam')

```

### 5. Entraîner le DCGAN

Nous allons entraîner le DCGAN en alternant entre l'entraînement du générateur et celui du discriminateur.

```python
def train_dcgan(dcgan, generator, discriminator, epochs, batch_size):
    for epoch in range(epochs):
        # ---------------------
        # Entraîner le Discriminateur
        # ---------------------
        # Sélectionner un échantillon aléatoire d'images réelles
        idx = np.random.randint(0, X_train.shape[0], batch_size)
        real_images = X_train[idx]

        # Générer des échantillons de bruit aléatoire
        noise = np.random.normal(0, 1, (batch_size, latent_dim))
        fake_images = generator.predict(noise)

        # Créer les étiquettes pour les images réelles et générées
        real_labels = np.ones((batch_size, 1))  # Étiquettes réelles
        fake_labels = np.zeros((batch_size, 1))  # Étiquettes générées

        # Entraîner le discriminateur
        d_loss_real = discriminator.train_on_batch(real_images, real_labels)
        d_loss_fake = discriminator.train_on_batch(fake_images, fake_labels)
        d_loss = 0.5 * np.add(d_loss_real, d_loss_fake)

        # ---------------------
        # Entraîner le Générateur
        # ---------------------
        noise = np.random.normal(0, 1, (batch_size, latent_dim))  # Bruit pour le générateur
        valid_labels = np.ones((batch_size, 1))  # On veut que le générateur produise des images "réelles"

        # Entraîner le générateur
        g_loss = dcgan.train_on_batch(noise, valid_labels)

        # Afficher les pertes
        print(f"{epoch}/{epochs} [D loss: {d_loss[0]:.4f}, acc.: {100*d_loss[1]:.2f}%] [G loss: {g_loss:.4f}]")

# Paramètres d'entraînement
epochs = 10000
batch_size = 64

# Entraîner le DCGAN
train_dcgan(dcgan, generator, discriminator, epochs, batch_size)

```

### 6. Visualiser les Résultats

Nous allons visualiser les images générées après l'entraînement.

```python
def plot_generated_images(generator, epoch, latent_dim):
    noise = np.random.normal(0, 1, (16, latent_dim))
    generated_images = generator.predict(noise)
    generated_images = generated_images.reshape(16, 28, 28)

    plt.figure(figsize=(10, 10))
    for i in range(generated_images.shape[0]):
        plt.subplot(4, 4, i + 1)
        plt.imshow(generated_images[i], interpolation='nearest', cmap='gray')
        plt.axis('off')
    plt.tight_layout()
    plt.savefig(f"dcgan_generated_epoch_{epoch}.png")
    plt.show()

# Exemple d'affichage des résultats
plot_generated_images(generator, 10000, latent_dim)

```

### Conclusion

Vous avez maintenant construit un DCGAN capable de générer des images du jeu de données Fashion MNIST. Les GAN peuvent être améliorés et ajustés pour générer des images de meilleure qualité en expérimentant avec les architectures et les hyperparamètres. N'hésitez pas à explorer et à personnaliser votre modèle !

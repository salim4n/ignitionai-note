---
title: Entraîner un GAN
description: Entraîner un GAN
---

L’entraînement d’un réseau antagoniste génératif (GAN) consiste à faire alternance entre l’entraînement du générateur et celui du discriminateur. Voici un guide étape par étape pour entraîner un GAN, en utilisant TensorFlow et Keras.

### 1. **Préparer le Jeu de Données**

Pour cet exemple, nous utiliserons le jeu de données **Fashion MNIST**, qui contient des images de vêtements. Assurons-nous d'importer les bibliothèques nécessaires et de charger les données :

```python
import numpy as np
import matplotlib.pyplot as plt
from tensorflow.keras.datasets import fashion_mnist

# Charger le jeu de données
(X_train, _), (_, _) = fashion_mnist.load_data()
X_train = X_train / 255.0  # Normaliser les images entre 0 et 1
X_train = np.expand_dims(X_train, axis=-1)  # Ajouter une dimension pour la couleur

```

### 2. **Définir les Modèles du Générateur et du Discriminateur**

Nous allons utiliser les architectures que nous avons définies précédemment. Voici un rappel :

```python
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Reshape, Flatten, Conv2DTranspose, Conv2D, LeakyReLU

# Générateur
def build_generator(latent_dim):
    model = Sequential()
    model.add(Dense(256, activation='relu', input_dim=latent_dim))
    model.add(Dense(512, activation='relu'))
    model.add(Dense(1024, activation='relu'))
    model.add(Dense(28 * 28 * 1, activation='tanh'))  # Pour Fashion MNIST
    model.add(Reshape((28, 28, 1)))
    return model

# Discriminateur
def build_discriminator(img_shape):
    model = Sequential()
    model.add(Conv2D(64, kernel_size=3, strides=2, input_shape=img_shape, padding='same'))
    model.add(LeakyReLU(alpha=0.2))
    model.add(Conv2D(128, kernel_size=3, strides=2, padding='same'))
    model.add(LeakyReLU(alpha=0.2))
    model.add(Flatten())
    model.add(Dense(1, activation='sigmoid'))
    return model

# Paramètres
latent_dim = 100
img_shape = (28, 28, 1)

# Créer les modèles
generator = build_generator(latent_dim)
discriminator = build_discriminator(img_shape)

# Compiler le discriminateur
discriminator.compile(loss='binary_crossentropy', optimizer='adam', metrics=['accuracy'])

```

### 3. **Construire le Modèle GAN**

Nous devons maintenant construire le modèle GAN en combinant le générateur et le discriminateur :

```python
from tensorflow.keras.models import Model

# Créer le GAN
discriminator.trainable = False  # On ne veut pas entraîner le discriminateur pendant l'entraînement du GAN
gan_input = Input(shape=(latent_dim,))
generated_image = generator(gan_input)
gan_output = discriminator(generated_image)
gan = Model(gan_input, gan_output)

# Compiler le GAN
gan.compile(loss='binary_crossentropy', optimizer='adam')

```

### 4. **Entraîner le GAN**

L'entraînement d'un GAN implique d'alterner entre l'entraînement du discriminateur et du générateur. Voici comment cela se fait :

```python
def train_gan(gan, generator, discriminator, epochs, batch_size):
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
        fake_labels = np.zeros((batch_size, 1))  # Étiquettes fausses

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
        g_loss = gan.train_on_batch(noise, valid_labels)

        # Afficher les pertes
        print(f"{epoch}/{epochs} [D loss: {d_loss[0]:.4f}, acc.: {100*d_loss[1]:.2f}%] [G loss: {g_loss:.4f}]")

# Paramètres d'entraînement
epochs = 10000
batch_size = 64

# Entraîner le GAN
train_gan(gan, generator, discriminator, epochs, batch_size)

```

### 5. **Visualiser les Résultats**

Il est souvent utile de visualiser les images générées pendant l'entraînement pour voir les progrès du GAN.

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
    plt.savefig(f"gan_generated_epoch_{epoch}.png")
    plt.show()

# Exemple d'affichage des résultats
plot_generated_images(generator, 10000, latent_dim)

```

### Résumé

1. **Préparation des Données** : Normaliser et préparer les images.
2. **Création des Modèles** : Construire le générateur et le discriminateur.
3. **Entraînement** : Alternance entre l'entraînement des deux modèles.
4. **Visualisation** : Afficher les résultats générés.

En suivant ces étapes, vous pourrez construire et entraîner votre propre GAN pour générer des images, que ce soit sur Fashion MNIST ou sur d'autres ensembles de données. N'hésitez pas à expérimenter avec différentes architectures et paramètres pour améliorer les résultats !

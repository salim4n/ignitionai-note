---
title: Construire un GAN de Génération de Visages avec le Jeu de Données des Célébrités
description: Construire un GAN de Génération de Visages avec le Jeu de Données des Célébrités
---

Dans cet exemple, nous allons construire un GAN (Generative Adversarial Network) capable de générer des visages à partir d'un jeu de données de célébrités. Nous utiliserons le jeu de données CelebA, qui contient des milliers d'images de visages de célébrités.

### Étapes à Suivre

1. **Installer les bibliothèques nécessaires**
2. **Préparer le jeu de données**
3. **Définir le modèle du générateur**
4. **Définir le modèle du discriminateur**
5. **Construire le modèle GAN**
6. **Entraîner le GAN**
7. **Visualiser les résultats**

### 1. Installer les Bibliothèques Nécessaires

Assurez-vous d'avoir TensorFlow et d'autres bibliothèques installées.

```bash
pip install tensorflow numpy matplotlib

```

### 2. Préparer le Jeu de Données

Nous allons télécharger et prétraiter le jeu de données CelebA. Ce jeu de données contient des images de visages, et nous allons les redimensionner et normaliser.

```python
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import os

# Définir le chemin du jeu de données
dataset_path = 'path/to/celeba'  # Remplacez par le chemin de votre jeu de données

# Prétraiter les images
def preprocess_images(img_size=(64, 64)):
    datagen = ImageDataGenerator(rescale=1.0 / 255.0)  # Normalisation des images
    dataset = datagen.flow_from_directory(dataset_path,
                                          target_size=img_size,
                                          class_mode=None,
                                          batch_size=32)
    return dataset

# Charger les images
img_size = (64, 64)
celeba_dataset = preprocess_images(img_size)

```

### 3. Définir le Modèle du Générateur

Le générateur transformera un vecteur de bruit en une image de visage.

```python
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Reshape, Conv2DTranspose, BatchNormalization, LeakyReLU

def build_generator(latent_dim):
    model = Sequential()
    model.add(Dense(256 * 16 * 16, activation='relu', input_dim=latent_dim))
    model.add(Reshape((16, 16, 256)))
    model.add(BatchNormalization(momentum=0.8))

    model.add(Conv2DTranspose(128, kernel_size=3, strides=2, padding='same'))
    model.add(BatchNormalization(momentum=0.8))
    model.add(LeakyReLU(alpha=0.2))

    model.add(Conv2DTranspose(64, kernel_size=3, strides=2, padding='same'))
    model.add(BatchNormalization(momentum=0.8))
    model.add(LeakyReLU(alpha=0.2))

    model.add(Conv2DTranspose(3, kernel_size=3, padding='same', activation='tanh'))  # 3 canaux pour RGB

    return model

latent_dim = 100  # Dimension du bruit
generator = build_generator(latent_dim)

```

### 4. Définir le Modèle du Discriminateur

Le discriminateur déterminera si une image est réelle ou générée.

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

img_shape = (64, 64, 3)
discriminator = build_discriminator(img_shape)

# Compiler le discriminateur
discriminator.compile(loss='binary_crossentropy', optimizer='adam', metrics=['accuracy'])

```

### 5. Construire le Modèle GAN

Le modèle GAN combine le générateur et le discriminateur.

```python
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input

discriminator.trainable = False  # Le discriminateur ne sera pas entraîné lors de l'entraînement du GAN
gan_input = Input(shape=(latent_dim,))
generated_image = generator(gan_input)
gan_output = discriminator(generated_image)
gan = Model(gan_input, gan_output)

# Compiler le GAN
gan.compile(loss='binary_crossentropy', optimizer='adam')

```

### 6. Entraîner le GAN

Nous allons entraîner le GAN en alternant entre l'entraînement du générateur et celui du discriminateur.

```python
def train_gan(gan, generator, discriminator, dataset, epochs, batch_size):
    for epoch in range(epochs):
        # ---------------------
        # Entraîner le Discriminateur
        # ---------------------
        real_images = dataset.next()  # Obtenir un lot d'images réelles

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
        g_loss = gan.train_on_batch(noise, valid_labels)

        # Afficher les pertes
        print(f"{epoch}/{epochs} [D loss: {d_loss[0]:.4f}, acc.: {100*d_loss[1]:.2f}%] [G loss: {g_loss:.4f}]")

# Paramètres d'entraînement
epochs = 10000
batch_size = 64

# Entraîner le GAN
train_gan(gan, generator, discriminator, celeba_dataset, epochs, batch_size)

```

### 7. Visualiser les Résultats

Nous allons visualiser les images générées après l'entraînement.

```python
import matplotlib.pyplot as plt

def plot_generated_images(generator, epoch, latent_dim):
    noise = np.random.normal(0, 1, (16, latent_dim))
    generated_images = generator.predict(noise)
    generated_images = (generated_images + 1) / 2.0  # Ramener les valeurs entre 0 et 1

    plt.figure(figsize=(10, 10))
    for i in range(generated_images.shape[0]):
        plt.subplot(4, 4, i + 1)
        plt.imshow(generated_images[i])
        plt.axis('off')
    plt.tight_layout()
    plt.savefig(f"gan_generated_epoch_{epoch}.png")
    plt.show()

# Exemple d'affichage des résultats
plot_generated_images(generator, 10000, latent_dim)

```

### Conclusion

Vous avez maintenant construit un GAN capable de générer des visages à partir du jeu de données des célébrités. Les GANs peuvent nécessiter des ajustements et des améliorations pour produire des images de meilleure qualité. N'hésitez pas à explorer différentes architectures et hyperparamètres pour obtenir les meilleurs résultats !

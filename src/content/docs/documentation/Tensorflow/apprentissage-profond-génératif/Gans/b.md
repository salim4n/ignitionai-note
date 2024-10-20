---
title: Concevoir votre première architecture GAN
description: Concevoir votre première architecture GAN
---

Les réseaux antagonistes génératifs (GAN) sont une classe de modèles d'apprentissage non supervisé qui impliquent deux réseaux de neurones : un générateur et un discriminateur. Voici un aperçu de la conception d'une architecture GAN de base.

### 1. **Composants de l'architecture GAN**

- **Générateur (Generator)** :
  - Prend un vecteur de bruit aléatoire comme entrée (généralement échantillonné à partir d'une distribution normale).
  - Transforme ce bruit en un échantillon de données, comme une image.
  - A pour objectif de produire des échantillons qui ressemblent aux données réelles.
- **Discriminateur (Discriminator)** :
  - Prend en entrée à la fois des échantillons réels (provenant du jeu de données) et des échantillons générés (provenant du générateur).
  - Tente de classer ces échantillons comme réels ou faux.
  - A pour objectif d'améliorer la capacité à distinguer les échantillons générés des échantillons réels.

### 2. **Architecture du Générateur**

```python
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Reshape, Flatten, Conv2DTranspose

def build_generator(latent_dim):
    model = Sequential()
    model.add(Dense(256, activation='relu', input_dim=latent_dim))
    model.add(Dense(512, activation='relu'))
    model.add(Dense(1024, activation='relu'))
    model.add(Dense(28 * 28 * 1, activation='tanh'))  # Pour MNIST, par exemple
    model.add(Reshape((28, 28, 1)))  # Redimensionne en image
    return model

```

### 3. **Architecture du Discriminateur**

```python
from tensorflow.keras.layers import Conv2D, LeakyReLU

def build_discriminator(img_shape):
    model = Sequential()
    model.add(Conv2D(64, kernel_size=3, strides=2, input_shape=img_shape, padding='same'))
    model.add(LeakyReLU(alpha=0.2))
    model.add(Conv2D(128, kernel_size=3, strides=2, padding='same'))
    model.add(LeakyReLU(alpha=0.2))
    model.add(Flatten())
    model.add(Dense(1, activation='sigmoid'))  # Pour classification binaire
    return model

```

### 4. **Compilation du GAN**

Pour créer le modèle GAN, nous combinons le générateur et le discriminateur.

```python
from tensorflow.keras.optimizers import Adam

def build_gan(generator, discriminator):
    model = Sequential()
    model.add(generator)
    model.add(discriminator)
    return model

# Paramètres
latent_dim = 100  # Dimension de l'espace latent
img_shape = (28, 28, 1)  # Pour MNIST

# Construire les modèles
generator = build_generator(latent_dim)
discriminator = build_discriminator(img_shape)

# Compilation du discriminateur
discriminator.compile(loss='binary_crossentropy', optimizer=Adam(0.0002, 0.5), metrics=['accuracy'])

# Construire le GAN
gan = build_gan(generator, discriminator)

# Compilation du GAN
discriminator.trainable = False  # On ne veut pas entraîner le discriminateur lors de la formation du GAN
gan.compile(loss='binary_crossentropy', optimizer=Adam(0.0002, 0.5))

```

### 5. **Entraînement du GAN**

L'entraînement d'un GAN implique de faire alterner la formation du discriminateur et du générateur.

```python
import numpy as np

def train_gan(gan, generator, discriminator, epochs, batch_size, latent_dim):
    for epoch in range(epochs):
        # Entraîner le discriminateur
        # Échantillonner des images réelles
        idx = np.random.randint(0, X_train.shape[0], batch_size)  # X_train est le jeu de données
        real_imgs = X_train[idx]

        # Échantillonner des vecteurs de bruit aléatoire
        noise = np.random.normal(0, 1, (batch_size, latent_dim))
        fake_imgs = generator.predict(noise)

        # Étiquettes pour le discriminateur
        d_loss_real = discriminator.train_on_batch(real_imgs, np.ones((batch_size, 1)))  # Étiquettes réelles
        d_loss_fake = discriminator.train_on_batch(fake_imgs, np.zeros((batch_size, 1)))  # Étiquettes fausses
        d_loss = 0.5 * np.add(d_loss_real, d_loss_fake)

        # Entraîner le générateur
        noise = np.random.normal(0, 1, (batch_size, latent_dim))  # Nouveau bruit aléatoire
        g_loss = gan.train_on_batch(noise, np.ones((batch_size, 1)))  # On veut que le générateur produise des échantillons "réels"

        # Afficher les pertes
        print(f"{epoch}/{epochs} [D loss: {d_loss[0]:.4f}, acc.: {100*d_loss[1]:.2f}%] [G loss: {g_loss:.4f}]")

```

### Résumé

1. **Générateur** : Transforme le bruit en images réalistes.
2. **Discriminateur** : Distingue entre les vraies images et celles générées.
3. **Entraînement** : Alternance entre la formation des deux réseaux.

Cette architecture de base peut être étendue et modifiée selon les besoins et les types de données utilisés. Les GANs sont utilisés dans divers domaines, tels que la génération d'images, la super-résolution, et bien plus encore.

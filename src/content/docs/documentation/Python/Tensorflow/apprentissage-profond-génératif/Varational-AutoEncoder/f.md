---
title: Architecture du VAE
description: Architecture du VAE
---

Le **Variational Autoencoder (VAE)** est un modèle génératif qui combine les concepts d'autoencodeurs et de probabilités. Il apprend à encoder des données dans un espace latent tout en maintenant une structure probabiliste. Voici une description de l'architecture typique d'un VAE :

1. **Encodeur (ou Réseau d'Encodage)** :
   - L'encodeur prend les données d'entrée et les transforme en deux vecteurs : la moyenne $((mu))$ et la variance $((sigma^2))$ d'une distribution normale. Cela signifie que pour chaque entrée, le modèle prédit non seulement un point dans l'espace latent, mais une distribution autour de ce point.
   - La fonction d'activation courante utilisée dans les couches de l'encodeur est souvent **ReLU** (Rectified Linear Unit).
2. **Échantillonnage** :
   - À partir des valeurs de la moyenne et de la variance, un échantillon est généré en utilisant la méthode du **reparamétrage**. Cela implique l'utilisation de la formule :
     $[
    z = \mu + \sigma \cdot \epsilon
    ]$
     où $(\epsilon)$ est un bruit aléatoire échantillonné à partir d'une distribution normale standard $(N(0,1))$.
3. **Décodeur (ou Réseau de Décodage)** :
   - Le décodeur prend le vecteur échantillonné $(z)$ et le transforme en une reconstruction de l'entrée originale. Il essaie de générer des données qui ressemblent à celles d'origine.
   - Les fonctions d'activation souvent utilisées dans le décodeur incluent **ReLU** pour les couches intermédiaires et **sigmoïde** ou **tanh** pour la sortie, selon le type de données.
4. **Fonction de Perte** :
   - La fonction de perte d'un VAE est composée de deux termes :
     - La **perte de reconstruction** qui mesure à quel point les données générées par le décodeur diffèrent des données d'entrée.
     - La **perte de divergence KL** qui mesure à quel point la distribution latente apprise par l'encodeur s'écarte de la distribution normale standard.

### Exemple de Code pour un VAE

Voici un exemple de code pour construire un VAE utilisant TensorFlow et Keras :

```python
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers

# Paramètres
latent_dim = 2  # Dimension de l'espace latent

# Encodeur
encoder_input = keras.Input(shape=(28, 28, 1))  # Par exemple, pour MNIST
x = layers.Flatten()(encoder_input)
x = layers.Dense(128, activation='relu')(x)
z_mean = layers.Dense(latent_dim)(x)
z_log_var = layers.Dense(latent_dim)(x)

# Échantillonnage
def sampling(args):
    z_mean, z_log_var = args
    epsilon = tf.random.normal(tf.shape(z_mean))
    return z_mean + tf.exp(0.5 * z_log_var) * epsilon

z = layers.Lambda(sampling)([z_mean, z_log_var])

# Décodeur
decoder_input = keras.Input(shape=(latent_dim,))
x = layers.Dense(128, activation='relu')(decoder_input)
x = layers.Dense(28 * 28, activation='sigmoid')(x)
decoder_output = layers.Reshape((28, 28, 1))(x)

# Modèle
encoder = keras.Model(encoder_input, [z_mean, z_log_var, z], name='encoder')
decoder = keras.Model(decoder_input, decoder_output, name='decoder')

# VAE
vae_input = encoder_input
vae_output = decoder(z)
vae = keras.Model(vae_input, vae_output, name='vae')

# Fonction de perte
def vae_loss(encoder_mean, encoder_log_var, decoder_output, original_input):
    reconstruction_loss = tf.reduce_mean(keras.losses.binary_crossentropy(keras.backend.flatten(original_input), keras.backend.flatten(decoder_output)))
    kl_loss = -0.5 * tf.reduce_mean(1 + encoder_log_var - tf.square(encoder_mean) - tf.exp(encoder_log_var))
    return reconstruction_loss + kl_loss

# Compilation du modèle
vae.compile(optimizer='adam', loss=lambda x, y: vae_loss(z_mean, z_log_var, y, x))

# Entraînement (exemple avec des données MNIST)
# x_train, y_train = ...  # Charger vos données ici
# vae.fit(x_train, x_train, epochs=50, batch_size=128)

```

### Conclusion

Le VAE est un modèle puissant pour générer de nouvelles données similaires à un ensemble de données d'entraînement donné. En combinant un encodeur probabiliste et un décodeur, il permet d'apprendre des représentations latentes efficaces qui peuvent être utilisées pour diverses tâches génératives.

---
title: Couche d'échantillonnage
description: Couche d'échantillonnage
---

Pour ajouter une couche d'échantillonnage (**sample layer**) dans un **Variational AutoEncoder (VAE)**, il est nécessaire de convertir les paramètres de l'espace latent (la **moyenne** et la **log-variance**) en un vecteur latent échantillonné. Ce processus utilise la technique appelée **reparamétrage**. Cela permet au modèle d'apprendre via backpropagation tout en échantillonnant aléatoirement dans l'espace latent.

Voici les étapes et un exemple pour inclure une couche d'échantillonnage dans l'architecture d'un VAE.

### 1. **Reparamétrage** pour la couche d'échantillonnage

L'idée du reparamétrage est la suivante :

$z = \mu + \sigma \cdot \epsilon$

Où :

- $( \mu )$ est la moyenne, apprise par l'encodeur.
- $( \sigma )$ est l'écart type, calculé à partir de la log-variance apprise par l'encodeur.
- $( \epsilon )$ est un bruit échantillonné à partir d'une distribution gaussienne normale $( \mathcal{N}(0, I) )$.

### 2. Ajouter une fonction de reparamétrage

Voici une fonction qui peut être utilisée dans la couche d'échantillonnage :

```python
import tensorflow as tf

# Couche d'échantillonnage : applique la technique de reparamétrage
class SamplingLayer(tf.keras.layers.Layer):
    def call(self, inputs):
        mu, log_var = inputs  # inputs est une liste contenant la moyenne et la log-variance
        epsilon = tf.random.normal(shape=tf.shape(mu))  # Échantillonner epsilon depuis N(0, 1)
        z = mu + tf.exp(0.5 * log_var) * epsilon  # Reparamétrage pour générer z
        return z

```

### 3. Construire l'architecture du VAE avec la couche d'échantillonnage

### 3.1. Encodeur

L'encodeur prend une image en entrée et produit deux sorties : la moyenne \$( \mu )$ et la log-variance $( \log(\sigma^2) ).$

```python
latent_dim = 2  # Dimension de l'espace latent

# Construction de l'encodeur
encoder_inputs = tf.keras.layers.Input(shape=(28, 28, 1))
x = tf.keras.layers.Flatten()(encoder_inputs)
x = tf.keras.layers.Dense(128, activation='relu')(x)
mu = tf.keras.layers.Dense(latent_dim)(x)  # Apprentissage de la moyenne
log_var = tf.keras.layers.Dense(latent_dim)(x)  # Apprentissage de la log-variance

# Échantillonnage
z = SamplingLayer()([mu, log_var])  # La couche de Sampling utilise la moyenne et la log-variance

```

### 3.2. Décodeur

Le décodeur prend le vecteur latent $( z )$ en entrée et génère l'image reconstruite.

```python
# Construction du décodeur
decoder_inputs = tf.keras.layers.Input(shape=(latent_dim,))
x = tf.keras.layers.Dense(128, activation='relu')(decoder_inputs)
x = tf.keras.layers.Dense(28 * 28, activation='sigmoid')(x)
decoder_outputs = tf.keras.layers.Reshape((28, 28, 1))(x)

# Modèle du décodeur
decoder = tf.keras.Model(decoder_inputs, decoder_outputs)

```

### 3.3. Architecture complète du VAE

Ensuite, nous connectons l'encodeur et le décodeur pour créer le modèle VAE complet.

```python
# Modèle complet du VAE
encoder = tf.keras.Model(encoder_inputs, [mu, log_var, z], name='encoder')
vae_outputs = decoder(z)

# Définir le modèle VAE
vae = tf.keras.Model(encoder_inputs, vae_outputs, name='vae')

```

### 4. Calculer la perte (Loss)

Dans un VAE, la fonction de perte est composée de deux parties :

1. **La perte de reconstruction** : mesure à quel point les données générées sont proches des données réelles.
2. **La divergence KL** : mesure à quel point la distribution latente apprise $( q(z|x) )$ diverge de la distribution gaussienne normale $( p(z) )$.

```python
from tensorflow.keras.losses import binary_crossentropy

def vae_loss(x, x_reconstructed, mu, log_var):
    # Calculer la perte de reconstruction
    reconstruction_loss = tf.reduce_mean(binary_crossentropy(x, x_reconstructed))

    # Calculer la divergence KL
    kl_loss = -0.5 * tf.reduce_sum(1 + log_var - tf.square(mu) - tf.exp(log_var))

    # Somme des pertes
    return reconstruction_loss + kl_loss

```

### 5. Compilation du modèle

Nous compilons enfin le modèle avec la perte spécifique au VAE.

```python
# Compilation du modèle VAE
vae.add_loss(vae_loss(encoder_inputs, vae_outputs, mu, log_var))
vae.compile(optimizer='adam')

```

### 6. Entraînement du modèle

Ensuite, vous pouvez entraîner le modèle avec les données de Fashion MNIST par exemple :

```python
(x_train, _), (x_test, _) = tf.keras.datasets.fashion_mnist.load_data()

x_train = x_train.astype("float32") / 255.0
x_train = np.expand_dims(x_train, axis=-1)

vae.fit(x_train, x_train, epochs=10, batch_size=64)

```

### Conclusion

En utilisant une couche d'échantillonnage avec le reparamétrage dans le VAE, nous permettons à notre modèle de créer des vecteurs latents tout en gardant la rétropropagation activée, ce qui est essentiel pour l'entraînement. Ensuite, ces vecteurs sont passés dans le décodeur pour générer de nouvelles données.

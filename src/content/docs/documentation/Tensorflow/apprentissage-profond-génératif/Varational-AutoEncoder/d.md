---
title: Générer des données avec un Variational AutoEncoder (VAE)
description: Générer des données avec un Variational AutoEncoder (VAE)
---

Pour générer de nouvelles données avec un **Variational AutoEncoder (VAE)**, nous utilisons la partie **décodeur** du modèle. Voici comment vous pouvez le faire :

### Étapes pour générer de nouvelles données avec un décodeur

1. **Echantillonnage à partir de l'espace latent** :

   Pour générer de nouvelles données, nous échantillonnons des points de l'espace latent. Ces points doivent être échantillonnés à partir d'une distribution normale standard $( \mathcal{N}(0, I) )$, car le VAE est conçu pour encoder les données dans cet espace latent gaussien.

2. **Passer les échantillons dans le décodeur** :

   Après avoir généré les points latents, nous les passons dans le **décodeur** du VAE, qui les transforme en images ou autres types de données.

### Exemple de code pour générer des données avec le décodeur

### 1. Construire et entraîner le VAE (avec encodeur et décodeur)

Supposons que nous avons déjà un VAE entraîné et que le modèle est séparé en deux parties : un **encodeur** et un **décodeur**.

Voici un résumé de la structure :

- **Encodeur** : Il mappe les données d'entrée à un espace latent de distribution gaussienne (paramètres $( \mu )$ et $( \sigma )).$
- **Décodeur** : Il prend un vecteur latent $( z )$ échantillonné et le convertit en une donnée reconstruite.

```python
# Exemple de décodeur simple
latent_dim = 2  # Dimension de l'espace latent (peut varier selon le modèle)

decoder = tf.keras.Sequential([
    tf.keras.layers.InputLayer(input_shape=(latent_dim,)),
    tf.keras.layers.Dense(units=128, activation='relu'),
    tf.keras.layers.Dense(units=784, activation='sigmoid')  # 28x28 pixels, aplatis en un vecteur 784
])

# Reshape les données pour former une image de 28x28 pixels
output = tf.keras.layers.Reshape(target_shape=(28, 28))(decoder.output)

decoder_model = tf.keras.Model(decoder.input, output)

```

### 2. Générer de nouvelles données

Pour générer de nouvelles données, nous devons :

1. **Échantillonner un point** dans l'espace latent.
2. **Passer ce point** à travers le décodeur pour générer une nouvelle image.

```python
import numpy as np

# Nombre de nouvelles données à générer
n_samples = 10

# Échantillonner des points aléatoires à partir d'une distribution gaussienne standard
latent_samples = np.random.normal(size=(n_samples, latent_dim))

# Passer les points latents à travers le décodeur pour générer de nouvelles données
generated_data = decoder_model.predict(latent_samples)

# Afficher les images générées
import matplotlib.pyplot as plt

for i in range(n_samples):
    plt.subplot(1, n_samples, i+1)
    plt.imshow(generated_data[i], cmap='gray')
    plt.axis('off')

plt.show()

```

### Explication du code :

- **Échantillonage latent** : Nous utilisons `np.random.normal` pour générer des échantillons de l'espace latent. Dans cet exemple, l'espace latent a une dimension de `latent_dim = 2`, mais cela peut varier.
- **Génération de données** : Les vecteurs latents sont passés à travers le décodeur pour produire des images. Le décodeur reconstruit ces images à partir des vecteurs latents.
- **Affichage** : Les images générées sont affichées à l'aide de Matplotlib.

### Points importants :

- Le décodeur apprend à reconstruire les données à partir de points de l'espace latent. Les points générés sont proches de l'information réelle si le VAE a été bien entraîné.
- Si la dimension de l'espace latent est faible (comme dans cet exemple avec 2 dimensions), il est facile de visualiser et d'explorer cet espace.

En résumé, le **décodeur** du VAE permet de générer de nouvelles données en échantillonnant des points dans l'espace latent gaussien et en les passant dans le décodeur.

---
title: Créer un AutoEncoder
description: Créer un AutoEncoder
---

Pour construire votre premier AutoEncoder avec TensorFlow, suivez ces étapes. Un AutoEncoder est un type de réseau de neurones utilisé pour apprendre une représentation comprimée (ou codée) de données, généralement pour des tâches de réduction de dimensionnalité ou de débruitage.

### 1. Importer les bibliothèques nécessaires

```python
import tensorflow as tf
from tensorflow.keras import layers, models
import numpy as np
import matplotlib.pyplot as plt

```

### 2. Charger et préparer les données (par exemple, le dataset MNIST)

On utilise ici les images de chiffres manuscrits (MNIST) comme exemple de données pour entraîner l'AutoEncoder.

```python
# Charger le dataset MNIST
(x_train, _), (x_test, _) = tf.keras.datasets.mnist.load_data()

# Normaliser les images à une échelle [0, 1]
x_train = x_train.astype('float32') / 255.
x_test = x_test.astype('float32') / 255.

# Reshaper les données pour qu'elles soient compatibles avec un réseau de neurones convolutif
x_train = np.reshape(x_train, (len(x_train), 28, 28, 1))
x_test = np.reshape(x_test, (len(x_test), 28, 28, 1))

```

### 3. Construire l'architecture de l'AutoEncoder

Un AutoEncoder classique comporte deux parties principales :

1. **L'encodeur** : compresse les données d'entrée en une dimension plus petite (bottleneck).
2. **Le décodeur** : reconstruit les données à partir de la représentation codée.

### Encodeur

```python
def build_autoencoder():
    # Partie encodeur
    encoder_input = layers.Input(shape=(28, 28, 1))
    x = layers.Conv2D(16, (3, 3), activation='relu', padding='same')(encoder_input)
    x = layers.MaxPooling2D((2, 2), padding='same')(x)
    x = layers.Conv2D(8, (3, 3), activation='relu', padding='same')(x)
    encoder_output = layers.MaxPooling2D((2, 2), padding='same')(x)

    # Partie décodeur
    x = layers.Conv2D(8, (3, 3), activation='relu', padding='same')(encoder_output)
    x = layers.UpSampling2D((2, 2))(x)
    x = layers.Conv2D(16, (3, 3), activation='relu', padding='same')(x)
    x = layers.UpSampling2D((2, 2))(x)
    decoder_output = layers.Conv2D(1, (3, 3), activation='sigmoid', padding='same')(x)

    # Modèle AutoEncoder complet
    autoencoder = models.Model(encoder_input, decoder_output)
    return autoencoder

```

### 4. Compiler le modèle

Utilisez une fonction de perte qui évalue la différence entre l'image d'entrée et l'image reconstruite. Par exemple, la perte `mse` (erreur quadratique moyenne) est souvent utilisée.

```python
autoencoder = build_autoencoder()

# Compilation du modèle
autoencoder.compile(optimizer='adam', loss='mse')

```

### 5. Entraîner l'AutoEncoder

Entraînez le modèle pour reconstruire les images.

```python
autoencoder.fit(x_train, x_train,
                epochs=10,
                batch_size=128,
                shuffle=True,
                validation_data=(x_test, x_test))

```

### 6. Visualiser les résultats

Après l'entraînement, vous pouvez visualiser certaines des images reconstruites pour voir comment l'AutoEncoder fonctionne.

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

Félicitations ! Vous venez de construire et d'entraîner un AutoEncoder simple avec TensorFlow.

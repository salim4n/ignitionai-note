---
title : Construction d'un modèle U-Net
description : Construction d'un modèle U-Net
---

Construire un modèle U-Net à partir de zéro avec TensorFlow ou Keras pour la segmentation d'images est une tâche assez courante en vision par ordinateur. Ici, nous allons créer une version de base du U-Net, en détaillant chaque étape pour comprendre son architecture.

### 1. **Étapes principales de la construction du modèle U-Net :**

- **Encodeur (Downsampling)** : Réduction progressive de la résolution d'image tout en augmentant la profondeur à travers des convolutions et du max-pooling.
- **Goulot d'étranglement (Bottleneck)** : La partie la plus profonde du réseau, où la résolution est la plus faible mais les caractéristiques sont les plus complexes.
- **Décodeur (Upsampling)** : Récupération de la résolution d'origine en appliquant des convolutions transposées et en fusionnant les informations avec les connexions en U (skip connections).

### 2. **Implémentation du U-Net avec TensorFlow/Keras**

Voici le code pour construire un U-Net complet. Ce modèle est adapté pour la segmentation d'images de type médical ou d'autres applications nécessitant la segmentation pixel par pixel.

### **Code complet : Construction du U-Net**

```python
import tensorflow as tf
from tensorflow.keras import layers, Model

def unet_model(input_shape=(128, 128, 3), num_classes=1):
    inputs = layers.Input(input_shape)

    # Encoder (cheminée descendante)
    # Bloc 1
    conv1 = layers.Conv2D(64, (3, 3), activation='relu', padding='same')(inputs)
    conv1 = layers.Conv2D(64, (3, 3), activation='relu', padding='same')(conv1)
    pool1 = layers.MaxPooling2D((2, 2))(conv1)

    # Bloc 2
    conv2 = layers.Conv2D(128, (3, 3), activation='relu', padding='same')(pool1)
    conv2 = layers.Conv2D(128, (3, 3), activation='relu', padding='same')(conv2)
    pool2 = layers.MaxPooling2D((2, 2))(conv2)

    # Bloc 3
    conv3 = layers.Conv2D(256, (3, 3), activation='relu', padding='same')(pool2)
    conv3 = layers.Conv2D(256, (3, 3), activation='relu', padding='same')(conv3)
    pool3 = layers.MaxPooling2D((2, 2))(conv3)

    # Bloc 4
    conv4 = layers.Conv2D(512, (3, 3), activation='relu', padding='same')(pool3)
    conv4 = layers.Conv2D(512, (3, 3), activation='relu', padding='same')(conv4)
    pool4 = layers.MaxPooling2D((2, 2))(conv4)

    # Goulot d'étranglement (Bottleneck)
    conv5 = layers.Conv2D(1024, (3, 3), activation='relu', padding='same')(pool4)
    conv5 = layers.Conv2D(1024, (3, 3), activation='relu', padding='same')(conv5)

    # Décodeur (cheminée montante)
    # Bloc 6 (Upsampling + skip connection avec conv4)
    up6 = layers.Conv2DTranspose(512, (2, 2), strides=(2, 2), padding='same')(conv5)
    merge6 = layers.concatenate([up6, conv4], axis=3)
    conv6 = layers.Conv2D(512, (3, 3), activation='relu', padding='same')(merge6)
    conv6 = layers.Conv2D(512, (3, 3), activation='relu', padding='same')(conv6)

    # Bloc 7 (Upsampling + skip connection avec conv3)
    up7 = layers.Conv2DTranspose(256, (2, 2), strides=(2, 2), padding='same')(conv6)
    merge7 = layers.concatenate([up7, conv3], axis=3)
    conv7 = layers.Conv2D(256, (3, 3), activation='relu', padding='same')(merge7)
    conv7 = layers.Conv2D(256, (3, 3), activation='relu', padding='same')(conv7)

    # Bloc 8 (Upsampling + skip connection avec conv2)
    up8 = layers.Conv2DTranspose(128, (2, 2), strides=(2, 2), padding='same')(conv7)
    merge8 = layers.concatenate([up8, conv2], axis=3)
    conv8 = layers.Conv2D(128, (3, 3), activation='relu', padding='same')(merge8)
    conv8 = layers.Conv2D(128, (3, 3), activation='relu', padding='same')(conv8)

    # Bloc 9 (Upsampling + skip connection avec conv1)
    up9 = layers.Conv2DTranspose(64, (2, 2), strides=(2, 2), padding='same')(conv8)
    merge9 = layers.concatenate([up9, conv1], axis=3)
    conv9 = layers.Conv2D(64, (3, 3), activation='relu', padding='same')(merge9)
    conv9 = layers.Conv2D(64, (3, 3), activation='relu', padding='same')(conv9)

    # Sortie : Carte de segmentation (num_classes can be 1 for binary, or >1 for multiclass segmentation)
    output = layers.Conv2D(num_classes, (1, 1), activation='sigmoid')(conv9)

    model = Model(inputs=inputs, outputs=output)

    return model

# Créer le modèle U-Net
unet = unet_model(input_shape=(128, 128, 3), num_classes=1)
unet.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

# Afficher le résumé du modèle
unet.summary()

```

### 3. **Explication du modèle U-Net**

1. **Entrée** : La taille d'entrée par défaut est fixée à `(128, 128, 3)` pour des images RGB de résolution 128x128 pixels. Cela peut être modifié selon vos besoins.
2. **Encodeur** :
    - Le modèle commence par plusieurs blocs de **deux convolutions 2D** (chaque fois avec `ReLU` comme fonction d'activation) suivis d'une **couche de pooling max** (qui réduit de moitié la taille de l'image).
    - Chaque bloc d'encodage double le nombre de filtres, donc nous avons des convolutions avec 64, 128, 256, et 512 filtres, respectivement.
3. **Goulot d'étranglement (Bottleneck)** :
    - Le plus petit niveau spatial (après les étapes de pooling) comporte des convolutions avec 1024 filtres, pour capturer les caractéristiques les plus profondes et abstraites de l'image.
4. **Décodeur** :
    - La phase de décodeur commence avec une **convolution transposée** (ou convolution inverse) qui double la taille spatiale de l'image.
    - Ensuite, les **skip connections** fusionnent les caractéristiques du décodeur avec celles de l'encodeur correspondant pour conserver les informations perdues lors du pooling.
5. **Sortie** :
    - La sortie est une carte de segmentation de même taille que l'image d'entrée, avec une seule carte (pour la segmentation binaire).
    - La fonction d'activation à la sortie est **sigmoïde** pour un problème de segmentation binaire. Si vous avez un problème de segmentation multi-classes, vous pouvez utiliser `softmax` et définir `num_classes` > 1.

### 4. **Compilation et entraînement**

Une fois que le modèle U-Net est défini, vous pouvez l'entraîner sur un jeu de données avec des images et des masques d'annotations pour la segmentation.

Voici un exemple de comment l'entraîner :

```python
# Exemple de compilation avec un jeu de données
unet.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

# Entraînement du modèle
history = unet.fit(train_images, train_masks,
                   validation_data=(val_images, val_masks),
                   epochs=20, batch_size=32)

```

### 5. **Évaluation du modèle**

Après l'entraînement, vous pouvez évaluer le modèle sur un ensemble de test ou utiliser les prédictions pour segmenter des images.

```python
# Évaluation du modèle sur le jeu de test
loss, accuracy = unet.evaluate(test_images, test_masks)
print(f"Test accuracy: {accuracy}")

# Prédictions sur de nouvelles images
predictions = unet.predict(new_images)

```

---

### **Conclusion**

Le modèle **U-Net** est un réseau de segmentation puissant et flexible. Grâce à sa structure en "U" et ses **skip connections**, il parvient à bien capturer les détails et à préserver la résolution spatiale, même après plusieurs étapes de pooling. Ce modèle est largement utilisé pour des tâches de segmentation dans des domaines comme l'imagerie médicale, la segmentation sémantique, et bien d'autres.
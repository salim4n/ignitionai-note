---
title : FCN
description : FCN
---

Un **réseau de neurones entièrement convolutionnel (Fully Convolutional Network, FCN)** est un type de modèle particulièrement adapté aux tâches de segmentation d'image, où chaque pixel de l'image doit être classé dans une catégorie. Ce modèle repose sur deux parties principales :

1. **L'encodeur** : Réduit progressivement la taille spatiale de l'image d'entrée tout en capturant des caractéristiques de plus en plus complexes. Il extrait des représentations à plusieurs niveaux de l'image.
2. **Le décodeur** : Reconstruit la résolution spatiale d'origine de l'image tout en générant une carte de segmentation où chaque pixel est classé.

### **1. Section Encodeur du FCN**

L'encodeur suit une approche classique des **réseaux convolutionnels (CNN)**, où des couches de convolutions sont alternées avec des couches de pooling pour extraire des caractéristiques tout en réduisant progressivement la taille de l'image. Cet encodeur est souvent inspiré d'architectures CNN comme **VGG**, **ResNet**, etc.

Voici un exemple basique de la structure d'un encodeur :

### **Étapes dans l'encodeur** 

- Chaque couche de convolution applique des filtres qui apprennent à détecter des caractéristiques (bords, textures, motifs complexes).
- Le pooling (généralement max-pooling) est utilisé pour réduire la taille de la carte de caractéristiques tout en conservant les informations les plus importantes.
- À chaque étape, la profondeur (nombre de canaux) augmente tandis que la taille spatiale diminue.

### **Exemple d'encodeur avec des convolutions et max-pooling** 

```python
import tensorflow as tf
from tensorflow.keras import layers

def build_encoder(input_shape):
    inputs = tf.keras.Input(shape=input_shape)

    # Première couche convolutionnelle
    x = layers.Conv2D(64, (3, 3), activation='relu', padding='same')(inputs)
    x = layers.MaxPooling2D((2, 2))(x)  # Réduit la taille par 2 (224x224 -> 112x112)

    # Deuxième couche convolutionnelle
    x = layers.Conv2D(128, (3, 3), activation='relu', padding='same')(x)
    x = layers.MaxPooling2D((2, 2))(x)  # 112x112 -> 56x56

    # Troisième couche convolutionnelle
    x = layers.Conv2D(256, (3, 3), activation='relu', padding='same')(x)
    x = layers.MaxPooling2D((2, 2))(x)  # 56x56 -> 28x28

    # Quatrième couche convolutionnelle
    x = layers.Conv2D(512, (3, 3), activation='relu', padding='same')(x)
    x = layers.MaxPooling2D((2, 2))(x)  # 28x28 -> 14x14

    # Cinquième couche convolutionnelle
    x = layers.Conv2D(512, (3, 3), activation='relu', padding='same')(x)
    x = layers.MaxPooling2D((2, 2))(x)  # 14x14 -> 7x7

    return tf.keras.Model(inputs, x, name='encoder')

# Création de l'encodeur
input_shape = (224, 224, 3)  # Taille d'entrée typique pour une image (par exemple, ImageNet)
encoder = build_encoder(input_shape)
encoder.summary()

```

Dans cet exemple, l'encodeur prend une image d'entrée de **224x224x3** (comme dans VGG-16 par exemple) et réduit progressivement la taille jusqu'à **7x7x512** à travers cinq couches convolutionnelles et cinq couches de max-pooling.

---

### **2. Section Décodeur du FCN**

Le décodeur effectue l'inverse de l'encodeur. Il remonte progressivement la taille des cartes de caractéristiques tout en générant une carte de segmentation avec la même taille que l'image d'entrée. L'**upsampling** est réalisé à l'aide de **convolutions transposées** (ou déconvolutions) ou d'**interpolations** pour restaurer la résolution.

### **Étapes dans le décodeur** 

- **Convolutions transposées** ou **UpSampling** : Ces opérations augmentent la taille de la carte de caractéristiques à chaque étape.
- À la fin du décodeur, une couche de convolution finale (souvent de taille 1x1) est utilisée pour générer la carte de segmentation.

### **Exemple de décodeur avec convolutions transposées** 

```python
def build_decoder(encoder_output, num_classes):
    # 7x7x512 -> 14x14x512 (Déconvolution)
    x = layers.Conv2DTranspose(512, (3, 3), strides=(2, 2), padding='same', activation='relu')(encoder_output)

    # 14x14x512 -> 28x28x256 (Déconvolution)
    x = layers.Conv2DTranspose(256, (3, 3), strides=(2, 2), padding='same', activation='relu')(x)

    # 28x28x256 -> 56x56x128 (Déconvolution)
    x = layers.Conv2DTranspose(128, (3, 3), strides=(2, 2), padding='same', activation='relu')(x)

    # 56x56x128 -> 112x112x64 (Déconvolution)
    x = layers.Conv2DTranspose(64, (3, 3), strides=(2, 2), padding='same', activation='relu')(x)

    # 112x112x64 -> 224x224x32 (Déconvolution)
    x = layers.Conv2DTranspose(32, (3, 3), strides=(2, 2), padding='same', activation='relu')(x)

    # Dernière couche de convolution pour générer la carte de segmentation
    output = layers.Conv2D(num_classes, (1, 1), activation='softmax')(x)

    return tf.keras.Model(encoder_output, output, name='decoder')

# Création du décodeur
num_classes = 21  # Exemple pour la segmentation avec 21 classes (comme PASCAL VOC)
decoder = build_decoder(encoder.output, num_classes)
decoder.summary()

```

Dans cet exemple, le décodeur prend la sortie de l'encodeur (de taille 7x7x512) et utilise des convolutions transposées pour la ramener progressivement à la taille d'origine (224x224). La dernière couche applique une convolution 1x1 pour produire une carte de segmentation où chaque pixel a un score pour chaque classe.

---

### **3. FCN complet : Combinaison de l'encodeur et du décodeur**

Maintenant que nous avons construit les sections d'encodeur et de décodeur, nous pouvons les combiner pour former un **réseau de neurones entièrement convolutionnel complet**.

### **Construction d'un modèle FCN complet** 

```python
def build_fcn(input_shape, num_classes):
    # Construire l'encodeur
    encoder = build_encoder(input_shape)

    # Construire le décodeur avec la sortie de l'encodeur
    decoder = build_decoder(encoder.output, num_classes)

    # Combiner encodeur et décodeur dans un seul modèle
    model = tf.keras.Model(inputs=encoder.input, outputs=decoder.output, name='FCN')

    return model

# Paramètres du modèle
input_shape = (224, 224, 3)  # Taille d'image d'entrée
num_classes = 21  # Nombre de classes pour la segmentation

# Construire le modèle FCN
fcn_model = build_fcn(input_shape, num_classes)
fcn_model.summary()

```

Ce modèle combine l'encodeur et le décodeur pour former un réseau de segmentation complet qui prend une image en entrée et produit une carte de segmentation en sortie.

---

### **Explication détaillée :**

1. **L'encodeur** :
    - L'encodeur est basé sur des couches convolutionnelles et de pooling pour capturer des caractéristiques à différentes échelles tout en réduisant la taille de l'image. Il permet d'extraire des représentations utiles pour la tâche de segmentation.
2. **Le décodeur** :
    - Le décodeur applique des convolutions transposées pour **upsampler** les caractéristiques extraites par l'encodeur, restaurant ainsi la taille spatiale de l'image d'origine.
    - La dernière couche de convolution permet de générer une carte de segmentation où chaque pixel est classifié dans une des **n classes** (21 dans notre exemple).

---

### **Conclusion**

Ce modèle FCN combine un encodeur qui extrait des caractéristiques complexes à partir d'une image et un décodeur qui reconstruit la résolution spatiale d'origine pour fournir une segmentation précise. L'utilisation de **convolutions transposées** permet au modèle de restaurer les détails perdus lors de la réduction de l'image dans l'encodeur. Ce type de réseau est utilisé dans diverses tâches de segmentation d'image, telles que la segmentation sémantique, la segmentation d'objets et la détection de contours.
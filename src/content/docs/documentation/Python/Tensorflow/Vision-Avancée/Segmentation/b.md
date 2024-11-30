---
title : Architecture FCN
description : Architecture FCN
---

Dans un **réseau de neurones entièrement convolutionnel (FCN)**, la tâche principale est de prédire une **carte de segmentation** à partir d'une image d'entrée, en attribuant un label à chaque pixel. Pour accomplir cela, le réseau est divisé en deux parties principales :

1. **L'encodeur** : extrait les caractéristiques de l'image tout en réduisant sa résolution à travers des convolutions et des opérations de pooling.
2. **Le décodeur** : reconstruit la résolution originale de l'image tout en utilisant les caractéristiques extraites pour générer des prédictions pixel-par-pixel.

### **Rôle du décodeur dans un FCN**

La section **décodeur** du réseau est responsable de transformer les cartes de caractéristiques comprimées générées par l'encodeur en une carte de segmentation de la même taille que l'image d'origine. Le décodeur utilise principalement des opérations de **upsampling** pour restaurer la résolution de l'image, tout en maintenant les informations essentielles extraites par l'encodeur.

### **Étapes clés dans le décodeur d'un FCN**

1. **Upsampling (déconvolution)** :
    - L'opération d'upsampling permet de **remonter en résolution** après avoir réduit l'image lors du passage par l'encodeur.
    - L'upsampling peut être réalisé par des opérations comme la **convolution transposée (déconvolution)**, qui permet d’augmenter la taille des cartes de caractéristiques tout en appliquant des filtres pour ajuster les informations. Contrairement au pooling qui réduit la résolution, la déconvolution fonctionne dans le sens inverse.
    - Par exemple, si une carte de caractéristiques est réduite à 7x7 dans l'encodeur, le décodeur pourrait la ramener progressivement à 14x14, 28x28, jusqu'à atteindre la résolution de l'image d'origine (par exemple, 224x224).
2. **Transfert d'informations spatiales** :
    - Le décodeur essaie de **récupérer les détails spatiaux** perdus lors des opérations de pooling ou de convolutions avec stride dans l'encodeur.
    - Comme les cartes de caractéristiques sont souvent fortement réduites à la fin de l'encodeur (par exemple, une réduction à 1/32e de la taille d'origine), le décodeur compense cette perte de résolution en récupérant progressivement les détails.
3. **Fusion des informations de différents niveaux** :
    - Dans des architectures plus avancées (comme U-Net), le décodeur peut **fusionner les caractéristiques extraites** à différents niveaux de l'encodeur à l'aide de connexions par saut (*skip connections*).
    - Ces connexions permettent de combiner les informations de haut niveau (concepts globaux) avec celles de bas niveau (détails fins), ce qui améliore la capacité du modèle à distinguer les objets dans une image et à générer des bordures plus précises dans la segmentation.
4. **Prédictions pour chaque pixel** :
    - À la fin du décodeur, chaque pixel de l'image a une prédiction associée. Par exemple, si le réseau doit segmenter une image en N classes, la sortie du décodeur sera une **carte de caractéristiques de taille (hauteur, largeur, N)**, où chaque pixel contiendra une distribution de probabilités indiquant son appartenance à chaque classe.
    - Cette prédiction pixel-par-pixel est réalisée en appliquant une couche de convolution 1x1 (ou une couche dense dans certaines variantes) sur la dernière carte de caractéristiques du décodeur.

### **Visualisation simplifiée de la section décodeur**

Imaginons une image d'entrée de taille 224x224. L'encodeur réduit la taille de cette image à une carte de caractéristiques de 7x7 à travers plusieurs couches de convolution et de pooling. Le décodeur fonctionne comme suit :

```
Encodeur :
    Image d'entrée (224x224x3)
    -> 112x112x64 (Convolution + MaxPooling)
    -> 56x56x128 (Convolution + MaxPooling)
    -> 28x28x256 (Convolution + MaxPooling)
    -> 14x14x512 (Convolution + MaxPooling)
    -> 7x7x512 (Convolution + MaxPooling)

Décodeur :
    -> Upsampling de 7x7x512 à 14x14x512
    -> Upsampling de 14x14x512 à 28x28x256
    -> Upsampling de 28x28x256 à 56x56x128
    -> Upsampling de 56x56x128 à 112x112x64
    -> Upsampling de 112x112x64 à 224x224xN (N étant le nombre de classes)

```

### **Techniques d'upsampling dans le décodeur**

Le décodeur utilise plusieurs techniques pour **remonter en résolution** et transformer les cartes de caractéristiques en une sortie utilisable pour la segmentation d'image.

1. **Déconvolution (Convolution transposée)** :
    - Cette technique fonctionne en "inversant" la convolution. Elle permet d'augmenter la taille des cartes de caractéristiques tout en appliquant des filtres pour conserver des informations pertinentes.
    - Par exemple, une convolution transposée avec un noyau de 3x3 et un stride de 2 va doubler la taille spatiale de la carte de caractéristiques tout en capturant des détails locaux.
2. **Interpolation bilinéaire** :
    - Une autre méthode d'upsampling consiste simplement à interpoler la carte de caractéristiques pour en augmenter la résolution. Cela est moins coûteux en calcul que la convolution transposée mais peut manquer de finesse pour capturer les détails complexes.
3. **Connexions par saut (Skip Connections)** :
    - Cette technique est utilisée dans des architectures comme U-Net et fusionne les cartes de caractéristiques extraites aux différents niveaux de l'encodeur avec celles du décodeur, apportant ainsi des informations de bas niveau (détails fins) au décodeur.
    - Par exemple, si une carte de caractéristiques de 28x28 a été extraite dans l'encodeur, elle peut être directement fusionnée avec la carte de 28x28 du décodeur avant l'upsampling.

### **Exemple de code simplifié pour un décodeur avec upsampling**

Voici un exemple de décodeur utilisant des convolutions transposées (déconvolutions) pour upsampler les cartes de caractéristiques :

```python
import tensorflow as tf
from tensorflow.keras import layers

def build_decoder(input_tensor):
    # 7x7x512 -> 14x14x512 (déconvolution)
    x = layers.Conv2DTranspose(512, (3, 3), strides=(2, 2), padding='same')(input_tensor)

    # 14x14x512 -> 28x28x256 (déconvolution)
    x = layers.Conv2DTranspose(256, (3, 3), strides=(2, 2), padding='same')(x)

    # 28x28x256 -> 56x56x128 (déconvolution)
    x = layers.Conv2DTranspose(128, (3, 3), strides=(2, 2), padding='same')(x)

    # 56x56x128 -> 112x112x64 (déconvolution)
    x = layers.Conv2DTranspose(64, (3, 3), strides=(2, 2), padding='same')(x)

    # 112x112x64 -> 224x224xN (N étant le nombre de classes)
    output = layers.Conv2DTranspose(N, (3, 3), strides=(2, 2), padding='same', activation='softmax')(x)

    return output

# Supposons que "encoder_output" soit la sortie de l'encodeur de taille 7x7x512
# Nombre de classes pour la segmentation, par exemple N = 10
N = 10
decoder_output = build_decoder(encoder_output)

```

---

### **Avantages du décodeur dans un FCN**

- **Récupération de la résolution spatiale** : Le décodeur permet de restaurer la taille de l'image d'entrée après la compression spatiale effectuée dans l'encodeur.
- **Précision pixel-par-pixel** : Grâce à l'upsampling et à la conservation des informations de caractéristiques à chaque étape, le décodeur peut produire des prédictions détaillées pour chaque pixel.
- **Flexibilité** : Le décodeur peut fonctionner avec différentes méthodes d'upsampling, offrant une grande flexibilité pour adapter le modèle en fonction des besoins de la tâche (par exemple, convolution transposée, interpolation).

---

### **Conclusion**

Le **décodeur** dans un **Fully Convolutional Network (FCN)** joue un rôle crucial en **restaurant la résolution d'origine** et en générant une carte de segmentation où chaque pixel est étiqueté avec une classe spécifique. Il utilise des techniques comme la **déconvolution** et les **connexions par saut** pour récupérer les détails et fournir des résultats de segmentation détaillés. Cette section est indispensable pour transformer les caractéristiques extraites dans l'encodeur en une prédiction fine et précise.
---
title : Fully Convolutional Networks - FCN
description : Conception conceptuelle des réseaux de neurones entièrement convolutionnels (Fully Convolutional Networks - FCN) et des modèles qui en découlent
---


## Google Collab

[Google Colab](https://colab.research.google.com/github/https-deeplearning-ai/tensorflow-3-public/blob/main/Course%203%20-%20Advance%20Computer%20Vision/W3/ungraded_labs/C3_W3_Lab_1_VGG16-FCN8-CamVid.ipynb)



[Google Colab](https://colab.research.google.com/github/https-deeplearning-ai/tensorflow-3-public/blob/main/Course%203%20-%20Advance%20Computer%20Vision/W3/ungraded_labs/C3_W3_Lab_2_OxfordPets-UNet.ipynb)


[Google Colab](https://colab.research.google.com/github/https-deeplearning-ai/tensorflow-3-public/blob/main/Course%203%20-%20Advance%20Computer%20Vision/W3/ungraded_labs/C3_W3_Lab_3_Mask-RCNN-ImageSegmentation.ipynb)


La **segmentation d'image** est une tâche clé en vision par ordinateur qui consiste à attribuer un label à chaque pixel d'une image, souvent pour identifier des objets ou des régions spécifiques. Pour réaliser cette tâche efficacement, des architectures spécifiques de réseaux de neurones sont utilisées, dont les réseaux de neurones entièrement convolutionnels, ou **Fully Convolutional Networks (FCN)**. Ces modèles ont été un tournant majeur dans le domaine de la segmentation d'image et ont inspiré de nombreux modèles ultérieurs comme **U-Net**, **SegNet** et **DeepLab**.

---

## 1. **Qu'est-ce qu'un Fully Convolutional Network (FCN) ?**

Un **FCN** est un type de réseau de neurones conçu pour les tâches de segmentation d'images. Contrairement aux réseaux traditionnels de classification d'images qui utilisent des couches entièrement connectées (fully connected) pour produire des prédictions, les FCN sont basés uniquement sur des couches **convolutionnelles**, ce qui leur permet de prendre en entrée des images de taille variable et de générer des prédictions pour chaque pixel de l'image.

### **Caractéristiques principales d'un FCN :**

- **Pas de couches entièrement connectées** : Au lieu d'utiliser des couches denses à la fin (comme dans des réseaux comme VGG ou ResNet pour la classification), un FCN transforme les couches finales en **couches de convolution**. Cela permet au réseau de produire une sortie avec la même résolution spatiale que l'entrée, essentielle pour la segmentation pixel-par-pixel.
- **Cartes de caractéristiques spatiales conservées** : Les FCN conservent la structure spatiale des images à chaque étape, ce qui est crucial pour les tâches de segmentation où la position des objets dans l'image est importante.
- **Upsampling (interpolation ou déconvolution)** : Pour restaurer la résolution d'origine de l'image après plusieurs couches de convolution et de sous-échantillonnage (max pooling), un processus appelé **upsampling** (souvent réalisé par des couches de **déconvolution** ou **transpose convolution**) est utilisé pour augmenter la taille des cartes de caractéristiques.

---

## 2. **Architecture d'un Fully Convolutional Network**

### **Étapes principales d'un FCN :**

1. **Encodeur (downsampling)** :
    - Le réseau commence par un bloc d'**encodeur**, qui est essentiellement un réseau convolutionnel classique (comme VGG ou ResNet) où chaque couche extrait des caractéristiques de l'image tout en réduisant progressivement sa résolution à l'aide de la convolution et du **max pooling**.
    - Par exemple, une image d'entrée de taille 224x224x3 peut être réduite à une carte de caractéristiques de taille 7x7x512 après plusieurs convolutions et poolings.
2. **Décoder (upsampling)** :
    - Ensuite, les cartes de caractéristiques réduites sont **interpolées** pour augmenter leur résolution. L'upsampling peut se faire avec des techniques comme la **déconvolution** (convolution transposée) ou l'**interpolation bilinéaire**.
    - Le but est de revenir à la résolution de l'image d'entrée, tout en faisant des prédictions pour chaque pixel.
3. **Prédictions pixel-par-pixel** :
    - À la fin, la sortie du réseau est une carte de caractéristiques où chaque pixel est étiqueté avec une classe (par exemple, fond, objet 1, objet 2, etc.). La dimension finale pourrait être 224x224xN, où N est le nombre de classes à prédire (par exemple, chat, chien, voiture).

### **Exemple simplifié d'un FCN pour la segmentation :**

```
Image d'entrée : 224x224x3
    -> Convolutions et pooling (réduction spatiale)
        -> 112x112x64 -> 56x56x128 -> 28x28x256 -> 14x14x512 -> 7x7x512
    -> Upsampling (déconvolution) pour augmenter la taille
        -> 14x14x512 -> 28x28x256 -> 56x56x128 -> 112x112x64 -> 224x224xN
    -> Sortie : 224x224xN (une prédiction par pixel)

```

---

## 3. **Modèles basés sur les Fully Convolutional Networks**

Après le succès des FCN, plusieurs modèles ont été développés pour améliorer la précision et la flexibilité dans la segmentation d'image. Voici quelques-uns des modèles clés qui sont basés sur la conception des FCN, mais qui introduisent des innovations supplémentaires.

### **a) U-Net**

Le **U-Net** est une architecture très populaire en segmentation d'image, notamment en **imagerie biomédicale**. Il reprend l'idée des FCN mais introduit un concept important : les **connexions par saut** (*skip connections*).

- **Structure en forme de U** : U-Net possède un encodeur (comme FCN), mais il ajoute un **décodage symétrique** avec des connexions par saut entre les couches correspondantes de l'encodeur et du décodeur. Cela permet de récupérer des détails de haut niveau à chaque étape du décodeur.
- **Amélioration des détails** : Ces connexions par saut aident à conserver des informations de bas niveau (comme les contours) qui peuvent être perdues lors du downsampling, ce qui améliore les performances de segmentation.

### **b) SegNet**

**SegNet** est un autre modèle inspiré des FCN, conçu pour être plus **efficace** en termes de mémoire et de calcul.

- **Mémorisation des indices de pooling** : Au lieu d'utiliser des convolutions transposées pour l'upsampling, SegNet mémorise les indices utilisés lors du max pooling dans l'encodeur et les réutilise lors du décodage. Cela permet de réduire les paramètres tout en maintenant la précision.

### **c) DeepLab**

**DeepLab** est une série de modèles développés pour améliorer la segmentation dans des images complexes où les objets peuvent apparaître à différentes échelles.

- **Atrous Convolution (ou convolution dilatée)** : DeepLab utilise des convolutions dilatées qui permettent de capturer des informations à différentes échelles sans augmenter le nombre de paramètres.
- **Conditional Random Fields (CRF)** : DeepLab introduit également l'idée d'utiliser des modèles probabilistes comme les **CRF** pour affiner les bordures des objets segmentés.

---

## 4. **Les avantages des Fully Convolutional Networks et de leurs descendants**

### **a) Flexibilité dans la taille des images**

Puisque les FCN et les architectures basées sur eux n'ont pas de couches entièrement connectées, ils peuvent accepter des images de taille variable, ce qui est utile pour des tâches de segmentation où les tailles d'image peuvent varier.

### **b) Prédiction pour chaque pixel**

Les FCN génèrent une sortie avec une prédiction pour chaque pixel, ce qui les rend bien adaptés à des tâches comme la segmentation sémantique (attribuer une étiquette à chaque pixel) ou la segmentation d'instance (détecter et séparer plusieurs instances d'un même objet dans une image).

### **c) Réduction de la perte d'information**

L'ajout de connexions par saut dans des modèles comme **U-Net** permet de récupérer des détails fins des couches initiales, ce qui est souvent nécessaire pour des tâches nécessitant des prédictions fines, comme en imagerie médicale.

---

## 5. **Conclusion**

Les **Fully Convolutional Networks (FCN)** ont révolutionné la segmentation d'image en remplaçant les couches entièrement connectées par des convolutions. Ce changement a permis d'effectuer des prédictions pour chaque pixel, une avancée clé dans le domaine. De nombreux modèles dérivés, comme **U-Net**, **SegNet** et **DeepLab**, ont enrichi cette idée de base en introduisant des améliorations comme les connexions par saut et les convolutions dilatées, améliorant la précision et l'efficacité dans diverses applications de segmentation.

### **Résumé des points clés :**

- Les FCN ont éliminé les couches entièrement connectées, permettant des prédictions spatiales pour chaque pixel.
- L'upsampling est utilisé pour restaurer la taille d'origine des images après downsampling.
- Les modèles comme U-Net et DeepLab ont poussé la segmentation plus loin avec des connexions par saut et des convolutions dilatées pour mieux capturer les objets à différentes échelles et améliorer les détails.

Ces concepts sont fondamentaux pour comprendre les architectures modernes utilisées dans la segmentation d'images.
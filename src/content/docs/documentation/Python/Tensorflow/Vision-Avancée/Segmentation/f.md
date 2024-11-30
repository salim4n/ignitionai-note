---
title : U-Net
description : U-Net
---

[U-Net: Convolutional Networks for Biomedical Image Segmentation](https://arxiv.org/abs/1505.04597)

Le **U-Net** est un modèle de réseau de neurones convolutionnel particulièrement conçu pour les tâches de **segmentation d'image**, où chaque pixel de l'image doit être classé dans une catégorie spécifique (par exemple, pour identifier des objets dans une image). Le modèle est devenu populaire en particulier dans des domaines comme l'imagerie biomédicale, mais il a également été largement adopté pour d'autres tâches de segmentation sémantique.

### **Structure générale du U-Net**

Le nom **U-Net** provient de sa forme caractéristique en "U", où l'on trouve deux sections distinctes :

1. Une **cheminée descendante** (encodeur) qui extrait des caractéristiques de plus en plus complexes tout en réduisant la résolution spatiale.
2. Une **cheminée montante** (décodeur) qui reconstruit l'image en augmentant la résolution spatiale pour produire une carte de segmentation pixel par pixel.

Chaque partie de la structure U-Net joue un rôle clé dans la segmentation d'images.

---

### **1. Cheminée descendante (Encodeur)**

La première moitié du U-Net est un **encodeur** qui fonctionne de manière similaire à d'autres réseaux convolutionnels, comme VGG ou ResNet. Son objectif est d'extraire des caractéristiques de plus en plus complexes en appliquant des convolutions et des opérations de pooling pour réduire la taille de l'image tout en augmentant la profondeur de ses représentations.

- **Convolutions** : Le réseau utilise des couches convolutionnelles (avec des filtres) pour extraire des caractéristiques.
- **Pooling** : Des couches de max-pooling réduisent progressivement la taille spatiale (largeur et hauteur) de l'image tout en conservant les caractéristiques importantes.
- Chaque étape de pooling est souvent accompagnée d'une augmentation du nombre de filtres, afin de capturer des caractéristiques plus complexes.

### Exemple visuel de la réduction progressive de la taille de l'image :

- Input : **572x572**
- Après convolutions et pooling : **284x284**, **140x140**, etc.

### **2. Cheminée montante (Décodeur)**

La seconde moitié du U-Net est un **décodeur**, qui effectue l'opération inverse de l'encodeur. Il vise à restaurer la résolution spatiale d'origine en utilisant des techniques comme les **convolutions transposées** (déconvolutions) ou des opérations d'**upsampling**. L'objectif final est de produire une carte de segmentation de la même taille que l'image d'entrée, où chaque pixel est classé dans une classe spécifique.

Ce processus inclut :

- **Upsampling** : Chaque étape du décodeur double la taille spatiale de l'image en appliquant des convolutions transposées.
- **Convolutions** : Des convolutions sont utilisées après chaque étape d'upsampling pour affiner la carte des caractéristiques.
- **Combinaison des caractéristiques** : Les couches d'upsampling dans le décodeur sont **fusionnées** avec les couches correspondantes de l'encodeur. Cette étape est clé dans U-Net, car elle permet au modèle de conserver les informations de localisation fines qui ont été perdues lors du pooling dans la phase d'encodage.

### **3. Connexions en U (Skip Connections)**

Une caractéristique distinctive du U-Net est l'ajout de **connexions en U**, également appelées **skip connections**, entre les couches correspondantes de l'encodeur et du décodeur. Ces connexions permettent au modèle de transférer directement des informations des premières couches (de l'encodeur) vers les couches ultérieures correspondantes (du décodeur), sans passer par le goulot d'étranglement central.

### Pourquoi ces connexions sont importantes :

- Lors du processus de downsampling (pooling), certaines informations sur les **détails spatiaux fins** peuvent être perdues.
- Les connexions en U permettent au modèle de **transférer des informations de localisation plus précises** à chaque étape d'upsampling dans le décodeur. Cela aide à générer des segmentations plus fines et plus précises, en particulier pour les petits objets ou les détails complexes.

---

### **Résumé de la structure U-Net** :

1. **Encodeur** (cheminée descendante) :
    - Convolutions + ReLU
    - Max-pooling pour réduire la taille spatiale et augmenter la profondeur
2. **Décodeur** (cheminée montante) :
    - Upsampling via convolutions transposées pour augmenter la taille spatiale
    - Fusion des caractéristiques avec celles de l'encodeur via des **skip connections**
    - Convolutions pour affiner la carte de segmentation
3. **Skip connections** :
    - Connexions entre les couches d'encodage et de décodage de même niveau
    - Permettent de préserver les informations fines perdues lors du downsampling

---

### **Représentation schématique du U-Net**

```
Input -----> Encodeur -----> Goulot d'étranglement -----> Décodeur -----> Segmentation
     |              |                                  |              |
     |--- Skip connections ---------------> Skip connections ---|

```

---

### **Applications du U-Net**

Le U-Net a été initialement proposé pour la segmentation d'images biomédicales, mais il a depuis été utilisé dans plusieurs autres domaines de vision par ordinateur, tels que :

- **Segmentation sémantique** : Classifier chaque pixel d'une image dans une catégorie, par exemple pour la segmentation de routes, d'objets, ou de scènes.
- **Imagerie médicale** : Segmenter des organes ou des anomalies dans des images radiologiques ou des scans IRM.
- **Détection de contours et de bordures** : Trouver des frontières précises dans des images, comme dans les cartes géographiques ou les images satellites.

---

### **Conclusion**

Le **U-Net** est un réseau de neurones spécialisé pour la segmentation d'image, construit autour d'une structure symétrique avec une phase d'encodage (qui extrait des caractéristiques à travers des convolutions et du pooling) et une phase de décodage (qui reconstruit la résolution spatiale à travers des convolutions transposées). L'élément clé du U-Net est l'utilisation de **skip connections**, qui permettent de récupérer des informations détaillées perdues dans la phase d'encodage. Grâce à cette conception efficace, U-Net est capable de produire des segmentations précises, même avec un nombre limité d'exemples annotés.
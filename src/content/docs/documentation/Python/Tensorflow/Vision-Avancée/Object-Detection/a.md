---
title : Réseaux neuronaux convolutionnels régionaux (R-CNN)
description : R-CNN
---

## 1. **Introduction aux réseaux neuronaux convolutionnels régionaux (R-CNN)**

[Rich feature hierarchies for accurate object detection and...](https://arxiv.org/abs/1311.2524)

Les R-CNN (Regional Convolutional Neural Networks) sont une famille d'architectures utilisées pour la détection d'objets. Contrairement à la classification d'images (qui se concentre sur une seule étiquette pour une image entière), la détection d'objets implique l'identification de plusieurs objets dans une image et la localisation de ces objets sous forme de cadres englobants (bounding boxes). Les R-CNN ont été conçus pour résoudre ce problème en combinant à la fois la détection des régions d'intérêt (ROI) et la classification.

### **1.1. R-CNN classique**

Le concept fondamental de R-CNN repose sur une approche en deux étapes :

1. **Propositions régionales** : On extrait des régions candidates dans une image à l'aide de méthodes comme *Selective Search*, qui proposent des zones susceptibles de contenir des objets.
2. **Classification des régions** : Chaque région proposée est redimensionnée et passée à travers un réseau neuronal convolutionnel (CNN) pour obtenir des caractéristiques, qui sont ensuite classifiées pour prédire si un objet est présent et, si oui, de quel objet il s'agit.

### **Étapes de R-CNN :**

1. **Extraction de propositions régionales** : Environ 2000 régions par image.
2. **Redimensionnement des régions** : Chaque région est redimensionnée à une taille fixe.
3. **Extraction de caractéristiques** : Un CNN est utilisé pour extraire des caractéristiques.
4. **Classification et régression des boîtes englobantes** : Chaque région est classée, et une régression est effectuée pour ajuster les bounding boxes.

### **Limitations :**

- **Très lent** : Chaque région doit être passée individuellement à travers le CNN.
- **Consommation de ressources** : Nécessite une quantité importante de calculs en raison de la duplication du traitement pour chaque région.

```python
# Ceci est un pseudo-code de base montrant l'approche R-CNN (sans framework spécifique)
for region in regions_proposées:
    image_region = resize(region, taille_fixe)
    features = CNN(image_region)
    classification = classify(features)
    bounding_box = adjust_bounding_box(region, features)

```

---

## 2. **Fast R-CNN**

Fast R-CNN est une amélioration significative de R-CNN en termes de vitesse et d'efficacité. Le concept principal de Fast R-CNN est de faire passer l'image complète une seule fois à travers le réseau CNN, plutôt que de traiter chaque région de manière indépendante.

[Fast R-CNN](https://arxiv.org/abs/1504.08083)

### **2.1. Principales différences avec R-CNN :**

1. **Extraction de caractéristiques en une seule passe** : Au lieu de redimensionner chaque région proposée, Fast R-CNN fait passer l'image entière dans un CNN pour obtenir une carte de caractéristiques (feature map).
2. **Réseau de régions d'intérêt (RoI pooling)** : Les régions d'intérêt sont ensuite extraites directement de cette carte de caractéristiques, en utilisant un mécanisme appelé *RoI pooling*, qui redimensionne chaque région d'intérêt en une taille fixe afin qu'elles puissent être traitées de manière uniforme.
3. **Classification et régression conjointes** : Contrairement à R-CNN, où les étapes de classification et de régression des bounding boxes étaient séparées, Fast R-CNN les réalise simultanément dans une couche entièrement connectée après le RoI pooling.

### **Étapes de Fast R-CNN :**

1. **L'image complète est passée à travers un CNN** : Cela génère une carte de caractéristiques.
2. **RoI Pooling** : Les régions proposées sont appliquées sur cette carte pour en extraire des sous-parties qui correspondent aux régions d'intérêt.
3. **Classification et régression** : Chaque région est classée et sa bounding box est ajustée.

### **Avantages :**

- **Beaucoup plus rapide que R-CNN** : Un seul passage dans le CNN pour l'image entière.
- **Moins de redondance** : On évite de recalculer les caractéristiques pour chaque région proposée.

### **Exemple de Code TensorFlow :**

Dans l'implémentation en TensorFlow, vous pouvez utiliser un réseau pré-entraîné comme base pour extraire les caractéristiques et ensuite effectuer le RoI Pooling.

```python
import tensorflow as tf

# Charger un modèle pré-entraîné comme base (par exemple, ResNet ou VGG)
base_model = tf.keras.applications.ResNet50(input_shape=(224, 224, 3), include_top=False)

# Entrée de l'image complète
input_image = tf.keras.layers.Input(shape=(None, None, 3))
feature_map = base_model(input_image)

# Définition des RoI à partir des propositions régionales (RoI Pooling)
rois = tf.keras.layers.Input(shape=(None, 4))  # RoI définies par leur bounding box
roi_pooled = tf.image.crop_and_resize(feature_map, rois, box_indices=[0]*len(rois), crop_size=(7, 7))

# Ajout de couches fully connected pour la classification et la régression des bounding boxes
fc = tf.keras.layers.Dense(1024, activation='relu')(roi_pooled)
classification = tf.keras.layers.Dense(num_classes, activation='softmax')(fc)
bounding_box = tf.keras.layers.Dense(4)(fc)

model = tf.keras.models.Model(inputs=[input_image, rois], outputs=[classification, bounding_box])

```

---

## 3. **Faster R-CNN**

Faster R-CNN va encore plus loin en optimisant l'étape d'extraction des propositions régionales, qui était le goulot d'étranglement des R-CNN et Fast R-CNN.

### **3.1. Region Proposal Network (RPN)**

La principale innovation de Faster R-CNN est l'introduction du *Region Proposal Network* (RPN). Ce réseau est responsable de la génération des régions d'intérêt de manière plus rapide et plus efficace.

### **Étapes de Faster R-CNN :**

1. **Extraction des caractéristiques** : Comme dans Fast R-CNN, l'image complète est passée à travers un CNN pour obtenir une carte de caractéristiques.
2. **Region Proposal Network (RPN)** : Plutôt que d'utiliser une méthode externe comme *Selective Search* pour proposer des régions, le RPN analyse directement la carte de caractéristiques pour proposer des régions d'intérêt.
3. **RoI Pooling et classification** : Les régions proposées sont passées par le RoI pooling, puis classifiées et ajustées comme dans Fast R-CNN.

### **Avantages de Faster R-CNN :**

- **Génération rapide des régions** : Le RPN est intégré dans le modèle, ce qui rend la génération des propositions beaucoup plus rapide.
- **Meilleure performance** : Faster R-CNN est non seulement plus rapide, mais également plus précis, car le RPN est appris conjointement avec la tâche de détection d'objets.

### **Code TensorFlow Simplifié :**

L'idée est d'inclure le RPN directement dans l'architecture du modèle.

```python
# Pseudo-code pour Faster R-CNN
# Après avoir passé l'image à travers le CNN de base pour obtenir une carte de caractéristiques
feature_map = base_model(input_image)

# Region Proposal Network (RPN)
rpn = tf.keras.layers.Conv2D(512, (3, 3), padding='same', activation='relu')(feature_map)
proposals = tf.keras.layers.Conv2D(num_anchors * 4, (1, 1))(rpn)  # Générer des propositions de bounding boxes

# RoI Pooling et suite de Fast R-CNN
roi_pooled = roi_pooling(proposals, feature_map)
fc = tf.keras.layers.Dense(1024, activation='relu')(roi_pooled)
classification = tf.keras.layers.Dense(num_classes, activation='softmax')(fc)
bounding_box = tf.keras.layers.Dense(4)(fc)

model = tf.keras.models.Model(inputs=input_image, outputs=[classification, bounding_box])

```

---

## 4. **Comparaison et résumé**

| **Modèle** | **Avantages** | **Inconvénients** |
| --- | --- | --- |
| **R-CNN** | Simple à implémenter | Très lent, duplication de calcul |
| **Fast R-CNN** | Plus rapide que R-CNN, classification conjointe | Génération des régions encore lente |
| **Faster R-CNN** | Propositions rapides grâce au RPN, très performant | Plus complexe à implémenter |

En résumé, les R-CNN ont considérablement amélioré la détection d'objets, et Faster R-CNN a été une étape décisive pour rendre ce processus plus rapide et plus efficace.

---

Voilà pour cette prise de note explicative. Si tu as des questions spécifiques ou que tu veux approfondir un point en particulier, n’hésite pas à demander !
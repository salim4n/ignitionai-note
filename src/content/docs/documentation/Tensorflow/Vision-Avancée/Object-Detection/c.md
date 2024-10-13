---
title: API de détection d'objets de TensorFlow
description: API de détection d'objets de TensorFlow
---

## 1. **Introduction à l'API de détection d'objets de TensorFlow**

[models/research/object_detection/g3doc/tf2.md at master · tensorflow/models](https://github.com/tensorflow/models/blob/master/research/object_detection/g3doc/tf2.md)

[Points de contrôle de la formation  |  TensorFlow Core](https://www.tensorflow.org/guide/checkpoint?hl=fr)

L'API de détection d'objets de TensorFlow est un ensemble d'outils qui permet de charger facilement des modèles de détection d'objets pré-entraînés et de les utiliser sur des images pour détecter des objets, prédire les boîtes englobantes, et afficher ces résultats. Cette API offre des modèles tels que Faster R-CNN, SSD (Single Shot MultiBox Detector), et d'autres architectures avancées.

---

## 2. **Installation et configuration de l'API de détection d'objets**

### **Étape 1 : Installer TensorFlow et les dépendances**

Avant de commencer, assure-toi que TensorFlow et l'API de détection d'objets sont installés. Voici les étapes d'installation des bibliothèques nécessaires.

### **Installation des bibliothèques principales** :

```bash
pip install tensorflow tensorflow-hub tensorflow-object-detection-api
pip install matplotlib opencv-python

```

### **Télécharger l'API de détection d'objets de TensorFlow (si non installée)** :

L'API de détection d'objets de TensorFlow est disponible sur GitHub. Si tu veux utiliser les modèles et les scripts d'exemples fournis, tu peux la cloner à partir de GitHub :

```bash
git clone <https://github.com/tensorflow/models.git>
cd models/research/object_detection

```

Ensuite, il faut ajouter l'API au chemin d'accès Python :

```bash
export PYTHONPATH=$PYTHONPATH:`pwd`:`pwd`/slim

```

---

## 3. **Télécharger et charger un modèle de détection d'objets**

TensorFlow propose de nombreux modèles de détection d'objets dans son *Model Zoo*. Nous allons utiliser l'un de ces modèles, par exemple Faster R-CNN ou SSD, pour effectuer de la détection d'objets.

### **Étape 2 : Télécharger un modèle pré-entraîné depuis le Model Zoo**

Le *Model Zoo* de TensorFlow contient plusieurs modèles pré-entraînés. Nous allons utiliser un modèle comme Faster R-CNN ou SSD.

Voici comment télécharger un modèle SSD (Single Shot Multibox Detector) :

1. Va sur le *Model Zoo* : https://github.com/tensorflow/models/blob/master/research/object_detection/g3doc/tf2_detection_zoo.md
2. Choisis un modèle, par exemple : `ssd_mobilenet_v2_fpnlite_320x320_coco17_tpu-8`.
3. Télécharge et décompresse le modèle.

Exemple de lien de téléchargement direct :

```bash
wget <http://download.tensorflow.org/models/object_detection/tf2/20200711/ssd_mobilenet_v2_fpnlite_320x320_coco17_tpu-8.tar.gz>
tar -xvf ssd_mobilenet_v2_fpnlite_320x320_coco17_tpu-8.tar.gz

```

### **Étape 3 : Charger le modèle avec TensorFlow**

Une fois le modèle téléchargé, nous pouvons le charger en utilisant les bibliothèques TensorFlow et TensorFlow Hub.

```python
import tensorflow as tf
import os

# Chemin vers le répertoire du modèle téléchargé
model_dir = 'ssd_mobilenet_v2_fpnlite_320x320_coco17_tpu-8/saved_model'

# Charger le modèle pré-entraîné
model = tf.saved_model.load(model_dir)

```

---

## 4. **Effectuer des prédictions sur une image**

Avant de visualiser les boîtes englobantes, nous devons prétraiter l'image, effectuer la détection, puis extraire les résultats comme les boîtes englobantes, les classes détectées et les scores.

### **Étape 4 : Charger et préparer l'image**

Nous devons charger une image (par exemple avec OpenCV ou PIL), la redimensionner et la préparer pour la passer dans le modèle.

```python
import cv2
import numpy as np

# Charger une image avec OpenCV
image_path = 'path_to_your_image.jpg'
image = cv2.imread(image_path)
image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)  # Convertir BGR en RGB

# Redimensionner si nécessaire (les modèles comme SSD peuvent avoir des tailles spécifiques)
input_tensor = tf.convert_to_tensor(image_rgb)
input_tensor = input_tensor[tf.newaxis, ...]  # Ajouter la dimension batch

```

### **Étape 5 : Effectuer la détection d'objets**

Passons maintenant l'image à travers le modèle pour obtenir les prédictions.

```python
# Effectuer la prédiction
detections = model(input_tensor)

# Extraire les résultats
detection_boxes = detections['detection_boxes'].numpy()
detection_scores = detections['detection_scores'].numpy()
detection_classes = detections['detection_classes'].numpy()

```

---

## 5. **Visualiser les boîtes englobantes**

Pour visualiser les boîtes englobantes, nous allons tracer les cadres sur l'image en utilisant OpenCV ou Matplotlib. Nous allons aussi afficher les étiquettes et les scores de confiance pour chaque objet détecté.

### **Étape 6 : Tracer les boîtes englobantes sur l'image**

Voici une fonction pour dessiner les boîtes englobantes sur l'image et afficher les résultats.

```python
import matplotlib.pyplot as plt

def draw_bounding_boxes(image, boxes, scores, classes, threshold=0.5):
    """
    Dessiner les boîtes englobantes sur l'image.
    Args:
        image: Image d'entrée
        boxes: Coordonnées des boîtes englobantes (normalisées)
        scores: Scores de confiance associés
        classes: Classes prédites
        threshold: Seuil de confiance pour afficher les objets
    """
    height, width, _ = image.shape
    for i in range(len(scores)):
        if scores[i] > threshold:
            # Extraire les coordonnées de la boîte englobante (normalisées)
            ymin, xmin, ymax, xmax = boxes[i]
            (xmin, xmax, ymin, ymax) = (xmin * width, xmax * width, ymin * height, ymax * height)

            # Dessiner la boîte sur l'image
            cv2.rectangle(image, (int(xmin), int(ymin)), (int(xmax), int(ymax)), (255, 0, 0), 2)

            # Ajouter le label (classe et score)
            label = f'Classe: {int(classes[i])}, Score: {scores[i]:.2f}'
            cv2.putText(image, label, (int(xmin), int(ymin) - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 0, 0), 2)

    return image

# Appliquer la fonction pour tracer les boîtes
annotated_image = draw_bounding_boxes(image_rgb.copy(), detection_boxes[0], detection_scores[0], detection_classes[0])

# Afficher l'image avec les boîtes englobantes
plt.figure(figsize=(10, 10))
plt.imshow(annotated_image)
plt.axis('off')
plt.show()

```

---

## 6. **Explication des résultats**

- **`detection_boxes`** : Les coordonnées des boîtes englobantes. Ces valeurs sont normalisées entre 0 et 1, donc elles doivent être multipliées par la largeur et la hauteur de l'image pour obtenir des valeurs en pixels.
- **`detection_scores`** : Les scores de confiance pour chaque boîte englobante. Un score supérieur à 0,5 est souvent utilisé comme seuil pour considérer qu'un objet est détecté avec une certaine confiance.
- **`detection_classes`** : Les indices des classes d'objets détectées. Par exemple, un indice de 1 pourrait correspondre à une "personne", 3 à une "voiture", etc., selon le jeu de données COCO utilisé.

---

## 7. **Conclusion**

En utilisant l'API de détection d'objets de TensorFlow, il est possible de charger un modèle pré-entraîné, de l'appliquer sur des images, et de visualiser facilement les résultats avec des boîtes englobantes. Voici un résumé des étapes :

1. **Installer TensorFlow et l'API de détection d'objets**.
2. **Télécharger et charger un modèle pré-entraîné**.
3. **Prétraiter l'image pour qu'elle soit compatible avec le modèle**.
4. **Effectuer la détection d'objets et extraire les résultats**.
5. **Visualiser les boîtes englobantes et les scores de confiance sur l'image**.

Ce pipeline est utile pour la plupart des tâches de détection d'objets sur des images fixes ou même des flux vidéo en temps réel.
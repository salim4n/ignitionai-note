---
title : R-CNN sur TF-Hub
description : R-CNN sur TF-Hub
---

## 1. **Introduction à TensorFlow Hub**

TensorFlow Hub est une bibliothèque qui permet de réutiliser des modèles d'apprentissage automatique pré-entraînés. Ces modèles peuvent être intégrés facilement dans des projets pour des tâches variées comme la classification d'images, la détection d'objets, le traitement du langage naturel, etc.

Dans ce cas, nous allons utiliser TensorFlow Hub pour récupérer un modèle de détection d'objets basé sur Faster R-CNN. Les modèles de détection d'objets sur TensorFlow Hub sont souvent pré-entraînés sur des ensembles de données comme COCO (Common Objects in Context), un large ensemble d'images contenant des annotations d'objets.

---

## 2. **Télécharger et charger le modèle Faster R-CNN depuis TensorFlow Hub**

Pour utiliser un modèle de détection d'objets, tel que Faster R-CNN, nous pouvons directement le télécharger à partir de TensorFlow Hub. Ce modèle prend une image en entrée et renvoie des boîtes englobantes, des classes d'objets, et des scores de confiance pour chaque objet détecté.

### **Étapes pour récupérer et utiliser le modèle :**

1. **Installer les bibliothèques nécessaires** :
    - `tensorflow` : Pour la manipulation des modèles de deep learning.
    - `tensorflow_hub` : Pour accéder aux modèles pré-entraînés sur TensorFlow Hub.
    - `matplotlib` (optionnel) : Pour visualiser les résultats.
    
    Si tu ne les as pas déjà, installe ces bibliothèques avec la commande suivante :
    
    ```bash
    pip install tensorflow tensorflow_hub matplotlib
    
    ```
    
2. **Récupérer le modèle de TensorFlow Hub** :
TensorFlow Hub propose plusieurs modèles de détection d'objets, y compris Faster R-CNN. Nous allons utiliser un modèle pré-entraîné.
3. **Prétraitement de l'image** :
Le modèle exige que l'image soit redimensionnée et normalisée avant d'être traitée.
4. **Effectuer la détection d'objets** :
Après avoir traité l'image, le modèle renvoie une liste de boîtes englobantes, de classes et de scores pour chaque objet détecté.

### **Code complet pour la détection d'objets avec Faster R-CNN sur TensorFlow Hub** :

Voici un exemple complet en Python pour charger un modèle Faster R-CNN depuis TensorFlow Hub et effectuer la détection d'objets sur une image.

### **Étape 1 : Importer les bibliothèques nécessaires**

```python
import tensorflow as tf
import tensorflow_hub as hub
import numpy as np
import matplotlib.pyplot as plt
import cv2  # OpenCV pour charger et manipuler les images

```

### **Étape 2 : Télécharger l'image et la préparer**

Nous utilisons OpenCV pour lire une image à partir du disque. L'image est ensuite redimensionnée et normalisée pour être compatible avec le modèle.

```python
# Charger une image à partir du disque
image_path = 'path_to_your_image.jpg'  # Remplacer par le chemin de votre image
image = cv2.imread(image_path)
image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)  # Convertir en RGB, car OpenCV charge en BGR

# Redimensionner l'image à une taille standard si nécessaire
input_image = tf.convert_to_tensor(image_rgb, dtype=tf.float32)
input_image = tf.image.resize(input_image, (640, 640))  # Redimensionnement

# Ajouter une dimension batch (car le modèle attend un batch d'images)
input_image = tf.expand_dims(input_image, axis=0)

```

### **Étape 3 : Charger le modèle Faster R-CNN depuis TensorFlow Hub**

```python
# Charger le modèle Faster R-CNN depuis TensorFlow Hub
model_url = "<https://tfhub.dev/tensorflow/faster_rcnn/resnet50_v1_640x640/1>"  # URL du modèle Faster R-CNN
model = hub.load(model_url)

```

### **Étape 4 : Faire des prédictions**

Le modèle retourne trois résultats principaux :

- `detection_boxes` : Les coordonnées des boîtes englobantes des objets détectés.
- `detection_scores` : Les scores de confiance associés à chaque boîte englobante.
- `detection_classes` : Les classes d'objets détectées (par exemple, voiture, chien, etc.).

```python
# Appliquer le modèle sur l'image
results = model(input_image)

# Extraction des résultats
detection_boxes = results['detection_boxes'].numpy()
detection_scores = results['detection_scores'].numpy()
detection_classes = results['detection_classes'].numpy()

```

### **Étape 5 : Visualiser les résultats**

Pour visualiser les objets détectés, nous pouvons tracer les boîtes englobantes sur l'image en utilisant `matplotlib` et OpenCV.

```python
# Fonction pour dessiner les boîtes englobantes
def draw_boxes(image, boxes, scores, classes, score_threshold=0.5):
    height, width, _ = image.shape
    for i in range(len(scores)):
        if scores[i] > score_threshold:
            # Récupérer les coordonnées des boîtes (normalisées entre 0 et 1)
            ymin, xmin, ymax, xmax = boxes[i]
            (xmin, xmax, ymin, ymax) = (xmin * width, xmax * width, ymin * height, ymax * height)

            # Dessiner les boîtes englobantes
            cv2.rectangle(image, (int(xmin), int(ymin)), (int(xmax), int(ymax)), (255, 0, 0), 2)

    return image

# Appliquer la fonction pour dessiner les boîtes
annotated_image = draw_boxes(image_rgb.copy(), detection_boxes[0], detection_scores[0], detection_classes[0])

# Afficher l'image avec les boîtes englobantes
plt.figure(figsize=(10, 10))
plt.imshow(annotated_image)
plt.axis('off')
plt.show()

```

---

### **Explications supplémentaires** :

1. **Détection des objets avec Faster R-CNN** :
Faster R-CNN est conçu pour détecter des objets dans des images en générant des propositions régionales à l'aide d'un réseau (RPN) et en classifiant ces régions. Le modèle que nous avons chargé utilise un backbone ResNet-50 pour extraire les caractéristiques des images, puis applique un RPN et un classificateur pour la détection.
2. **Résultats du modèle** :
    - `detection_boxes` renvoie une liste de boîtes englobantes normalisées (ymin, xmin, ymax, xmax), où les coordonnées sont comprises entre 0 et 1.
    - `detection_scores` donne les scores de confiance pour chaque détection. Un score supérieur à 0,5 est généralement un bon seuil pour dire qu'un objet est détecté avec une confiance raisonnable.
    - `detection_classes` renvoie les indices des classes d'objets détectées (par exemple, 1 pourrait représenter "personne", 3 pour "voiture", etc.).

---

## 3. **Résumé de l'approche**

1. **Récupération du modèle** : TensorFlow Hub fournit des modèles pré-entraînés, comme Faster R-CNN, que nous pouvons utiliser directement sans besoin d'entraîner le modèle depuis zéro.
2. **Prétraitement de l'image** : Redimensionner et normaliser les images pour les rendre compatibles avec les exigences du modèle.
3. **Exécution du modèle** : Le modèle effectue la détection d'objets et retourne des boîtes englobantes, des scores de confiance et des classes d'objets.
4. **Visualisation** : Utilisation d'outils comme OpenCV et Matplotlib pour afficher les résultats.

---

### **Conclusion**

Ce code  permet d'utiliser un modèle de détection d'objets Faster R-CNN pré-entraîné à partir de TensorFlow Hub. Il offre une solution rapide pour tester la détection d'objets dans tes propres images, sans avoir à former un modèle depuis zéro. Si tu souhaites approfondir l'analyse des résultats ou améliorer l'affichage, il est possible d'ajouter des légendes aux boîtes pour indiquer le nom des classes ou d'ajuster le seuil de confiance pour mieux filtrer les objets détectés.
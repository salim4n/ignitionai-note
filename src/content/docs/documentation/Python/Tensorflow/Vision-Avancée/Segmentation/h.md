---
title : Mask R-CNN
description : Mask R-CNN
---

Le **Mask R-CNN** est une extension du modèle Faster R-CNN conçu pour la détection d'objets, mais avec une fonctionnalité supplémentaire pour la **segmentation d'instances**. Ce modèle peut non seulement détecter et localiser des objets dans une image, mais aussi générer un masque de segmentation pour chaque instance d'objet détectée.

Dans cette section, nous allons utiliser TensorFlow/Keras pour charger un modèle Mask R-CNN pré-entraîné et l'utiliser pour effectuer la segmentation d'instances sur des images.

### 1. **Concepts clés de Mask R-CNN**

- **Segmentation d'instances** : Contrairement à la segmentation sémantique, où chaque pixel est classé dans une catégorie, la segmentation d'instances vise à détecter et à segmenter chaque **instance individuelle** d'une classe (par exemple, détecter et segmenter chaque voiture dans une image).
- **Masque de segmentation** : En plus des boîtes englobantes (bounding boxes) fournies par Faster R-CNN, Mask R-CNN génère également un **masque binaire** pour chaque objet détecté. Ce masque montre la forme précise de l'objet à l'intérieur de la boîte englobante.

### 2. **Chargement d'un modèle Mask R-CNN avec TensorFlow**

Nous allons utiliser un modèle pré-entraîné de Mask R-CNN disponible via le module `TensorFlow Object Detection API`.

### **Étape 1 : Installation des dépendances**

Si vous n'avez pas encore installé les bibliothèques nécessaires pour travailler avec Mask R-CNN et l'API de détection d'objets de TensorFlow, commencez par les installer :

```bash
pip install tensorflow opencv-python
pip install tensorflow-gpu # si vous avez un GPU

```

### **Étape 2 : Téléchargement d'un modèle pré-entraîné Mask R-CNN**

Les modèles Mask R-CNN pré-entraînés sont disponibles via le `TensorFlow Model Zoo`. Vous pouvez choisir un modèle pré-entraîné sur le jeu de données COCO. Voici un exemple de téléchargement d'un modèle pré-entraîné.

```bash
# Téléchargement du modèle pré-entraîné Mask R-CNN
!wget <http://download.tensorflow.org/models/object_detection/mask_rcnn_inception_v2_coco_2018_01_28.tar.gz>
!tar -xvzf mask_rcnn_inception_v2_coco_2018_01_28.tar.gz

```

### **Étape 3 : Utilisation de l'API TensorFlow Object Detection**

L'API de détection d'objets de TensorFlow offre une interface simple pour charger et utiliser des modèles comme Mask R-CNN.

```python
import numpy as np
import tensorflow as tf
import cv2
from matplotlib import pyplot as plt

# Fonction utilitaire pour charger le modèle Mask R-CNN pré-entraîné
def load_model(model_path):
    model = tf.saved_model.load(model_path)
    return model

# Chemin vers le modèle pré-entraîné
model_path = "mask_rcnn_inception_v2_coco_2018_01_28/saved_model"
mask_rcnn_model = load_model(model_path)

# Fonction pour prétraiter l'image avant de la passer au modèle
def load_image_into_numpy_array(path):
    img_data = tf.io.read_file(path)
    img = tf.image.decode_image(img_data, channels=3)
    img = tf.image.convert_image_dtype(img, dtype=tf.float32)
    return np.array(img)

# Chargez une image pour effectuer la segmentation d'instances
image_path = "path_to_your_image.jpg"  # Remplacez par le chemin de votre image
image_np = load_image_into_numpy_array(image_path)

# Conversion de l'image en un format compatible avec le modèle
input_tensor = tf.convert_to_tensor(image_np)
input_tensor = input_tensor[tf.newaxis, ...]

# Prédictions avec le modèle Mask R-CNN
output_dict = mask_rcnn_model(input_tensor)

# Extraire les boîtes, masques, scores, etc. à partir des prédictions
detection_masks = output_dict['detection_masks'][0].numpy()
detection_boxes = output_dict['detection_boxes'][0].numpy()
detection_scores = output_dict['detection_scores'][0].numpy()
detection_classes = output_dict['detection_classes'][0].numpy()

# Seulement garder les prédictions avec une bonne confiance
threshold = 0.5
good_predictions = detection_scores > threshold
masks = detection_masks[good_predictions]
boxes = detection_boxes[good_predictions]
scores = detection_scores[good_predictions]
classes = detection_classes[good_predictions]

```

### **Étape 4 : Visualisation des boîtes englobantes et des masques**

Une fois que vous avez les prédictions du modèle Mask R-CNN, vous pouvez dessiner les boîtes englobantes et appliquer les masques générés sur l'image d'entrée.

```python
# Fonction utilitaire pour dessiner les boîtes et masques sur l'image
def display_instances(image, boxes, masks, class_ids, scores, threshold=0.5):
    n_instances = boxes.shape[0]
    colors = plt.cm.hsv(np.linspace(0, 1, n_instances)).tolist()

    for i in range(n_instances):
        if scores[i] > threshold:
            box = boxes[i]
            mask = masks[i]
            class_id = class_ids[i]

            # Calculer les coordonnées de la boîte englobante
            y1, x1, y2, x2 = box
            y1, x1, y2, x2 = int(y1 * image.shape[0]), int(x1 * image.shape[1]), int(y2 * image.shape[0]), int(x2 * image.shape[1])

            # Dessiner la boîte englobante
            cv2.rectangle(image, (x1, y1), (x2, y2), color=(255, 0, 0), thickness=2)

            # Appliquer le masque à l'image
            mask = cv2.resize(mask, (x2 - x1, y2 - y1))
            mask = np.where(mask >= 0.5, 1, 0).astype(np.uint8)
            roi = image[y1:y2, x1:x2][mask == 1]
            colored_mask = np.array(colors[i][:3]) * 255
            image[y1:y2, x1:x2][mask == 1] = roi * 0.5 + colored_mask * 0.5

    return image

# Appliquer les masques et boîtes à l'image d'origine
image_with_masks = display_instances(image_np.copy(), boxes, masks, classes, scores)

# Afficher l'image avec les masques et boîtes englobantes
plt.figure(figsize=(10, 10))
plt.imshow(image_with_masks)
plt.axis('off')
plt.show()

```

### 3. **Explication étape par étape du processus**

1. **Chargement du modèle Mask R-CNN** : Nous chargeons un modèle pré-entraîné sur COCO pour la segmentation d'instances. Ce modèle est capable de détecter et de segmenter 80 objets différents.
2. **Prétraitement de l'image** : L'image d'entrée est convertie en un tableau NumPy pour pouvoir être utilisée avec le modèle. Le modèle attend une entrée avec une forme `batch_size, height, width, channels`.
3. **Prédictions** : Le modèle génère plusieurs prédictions, dont les boîtes englobantes, les scores de confiance, les masques de segmentation, et les classes des objets détectés.
4. **Affichage des masques et boîtes englobantes** : Nous appliquons les masques de segmentation et dessinons les boîtes englobantes sur l'image originale, avec des couleurs différentes pour chaque instance d'objet.

### 4. **Conclusion**

Le **Mask R-CNN** est un modèle performant pour la segmentation d'instances. En plus de la détection d'objets standard (comme le fait Faster R-CNN), il est capable de générer des masques précis pour chaque instance détectée. Cela permet de réaliser des tâches de segmentation où chaque objet est identifié individuellement, ce qui est utile pour des applications comme l'imagerie médicale, la robotique ou la vision par ordinateur avancée.
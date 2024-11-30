---
title : CAM
description : CAM
---

Les **Class Activation Maps (CAM)** sont une méthode puissante pour interpréter un modèle de classification d'images. Elles permettent de **visualiser quelles parties de l'image** ont influencé la décision d'un modèle pour une classe donnée. En particulier, CAM met en évidence les régions de l'image qui ont le plus activé les filtres d'une couche spécifique d'un réseau neuronal avant la prédiction finale.

Dans cette section, nous allons :

1. Charger un modèle de classification d'images.
2. Calculer et visualiser les **Class Activation Maps** pour comprendre quelles parties de l'image le modèle utilise pour ses prédictions.

### 1. **Étapes pour calculer les CAM**

Pour générer une CAM, nous devons suivre les étapes suivantes :

1. **Choisir une image** : Prendre une image d'exemple pour laquelle nous voulons interpréter la prédiction du modèle.
2. **Charger un modèle pré-entraîné** : Utiliser un modèle de classification d'images tel que ResNet50, VGG16, ou InceptionV3.
3. **Identifier la couche de convolution appropriée** : Pour générer une carte de chaleur (heatmap) des activations, nous devons extraire la sortie de la dernière couche de convolution.
4. **Calculer les activations** : Calculer les activations de la dernière couche de convolution par rapport à la classe prédite.
5. **Combiner les activations avec les poids de la couche dense finale** : Les activations sont pondérées par les poids associés à la classe prédite pour obtenir la carte d'activation.
6. **Superposer la carte d'activation sur l'image d'origine** : Générer une visualisation qui superpose la CAM à l'image originale.

### 2. **Implémentation des Class Activation Maps avec TensorFlow et Keras**

### **Étape 1 : Charger les bibliothèques nécessaires**

```python
import numpy as np
import tensorflow as tf
import matplotlib.pyplot as plt
from tensorflow.keras.applications import ResNet50
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.resnet50 import preprocess_input, decode_predictions

# Charger un modèle pré-entraîné (ResNet50 dans cet exemple)
model = ResNet50(weights="imagenet")

```

### **Étape 2 : Charger une image et la prétraiter**

On charge une image depuis le disque, puis on la convertit dans un format compatible avec le modèle.

```python
# Charger et prétraiter une image
img_path = "path_to_your_image.jpg"  # Remplacer par le chemin de votre image
img = image.load_img(img_path, target_size=(224, 224))
img_array = image.img_to_array(img)
img_array = np.expand_dims(img_array, axis=0)
img_array = preprocess_input(img_array)  # Prétraitement spécifique à ResNet50

```

### **Étape 3 : Obtenir la prédiction du modèle**

Le modèle effectue une prédiction sur l'image, et nous récupérons la classe prédite ainsi que ses informations associées.

```python
# Prédiction sur l'image
preds = model.predict(img_array)

# Obtenir la classe prédite
predicted_class = np.argmax(preds[0])
print(f"Classe prédite: {decode_predictions(preds, top=1)[0][0]}")

```

### **Étape 4 : Créer le modèle CAM en extrayant la dernière couche de convolution**

Nous allons extraire la sortie de la dernière couche de convolution et la combiner avec les poids de la couche dense associée à la prédiction.

```python
# Modèle pour obtenir les activations de la dernière couche de convolution
last_conv_layer = model.get_layer("conv5_block3_out")

# Créer un nouveau modèle pour obtenir les activations de la dernière couche de convolution
cam_model = tf.keras.models.Model([model.inputs], [last_conv_layer.output, model.output])

# Récupérer les activations de la couche convolutionnelle et la prédiction
conv_output, predictions = cam_model(img_array)

# Récupérer les activations de la classe prédite
predicted_class_output = predictions[:, predicted_class]

# Calculer le gradient de la classe prédite par rapport à la sortie de la dernière couche de convolution
grads = tf.gradients(predicted_class_output, conv_output)[0]

# Calculer la moyenne des gradients sur chaque canal de la dernière couche de convolution
pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))

# Appliquer les gradients aux activations
conv_output = conv_output[0]
pooled_grads_value = pooled_grads.numpy()

for i in range(pooled_grads_value.shape[-1]):
    conv_output[:, :, i] *= pooled_grads_value[i]

```

### **Étape 5 : Générer et visualiser la Class Activation Map**

Nous obtenons maintenant une carte de chaleur (heatmap) basée sur les activations pondérées par les gradients, et nous la superposons à l'image d'origine.

```python
# Moyenniser les activations sur les canaux pour obtenir la carte de chaleur
heatmap = np.mean(conv_output, axis=-1)

# Normaliser la carte de chaleur pour qu'elle soit entre 0 et 1
heatmap = np.maximum(heatmap, 0) / np.max(heatmap)

# Afficher la carte de chaleur
plt.matshow(heatmap)
plt.show()

# Charger l'image d'origine
img = image.load_img(img_path)
img = image.img_to_array(img)

# Redimensionner la carte de chaleur pour qu'elle corresponde à la taille de l'image d'origine
heatmap = np.uint8(255 * heatmap)
heatmap = np.expand_dims(heatmap, axis=-1)
heatmap = tf.image.resize(heatmap, (img.shape[0], img.shape[1]))

# Appliquer un colormap pour rendre la carte de chaleur plus visible
heatmap = tf.keras.preprocessing.image.array_to_img(heatmap)
heatmap = heatmap.convert("RGB")
heatmap = np.array(heatmap)
heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)

# Superposer la carte de chaleur à l'image d'origine
superimposed_img = heatmap * 0.4 + img

# Afficher l'image finale
plt.figure(figsize=(10, 10))
plt.imshow(superimposed_img.astype(np.uint8))
plt.axis('off')
plt.show()

```

### 3. **Explication des étapes techniques**

1. **Extraire les activations de la dernière couche convolutionnelle** : Nous utilisons la dernière couche de convolution avant les couches denses pour extraire les activations. Ce sont ces activations qui indiquent quelles parties de l'image ont le plus contribué à la prédiction.
2. **Calcul des gradients** : Les gradients sont calculés par rapport à la classe prédite. Ils indiquent l'importance de chaque activation de la dernière couche de convolution pour cette classe.
3. **Pondération des activations** : Les activations de chaque canal sont pondérées par la moyenne des gradients correspondants, ce qui permet de renforcer les activations qui ont eu le plus d'impact sur la prédiction finale.
4. **Génération de la carte de chaleur (CAM)** : En combinant les activations pondérées, nous obtenons une carte de chaleur qui met en évidence les zones de l'image les plus influentes pour la décision du modèle.
5. **Superposition de la carte de chaleur à l'image d'origine** : Enfin, nous superposons la carte de chaleur sur l'image d'origine pour obtenir une visualisation interprétable et visuelle des parties de l'image utilisées par le modèle.

### 4. **Conclusion**

Les **Class Activation Maps (CAM)** sont un outil puissant pour **interpréter les prédictions** des modèles de réseaux de neurones, en particulier les modèles de classification d'images. En visualisant les parties de l'image qui ont influencé la décision, nous pouvons mieux comprendre comment un modèle traite l'information et pourquoi il prend certaines décisions. Cette méthode est cruciale pour améliorer la confiance dans les systèmes basés sur l'IA, diagnostiquer les erreurs et ajuster les architectures de modèles.
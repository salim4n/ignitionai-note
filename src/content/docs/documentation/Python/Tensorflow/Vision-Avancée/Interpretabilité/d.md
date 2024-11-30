---
title : Grad-CAM
description : Grad-CAM
---

Le **Gradient-weighted Class Activation Mapping (Grad-CAM)** est une technique d'interprétabilité qui étend les **Class Activation Maps (CAM)**. Contrairement aux CAM classiques, qui nécessitent que le modèle soit modifié (pour accéder à la dernière couche convolutionnelle), Grad-CAM peut être appliqué **sans modifier le modèle** et utilise les gradients pour identifier les parties importantes d'une image pour une classe spécifique.

Grad-CAM génère une **carte de chaleur pondérée par les gradients** à partir des activations des couches de convolution, permettant de comprendre quelles parties d'une image sont les plus importantes pour une prédiction.

### Étapes pour implémenter Grad-CAM

1. **Charger un modèle pré-entraîné** et une image d'exemple.
2. **Calculer les activations de la dernière couche convolutionnelle** et les gradients de la prédiction par rapport à ces activations.
3. **Moyenner les gradients** et les appliquer aux activations pour pondérer leur importance.
4. **Générer une carte de chaleur** qui montre les zones importantes pour la prédiction.
5. **Superposer la carte de chaleur** sur l'image originale.

### 1. **Charger les bibliothèques et le modèle**

On commence par charger TensorFlow et Keras, ainsi qu'un modèle pré-entraîné (comme VGG16). Nous chargerons également une image d'exemple pour laquelle nous souhaitons générer la carte Grad-CAM.

```python
import tensorflow as tf
import numpy as np
import matplotlib.pyplot as plt
from tensorflow.keras.applications import VGG16
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.vgg16 import preprocess_input, decode_predictions

# Charger le modèle pré-entraîné VGG16
model = VGG16(weights='imagenet')

# Résumer le modèle
model.summary()

```

### **Charger une image et la pré-traiter**

Nous allons maintenant charger une image à analyser et la redimensionner pour qu'elle soit compatible avec le modèle.

```python
# Charger et pré-traiter une image
img_path = 'path_to_your_image.jpg'  # Remplacer par le chemin de votre image
img = image.load_img(img_path, target_size=(224, 224))
img_array = image.img_to_array(img)
img_array = np.expand_dims(img_array, axis=0)
img_array = preprocess_input(img_array)

```

### **Faire une prédiction avec le modèle**

Le modèle fait une prédiction sur l'image, et nous extrayons l'index de la classe prédite.

```python
# Prédire la classe de l'image
preds = model.predict(img_array)

# Obtenir l'indice de la classe prédite
predicted_class = np.argmax(preds[0])

# Afficher la classe prédite
print(f"Classe prédite: {decode_predictions(preds, top=1)[0][0]}")

```

### 2. **Implémenter Grad-CAM**

### **Obtenir les activations de la dernière couche convolutionnelle et calculer les gradients**

Nous devons récupérer la sortie de la dernière couche de convolution et calculer les gradients de la classe prédite par rapport à ces activations.

```python
# Définir la dernière couche convolutionnelle
last_conv_layer = model.get_layer('block5_conv3')

# Créer un modèle qui retourne à la fois la sortie de la dernière couche convolutionnelle et la prédiction
grad_model = tf.keras.models.Model([model.inputs], [last_conv_layer.output, model.output])

# Suivre les gradients
with tf.GradientTape() as tape:
    conv_output, predictions = grad_model(img_array)
    predicted_output = predictions[:, predicted_class]

# Calculer les gradients de la classe prédite par rapport à la sortie de la dernière couche de convolution
grads = tape.gradient(predicted_output, conv_output)

# Moyenne des gradients pour chaque canal (gradient global pour chaque filtre)
pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))

# Pondérer les activations de la dernière couche par les gradients
conv_output = conv_output[0]  # On enlève la dimension batch
pooled_grads_value = pooled_grads.numpy()

for i in range(pooled_grads_value.shape[-1]):
    conv_output[:, :, i] *= pooled_grads_value[i]

```

### 3. **Générer la carte de chaleur Grad-CAM**

En utilisant les activations pondérées, nous générons la carte de chaleur qui montre les parties importantes de l'image.

```python
# Moyenne des activations pondérées pour obtenir la carte de chaleur
heatmap = np.mean(conv_output, axis=-1)

# Normaliser la carte de chaleur entre 0 et 1
heatmap = np.maximum(heatmap, 0) / np.max(heatmap)

# Afficher la carte de chaleur
plt.matshow(heatmap)
plt.title("Grad-CAM Heatmap")
plt.show()

```

### 4. **Superposer la carte de chaleur sur l'image originale**

Nous redimensionnons la carte de chaleur pour qu'elle corresponde à la taille d'origine de l'image, puis la superposons à l'image pour obtenir une visualisation intuitive.

```python
import cv2

# Redimensionner la carte de chaleur pour qu'elle corresponde à la taille de l'image d'origine
heatmap = cv2.resize(heatmap, (img.shape[1], img.shape[0]))

# Convertir la carte de chaleur en format RGB
heatmap = np.uint8(255 * heatmap)

# Appliquer un colormap pour rendre la carte de chaleur visible
heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)

# Superposer la carte de chaleur à l'image d'origine
superimposed_img = heatmap * 0.4 + img

# Afficher l'image finale
plt.figure(figsize=(8, 8))
plt.imshow(superimposed_img.astype(np.uint8))
plt.axis('off')
plt.title("Superimposed Grad-CAM Heatmap")
plt.show()

```

### 5. **Explication technique de Grad-CAM**

- **Gradients et activations** : Grad-CAM utilise les **activations de la dernière couche convolutionnelle** et les pondère en fonction des **gradients** de la classe prédite par rapport à ces activations. Cela permet de comprendre quelles parties de l'image activent le plus les filtres importants pour une prédiction donnée.
- **Carte de chaleur** : En moyennant les activations pondérées, on obtient une carte de chaleur qui met en évidence les zones importantes pour la décision finale. Cette méthode est particulièrement efficace car elle met en avant des caractéristiques locales (via les convolutions) qui influencent directement la prédiction.
- **Superposition sur l'image d'origine** : La carte de chaleur est ensuite **superposée à l'image d'origine** pour fournir une visualisation claire des régions importantes. Les zones chaudes (rouge/orange) indiquent les parties de l'image qui ont le plus influencé la prédiction, tandis que les zones plus froides sont moins importantes.

### 6. **Conclusion**

Grad-CAM est un outil puissant pour comprendre **quelles parties d'une image influencent les prédictions d'un modèle de réseau de neurones**. Cela est crucial pour l'interprétabilité, car il permet de visualiser et de diagnostiquer les comportements des modèles, et peut également être utilisé pour identifier des biais ou améliorer la transparence dans des applications critiques. En superposant les activations importantes sur l'image originale, on obtient une visualisation intuitive qui facilite la compréhension des décisions du modèle.
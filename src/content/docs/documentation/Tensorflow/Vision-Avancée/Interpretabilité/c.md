---
title : Saliency Maps
description : Saliency Maps
---

Les **Saliency Maps** sont une méthode d’interprétation des modèles d’apprentissage profond, particulièrement utiles pour comprendre **quelles parties d’une image influencent** le plus une prédiction. Elles fonctionnent en calculant les **dérivées des prédictions** par rapport à chaque pixel de l’image d'entrée, permettant de voir comment les petites variations dans chaque pixel affectent la prédiction.

Contrairement aux **Class Activation Maps (CAM)**, les Saliency Maps peuvent être utilisées avec **n'importe quel modèle**, même si le modèle n’a pas de couche de convolution, car elles reposent simplement sur les gradients.

### 1. **Étapes pour calculer les Saliency Maps**

Voici un aperçu des étapes pour générer une Saliency Map :

1. **Charger l’image et le modèle pré-entraîné**.
2. **Obtenir la prédiction du modèle** pour une classe spécifique.
3. **Calculer les gradients** des pixels d'entrée par rapport à la prédiction.
4. **Créer une carte de chaleur basée sur ces gradients** et visualiser les parties les plus importantes de l'image pour la prédiction.

### 2. **Implémentation des Saliency Maps avec TensorFlow et Keras**

### **Étape 1 : Charger les bibliothèques et le modèle**

On commence par charger TensorFlow, Keras, et un modèle pré-entraîné tel que VGG16, ResNet50, ou InceptionV3.

```python
import tensorflow as tf
import numpy as np
import matplotlib.pyplot as plt
from tensorflow.keras.applications import VGG16
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.vgg16 import preprocess_input, decode_predictions

# Charger le modèle pré-entraîné (par exemple VGG16)
model = VGG16(weights='imagenet')

# Afficher un résumé du modèle pour voir la structure
model.summary()

```

### **Étape 2 : Charger une image et la prétraiter**

On charge une image à partir du disque, on la redimensionne et on la pré-traite de manière compatible avec le modèle choisi.

```python
# Charger et prétraiter une image
img_path = "path_to_your_image.jpg"  # Remplacer par le chemin de votre image
img = image.load_img(img_path, target_size=(224, 224))
img_array = image.img_to_array(img)
img_array = np.expand_dims(img_array, axis=0)
img_array = preprocess_input(img_array)  # Prétraitement spécifique à VGG16

```

### **Étape 3 : Obtenir la prédiction du modèle**

Nous demandons au modèle de prédire la classe de l'image, et récupérons l'index de la classe prédite.

```python
# Prédire la classe de l'image
preds = model.predict(img_array)

# Afficher la classe prédite
print(f"Classe prédite: {decode_predictions(preds, top=1)[0][0]}")

# Récupérer l'indice de la classe prédite
predicted_class = np.argmax(preds[0])

```

### **Étape 4 : Calculer les gradients de la sortie par rapport à l'image d'entrée**

Nous calculons les gradients de la sortie de la classe prédite par rapport à l’image d’entrée. Cela nous donne une idée de la sensibilité de chaque pixel par rapport à la prédiction.

```python
# Créer une fonction TensorFlow pour obtenir les gradients
with tf.GradientTape() as tape:
    tape.watch(img_array)  # Surveiller l'image d'entrée
    preds = model(img_array)  # Faire une nouvelle prédiction
    class_output = preds[:, predicted_class]  # Récupérer la sortie pour la classe prédite

# Calculer le gradient de la classe prédite par rapport à l'image d'entrée
grads = tape.gradient(class_output, img_array)

# Prendre la valeur absolue des gradients pour obtenir la magnitude des changements
saliency = tf.reduce_max(tf.abs(grads), axis=-1)[0]

```

### **Étape 5 : Visualiser la Saliency Map**

Nous allons maintenant afficher la **Saliency Map**, qui montre l'importance de chaque pixel dans l'image d'entrée pour la prédiction du modèle.

```python
# Normaliser la saliency map pour qu'elle soit entre 0 et 1
saliency = (saliency - tf.reduce_min(saliency)) / (tf.reduce_max(saliency) - tf.reduce_min(saliency))

# Afficher la saliency map
plt.imshow(saliency, cmap='hot')
plt.axis('off')
plt.title("Saliency Map")
plt.show()

```

### 3. **Explication des étapes techniques**

1. **Suivi des gradients** : En utilisant `tf.GradientTape()`, nous demandons à TensorFlow de suivre les opérations pour calculer les gradients de la sortie de la classe prédite par rapport à l'image d'entrée.
2. **Calcul des gradients** : Les gradients sont calculés pour chaque pixel de l'image d'entrée. Ces gradients nous indiquent dans quelle mesure de petites modifications de chaque pixel influenceraient la prédiction du modèle.
3. **Magnitude des gradients** : Nous prenons la **valeur absolue des gradients** et utilisons la valeur maximale sur tous les canaux de couleur pour obtenir une carte de chaleur en niveaux de gris. Cette carte montre quelles régions de l'image affectent le plus la prédiction.
4. **Affichage de la Saliency Map** : Nous normalisons les valeurs de la carte de chaleur entre 0 et 1 et la visualisons avec une colormap (ici `hot`) qui met en évidence les zones importantes en rouge et jaune.

### 4. **Exemple concret d'interprétation d'une Saliency Map**

Supposons que nous utilisons une image d’un chien, et que le modèle prédit correctement la classe "chien". En calculant la **Saliency Map**, nous pourrons voir les régions spécifiques de l’image (comme la tête ou les oreilles du chien) qui ont contribué de manière significative à cette prédiction. Si les régions importantes sont bien alignées avec les caractéristiques distinctives de l’objet à classifier, cela renforce la confiance dans le modèle. Si, au contraire, les régions importantes sont ailleurs (par exemple, en arrière-plan), cela pourrait indiquer des biais ou des faiblesses dans le modèle.

### 5. **Conclusion**

Les **Saliency Maps** sont un outil simple et efficace pour interpréter les prédictions des modèles de réseaux de neurones, en particulier pour les images. Elles permettent de visualiser **quelles parties de l’image** influencent le plus la prédiction du modèle, ce qui peut être très utile pour diagnostiquer des erreurs, ajuster des modèles, ou simplement améliorer la transparence des systèmes d'IA.

L'étape suivante dans l'exploration de l'interprétabilité consistera à examiner des techniques plus avancées, comme les **Gradient-weighted Class Activation Maps (Grad-CAM)**, qui permettent de combiner les avantages des saliency maps avec ceux des CAM pour une interprétation plus détaillée et précise des prédictions des modèles.
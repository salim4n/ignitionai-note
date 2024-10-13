---
title: Transfer Learning avec ResNet-50
description: Transfer Learning avec ResNet-50
---

## 1. **Introduction au transfert learning avec ResNet-50**

ResNet-50 est un réseau de neurones profond composé de 50 couches, largement utilisé pour des tâches de classification d'images. Il est souvent utilisé avec des poids pré-entraînés, car cela permet de tirer parti des connaissances acquises sur de grands ensembles de données comme ImageNet. Ensuite, on peut ajuster certains paramètres du modèle (fine-tuning) pour des tâches spécifiques.

### **Les étapes à suivre** :

1. Charger le modèle ResNet-50 sans passer par TensorFlow Hub.
2. Restaurer les poids pré-entraînés (comme ceux entraînés sur ImageNet).
3. Sélectionner les couches à réentraîner et geler celles qui ne doivent pas être modifiées.

---

## 2. **Charger un modèle ResNet-50 hors TensorFlow Hub**

Au lieu d’utiliser TensorFlow Hub, nous allons utiliser l’API de Keras (intégrée à TensorFlow) pour charger le modèle ResNet-50 avec ou sans les poids pré-entraînés.

### **Étape 1 : Charger ResNet-50 avec les poids pré-entraînés**

Voici comment charger le modèle ResNet-50 pré-entraîné sur ImageNet à l’aide de Keras. Si tu veux commencer avec un modèle non pré-entraîné, il suffit de passer `weights=None`.

```python
import tensorflow as tf
from tensorflow.keras.applications import ResNet50

# Charger ResNet-50 avec des poids pré-entraînés sur ImageNet
model = ResNet50(weights='imagenet', include_top=False, input_shape=(224, 224, 3))

```

- **`weights='imagenet'`** : Indique que le modèle doit être chargé avec des poids pré-entraînés sur le dataset ImageNet.
- **`include_top=False`** : Enlève la couche de classification finale (top layer), car nous voulons adapter le modèle pour une tâche spécifique.
- **`input_shape=(224, 224, 3)`** : Définit la taille de l'image d'entrée.

### **Explication :**

- **Pourquoi inclure `include_top=False` ?**
Cela permet d’utiliser les caractéristiques extraites par ResNet-50 sans la dernière couche qui est spécifique à ImageNet (1000 classes). Nous allons ajouter notre propre couche de classification personnalisée pour la tâche que nous voulons réaliser (par exemple, classer des images en 10 catégories au lieu de 1000).

---

## 3. **Restaurer les poids pré-entraînés**

Dans ce cas, nous avons déjà chargé les poids pré-entraînés d’ImageNet dans la section précédente. Si tu veux charger des poids d'une autre source (par exemple, des poids personnalisés que tu as sauvegardés après un autre entraînement), voici comment les charger à partir d’un fichier `.h5` (fichier de sauvegarde de Keras).

### **Étape 2 : Charger des poids pré-entraînés depuis un fichier personnalisé**

Supposons que tu as sauvegardé un modèle avec des poids dans un fichier. Tu peux charger ces poids avec la méthode `load_weights()`.

```python
# Charger un modèle ResNet-50 sans poids
model = ResNet50(weights=None, include_top=False, input_shape=(224, 224, 3))

# Charger les poids sauvegardés dans un fichier .h5
model.load_weights('path_to_your_custom_weights.h5')

```

---

## 4. **Configurer les parties du modèle à réentraîner (fine-tuning)**

Lorsque tu fais du transfert learning, il est souvent utile de **geler** certaines couches du modèle (celles pré-entraînées) afin de ne pas les modifier pendant l’entraînement. Tu peux ensuite choisir de **réentraîner** uniquement certaines couches supérieures.

### **Étape 3 : Geler les couches que tu ne veux pas réentraîner**

Nous allons geler les premières couches de ResNet-50 pour conserver les poids pré-entraînés, et ne réentraîner que les couches de classification que nous allons ajouter à la fin.

### **Geler les couches de ResNet-50** :

```python
# Geler toutes les couches de ResNet-50 (empêcher leur mise à jour pendant l'entraînement)
for layer in model.layers:
    layer.trainable = False

```

### **Ajouter de nouvelles couches de classification** :

Comme nous avons supprimé la couche de classification d'ImageNet (avec `include_top=False`), nous devons ajouter une nouvelle tête (classification head) adaptée à notre nouvelle tâche.

Voici comment ajouter des couches supplémentaires :

```python
from tensorflow.keras import layers, models

# Créer un modèle séquentiel
new_model = models.Sequential()

# Ajouter ResNet-50 comme base du modèle
new_model.add(model)

# Ajouter des couches de classification personnalisées (par exemple, pour 10 classes)
new_model.add(layers.Flatten())  # Applatir les caractéristiques en un vecteur
new_model.add(layers.Dense(256, activation='relu'))  # Ajouter une couche entièrement connectée
new_model.add(layers.Dropout(0.5))  # Ajouter du dropout pour éviter l'overfitting
new_model.add(layers.Dense(10, activation='softmax'))  # Sortie pour 10 classes (changer selon ton problème)

# Afficher la structure du nouveau modèle
new_model.summary()

```

### **Pourquoi ajouter ces nouvelles couches ?**

1. **`Flatten`** : ResNet-50 produit des cartes de caractéristiques (feature maps) de dimensions (7, 7, 2048). Il faut les transformer en un vecteur 1D avec `Flatten`.
2. **`Dense(256)`** : Ajout d'une couche entièrement connectée pour capturer les combinaisons complexes des caractéristiques extraites par ResNet-50.
3. **`Dropout(0.5)`** : Utilisé pour réduire le surapprentissage (overfitting) en ignorant aléatoirement des neurones pendant l'entraînement.
4. **`Dense(10)`** : La dernière couche de sortie avec 10 neurones (nombre de classes à classifier). Tu peux ajuster cette valeur en fonction de ta tâche.

---

## 5. **Dé-geler certaines couches pour un réentraînement partiel**

Si tu veux entraîner certaines couches de ResNet-50 tout en en gelant d’autres, tu peux dégeler une partie des couches. Souvent, on dégèle les couches supérieures du modèle pour permettre un ajustement fin des caractéristiques.

### **Étape 4 : Dégeler les couches supérieures de ResNet-50**

Voici comment dégeler les dernières couches de ResNet-50 (par exemple, les 10 dernières couches) tout en gardant les autres gelées :

```python
# Dégeler les 10 dernières couches pour fine-tuning
for layer in model.layers[-10:]:
    layer.trainable = True

```

### **Pourquoi dégeler seulement quelques couches ?**

Cela permet de conserver les connaissances générales du modèle (extraction de caractéristiques à bas niveau dans les premières couches) tout en affinant les caractéristiques plus spécifiques dans les dernières couches pour mieux s’adapter à la nouvelle tâche.

---

## 6. **Compiler et entraîner le modèle**

Une fois que tu as configuré les couches à entraîner et celles à geler, tu peux compiler et entraîner ton modèle. Utilise une fonction de perte et un optimiseur appropriés pour ta tâche.

### **Étape 5 : Compiler et entraîner le modèle**

Voici un exemple de compilation et d’entraînement du modèle :

```python
# Compiler le modèle
new_model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=0.0001),
                  loss='categorical_crossentropy',  # Pour un problème de classification avec 10 classes
                  metrics=['accuracy'])

# Entraîner le modèle sur un ensemble de données
history = new_model.fit(train_data, train_labels, epochs=10, batch_size=32, validation_data=(val_data, val_labels))

```

- **Optimiseur (`Adam`)** : Utilisé pour ajuster les poids. Le taux d'apprentissage est généralement plus bas pour le fine-tuning.
- **Fonction de perte (`categorical_crossentropy`)** : Appropriée pour une tâche de classification multi-classes.
- **`train_data` et `train_labels`** : Tes données d'entraînement.
- **`val_data` et `val_labels`** : Tes données de validation.

---

## 7. **Conclusion**

Tu as maintenant un pipeline complet pour charger un modèle ResNet-50 depuis Keras (hors TensorFlow Hub), restaurer des poids pré-entraînés, et sélectionner les parties du modèle à réentraîner. Voici un résumé des étapes :

1. **Charger ResNet-50 avec ou sans poids pré-entraînés**.
2. **Restaurer les poids personnalisés si nécessaire**.
3. **Geler certaines couches pour préserver les caractéristiques générales**.
4. **Ajouter de nouvelles couches de classification** adaptées à ta tâche.
5. **Dégeler certaines couches pour ajuster finement le modèle**.
6. **Compiler et entraîner le modèle sur tes données spécifiques**.

Ce processus te donne un contrôle total pour ajuster les performances du modèle pré-entraîné à une nouvelle tâche. Si tu veux explorer
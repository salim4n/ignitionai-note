---
title : API pour annotation
description : API pour annotation
---
Pour annoter manuellement des images pour la détection d’objets en utilisant l'API de détection d'objets de TensorFlow, il est essentiel de comprendre que l'annotation consiste à ajouter des boîtes englobantes et des étiquettes sur les objets d'intérêt dans les images. Ces annotations seront ensuite utilisées pour entraîner un modèle de détection d'objets.

L'API de détection d'objets de TensorFlow n'offre pas directement un outil d'annotation visuelle, mais nous pouvons utiliser des outils comme **LabelImg** pour créer des annotations manuelles au format **Pascal VOC** ou **COCO**, qui sont compatibles avec l'API. Ensuite, nous pouvons convertir ces annotations en TFRecords pour les utiliser dans l'entraînement de modèles TensorFlow.

Voici les étapes détaillées pour réaliser ce processus, depuis l'annotation des images jusqu'à l'intégration dans TensorFlow.

---

## 1. **Introduction à l'annotation pour la détection d’objets**

Dans la détection d'objets, annoter manuellement des images consiste à :

- Dessiner des boîtes englobantes autour des objets d'intérêt.
- Attribuer une étiquette à chaque boîte englobante pour identifier l'objet.

Les annotations peuvent être effectuées avec des outils comme **LabelImg** ou **RectLabel**. Ces outils exportent les annotations dans des formats standards (XML pour Pascal VOC, JSON pour COCO), que nous devons ensuite convertir en TFRecords pour l'entraînement avec TensorFlow.

---

## 2. **Installer et utiliser un outil d'annotation (LabelImg)**

### **Étape 1 : Installer LabelImg**

**LabelImg** est un outil open-source permettant de dessiner des boîtes englobantes et d'exporter les annotations au format **Pascal VOC** ou **COCO**. Il est compatible avec Windows, macOS et Linux.

### Installation via pip :

```bash
pip install labelImg

```

Ou, tu peux cloner le dépôt et l'installer manuellement :

```bash
git clone <https://github.com/tzutalin/labelImg.git>
cd labelImg
pip install pyqt5 lxml
python labelImg.py

```

### **Étape 2 : Annoter les images avec LabelImg**

1. Ouvre **LabelImg** :
    
    ```bash
    labelImg
    
    ```
    
2. **Charger une image** : Ouvre une image sur laquelle tu souhaites annoter des objets.
3. **Dessiner des boîtes englobantes** :
    - Clique sur "Create RectBox" (ou appuie sur `w`).
    - Dessine une boîte autour de l'objet que tu veux détecter.
    - Attribue une étiquette à cet objet (par exemple, "cat", "dog", etc.).
4. **Enregistrer l'annotation** :
    - Enregistre les annotations sous forme de fichiers **Pascal VOC** (`.xml`) ou **COCO** (`.json`).
5. Répète ce processus pour toutes les images que tu souhaites annoter.

---

## 3. **Convertir les annotations en TFRecord**

Une fois les images annotées, il faut convertir les fichiers XML (Pascal VOC) ou JSON (COCO) en un format que TensorFlow peut comprendre, c'est-à-dire en **TFRecord**.

### **Étape 3 : Convertir les annotations au format TFRecord**

Voici les étapes pour convertir des annotations VOC ou COCO en TFRecord. TensorFlow Object Detection API fournit des scripts pour cela.

### **Pré-requis** : Organisation des données

Ton répertoire d'images et d'annotations doit être structuré de la manière suivante :

```
dataset/
    ├── images/          # Images non annotées
    │    ├── image1.jpg
    │    ├── image2.jpg
    └── annotations/     # Fichiers d'annotations
         ├── image1.xml  # Format Pascal VOC
         ├── image2.xml

```

### **Utiliser les scripts de conversion** :

1. **Télécharge l'API de détection d'objets de TensorFlow** (si ce n'est pas encore fait) :
    
    ```bash
    git clone <https://github.com/tensorflow/models.git>
    cd models/research/object_detection
    
    ```
    
2. **Script de conversion Pascal VOC vers TFRecord** :
    
    Un script est fourni pour convertir des annotations VOC en TFRecord :
    
    ```bash
    python models/research/object_detection/dataset_tools/create_pascal_tf_record.py \\
        --data_dir=dataset \\
        --set=train \\
        --annotations_dir=annotations \\
        --output_path=train.record \\
        --label_map_path=label_map.pbtxt
    
    ```
    
    - **`data_dir`** : Le répertoire où se trouvent les images et les annotations.
    - **`annotations_dir`** : Le répertoire contenant les fichiers XML annotés.
    - **`output_path`** : Le chemin de sortie pour le fichier TFRecord.
    - **`label_map_path`** : Le fichier `.pbtxt` qui associe les étiquettes (comme "cat", "dog") à des identifiants numériques.
3. **Créer un fichier de mappage d'étiquettes** (`label_map.pbtxt`) :
    
    Ce fichier mappe chaque étiquette à un entier. Voici un exemple de fichier `label_map.pbtxt` pour deux classes, "cat" et "dog" :
    
    ```
    item {
      id: 1
      name: "cat"
    }
    
    item {
      id: 2
      name: "dog"
    }
    
    ```
    
    Ce fichier est utilisé par TensorFlow pour comprendre les classes d’objets.
    
4. **Script de conversion COCO vers TFRecord** :
    
    Si tu as annoté tes images au format COCO, un script similaire existe pour convertir ces annotations en TFRecord. Assure-toi d'avoir des annotations au format JSON (COCO) et utilise le script :
    
    ```bash
    python models/research/object_detection/dataset_tools/create_coco_tf_record.py \\
        --train_image_dir=dataset/images \\
        --val_image_dir=dataset/val_images \\
        --train_annotations_file=annotations/train_annotations.json \\
        --val_annotations_file=annotations/val_annotations.json \\
        --output_dir=output_dir/
    
    ```
    

---

## 4. **Utiliser les TFRecords pour entraîner un modèle de détection d'objets**

Maintenant que tu as converti tes annotations en TFRecord, tu peux les utiliser pour entraîner un modèle de détection d'objets dans TensorFlow.

### **Étape 4 : Configuration du pipeline d’entraînement**

1. **Télécharger un modèle pré-entraîné** (comme SSD ou Faster R-CNN) à partir du *Model Zoo* de TensorFlow : https://github.com/tensorflow/models/blob/master/research/object_detection/g3doc/tf2_detection_zoo.md
2. **Modifier le fichier de configuration du pipeline** :
    - Modifie le fichier de configuration pour pointer vers tes fichiers TFRecord.
    - Spécifie le fichier `label_map.pbtxt` dans la section `input_reader`.
    - Ajuste les paramètres d’entraînement comme le nombre d’époques, le taux d'apprentissage, etc.
3. **Entraîner le modèle** :
    
    Lance l'entraînement avec le script suivant :
    
    ```bash
    python models/research/object_detection/model_main_tf2.py \\
        --pipeline_config_path=path/to/your/pipeline.config \\
        --model_dir=path/to/model_dir \\
        --num_train_steps=50000 \\
        --sample_1_of_n_eval_examples=1 \\
        --alsologtostderr
    
    ```
    
    - **`pipeline_config_path`** : Le chemin vers ton fichier de configuration.
    - **`model_dir`** : Le répertoire où les checkpoints du modèle seront sauvegardés.

---

## 5. **Visualiser les résultats**

Une fois l'entraînement terminé, tu peux évaluer et visualiser les prédictions du modèle sur tes images. Utilise la même API de détection d’objets que nous avons vue précédemment pour charger ton modèle entraîné et visualiser les boîtes englobantes sur de nouvelles images.

### **Étape 5 : Visualisation des prédictions**

Voici un rappel du code pour charger ton modèle entraîné et afficher les boîtes englobantes :

```python
import tensorflow as tf
import cv2
import matplotlib.pyplot as plt

# Charger le modèle entraîné
model_dir = 'path_to_your_trained_model/saved_model'
model = tf.saved_model.load(model_dir)

# Charger et prétraiter une image
image_path = 'path_to_image.jpg'
image = cv2.imread(image_path)
image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
input_tensor = tf.convert_to_tensor(image_rgb)[tf.newaxis, ...]

# Effectuer la prédiction
detections = model(input_tensor)

# Extraire les résultats et afficher les boîtes englobantes
# (utiliser les fonctions précédemment expliquées pour dessiner les boîtes)

```

---

## 6. **Conclusion**

Ce processus permet d'annoter des images manuellement, de convertir les annotations au format TFRecord, et d'utiliser ces données pour entraîner un modèle de détection d'objets avec TensorFlow. Voici un résumé des étapes :

1. **Annoter manuellement** les images avec des outils comme LabelImg.
2. **Convertir les annotations** au format TFRecord avec les scripts fournis par TensorFlow Object Detection API.
3. **Configurer et entraîner** un modèle
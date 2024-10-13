---
title: Utiliser des modèles pré-entraînés
description: Utiliser des modèles pré-entraînés
---

Utiliser des **modèles pré-entraînés** dans des solutions MLOps permet de tirer parti de modèles déjà formés sur des données volumineuses et complexes, sans avoir à entraîner un modèle à partir de zéro. Cela est particulièrement utile pour des tâches comme la reconnaissance d'image, le traitement du langage naturel (NLP), ou encore la détection d'objets.

Voici comment vous pouvez construire des solutions avec des **modèles pré-entraînés** en Python, à l'aide de bibliothèques populaires comme **TensorFlow**, **PyTorch**, ou des plateformes comme **Hugging Face** pour les modèles de NLP.

### 1. **Pourquoi utiliser des modèles pré-entraînés ?**

- **Gains de temps et de ressources** : En utilisant des modèles déjà entraînés sur de grands ensembles de données, vous pouvez éviter le coût et le temps liés à l'entraînement.
- **Performances éprouvées** : Les modèles pré-entraînés sont souvent testés et validés sur des jeux de données complexes, garantissant un bon niveau de performance.
- **Flexibilité pour la personnalisation** : Vous pouvez utiliser ces modèles directement ou les affiner sur vos données spécifiques via une technique appelée **fine-tuning**.

### 2. **Utiliser des modèles pré-entraînés avec TensorFlow ou PyTorch**

### a) **Utiliser un modèle pré-entraîné pour la classification d'images avec TensorFlow**

Dans cet exemple, nous allons utiliser un modèle **ResNet50**, un réseau de neurones convolutif pré-entraîné sur ImageNet, pour la classification d'images.

**Étape 1 : Installation de TensorFlow**

```bash
pip install tensorflow

```

**Étape 2 : Charger et utiliser le modèle ResNet50**

```python
import tensorflow as tf
from tensorflow.keras.applications import ResNet50
from tensorflow.keras.applications.resnet50 import preprocess_input, decode_predictions
from tensorflow.keras.preprocessing import image
import numpy as np

# Charger le modèle ResNet50 pré-entraîné
model = ResNet50(weights='imagenet')

# Charger et prétraiter une image
img_path = 'image.jpg'  # Remplacez par le chemin de votre image
img = image.load_img(img_path, target_size=(224, 224))
x = image.img_to_array(img)
x = np.expand_dims(x, axis=0)
x = preprocess_input(x)

# Faire une prédiction
predictions = model.predict(x)

# Décoder les résultats
decoded_predictions = decode_predictions(predictions, top=3)[0]
for i, pred in enumerate(decoded_predictions):
    print(f"Prediction {i + 1}: {pred[1]} ({pred[2] * 100:.2f}%)")

```

Dans ce cas, le modèle **ResNet50** est déjà pré-entraîné sur **ImageNet**, un ensemble de données contenant plus d'un million d'images classées dans 1 000 catégories. Vous pouvez l’utiliser pour classer des images avec un bon niveau de précision.

### b) **Utiliser un modèle pré-entraîné avec PyTorch**

Voici un exemple similaire, mais avec **PyTorch** pour la classification d'images à l'aide de **ResNet18**.

**Étape 1 : Installation de PyTorch**

```bash
pip install torch torchvision

```

**Étape 2 : Charger et utiliser le modèle ResNet18**

```python
import torch
from torchvision import models, transforms
from PIL import Image

# Charger le modèle ResNet18 pré-entraîné
model = models.resnet18(pretrained=True)
model.eval()

# Transformer l'image pour correspondre à l'entrée du modèle
preprocess = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

# Charger et prétraiter l'image
img = Image.open("image.jpg")
img_t = preprocess(img)
batch_t = torch.unsqueeze(img_t, 0)

# Faire une prédiction
with torch.no_grad():
    output = model(batch_t)

# Charger les étiquettes ImageNet
labels = []
with open("imagenet_labels.txt") as f:
    labels = [line.strip() for line in f.readlines()]

# Obtenir les 3 meilleures prédictions
_, indices = torch.sort(output, descending=True)
percentage = torch.nn.functional.softmax(output, dim=1)[0] * 100
top3 = [(labels[idx], percentage[idx].item()) for idx in indices[0][:3]]

for i, (label, prob) in enumerate(top3):
    print(f"Prediction {i + 1}: {label} ({prob:.2f}%)")

```

Comme pour TensorFlow, ce modèle **ResNet18** est pré-entraîné sur le jeu de données ImageNet et peut être utilisé pour des tâches de classification d'images avec PyTorch.

### 3. **Utiliser des modèles pré-entraînés avec Hugging Face (NLP)**

Hugging Face propose une vaste collection de modèles pré-entraînés pour le traitement du langage naturel (**NLP**) via la bibliothèque **Transformers**. Ces modèles incluent des modèles de type **BERT**, **GPT**, **T5**, et bien d’autres, que vous pouvez utiliser directement ou affiner pour des tâches spécifiques.

### a) **Installation de la bibliothèque Transformers**

```bash
pip install transformers

```

### b) **Utiliser un modèle pré-entraîné pour la classification de texte**

Nous allons utiliser **DistilBERT**, une version allégée de BERT, pour effectuer une tâche de classification de texte.

```python
from transformers import pipeline

# Charger un pipeline de classification avec un modèle pré-entraîné
classifier = pipeline('sentiment-analysis')

# Exemple de texte
text = "MLOps is a great way to streamline machine learning deployment."

# Faire une prédiction
result = classifier(text)
print(result)

```

Ici, le modèle pré-entraîné **DistilBERT** est utilisé pour déterminer si le texte exprime une opinion **positive** ou **négative**. Vous pouvez également utiliser Hugging Face pour des tâches comme la traduction, le résumé automatique, la génération de texte, etc.

### 4. **Intégrer les modèles pré-entraînés dans un pipeline MLOps**

L'utilisation de modèles pré-entraînés s’intègre bien dans un pipeline **MLOps**, car elle permet d’accélérer le processus de développement et de déploiement de modèles. Voici un exemple d'intégration dans un pipeline :

1. **Étape de prétraitement** : Les données sont nettoyées et transformées en un format que le modèle pré-entraîné peut comprendre.
2. **Étape d'inférence** : Utilisation du modèle pré-entraîné pour effectuer une prédiction sur de nouvelles données.
3. **Étape de post-traitement** : Interpréter les résultats et éventuellement les intégrer dans un processus décisionnel ou un système en production.

Vous pouvez automatiser l’ensemble du processus via **GitHub Actions**, **Jenkins**, ou d’autres outils de **CI/CD**, en déclenchant une nouvelle prédiction chaque fois que de nouvelles données arrivent.

### 5. **Fine-tuning des modèles pré-entraînés**

Si les modèles pré-entraînés ne sont pas parfaitement adaptés à votre tâche spécifique, vous pouvez effectuer un **fine-tuning**. Cela consiste à prendre un modèle pré-entraîné et à le réentraîner légèrement sur un ensemble de données plus petit et spécifique à votre cas d’usage.

Exemple de **fine-tuning** d'un modèle NLP avec Hugging Face :

```python
from transformers import Trainer, TrainingArguments, AutoModelForSequenceClassification
from datasets import load_dataset

# Charger un modèle pré-entraîné et un jeu de données spécifique
model = AutoModelForSequenceClassification.from_pretrained("distilbert-base-uncased", num_labels=2)
dataset = load_dataset('imdb', split='train')

# Arguments d'entraînement
training_args = TrainingArguments(
    output_dir='./results',
    evaluation_strategy="epoch",
    per_device_train_batch_size=16,
    per_device_eval_batch_size=16,
    num_train_epochs=3,
    weight_decay=0.01,
)

# Créer un entraîneur
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=dataset,
)

# Lancer l'entraînement (fine-tuning)
trainer.train()

```

### 6. **Conclusion**

L’utilisation de **modèles pré-entraînés** permet de gagner du temps, d’améliorer les performances et de simplifier le processus de développement pour les applications **MLOps**. Que ce soit pour des tâches d’image, de NLP, ou d’autres domaines, ces modèles peuvent être intégrés dans vos pipelines de production, personnalisés via le fine-tuning, et automatisés grâce à des workflows CI/CD.

En résumé, vous pouvez :

- Utiliser des modèles pré-entraînés avec TensorFlow, PyTorch ou Hugging Face.
- Personnaliser ces modèles pour des besoins spécifiques via le fine-tuning.
- Automatiser l'inférence et le déploiement de ces modèles dans un pipeline MLOps.

Cela vous permet de mettre rapidement en place des solutions efficaces sans avoir à entraîner des modèles complexes à partir de zéro.

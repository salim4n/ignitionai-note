---
title: API et SDK - Hugging Face
description: API et SDK - Hugging Face
---

Hugging Face est une plateforme populaire spécialisée dans les modèles de traitement du langage naturel (NLP) et d'autres tâches d'apprentissage automatique, avec des APIs HTTP et des SDKs permettant d'intégrer et de déployer des modèles dans des workflows MLOps. Hugging Face propose des outils pour accéder aux modèles pré-entraînés, gérer des pipelines ML, et utiliser ces modèles dans des environnements de production.

Voici comment vous pouvez exploiter Hugging Face dans un contexte **MLOps** en utilisant à la fois les APIs et les SDKs.

---

### 1. **Introduction à Hugging Face pour MLOps**

### **Hugging Face Transformers**

Le **package Transformers** de Hugging Face permet d'utiliser et de fine-tuner des modèles pré-entraînés (comme BERT, GPT, T5, etc.) pour des tâches comme :

- La classification de texte.
- La traduction automatique.
- Le résumé de texte.

### **Hugging Face Inference API**

Hugging Face propose également une **API d'inférence** hébergée, qui permet d'accéder à ces modèles sans avoir à les entraîner ou les héberger soi-même. Vous pouvez envoyer des requêtes à l'API pour obtenir des prédictions en temps réel.

### 2. **Utilisation du SDK Hugging Face (Transformers) pour MLOps**

Le **SDK Transformers** permet d'utiliser les modèles de Hugging Face dans vos applications locales ou cloud, et s'intègre facilement dans un pipeline MLOps.

### a) **Installation du SDK Hugging Face**

Vous pouvez installer le SDK Hugging Face Transformers via pip :

```bash
pip install transformers

```

### b) **Charger un modèle pré-entraîné**

Voici comment charger et utiliser un modèle de Hugging Face pour faire des prédictions :

```python
from transformers import pipeline

# Charger un pipeline pour la tâche de classification de texte
classifier = pipeline('sentiment-analysis')

# Faire une prédiction sur une phrase
result = classifier('I love machine learning with Hugging Face!')
print(result)

```

Ce code utilise un modèle pré-entraîné pour analyser le sentiment d'une phrase. Il est aussi possible de charger des modèles pour d'autres tâches comme la génération de texte, le résumé, ou la traduction.

### c) **Entraînement ou fine-tuning de modèles**

Vous pouvez également fine-tuner un modèle avec Hugging Face, une étape importante dans un pipeline MLOps si vous avez des données spécifiques pour entraîner un modèle.

**Exemple** : Fine-tuning d'un modèle BERT pour la classification de texte.

```python
from transformers import BertTokenizer, BertForSequenceClassification, Trainer, TrainingArguments

# Charger un modèle BERT pré-entraîné et son tokenizer
model = BertForSequenceClassification.from_pretrained('bert-base-uncased')
tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')

# Préparer les données
train_texts = ["I love Hugging Face", "MLOps is essential"]
train_labels = [1, 0]  # 1: Positive, 0: Negative
train_encodings = tokenizer(train_texts, truncation=True, padding=True)

# Configurer l'entraînement
training_args = TrainingArguments(output_dir='./results', num_train_epochs=3, per_device_train_batch_size=8)
trainer = Trainer(model=model, args=training_args, train_dataset=train_encodings)

# Lancer l'entraînement
trainer.train()

```

Le modèle peut ensuite être exporté et déployé dans un environnement de production comme un endpoint HTTP via l'infrastructure de Hugging Face ou un autre service cloud.

### 3. **Utilisation de l'API d'inférence hébergée Hugging Face**

Si vous ne souhaitez pas déployer le modèle localement ou sur votre propre infrastructure, Hugging Face propose une **Inference API** hébergée, qui permet d'accéder à des modèles via des requêtes HTTP.

### a) **API Hugging Face Inference**

Vous pouvez envoyer des requêtes à l'API d'inférence pour utiliser des modèles hébergés par Hugging Face sans gérer l'infrastructure.

**Exemple** : Faire une requête à l'API d'inférence pour une tâche de classification de texte.

```python
import requests

API_URL = "<https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english>"
headers = {"Authorization": "Bearer <your-api-token>"}

# Les données d'entrée pour l'inférence
data = {
    "inputs": "I love using Hugging Face for MLOps!"
}

# Envoyer la requête POST
response = requests.post(API_URL, headers=headers, json=data)

# Afficher la réponse
print(response.json())

```

Dans cet exemple, vous remplacez `<your-api-token>` par votre clé d'API Hugging Face. Cette API est utilisée pour envoyer une phrase en entrée et obtenir une prédiction basée sur un modèle pré-entraîné.

### b) **Types d'API disponibles**

Hugging Face propose plusieurs types d'APIs :

- **NLP (Natural Language Processing)** : pour la classification de texte, la génération de texte, le résumé, la traduction, etc.
- **Vision** : pour des tâches comme la reconnaissance d'objets ou la classification d'images.
- **Audio** : pour la transcription automatique ou la reconnaissance vocale.

### 4. **Déploiement de modèles Hugging Face avec MLOps**

### a) **Déploiement avec Hugging Face Endpoints**

Hugging Face propose une infrastructure pour **déployer des modèles en tant qu'API** via des endpoints que vous pouvez appeler à partir de vos pipelines CI/CD ou depuis des applications. Cela simplifie la gestion des modèles en production.

Voici les étapes générales pour déployer un modèle comme un endpoint Hugging Face :

1. Entraînez ou fine-tunez un modèle localement ou dans le cloud.
2. Utilisez l'infrastructure Hugging Face pour le déploiement.
3. Appelez l'API HTTP pour effectuer des prédictions.

### b) **Automatisation des pipelines MLOps**

Hugging Face s'intègre bien avec des systèmes de CI/CD comme Jenkins, GitHub Actions, ou Azure DevOps. Par exemple, vous pouvez :

- Déclencher automatiquement l'entraînement d'un modèle lorsque de nouvelles données arrivent.
- Automatiser les tests pour vérifier la précision du modèle.
- Déployer de nouvelles versions de modèles sur des endpoints HTTP.

### 5. **Cas d'usage : Intégration avec Azure pour MLOps**

Hugging Face peut également être intégré dans un environnement Azure MLOps. Vous pouvez :

- Utiliser Azure pour l'entraînement distribué et le stockage de données.
- Intégrer les modèles Hugging Face dans des pipelines CI/CD dans Azure DevOps.
- Utiliser les endpoints Hugging Face ou les déployer sur des services comme **Azure Kubernetes Service (AKS)** pour l'inférence en temps réel.

### Conclusion

En combinant **Hugging Face** et **MLOps**, vous pouvez facilement utiliser des modèles pré-entraînés ou entraîner vos propres modèles, et les déployer via des APIs HTTP ou des SDKs. L'**Inference API** de Hugging Face simplifie l'accès aux modèles hébergés, tandis que le **SDK Transformers** permet une flexibilité totale pour l'entraînement, le fine-tuning, et le déploiement.

L'intégration avec des infrastructures cloud comme **Azure** permet d'automatiser les pipelines MLOps à grande échelle, garantissant que les modèles sont facilement déployés, surveillés, et mis à jour en production.

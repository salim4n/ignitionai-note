---
title: Télécharger des modèles Hugging Face
description: Télécharger des modèles Hugging Face
---

Télécharger des modèles et interagir avec eux via les bibliothèques Hugging Face (comme Transformers) est essentiel pour mettre en œuvre des applications d'apprentissage automatique, en particulier dans le traitement du langage naturel et d'autres domaines. Hugging Face propose un large éventail de modèles pré-entraînés et de pipelines simples pour une utilisation rapide.

---

### 1. **Télécharger des modèles avec la bibliothèque Transformers**

Hugging Face Transformers propose des milliers de modèles pré-entraînés disponibles pour diverses tâches, tels que la classification de texte, la génération de texte, la traduction et la vision par ordinateur.

- **Chargement d’un modèle et d’un tokenizer** : Pour télécharger et utiliser un modèle pré-entraîné, vous pouvez utiliser la fonction `from_pretrained`.

```python
from transformers import AutoModelForSequenceClassification, AutoTokenizer

# Charger un modèle et un tokenizer pour la classification de texte
model_name = "distilbert-base-uncased-finetuned-sst-2-english"
model = AutoModelForSequenceClassification.from_pretrained(model_name)
tokenizer = AutoTokenizer.from_pretrained(model_name)
```

- **Exécuter des inférences avec des pipelines** : Les pipelines simplifient l’exécution des inférences pour des tâches courantes comme l’analyse de sentiments, la question-réponse, etc.

```python
from transformers import pipeline

classifier = pipeline("sentiment-analysis", model=model_name)
result = classifier("I love Hugging Face!")
print(result)
```

Ce code renvoie le sentiment avec le score de confiance du modèle.

### 2. **Interagir avec des modèles téléchargés**

Une fois le modèle chargé, vous pouvez interagir avec lui en utilisant ses fonctions natives ou les pipelines Transformers pour des tâches spécifiques.

- **Tokenisation des données** : Préparer le texte pour le modèle en le transformant en vecteurs d’entrée.

```python
inputs = tokenizer("Hugging Face is amazing!", return_tensors="pt")
```

- **Faire une prédiction directe** : En passant les entrées au modèle, on peut accéder aux sorties brutes pour une interprétation personnalisée.

```python
outputs = model(**inputs)
predictions = outputs.logits.argmax(dim=-1)
print(predictions)  # Affiche l'étiquette prédite
```

### 3. **Explorer d'autres bibliothèques Hugging Face**

- **Hugging Face Datasets** : Cette bibliothèque permet de télécharger et de préparer des jeux de données adaptés aux modèles de NLP.

  ```python
  from datasets import load_dataset

  dataset = load_dataset("imdb")
  ```

- **Hugging Face Tokenizers** : Pour des besoins avancés en tokenisation, cette bibliothèque offre des outils rapides et optimisés.

  ```python
  from tokenizers import Tokenizer

  tokenizer = Tokenizer.from_pretrained("bert-base-uncased")
  ```

### 4. **Bonnes pratiques d'utilisation**

- **Gestion de la mémoire** : Libérer les modèles ou réduire la précision (ex. float16) pour des configurations de mémoire limitées.
- **Documentation et suivi des versions** : Prendre note des versions et des configurations de modèles pour assurer la reproductibilité.
- **Utilisation de la plateforme en ligne** : Les modèles peuvent également être utilisés directement via l’API Inference de Hugging Face pour éviter de télécharger localement.

---

### Conclusion

Télécharger et interagir avec les modèles via les bibliothèques Hugging Face facilite l'intégration des modèles pré-entraînés dans les applications. Que ce soit avec Transformers pour le NLP ou Datasets pour la gestion des jeux de données, Hugging Face offre un écosystème complet pour le développement de solutions de machine learning adaptées à diverses tâches.

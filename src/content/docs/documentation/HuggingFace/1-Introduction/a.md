---
title: Dépôts et espaces de Hugging Face
description: Dépôts et espaces de Hugging Face
---

Hugging Face propose des outils puissants pour collaborer, héberger et partager des modèles de machine learning, en particulier pour le traitement du langage naturel (NLP), la vision par ordinateur et d'autres domaines. Les dépôts (repositories) et espaces (Spaces) de Hugging Face facilitent la gestion des modèles et la création d'applications ML interactives.

---

### 1. **Utiliser les dépôts de Hugging Face**

Les dépôts sur Hugging Face sont conçus pour héberger des modèles, des jeux de données et des scripts. Les utilisateurs peuvent :

- **Héberger des modèles** : Créer des dépôts pour héberger des modèles de ML, disponibles en accès public ou privé, en particulier avec Transformers et Diffusers pour le NLP et la génération d'images.
- **Gérer les versions des modèles** : Utiliser des commits et des versions pour suivre l'historique des modifications d’un modèle.
- **Collaborer** : Collaborer avec d’autres utilisateurs et équipes en gérant les autorisations sur les dépôts.

Exemple pratique :

- Télécharger un modèle de Hugging Face vers un dépôt personnel.

```python
from transformers import AutoModel, AutoTokenizer
model = AutoModel.from_pretrained("bert-base-uncased")
tokenizer = AutoTokenizer.from_pretrained("bert-base-uncased")
```

- Pousser ce modèle vers un dépôt Hugging Face pour le partager :

```python
from huggingface_hub import Repository

repo = Repository(local_dir="path/to/model", clone_from="username/model_name")
repo.push_to_hub(commit_message="Initial commit")
```

### 2. **Utiliser les espaces (Spaces) de Hugging Face**

Les **Spaces** sont des environnements gratuits pour héberger et tester des applications ML interactives basées sur des frameworks comme Streamlit, Gradio ou Flask. Hugging Face fournit de l’infrastructure pour déployer des applications qui peuvent accéder aux modèles hébergés ou exécuter des inférences directement dans le navigateur.

- **Création d’un Space** : Dans l'onglet Spaces de votre compte Hugging Face, choisissez un framework (ex. : Gradio, Streamlit) pour créer votre application.
- **Héberger une démo interactive** : Créer une interface de démonstration pour un modèle de NLP ou de vision par ordinateur. Gradio, par exemple, facilite la création d’interfaces interactives avec quelques lignes de code.

Exemple pratique :

```python
# Exemples avec Gradio pour une application de NLP (sentiment analysis)
import gradio as gr
from transformers import pipeline

classifier = pipeline("sentiment-analysis")

def analyze_sentiment(text):
    return classifier(text)[0]["label"]

gr.Interface(fn=analyze_sentiment, inputs="text", outputs="label").launch()
```

---

### 3. **Bonnes pratiques d’utilisation**

- **Gestion de la confidentialité** : Vous pouvez configurer vos dépôts et espaces en mode public ou privé selon les besoins de votre équipe.
- **Documentation** : Pour chaque modèle, fournir une documentation et des exemples clairs dans le README du dépôt pour faciliter la réutilisation.
- **Optimisation des applications** : Pour les démos interactives sur Spaces, s’assurer que les modèles et les scripts sont optimisés pour une exécution rapide.

---

### Conclusion

Les dépôts et espaces de Hugging Face offrent un environnement complet pour gérer, partager et déployer des modèles de machine learning. Les dépôts facilitent la gestion des versions et la collaboration, tandis que les espaces permettent de créer des interfaces utilisateur simples et intuitives pour les démos en ligne.

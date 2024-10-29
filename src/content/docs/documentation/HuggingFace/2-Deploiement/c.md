---
title: Conteneuriser une application FastAPI avec des modèles Hugging Face
description: Conteneuriser une application FastAPI avec des modèles Hugging Face
---

La conteneurisation de FastAPI et des modèles Hugging Face via Docker rend le déploiement rapide, portable et reproductible. Voici un guide étape par étape pour créer un conteneur Docker pour une application FastAPI utilisant des modèles Hugging Face.

---

### 1. **Créer l'application FastAPI**

Commencez par créer une application FastAPI pour servir le modèle Hugging Face :

```python
# app.py
from fastapi import FastAPI
from transformers import pipeline

app = FastAPI()

# Charger le modèle Hugging Face (par exemple, un modèle de classification de sentiment)
sentiment_model = pipeline("sentiment-analysis")

# Définir un point de terminaison pour les prédictions
@app.get("/predict")
async def predict(text: str):
    result = sentiment_model(text)
    return {"text": text, "label": result[0]["label"], "score": result[0]["score"]}
```

Ce fichier `app.py` définit une API avec un point de terminaison `/predict`, qui prend un texte, exécute le modèle Hugging Face pour le sentiment, et renvoie une prédiction.

---

### 2. **Créer un Dockerfile**

Le Dockerfile décrit comment construire l'image Docker pour l'application.

```dockerfile
# Utiliser une image de base Python optimisée
FROM python:3.9-slim

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers de l'application dans le conteneur
COPY app.py /app

# Installer les bibliothèques nécessaires
RUN pip install fastapi uvicorn transformers torch

# Exposer le port sur lequel l'API écoutera
EXPOSE 8000

# Lancer l'application FastAPI avec Uvicorn
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
```

- **Base d'image** : `python:3.9-slim` est léger et rapide pour des applications Python.
- **Installation des dépendances** : `pip install` installe les bibliothèques nécessaires.
- **Exposer le port** : L'API sera accessible via le port `8000`.
- **Commande de démarrage** : Lance Uvicorn pour exécuter FastAPI.

---

### 3. **Construire et tester le conteneur**

1. **Construire l'image Docker** :

   ```bash
   docker build -t huggingface-fastapi .
   ```

2. **Lancer le conteneur** :

   ```bash
   docker run -p 8000:8000 huggingface-fastapi
   ```

   Cette commande exécute le conteneur et mappe le port `8000` de la machine hôte au port `8000` du conteneur.

3. **Tester l’API** : Accédez à `http://localhost:8000/predict?text="Votre texte ici"` pour tester l’API. Vous pouvez également utiliser l’interface Swagger générée automatiquement à `http://localhost:8000/docs`.

---

### 4. **Optimisation pour le déploiement**

Pour un déploiement en production, considérez les éléments suivants :

- **Multi-stage builds** : Pour minimiser la taille de l’image, utilisez une construction multi-stage.
- **Gestion des versions** : Spécifiez les versions exactes des bibliothèques dans le Dockerfile pour garantir la stabilité.
- **Variable d’environnement** : Configurez les tokens API ou autres paramètres via des variables d’environnement.
- **Déploiement cloud** : Déployez l'image sur des services comme AWS Elastic Container Service, Azure Kubernetes Service, ou GCP Kubernetes Engine.

---

### Exemple de déploiement cloud rapide

Pour Azure Container Registry (ACR) :

1. **Push de l’image vers ACR** :
   ```bash
   az acr login --name <nom_acr>
   docker tag huggingface-fastapi <nom_acr>.azurecr.io/huggingface-fastapi:v1
   docker push <nom_acr>.azurecr.io/huggingface-fastapi:v1
   ```
2. **Déployer sur Azure Kubernetes Service (AKS)** ou un service similaire pour une mise à l'échelle automatique et une gestion avancée.

---

### Conclusion

Conteneuriser une application FastAPI utilisant des modèles Hugging Face permet une intégration rapide et un déploiement agile dans des environnements de production. En empaquetant l'application dans Docker, on garantit la portabilité et facilite l’intégration avec des pipelines MLOps dans le cloud.

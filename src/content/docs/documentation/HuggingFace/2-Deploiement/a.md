---
title: Utiliser Docker Hub et Azure Container Registry avec des conteneurs Hugging Face
description: Utiliser Docker Hub et Azure Container Registry avec des conteneurs Hugging Face
---

Le déploiement de modèles Hugging Face dans des conteneurs Docker facilite la reproductibilité, l'évolutivité et l'intégration avec les pipelines MLOps. Docker Hub et Azure Container Registry (ACR) offrent une solution centralisée pour stocker, gérer et déployer des conteneurs Hugging Face dans le cloud.

---

### 1. **Préparer un conteneur Hugging Face avec Docker**

Les modèles Hugging Face peuvent être déployés dans des conteneurs pour une utilisation rapide dans des environnements de production. Docker permet de créer ces conteneurs et de les stocker sur Docker Hub ou ACR.

- **Créer un Dockerfile** : Commencez par un Dockerfile pour construire l'image du modèle. Voici un exemple de Dockerfile pour un modèle NLP Hugging Face :

  ```dockerfile
  # Utiliser une image de base Python
  FROM python:3.9-slim

  # Installer les bibliothèques requises
  RUN pip install transformers torch

  # Ajouter le code et les fichiers du modèle
  COPY . /app
  WORKDIR /app

  # Lancer le serveur
  CMD ["python", "app.py"]
  ```

- **Exemple d’API pour servir le modèle** : Le fichier `app.py` servira le modèle en utilisant, par exemple, FastAPI :

  ```python
  from transformers import pipeline
  from fastapi import FastAPI

  app = FastAPI()
  model = pipeline("sentiment-analysis")

  @app.get("/predict")
  async def predict(text: str):
      result = model(text)
      return result
  ```

- **Construire et tester le conteneur** :
  ```bash
  docker build -t huggingface-model .
  docker run -p 8000:8000 huggingface-model
  ```

### 2. **Publier l'image sur Docker Hub**

1. **Connexion à Docker Hub** :

   ```bash
   docker login
   ```

2. **Taguer et pousser l’image sur Docker Hub** :

   ```bash
   docker tag huggingface-model username/huggingface-model:v1
   docker push username/huggingface-model:v1
   ```

   L’image est désormais accessible publiquement ou en privé (selon votre configuration) sur Docker Hub, prête pour un déploiement sur n’importe quel service cloud.

### 3. **Utiliser Azure Container Registry (ACR)**

Azure Container Registry permet de stocker, gérer et déployer des images Docker sur Azure, intégré avec des services comme Azure Machine Learning ou Kubernetes pour un déploiement simplifié.

1. **Créer un registre de conteneurs sur Azure** :
   - Allez sur le portail Azure, sélectionnez "Container Registry", puis "Create".
   - Configurez le nom du registre, la région, et d'autres paramètres.
2. **Connexion à ACR et Push d’image** :

   - Connectez-vous à ACR depuis votre terminal :

     ```bash
     az acr login --name <nom_acr>
     ```

   - **Taguer et pousser l’image vers ACR** :
     ```bash
     docker tag huggingface-model <nom_acr>.azurecr.io/huggingface-model:v1
     docker push <nom_acr>.azurecr.io/huggingface-model:v1
     ```

3. **Déployer l’image depuis ACR** : Utilisez l'image depuis ACR pour des services Azure comme Azure Kubernetes Service (AKS) ou Azure App Service pour le déploiement.

### 4. **Bonnes pratiques**

- **Optimisation des images Docker** : Utilisez des images de base minimales (par exemple, `python:3.9-slim`) pour réduire la taille de l'image.
- **Tests locaux** : Testez l’image en local pour vérifier le bon fonctionnement avant de la publier.
- **Gestion des secrets** : Utilisez Azure Key Vault pour gérer les secrets (tokens API, informations de connexion) au lieu de les inclure dans les conteneurs.

---

### Conclusion

Utiliser Docker Hub et Azure Container Registry avec des conteneurs Hugging Face rend le déploiement des modèles plus rapide et plus flexible dans un cadre de production. Docker Hub permet une accessibilité et une distribution étendues des conteneurs, tandis qu'Azure Container Registry facilite l’intégration avec les services de cloud Azure pour des solutions d’IA scalables et sécurisées.

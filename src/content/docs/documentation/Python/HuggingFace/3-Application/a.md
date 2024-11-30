---
title: Déployer un conteneur Hugging Face sur Azure Container Apps
description: Déployer un conteneur Hugging Face sur Azure Container Apps
---

Déployer un modèle Hugging Face via Azure Container Apps permet de créer un service de modèle léger et scalable sans la gestion d'infrastructure complexe. Voici un guide détaillé pour conteneuriser un modèle Hugging Face et le déployer sur Azure Container Apps.

---

### Étapes pour déployer un conteneur Hugging Face sur Azure Container Apps

1. **Préparer l'application avec FastAPI et Hugging Face**

   Créez une API pour servir le modèle Hugging Face à l’aide de FastAPI (ou d’une autre solution Web légère) pour interagir facilement avec le modèle.

   ```python
   # app.py
   from fastapi import FastAPI
   from transformers import pipeline

   app = FastAPI()

   # Charger un modèle Hugging Face (par ex., analyse de sentiment)
   sentiment_analysis = pipeline("sentiment-analysis")

   @app.get("/predict")
   async def predict(text: str):
       result = sentiment_analysis(text)
       return {"text": text, "label": result[0]["label"], "score": result[0]["score"]}
   ```

   Ce code crée une API qui reçoit des textes et renvoie une prédiction.

2. **Créer un Dockerfile pour l'application**

   Pour conteneuriser l'application, créez un `Dockerfile` :

   ```dockerfile
   # Utilisez une image de base légère
   FROM python:3.9-slim

   # Définir le répertoire de travail
   WORKDIR /app

   # Copier les fichiers dans le conteneur
   COPY app.py /app
   COPY requirements.txt /app

   # Installer les dépendances
   RUN pip install -r requirements.txt

   # Exposer le port 8000
   EXPOSE 8000

   # Commande pour lancer l'application
   CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
   ```

   Dans le fichier `requirements.txt`, listez les bibliothèques nécessaires :

   ```
   fastapi
   uvicorn
   transformers
   torch
   ```

3. **Construire et tester l'image Docker en local**

   - **Construire l'image** :

     ```bash
     docker build -t huggingface-fastapi .
     ```

   - **Tester en local** :
     ```bash
     docker run -p 8000:8000 huggingface-fastapi
     ```
   - Accédez à `http://localhost:8000/predict?text=Votre+texte+ici` pour vérifier si le modèle fonctionne correctement.

4. **Publier l'image sur Azure Container Registry (ACR)**

   - **Connectez-vous à Azure et créez un registre ACR** :

     ```bash
     az login
     az acr create --resource-group <nom_groupe_ressource> --name <nom_registre> --sku Basic
     ```

   - **Poussez l'image dans ACR** :
     ```bash
     az acr login --name <nom_registre>
     docker tag huggingface-fastapi <nom_registre>.azurecr.io/huggingface-fastapi:v1
     docker push <nom_registre>.azurecr.io/huggingface-fastapi:v1
     ```

5. **Déployer sur Azure Container Apps**

   - **Créer une application de conteneur Azure** :

     ```bash
     az containerapp create \
       --resource-group <nom_groupe_ressource> \
       --name huggingface-container-app \
       --image <nom_registre>.azurecr.io/huggingface-fastapi:v1 \
       --environment <nom_environnement> \
       --cpu 0.5 \
       --memory 1.0Gi \
       --ingress external \
       --target-port 8000
     ```

   - **Valider le déploiement** : Accédez à l’URL générée par Azure Container Apps pour tester l’API.

---

### Conseils pour le déploiement en production

- **Auto-scaling** : Configurez le scaling automatique pour s'adapter à la demande.
- **Sécurité** : Activez l'authentification si nécessaire pour contrôler l'accès.
- **Surveillance** : Utilisez Azure Monitor pour suivre les performances du conteneur et recevoir des alertes.

---

### Conclusion

Déployer un conteneur Hugging Face sur Azure Container Apps rend l'inférence de modèle rapide, économique, et facilement scalable. Cette approche est idéale pour un déploiement léger et géré par Azure, évitant la maintenance d'infrastructures plus lourdes.

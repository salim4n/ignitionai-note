---
title: Utiliser FastAPI avec des modèles Hugging Face
description: Utiliser FastAPI avec des modèles Hugging Face
---

FastAPI est un framework web Python léger et performant, idéal pour déployer des modèles de machine learning comme ceux de Hugging Face en créant une API RESTful. Cette configuration permet de servir un modèle Hugging Face avec une interface rapide et facile d’accès, que les clients ou autres services peuvent interroger en temps réel.

---

### 1. **Installation de FastAPI et d’Uvicorn**

Avant de démarrer, installez FastAPI et Uvicorn, un serveur ASGI performant pour exécuter les applications FastAPI :

```bash
pip install fastapi uvicorn transformers
```

### 2. **Charger et servir un modèle Hugging Face avec FastAPI**

Commencez par créer une application FastAPI qui chargera un modèle Hugging Face, par exemple pour une tâche d’analyse de sentiment :

1. **Exemple de code d’API pour un modèle de sentiment** :

   ```python
   from fastapi import FastAPI
   from transformers import pipeline

   app = FastAPI()

   # Charger le modèle de sentiment Hugging Face
   sentiment_model = pipeline("sentiment-analysis")

   # Définir un point de terminaison pour les prédictions
   @app.get("/predict/")
   async def predict(text: str):
       # Utiliser le modèle pour prédire le sentiment du texte
       result = sentiment_model(text)
       return {"text": text, "label": result[0]["label"], "score": result[0]["score"]}
   ```

   - Dans cet exemple, l'API possède un seul point de terminaison `/predict/`, qui prend un texte en entrée, utilise le modèle de sentiment Hugging Face pour effectuer une prédiction, et retourne le label et le score.

2. **Lancer l’API avec Uvicorn** :

   ```bash
   uvicorn app:app --reload --host 0.0.0.0 --port 8000
   ```

   Ici, `app:app` correspond au fichier `app.py` contenant l’application FastAPI (`app` est le nom de l’instance FastAPI).

3. **Tester l'API** : Vous pouvez maintenant tester l'API en local, par exemple avec `curl` ou en accédant à `http://localhost:8000/predict/?text="Votre texte ici"` dans le navigateur.

### 3. **Bonnes pratiques avec FastAPI et Hugging Face**

- **Asynchronisme** : FastAPI supporte les fonctions asynchrones (`async def`) pour une meilleure gestion des requêtes concurrentes.
- **Réglages des limites de taille des requêtes** : Selon le modèle et l'utilisation, configurez les limites pour les requêtes (par exemple, limiter la longueur du texte en entrée pour éviter une surcharge).
- **Documentation interactive** : FastAPI génère automatiquement une documentation Swagger interactive à `http://localhost:8000/docs`, permettant de tester l’API directement depuis le navigateur.

### 4. **Optimisation et déploiement**

- **Déploiement sur le cloud** : Utilisez Docker pour empaqueter l’application et déployez-la sur une plateforme cloud (Azure, AWS, GCP).
- **Réduction de la taille des modèles** : Pour une API plus légère, pensez à optimiser les modèles Hugging Face (distillation, quantification).
- **Mise en cache** : Si l’application effectue des prédictions répétitives, l’ajout d’un cache peut réduire les temps de réponse et les coûts de calcul.

---

### Conclusion

Utiliser FastAPI avec des modèles Hugging Face permet de créer une API performante et flexible pour déployer des modèles de machine learning. Avec cette configuration, il est simple de transformer n’importe quel modèle Hugging Face en une API accessible, offrant une intégration rapide dans des systèmes d’applications plus larges ou en production.

---
title: Créer une API HTTP avec différents frameworks web
description: Créer une API HTTP avec différents frameworks web
---

La création d'une API HTTP est une étape cruciale dans le déploiement de modèles de Machine Learning (ML) et leur intégration dans des applications. Les APIs permettent d'exposer des modèles sous forme de services accessibles via des requêtes HTTP, facilitant ainsi l'interaction avec d'autres applications ou systèmes. Dans cet objectif, nous allons explorer comment construire une API HTTP à l'aide de plusieurs frameworks web populaires en Python, tels que **Flask**, **FastAPI**, et **Django**.

---

### 1. **Pourquoi créer une API HTTP pour MLOps ?**

- **Interopérabilité** : Les APIs permettent aux modèles ML d'être utilisés par d'autres applications, indépendamment de la langue ou de la plateforme.
- **Scalabilité** : Les modèles peuvent être déployés sur des serveurs, permettant de gérer plusieurs requêtes simultanément.
- **Facilité d'utilisation** : Les utilisateurs peuvent interagir avec le modèle via des requêtes HTTP, ce qui simplifie le processus d'intégration.

### 2. **Créer une API HTTP avec Flask**

Flask est un micro-framework léger et flexible pour Python, idéal pour créer des APIs simples.

### a) **Installation de Flask**

Vous pouvez installer Flask via pip :

```bash
pip install Flask

```

### b) **Créer une API avec Flask**

Voici un exemple de création d'une API pour prédire des résultats à partir d'un modèle de Machine Learning :

```python
from flask import Flask, request, jsonify
from sklearn.datasets import load_iris
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

# Créer l'application Flask
app = Flask(__name__)

# Charger et entraîner le modèle
data = load_iris()
X_train, X_test, y_train, y_test = train_test_split(data.data, data.target, test_size=0.2)
model = RandomForestClassifier(n_estimators=100)
model.fit(X_train, y_train)

@app.route('/predict', methods=['POST'])
def predict():
    # Récupérer les données JSON de la requête
    input_data = request.json['features']

    # Faire la prédiction
    prediction = model.predict([input_data])

    # Retourner le résultat sous forme JSON
    return jsonify({'prediction': int(prediction[0])})

if __name__ == '__main__':
    app.run(debug=True)

```

### c) **Tester l'API**

Vous pouvez tester l'API en utilisant **cURL** ou un outil comme **Postman**.

**Exemple avec cURL** :

```bash
curl -X POST <http://127.0.0.1:5000/predict> -H "Content-Type: application/json" -d '{"features": [5.1, 3.5, 1.4, 0.2]}'

```

---

### 3. **Créer une API HTTP avec FastAPI**

FastAPI est un framework moderne et rapide, basé sur des annotations de type, qui facilite la création d'APIs.

### a) **Installation de FastAPI**

Vous pouvez installer FastAPI et un serveur ASGI comme **uvicorn** via pip :

```bash
pip install fastapi uvicorn

```

### b) **Créer une API avec FastAPI**

Voici un exemple similaire utilisant FastAPI :

```python
from fastapi import FastAPI
from pydantic import BaseModel
from sklearn.datasets import load_iris
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

# Créer l'application FastAPI
app = FastAPI()

# Charger et entraîner le modèle
data = load_iris()
X_train, X_test, y_train, y_test = train_test_split(data.data, data.target, test_size=0.2)
model = RandomForestClassifier(n_estimators=100)
model.fit(X_train, y_train)

# Définir le modèle de données d'entrée
class InputData(BaseModel):
    features: list

@app.post('/predict')
def predict(input_data: InputData):
    # Faire la prédiction
    prediction = model.predict([input_data.features])
    return {"prediction": int(prediction[0])}

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)

```

### c) **Tester l'API**

Testez l'API de la même manière que pour Flask :

```bash
curl -X POST <http://127.0.0.1:8000/predict> -H "Content-Type: application/json" -d '{"features": [5.1, 3.5, 1.4, 0.2]}'

```

---

### 4. **Créer une API HTTP avec Django et Django REST Framework**

Django est un framework web complet, et avec **Django REST Framework (DRF)**, il est possible de construire des APIs robustes.

### a) **Installation de Django et DRF**

Installez Django et Django REST Framework via pip :

```bash
pip install django djangorestframework

```

### b) **Créer un projet Django**

1. Créez un projet Django :

   ```bash
   django-admin startproject myproject
   cd myproject

   ```

2. Créez une application pour votre API :

   ```bash
   python manage.py startapp mlapi

   ```

3. Ajoutez `mlapi` et `rest_framework` dans `settings.py`.

### c) **Définir les vues et les serializers**

Voici un exemple de vue et de serializer pour l'API :

**mlapi/models.py** :

```python
from django.db import models

# Modèle pour les données (optionnel, selon vos besoins)
class Prediction(models.Model):
    features = models.JSONField()
    prediction = models.IntegerField()

```

**mlapi/serializers.py** :

```python
from rest_framework import serializers

class PredictionSerializer(serializers.Serializer):
    features = serializers.ListField(child=serializers.FloatField())

```

**mlapi/views.py** :

```python
from rest_framework.views import APIView
from rest_framework.response import Response
from sklearn.datasets import load_iris
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from .serializers import PredictionSerializer

class PredictView(APIView):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Charger et entraîner le modèle
        data = load_iris()
        X_train, X_test, y_train, y_test = train_test_split(data.data, data.target, test_size=0.2)
        self.model = RandomForestClassifier(n_estimators=100)
        self.model.fit(X_train, y_train)

    def post(self, request):
        serializer = PredictionSerializer(data=request.data)
        if serializer.is_valid():
            features = serializer.validated_data['features']
            prediction = self.model.predict([features])
            return Response({'prediction': int(prediction[0])})
        return Response(serializer.errors, status=400)

```

### d) **Configurer les URLs**

Ajoutez une URL pour votre API dans **mlapi/urls.py** :

```python
from django.urls import path
from .views import PredictView

urlpatterns = [
    path('predict/', PredictView.as_view(), name='predict'),
]

```

Et ajoutez l'URL de l'application dans **myproject/urls.py** :

```python
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('mlapi/', include('mlapi.urls')),
]

```

### e) **Lancer le serveur et tester l'API**

Lancez le serveur Django :

```bash
python manage.py runserver

```

Testez l'API :

```bash
curl -X POST <http://127.0.0.1:8000/mlapi/predict/> -H "Content-Type: application/json" -d '{"features": [5.1, 3.5, 1.4, 0.2]}'

```

---

### Conclusion

La création d'une API HTTP pour des modèles de Machine Learning est essentielle pour les déployer dans des applications réelles. Avec des frameworks comme **Flask**, **FastAPI**, et **Django REST Framework**, vous pouvez facilement construire des APIs robustes et évolutives pour interagir avec vos modèles ML. Ces APIs peuvent être utilisées dans des environnements de production, facilitant l'accès aux modèles pour d'autres applications ou services.

La sélection du framework dépendra de vos besoins spécifiques en termes de complexité, de scalabilité et de familiarité avec le framework.

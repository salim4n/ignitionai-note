---
title: Utiliser GitHub Actions pour automatiser le packaging de modèles
description: Utiliser GitHub Actions pour automatiser le packaging de modèles
---

Les workflows CI/CD avec GitHub Actions permettent d’automatiser la construction, le test, et le déploiement de modèles machine learning en conteneurs. Automatiser le packaging de modèles, comme un modèle Hugging Face servi avec FastAPI, garantit que toute mise à jour du code ou du modèle est rapidement testée et prête à être déployée.

---

### Étapes pour configurer GitHub Actions pour le packaging d’un modèle

1. **Préparer le dépôt GitHub**

   - Commencez par mettre en place votre dépôt avec les fichiers nécessaires, notamment :
     - Le code de l’application (ex., `app.py` pour l’API FastAPI),
     - Un Dockerfile pour conteneuriser l’application,
     - Un fichier de configuration (ex., `requirements.txt` ou `environment.yml`).

2. **Créer un workflow GitHub Actions**

   Dans votre dépôt, ajoutez un fichier de workflow CI/CD sous `.github/workflows`. Par exemple, créez `.github/workflows/docker-package.yml` :

   ```yaml
   name: Build and Push Docker Image

   on:
     push:
       branches:
         - main
     pull_request:
       branches:
         - main

   jobs:
     build:
       runs-on: ubuntu-latest
       steps:
         - name: Checkout the code
           uses: actions/checkout@v2

         - name: Set up Docker Buildx
           uses: docker/setup-buildx-action@v1

         - name: Log in to Docker Hub
           uses: docker/login-action@v1
           with:
             username: ${{ secrets.DOCKER_USERNAME }}
             password: ${{ secrets.DOCKER_PASSWORD }}

         - name: Build and push Docker image
           uses: docker/build-push-action@v2
           with:
             context: .
             file: Dockerfile
             push: true
             tags: ${{ secrets.DOCKER_USERNAME }}/huggingface-fastapi:latest
   ```

   **Explications** :

   - `on` : Ce workflow est déclenché lorsqu’il y a un _push_ ou une _pull request_ sur la branche `main`.
   - **Steps** :
     - `actions/checkout@v2` : Clone le dépôt.
     - `docker/setup-buildx-action@v1` : Active le support de construction multiplateforme pour Docker.
     - `docker/login-action@v1` : Se connecte à Docker Hub (utilisez vos identifiants dans `Settings > Secrets` pour stocker `DOCKER_USERNAME` et `DOCKER_PASSWORD` de manière sécurisée).
     - `docker/build-push-action@v2` : Construit et pousse l'image sur Docker Hub avec le tag `latest`.

3. **Configurer les Secrets GitHub**

   Dans votre dépôt GitHub :

   - Allez dans `Settings > Secrets`.
   - Ajoutez `DOCKER_USERNAME` (votre nom d’utilisateur Docker) et `DOCKER_PASSWORD` (votre mot de passe Docker).

4. **Étendre le workflow avec des tests (facultatif)**

   Ajouter des tests est une bonne pratique pour garantir que le modèle fonctionne comme attendu avant le packaging. Par exemple, vous pouvez utiliser `pytest` avant l’étape de build pour tester le code et les prédictions :

   ```yaml
   - name: Install dependencies
     run: pip install -r requirements.txt

   - name: Run tests
     run: pytest
   ```

5. **Exécuter et valider**

   - Lorsque vous _pushez_ sur la branche `main`, GitHub Actions exécute automatiquement le workflow.
   - Sur la page **Actions** du dépôt, vous pouvez visualiser les logs en direct pour voir chaque étape du packaging et identifier toute erreur éventuelle.

---

### Conclusion

Avec GitHub Actions, automatiser le packaging de modèles permet de gagner du temps et d’assurer une continuité de service. Ce pipeline peut aussi être étendu pour des déploiements automatisés sur des plateformes cloud comme AWS, Azure ou GCP. Cette configuration assure que toute mise à jour du modèle ou du code est testée et prête à être distribuée en production de manière fluide.

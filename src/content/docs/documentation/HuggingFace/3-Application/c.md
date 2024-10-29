---
title: Déployer des modèles sur Hugging Face Spaces
description: Déployer des modèles sur Hugging Face Spaces
---

Hugging Face Spaces permet de partager et de déployer facilement des modèles et applications d'inférence. Spaces prend en charge des frameworks comme Gradio et Streamlit pour créer des interfaces interactives et des visualisations de modèles, tout en facilitant l'accès public.

---

### Étapes pour déployer un modèle sur Hugging Face Spaces

1. **Créer un Espace (Space) sur Hugging Face**

   Connectez-vous à votre compte Hugging Face, accédez à la section **Spaces**, puis créez un nouvel Espace en sélectionnant Gradio ou Streamlit comme framework. Ces options simplifient la création d’interfaces interactives pour tester et démontrer des modèles.

2. **Préparer les fichiers du projet**

   Préparez un fichier `app.py` pour créer une interface simple avec Gradio ou Streamlit.

   Exemple avec **Gradio** :

   ```python
   # app.py
   import gradio as gr
   from transformers import pipeline

   # Charger le modèle de Hugging Face
   sentiment_pipeline = pipeline("sentiment-analysis")

   # Définir une fonction de prédiction
   def predict_sentiment(text):
       return sentiment_pipeline(text)

   # Créer l'interface Gradio
   interface = gr.Interface(
       fn=predict_sentiment,
       inputs="text",
       outputs="label"
   )

   if __name__ == "__main__":
       interface.launch()
   ```

   Exemple avec **Streamlit** :

   ```python
   # app.py
   import streamlit as st
   from transformers import pipeline

   # Charger le modèle
   sentiment_pipeline = pipeline("sentiment-analysis")

   # Construire l'interface Streamlit
   st.title("Analyse de Sentiment")
   user_input = st.text_area("Entrez du texte ici:")

   if st.button("Analyser"):
       result = sentiment_pipeline(user_input)
       st.write(result)
   ```

3. **Ajouter les fichiers de configuration (optionnel)**

   Si votre application a besoin d’installations spécifiques, créez un fichier `requirements.txt` pour spécifier les bibliothèques Python nécessaires :

   ```
   transformers
   gradio  # ou streamlit
   ```

4. **Uploader le projet sur Hugging Face Spaces**

   Dans votre espace, téléchargez tous les fichiers (`app.py`, `requirements.txt`, etc.). Hugging Face déclenchera automatiquement le déploiement du Space une fois les fichiers uploadés.

5. **Tester et partager le modèle**

   Accédez à l'URL fournie par Hugging Face pour tester votre modèle déployé. Vous pouvez maintenant partager l'URL de votre Space avec d'autres utilisateurs pour qu'ils testent votre modèle.

---

### Conseils pour un déploiement réussi

- **Optimiser l'interface** : Utilisez les fonctionnalités d’interactivité de Gradio ou Streamlit pour une meilleure expérience utilisateur.
- **Exploitation d'options CPU/GPU** : Si votre modèle nécessite des performances élevées, vous pouvez sélectionner une instance avec GPU (option payante) pour un traitement plus rapide.
- **Automatisation des mises à jour** : Vous pouvez connecter le Space à GitHub pour automatiser les mises à jour.

---

### Conclusion

Déployer un modèle sur Hugging Face Spaces permet de le rendre accessible et facilement testable via une interface Web. Avec cette solution, les utilisateurs peuvent interagir directement avec les modèles, ce qui rend Spaces idéal pour la démonstration et le partage de modèles en temps réel.

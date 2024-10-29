---
title: Utiliser et porter des modèles au format ONNX
description: Utiliser et porter des modèles au format ONNX
---

Le format **ONNX (Open Neural Network Exchange)** permet de transférer des modèles entre différents frameworks de deep learning tout en optimisant les performances d'inférence, en particulier sur des architectures CPU et GPU, pour des applications d'inférence plus rapides. Ce format est donc essentiel pour MLOps, car il améliore l’efficacité et la portabilité des modèles.

---

### Étapes pour porter un modèle au format ONNX et l’utiliser

1. **Installer les packages nécessaires**

   Pour convertir un modèle en ONNX, vous aurez besoin de packages comme `onnx`, `onnxruntime`, et éventuellement de `transformers` pour les modèles Hugging Face.

   ```bash
   pip install onnx onnxruntime transformers
   ```

2. **Charger le modèle et l’exporter en ONNX**

   Voici un exemple avec un modèle Hugging Face en utilisant PyTorch :

   ```python
   from transformers import AutoTokenizer, AutoModelForSequenceClassification
   import torch

   # Charger le modèle et le tokenizer
   model_name = "bert-base-uncased"
   model = AutoModelForSequenceClassification.from_pretrained(model_name)
   tokenizer = AutoTokenizer.from_pretrained(model_name)

   # Préparer un exemple de données pour l'export
   text = "Ceci est un exemple de texte"
   inputs = tokenizer(text, return_tensors="pt")

   # Exporter vers ONNX
   torch.onnx.export(
       model,
       (inputs["input_ids"], inputs["attention_mask"]),
       "model.onnx",
       input_names=["input_ids", "attention_mask"],
       output_names=["output"],
       dynamic_axes={"input_ids": {0: "batch_size"}, "attention_mask": {0: "batch_size"}}
   )
   ```

3. **Vérifier le modèle ONNX**

   Utilisez la bibliothèque ONNX pour vérifier que le modèle a bien été exporté et pour inspecter les détails :

   ```python
   import onnx

   # Charger le modèle ONNX
   onnx_model = onnx.load("model.onnx")

   # Vérifier le modèle pour s'assurer qu'il est valide
   onnx.checker.check_model(onnx_model)
   print("Le modèle ONNX est valide.")
   ```

4. **Utiliser ONNX Runtime pour l’inférence**

   ONNX Runtime optimise les performances et peut être utilisé avec du code Python pour réaliser des inférences :

   ```python
   import onnxruntime as ort
   import numpy as np

   # Charger le modèle avec ONNX Runtime
   ort_session = ort.InferenceSession("model.onnx")

   # Préparer les entrées
   inputs_onnx = {
       "input_ids": inputs["input_ids"].numpy(),
       "attention_mask": inputs["attention_mask"].numpy()
   }

   # Exécuter l'inférence
   outputs = ort_session.run(None, inputs_onnx)
   print("Résultats de l'inférence ONNX:", outputs)
   ```

5. **Déployer le modèle ONNX**

   Les modèles ONNX peuvent être déployés sur différentes plateformes cloud (Azure, AWS) ou intégrés dans des applications via des frameworks comme FastAPI. Pour Azure, par exemple, vous pouvez utiliser **Azure Machine Learning** pour gérer le déploiement en tant que service d’inférence.

---

### Conseils pour l’utilisation de modèles ONNX

- **Optimisation des performances** : ONNX Runtime propose des options d’optimisation (comme `ort.InferenceSession(..., providers=['CPUExecutionProvider'])` pour CPU ou `CUDAExecutionProvider` pour GPU) pour accélérer le traitement.
- **Compatibilité du modèle** : Assurez-vous que les opérations utilisées par votre modèle sont supportées par ONNX avant la conversion.
- **Utiliser Hugging Face Optimum** : Cette extension simplifie la conversion des modèles Hugging Face vers ONNX et optimise l'inférence.

---

### Conclusion

Le portage de modèles vers le format ONNX est une étape stratégique en MLOps pour améliorer la vitesse et la flexibilité de déploiement des modèles. Grâce à ONNX et ONNX Runtime, vous pouvez exécuter des modèles optimisés pour diverses applications et plateformes, ce qui améliore l'efficacité et la portabilité dans le pipeline de production de modèles.

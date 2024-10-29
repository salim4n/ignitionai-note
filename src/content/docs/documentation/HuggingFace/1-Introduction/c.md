---
title: Ajouter des jeux de données à votre compte Hugging Face et les utiliser localement
description: Ajouter des jeux de données à votre compte Hugging Face et les utiliser localement
---

Hugging Face permet de gérer et de partager facilement des jeux de données via sa plateforme, facilitant la collaboration et la reproductibilité des projets de machine learning. En ajoutant des jeux de données à votre compte, vous pouvez ensuite les télécharger localement pour travailler avec eux à l’aide de la bibliothèque `datasets` de Hugging Face.

---

### 1. **Ajouter des jeux de données à votre compte Hugging Face**

Pour partager ou organiser des jeux de données, vous pouvez créer des dépôts de jeux de données (datasets) dans votre espace personnel ou organisationnel. Voici comment procéder :

1. **Créer un dépôt de dataset sur Hugging Face** :

   - Allez sur [Hugging Face](https://huggingface.co/) et connectez-vous.
   - Dans l’onglet "Datasets", cliquez sur "Add Dataset" et créez un nouveau dépôt.
   - Téléversez vos fichiers de données (CSV, JSON, texte brut, etc.) et ajoutez une documentation (README) pour décrire le jeu de données.

2. **Collaborer** : Invitez des collaborateurs pour des mises à jour partagées, et gérez les permissions pour autoriser des utilisateurs spécifiques à accéder ou modifier le dataset.

### 2. **Télécharger et utiliser des jeux de données localement avec `datasets`**

Une fois le jeu de données ajouté à votre compte, utilisez la bibliothèque `datasets` de Hugging Face pour le télécharger et le manipuler en local.

- **Installer la bibliothèque `datasets`** :

```bash
pip install datasets
```

- **Charger le jeu de données à partir de votre compte Hugging Face** :

```python
from datasets import load_dataset

# Remplacer "username/dataset_name" par votre identifiant et le nom de votre jeu de données
dataset = load_dataset("username/dataset_name")
```

- **Accéder aux éléments du jeu de données** :

```python
print(dataset["train"][0])  # Affiche le premier exemple du jeu de données d'entraînement
```

- **Travailler avec des sous-ensembles de données** : Vous pouvez également diviser ou échantillonner les données pour les explorations et expérimentations.

```python
small_dataset = dataset["train"].select(range(100))  # Prendre un échantillon de 100 données
```

### 3. **Exemples d'opérations sur les jeux de données**

Avec `datasets`, vous pouvez facilement effectuer des transformations ou préparer des données pour le machine learning :

- **Filtrer les données** :

```python
filtered_data = dataset["train"].filter(lambda x: x["label"] == 1)
```

- **Appliquer des transformations** :

```python
def tokenize_function(example):
    return tokenizer(example["text"], padding="max_length", truncation=True)

tokenized_data = dataset["train"].map(tokenize_function, batched=True)
```

- **Enregistrer le jeu de données localement** :

```python
dataset.save_to_disk("path/to/save/dataset")
```

### 4. **Bonnes pratiques pour l'ajout de jeux de données**

- **Documentation** : Fournissez une description détaillée, des attributs et des exemples d'utilisation dans le README du jeu de données.
- **Suivi de version** : Gérer les versions des jeux de données peut faciliter le suivi des changements pour une reproductibilité optimale.
- **Gestion de la confidentialité** : Hugging Face permet de rendre les jeux de données publics ou privés selon les besoins de votre équipe.

---

### Conclusion

Ajouter des jeux de données à votre compte Hugging Face et les utiliser localement avec la bibliothèque `datasets` rend la gestion et l'exploration des données plus faciles et structurées. Grâce à ces outils, vous pouvez manipuler et transformer les données rapidement pour les adapter à différents types de projets ML.

---
title: Revue API Sequential
description: API Sequential
---

### API Sequential

L'API Sequential de Keras est une manière simple et directe de créer des modèles de réseaux de neurones. Elle est idéale pour les modèles linéaires où les couches sont empilées les unes sur les autres de manière séquentielle. Voici un exemple de modèle créé avec l'API Sequential :

```python
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense

# Définir le modèle séquentiel
model = Sequential([
    Dense(units=64, activation='relu', input_shape=(10,)),
    Dense(units=64, activation='relu'),
    Dense(units=1, activation='sigmoid')
])

# Compiler le modèle
model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

# Résumé du modèle
model.summary()

```

### Explication :

1. **Importation des modules nécessaires :**
   - `Sequential` et `Dense` sont importés pour créer le modèle et ajouter des couches.
2. **Définition du modèle séquentiel :**
   - Le modèle est créé en utilisant `Sequential`.
   - Les couches sont ajoutées dans l'ordre : une couche dense avec 64 unités et activation ReLU, une autre couche dense avec 64 unités et activation ReLU, et une couche de sortie avec 1 unité et activation sigmoid.
3. **Compilation du modèle :**
   - Le modèle est compilé avec l'optimiseur Adam, la fonction de perte `binary_crossentropy`, et la métrique d'exactitude.
4. **Résumé du modèle :**
   - `model.summary()` affiche un résumé de l'architecture du modèle.

### API Functional

L'API Functional de Keras offre plus de flexibilité pour créer des modèles complexes, y compris ceux avec des chemins de données multiples ou des couches partagées. Voici un exemple de modèle créé avec l'API Functional :

```python
import tensorflow as tf
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input, Dense

# Définir les entrées
input_layer = Input(shape=(10,))

# Définir les couches
x = Dense(units=64, activation='relu')(input_layer)
x = Dense(units=64, activation='relu')(x)
output_layer = Dense(units=1, activation='sigmoid')(x)

# Créer le modèle
model = Model(inputs=input_layer, outputs=output_layer)

# Compiler le modèle
model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

# Résumé du modèle
model.summary()

```

### Explication :

1. **Importation des modules nécessaires :**
   - `Model`, `Input`, et `Dense` sont importés pour créer le modèle et ajouter des couches.
2. **Définition des entrées :**
   - `Input` définit la forme de l'entrée du modèle.
3. **Définition des couches :**
   - Les couches sont ajoutées en utilisant la syntaxe fonctionnelle. Chaque couche prend l'entrée de la couche précédente.
4. **Création du modèle :**
   - Le modèle est créé en utilisant `Model`, en spécifiant les entrées et les sorties.
5. **Compilation du modèle :**
   - Le modèle est compilé avec l'optimiseur Adam, la fonction de perte `binary_crossentropy`, et la métrique d'exactitude.
6. **Résumé du modèle :**
   - `model.summary()` affiche un résumé de l'architecture du modèle.

### Comparaison

- **Simplicité :**
  - L'API Sequential est plus simple et plus rapide à utiliser pour les modèles linéaires.
  - L'API Functional offre plus de flexibilité pour les modèles complexes.
- **Flexibilité :**
  - L'API Sequential est limitée aux modèles linéaires.
  - L'API Functional permet de créer des modèles avec des chemins de données multiples, des couches partagées, et des architectures plus complexes.
- **Utilisation :**
  - Utilisez l'API Sequential pour les modèles simples et linéaires.
  - Utilisez l'API Functional pour les modèles complexes ou lorsque vous avez besoin de plus de contrôle sur l'architecture du modèle.

En résumé, l'API Sequential est idéale pour les modèles simples et linéaires, tandis que l'API Functional offre plus de flexibilité pour les modèles complexes et non linéaires.

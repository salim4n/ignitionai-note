---
title: Utilisation de l'API Functional de Keras
description: API Functional
---

L'API Functional de Keras est une manière puissante et flexible de construire des modèles de réseaux de neurones. Elle permet de définir des architectures complexes avec des chemins de données multiples, des couches partagées, et des connexions résiduelles. Voici comment utiliser l'API Functional pour construire un modèle.

### Étape 1 : Importer les modules nécessaires

Commencez par importer les modules nécessaires de TensorFlow et Keras.

```python
import tensorflow as tf
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input, Dense, Concatenate

```

### Étape 2 : Définir les entrées

Utilisez la classe `Input` pour définir les entrées du modèle. Vous pouvez spécifier la forme des données d'entrée.

```python
# Définir une entrée de forme (32,)
input_layer = Input(shape=(32,))

```

### Étape 3 : Définir les couches

Ajoutez des couches au modèle en utilisant la syntaxe fonctionnelle. Chaque couche prend l'entrée de la couche précédente.

```python
# Ajouter une couche dense avec 64 unités et activation ReLU
x = Dense(units=64, activation='relu')(input_layer)

# Ajouter une autre couche dense avec 64 unités et activation ReLU
x = Dense(units=64, activation='relu')(x)

# Ajouter une couche de sortie avec 1 unité et activation sigmoid
output_layer = Dense(units=1, activation='sigmoid')(x)

```

### Étape 4 : Définir le modèle

Utilisez la classe `Model` pour créer le modèle en spécifiant les entrées et les sorties.

```python
# Créer le modèle
model = Model(inputs=input_layer, outputs=output_layer)

```

### Étape 5 : Compiler le modèle

Compilez le modèle en spécifiant l'optimiseur, la fonction de perte et les métriques.

```python
# Compiler le modèle
model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

```

### Étape 6 : Afficher le résumé du modèle

Affichez un résumé de l'architecture du modèle pour vérifier sa structure.

```python
# Résumé du modèle
model.summary()

```

### Exemple complet

Voici un exemple complet de la construction d'un modèle en utilisant l'API Functional :

```python
import tensorflow as tf
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input, Dense

# Définir l'entrée
input_layer = Input(shape=(32,))

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

### Explication détaillée

1. **Importer les modules nécessaires :**
   - Importez les modules nécessaires de TensorFlow et Keras.
2. **Définir les entrées :**
   - Utilisez la classe `Input` pour définir la forme des données d'entrée. Dans cet exemple, l'entrée a une forme de `(32,)`.
3. **Définir les couches :**
   - Ajoutez des couches en utilisant la syntaxe fonctionnelle. Chaque couche prend l'entrée de la couche précédente. Dans cet exemple, deux couches denses avec 64 unités et activation ReLU sont ajoutées, suivies d'une couche de sortie avec 1 unité et activation sigmoid.
4. **Définir le modèle :**
   - Utilisez la classe `Model` pour créer le modèle en spécifiant les entrées et les sorties.
5. **Compiler le modèle :**
   - Compilez le modèle avec l'optimiseur Adam, la fonction de perte `binary_crossentropy`, et la métrique d'exactitude.
6. **Afficher le résumé du modèle :**
   - Utilisez la méthode `summary` pour afficher un résumé de l'architecture du modèle.

En utilisant l'API Functional, vous pouvez créer des architectures de modèles complexes et flexibles, adaptées à des tâches spécifiques et complexes.

[Modèle multi-entrées](https://www.notion.so/Mod-le-multi-entr-es-b54e2f7146914fe9be321e02b6cde0c0?pvs=21)

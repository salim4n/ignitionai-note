---
title: Entrées, couches et modèle
description: API Functional
---

L'API Functional de Keras offre une grande flexibilité pour définir des architectures de modèles complexes. Elle permet de spécifier explicitement les entrées, les couches et les sorties du modèle. Voici comment vous pouvez définir les entrées, les couches et le modèle en utilisant l'API Functional.

### Définir les entrées

La première étape consiste à définir les entrées du modèle. Vous pouvez utiliser la classe `Input` pour spécifier la forme des données d'entrée.

```python
from tensorflow.keras.layers import Input

# Définir une entrée de forme (32,)
input_layer = Input(shape=(32,))

```

### Définir les couches

Ensuite, vous pouvez ajouter des couches au modèle en utilisant la syntaxe fonctionnelle. Chaque couche prend l'entrée de la couche précédente.

```python
from tensorflow.keras.layers import Dense

# Ajouter une couche dense avec 64 unités et activation ReLU
x = Dense(units=64, activation='relu')(input_layer)

# Ajouter une autre couche dense avec 64 unités et activation ReLU
x = Dense(units=64, activation='relu')(x)

# Ajouter une couche de sortie avec 1 unité et activation sigmoid
output_layer = Dense(units=1, activation='sigmoid')(x)

```

### Définir le modèle

Enfin, vous pouvez créer le modèle en utilisant la classe `Model`, en spécifiant les entrées et les sorties.

```python
from tensorflow.keras.models import Model

# Créer le modèle
model = Model(inputs=input_layer, outputs=output_layer)

```

### Compiler le modèle

Une fois le modèle défini, vous pouvez le compiler en spécifiant l'optimiseur, la fonction de perte et les métriques.

```python
# Compiler le modèle
model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

```

### Résumé du modèle

Vous pouvez afficher un résumé de l'architecture du modèle pour vérifier sa structure.

```python
# Résumé du modèle
model.summary()

```

### Exemple complet

Voici un exemple complet de la définition d'un modèle en utilisant l'API Functional :

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

1. **Définir les entrées :**
   - La classe `Input` est utilisée pour définir la forme des données d'entrée. Dans cet exemple, l'entrée a une forme de `(32,)`.
2. **Définir les couches :**
   - Les couches sont ajoutées en utilisant la syntaxe fonctionnelle. Chaque couche prend l'entrée de la couche précédente. Dans cet exemple, deux couches denses avec 64 unités et activation ReLU sont ajoutées, suivies d'une couche de sortie avec 1 unité et activation sigmoid.
3. **Définir le modèle :**
   - La classe `Model` est utilisée pour créer le modèle en spécifiant les entrées et les sorties.
4. **Compiler le modèle :**
   - Le modèle est compilé avec l'optimiseur Adam, la fonction de perte `binary_crossentropy`, et la métrique d'exactitude.
5. **Résumé du modèle :**
   - La méthode `summary` affiche un résumé de l'architecture du modèle.

En utilisant l'API Functional, vous pouvez créer des architectures de modèles complexes et flexibles, adaptées à des tâches spécifiques et complexes.

---
title: Modèles multi-sorties
description: API Functional
---

L'API Functional de Keras permet de créer des modèles complexes avec plusieurs sorties. Cela est particulièrement utile pour les tâches de multi-tâches où le modèle doit produire plusieurs prédictions simultanément. Voici comment vous pouvez utiliser l'API Functional pour créer un modèle qui produit plusieurs sorties.

### Étape 1 : Importer les modules nécessaires

Commencez par importer les modules nécessaires de TensorFlow et Keras.

```python
import tensorflow as tf
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input, Dense

```

### Étape 2 : Définir les entrées

Utilisez la classe `Input` pour définir les entrées du modèle. Vous pouvez spécifier la forme des données d'entrée.

```python
# Définir une entrée de forme (32,)
input_layer = Input(shape=(32,))

```

### Étape 3 : Définir les couches partagées

Ajoutez des couches partagées qui seront utilisées pour produire les différentes sorties.

```python
# Ajouter une couche dense avec 64 unités et activation ReLU
x = Dense(units=64, activation='relu')(input_layer)

# Ajouter une autre couche dense avec 64 unités et activation ReLU
x = Dense(units=64, activation='relu')(x)

```

### Étape 4 : Définir les sorties

Ajoutez des couches de sortie pour chaque tâche. Chaque sortie peut avoir sa propre architecture.

```python
# Ajouter une couche de sortie pour la première tâche
output_1 = Dense(units=1, activation='sigmoid', name='output_1')(x)

# Ajouter une couche de sortie pour la deuxième tâche
output_2 = Dense(units=1, activation='sigmoid', name='output_2')(x)

```

### Étape 5 : Définir le modèle

Utilisez la classe `Model` pour créer le modèle en spécifiant les entrées et les sorties.

```python
# Créer le modèle
model = Model(inputs=input_layer, outputs=[output_1, output_2])

```

### Étape 6 : Compiler le modèle

Compilez le modèle en spécifiant l'optimiseur, les fonctions de perte pour chaque sortie, et les métriques.

```python
# Compiler le modèle
model.compile(optimizer='adam',
              loss={'output_1': 'binary_crossentropy', 'output_2': 'binary_crossentropy'},
              metrics=['accuracy'])

```

### Étape 7 : Afficher le résumé du modèle

Affichez un résumé de l'architecture du modèle pour vérifier sa structure.

```python
# Résumé du modèle
model.summary()

```

### Exemple complet

Voici un exemple complet de la création d'un modèle qui produit plusieurs sorties en utilisant l'API Functional :

```python
import tensorflow as tf
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input, Dense

# Définir l'entrée
input_layer = Input(shape=(32,))

# Définir les couches partagées
x = Dense(units=64, activation='relu')(input_layer)
x = Dense(units=64, activation='relu')(x)

# Définir les sorties
output_1 = Dense(units=1, activation='sigmoid', name='output_1')(x)
output_2 = Dense(units=1, activation='sigmoid', name='output_2')(x)

# Créer le modèle
model = Model(inputs=input_layer, outputs=[output_1, output_2])

# Compiler le modèle
model.compile(optimizer='adam',
              loss={'output_1': 'binary_crossentropy', 'output_2': 'binary_crossentropy'},
              metrics=['accuracy'])

# Résumé du modèle
model.summary()

```

### Explication détaillée

1. **Importer les modules nécessaires :**
   - Importez les modules nécessaires de TensorFlow et Keras.
2. **Définir les entrées :**
   - Utilisez la classe `Input` pour définir la forme des données d'entrée. Dans cet exemple, l'entrée a une forme de `(32,)`.
3. **Définir les couches partagées :**
   - Ajoutez des couches partagées qui seront utilisées pour produire les différentes sorties. Dans cet exemple, deux couches denses avec 64 unités et activation ReLU sont ajoutées.
4. **Définir les sorties :**
   - Ajoutez des couches de sortie pour chaque tâche. Chaque sortie peut avoir sa propre architecture. Dans cet exemple, deux couches de sortie avec 1 unité et activation sigmoid sont ajoutées.
5. **Définir le modèle :**
   - Utilisez la classe `Model` pour créer le modèle en spécifiant les entrées et les sorties.
6. **Compiler le modèle :**
   - Compilez le modèle avec l'optimiseur Adam, les fonctions de perte `binary_crossentropy` pour chaque sortie, et les métriques d'exactitude.
7. **Afficher le résumé du modèle :**
   - Utilisez la méthode `summary` pour afficher un résumé de l'architecture du modèle.

En utilisant l'API Functional, vous pouvez créer des modèles complexes avec plusieurs sorties, adaptés à des tâches de multi-tâches et à des architectures avancées.

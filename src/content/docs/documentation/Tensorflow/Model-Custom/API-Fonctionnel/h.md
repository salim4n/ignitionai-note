---
title: Réseau Siamese
description: API Functional
---

Un réseau Siamese est une architecture de réseau de neurones utilisée pour comparer deux entrées et déterminer leur similarité. Il est souvent utilisé dans des tâches telles que la vérification de signature, la reconnaissance faciale, et la comparaison de texte. L'API Functional de Keras est particulièrement bien adaptée pour construire ce type de réseau.

### Étape 1 : Importer les modules nécessaires

Commencez par importer les modules nécessaires de TensorFlow et Keras.

```python
import tensorflow as tf
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input, Dense, Lambda
from tensorflow.keras.optimizers import RMSprop
import tensorflow.keras.backend as K

```

### Étape 2 : Définir la fonction de perte contrastive

La fonction de perte contrastive est utilisée pour entraîner le réseau Siamese. Elle mesure la similarité entre les paires d'entrées.

```python
def contrastive_loss(y_true, y_pred):
    margin = 1
    return K.mean(y_true * K.square(y_pred) + (1 - y_true) * K.square(K.maximum(0., margin - y_pred)))

```

### Étape 3 : Définir la distance euclidienne

La distance euclidienne est utilisée pour mesurer la similarité entre les sorties des deux branches du réseau.

```python
def euclidean_distance(vects):
    x, y = vects
    return K.sqrt(K.sum(K.square(x - y), axis=1, keepdims=True))

def eucl_dist_output_shape(shapes):
    shape1, shape2 = shapes
    return (shape1[0], 1)

```

### Étape 4 : Définir le réseau de base

Le réseau de base est une partie du réseau Siamese qui traite chaque entrée individuellement.

```python
def create_base_network(input_shape):
    input = Input(shape=input_shape)
    x = Dense(128, activation='relu')(input)
    x = Dense(128, activation='relu')(x)
    x = Dense(128, activation='relu')(x)
    return Model(input, x)

```

### Étape 5 : Définir le réseau Siamese

Le réseau Siamese combine deux instances du réseau de base pour traiter les deux entrées et calcule la distance euclidienne entre leurs sorties.

```python
def create_siamese_network(input_shape):
    base_network = create_base_network(input_shape)

    input_a = Input(shape=input_shape)
    input_b = Input(shape=input_shape)

    processed_a = base_network(input_a)
    processed_b = base_network(input_b)

    distance = Lambda(euclidean_distance, output_shape=eucl_dist_output_shape)([processed_a, processed_b])

    model = Model([input_a, input_b], distance)

    return model

```

### Étape 6 : Compiler le modèle

Compilez le modèle en utilisant l'optimiseur RMSprop et la fonction de perte contrastive.

```python
input_shape = (100,)  # Exemple de forme d'entrée
model = create_siamese_network(input_shape)
model.compile(loss=contrastive_loss, optimizer=RMSprop())

```

### Étape 7 : Préparer les données

Préparez les données d'entraînement et de test. Les données doivent être des paires d'entrées avec des étiquettes indiquant si les paires sont similaires (1) ou dissimilaires (0).

```python
import numpy as np

# Exemple de données d'entraînement
xs_a = np.random.rand(100, 100)
xs_b = np.random.rand(100, 100)
ys = np.random.randint(2, size=(100,))

# Entraîner le modèle
model.fit([xs_a, xs_b], ys, epochs=20, batch_size=32)

```

### Étape 8 : Tester le modèle

Testez le modèle avec des exemples d'entrée.

```python
# Exemple de test
test_a = np.random.rand(1, 100)
test_b = np.random.rand(1, 100)
pred = model.predict([test_a, test_b])
print(pred)

```

### Exemple complet

Voici un exemple complet de la construction d'un réseau Siamese en utilisant l'API Functional :

```python
import tensorflow as tf
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input, Dense, Lambda
from tensorflow.keras.optimizers import RMSprop
import tensorflow.keras.backend as K
import numpy as np

# Définir la fonction de perte contrastive
def contrastive_loss(y_true, y_pred):
    margin = 1
    return K.mean(y_true * K.square(y_pred) + (1 - y_true) * K.square(K.maximum(0., margin - y_pred)))

# Définir la distance euclidienne
def euclidean_distance(vects):
    x, y = vects
    return K.sqrt(K.sum(K.square(x - y), axis=1, keepdims=True))

def eucl_dist_output_shape(shapes):
    shape1, shape2 = shapes
    return (shape1[0], 1)

# Définir le réseau de base
def create_base_network(input_shape):
    input = Input(shape=input_shape)
    x = Dense(128, activation='relu')(input)
    x = Dense(128, activation='relu')(x)
    x = Dense(128, activation='relu')(x)
    return Model(input, x)

# Définir le réseau Siamese
def create_siamese_network(input_shape):
    base_network = create_base_network(input_shape)

    input_a = Input(shape=input_shape)
    input_b = Input(shape=input_shape)

    processed_a = base_network(input_a)
    processed_b = base_network(input_b)

    distance = Lambda(euclidean_distance, output_shape=eucl_dist_output_shape)([processed_a, processed_b])

    model = Model([input_a, input_b], distance)

    return model

# Compiler le modèle
input_shape = (100,)  # Exemple de forme d'entrée
model = create_siamese_network(input_shape)
model.compile(loss=contrastive_loss, optimizer=RMSprop())

# Exemple de données d'entraînement
xs_a = np.random.rand(100, 100)
xs_b = np.random.rand(100, 100)
ys = np.random.randint(2, size=(100,))

# Entraîner le modèle
model.fit([xs_a, xs_b], ys, epochs=20, batch_size=32)

# Exemple de test
test_a = np.random.rand(1, 100)
test_b = np.random.rand(1, 100)
pred = model.predict([test_a, test_b])
print(pred)

```

### Explication détaillée

1. **Importer les modules nécessaires :**
   - Importez les modules nécessaires de TensorFlow et Keras.
2. **Définir la fonction de perte contrastive :**
   - La fonction de perte contrastive mesure la similarité entre les paires d'entrées.
3. **Définir la distance euclidienne :**
   - La distance euclidienne est utilisée pour mesurer la similarité entre les sorties des deux branches du réseau.
4. **Définir le réseau de base :**
   - Le réseau de base traite chaque entrée individuellement. Dans cet exemple, il s'agit d'un réseau dense avec trois couches de 128 unités chacune.
5. **Définir le réseau Siamese :**
   - Le réseau Siamese combine deux instances du réseau de base pour traiter les deux entrées et calcule la distance euclidienne entre leurs sorties.
6. **Compiler le modèle :**
   - Compilez le modèle avec l'optimiseur RMSprop et la fonction de perte contrastive.
7. **Préparer les données :**
   - Préparez les données d'entraînement et de test. Les données doivent être des paires d'entrées avec des étiquettes indiquant si les paires sont similaires (1) ou dissimilaires (0).
8. **Tester le modèle :**
   - Testez le modèle avec des exemples d'entrée.

En utilisant l'API Functional, vous pouvez créer des réseaux Siamese complexes et flexibles, adaptés à des tâches spécifiques et avancées.

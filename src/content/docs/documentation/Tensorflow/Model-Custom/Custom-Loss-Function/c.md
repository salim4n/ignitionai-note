---
title: Siamese Modele et Contrastive Loss
description: a lot of code
---

### Importation des bibliothèques nécessaires

```python
import tensorflow as tf
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input, Flatten, Dense, Dropout, Lambda
from tensorflow.keras.optimizers import RMSprop
from tensorflow.keras.datasets import fashion_mnist
from tensorflow.python.keras.utils.vis_utils import plot_model
from tensorflow.keras import backend as K

import numpy as np
import matplotlib.pyplot as plt
from PIL import Image, ImageFont, ImageDraw
import random

```

**Explication :**

- `tensorflow` et ses sous-modules (`tf`, `Model`, `Input`, `Flatten`, `Dense`, `Dropout`, `Lambda`, `RMSprop`, `fashion_mnist`, `plot_model`, `K`) sont importés pour construire et entraîner le modèle.
- `numpy` (`np`) est utilisé pour les opérations sur les tableaux.
- `matplotlib.pyplot` (`plt`) est utilisé pour la visualisation des données.
- `PIL` (`Image`, `ImageFont`, `ImageDraw`) est utilisé pour le traitement des images.
- `random` est utilisé pour générer des nombres aléatoires.

### Définition de la fonction de perte contrastive

```python
def contrastive_loss(y_true, y_pred):
    margin = 1
    return K.mean(y_true * K.square(y_pred) + (1 - y_true) * K.square(K.maximum(0., margin - y_pred)))

```

**Explication :**

- Cette fonction définit la perte contrastive, qui est utilisée pour entraîner les réseaux siamois.
- `margin` est une constante qui définit la marge de séparation entre les paires similaires et dissimilaires.
- La fonction retourne la moyenne de la perte contrastive calculée pour chaque paire d'images.

### Définition du modèle siamois

```python
def create_base_network(input_shape):
    input = Input(shape=input_shape)
    x = Flatten()(input)
    x = Dense(128, activation='relu')(x)
    x = Dropout(0.1)(x)
    x = Dense(128, activation='relu')(x)
    x = Dropout(0.1)(x)
    x = Dense(128, activation='relu')(x)
    return Model(input, x)

```

**Explication :**

- Cette fonction crée le réseau de base pour le modèle siamois.
- `Input` définit la forme de l'entrée.
- `Flatten` aplatit l'entrée en un vecteur 1D.
- `Dense` ajoute des couches entièrement connectées avec une activation ReLU.
- `Dropout` ajoute une couche de dropout pour éviter le surapprentissage.
- `Model` compile le modèle avec l'entrée et la sortie définies.

### Création du modèle siamois

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

**Explication :**

- Cette fonction crée le réseau siamois en utilisant le réseau de base.
- `base_network` est créé en appelant `create_base_network`.
- `Input` définit les entrées pour les deux branches du réseau siamois.
- `processed_a` et `processed_b` sont les sorties des branches après avoir passé par le réseau de base.
- `Lambda` calcule la distance euclidienne entre les sorties des deux branches.
- `Model` compile le modèle avec les entrées et la sortie définies.

### Définition de la distance euclidienne

```python
def euclidean_distance(vects):
    x, y = vects
    return K.sqrt(K.sum(K.square(x - y), axis=1, keepdims=True))

def eucl_dist_output_shape(shapes):
    shape1, shape2 = shapes
    return (shape1[0], 1)

```

**Explication :**

- `euclidean_distance` calcule la distance euclidienne entre deux vecteurs.
- `eucl_dist_output_shape` définit la forme de la sortie de la distance euclidienne.

### Chargement et préparation des données

```python
(x_train, y_train), (x_test, y_test) = fashion_mnist.load_data()
x_train = x_train.astype('float32') / 255
x_test = x_test.astype('float32') / 255

```

**Explication :**

- Les données Fashion MNIST sont chargées et divisées en ensembles d'entraînement et de test.
- Les images sont normalisées en divisant par 255 pour que les valeurs soient comprises entre 0 et 1.

### Création des paires d'images

```python
def create_pairs(x, digit_indices):
    pairs = []
    labels = []
    n = min([len(digit_indices[d]) for d in range(10)]) - 1
    for d in range(10):
        for i in range(n):
            z1, z2 = digit_indices[d][i], digit_indices[d][i + 1]
            pairs += [[x[z1], x[z2]]]
            inc = random.randrange(1, 10)
            dn = (d + inc) % 10
            z1, z2 = digit_indices[d][i], digit_indices[dn][i]
            pairs += [[x[z1], x[z2]]]
            labels += [1, 0]
    return np.array(pairs), np.array(labels)

```

**Explication :**

- Cette fonction crée des paires d'images similaires et dissimilaires.
- `pairs` stocke les paires d'images.
- `labels` stocke les étiquettes (1 pour similaire, 0 pour dissimilaire).
- `n` est le nombre minimum d'images pour chaque classe.
- Les paires similaires et dissimilaires sont créées en utilisant des indices aléatoires.

### Préparation des indices des classes

```python
def create_indices(y):
    digit_indices = [np.where(y == i)[0] for i in range(10)]
    return digit_indices

```

**Explication :**

- Cette fonction crée une liste d'indices pour chaque classe dans les étiquettes.
- `digit_indices` stocke les indices des images pour chaque classe.

### Création des paires d'entraînement et de test

```python
digit_indices = create_indices(y_train)
tr_pairs, tr_y = create_pairs(x_train, digit_indices)

digit_indices = create_indices(y_test)
te_pairs, te_y = create_pairs(x_test, digit_indices)

```

**Explication :**

- Les indices des classes sont créés pour les ensembles d'entraînement et de test.
- Les paires d'images et les étiquettes sont créées pour les ensembles d'entraînement et de test.

### Compilation et entraînement du modèle

```python
input_shape = x_train.shape[1:]
model = create_siamese_network(input_shape)
model.compile(loss=contrastive_loss, optimizer=RMSprop())
model.fit([tr_pairs[:, 0], tr_pairs[:, 1]], tr_y, batch_size=128, epochs=20)

```

**Explication :**

- La forme de l'entrée est définie.
- Le modèle siamois est créé en appelant `create_siamese_network`.
- Le modèle est compilé avec la perte contrastive et l'optimiseur RMSprop.
- Le modèle est entraîné sur les paires d'entraînement avec une taille de lot de 128 et 20 époques.

### Évaluation du modèle

```python
pred = model.predict([te_pairs[:, 0], te_pairs[:, 1]])

```

**Explication :**

- Le modèle fait des prédictions sur les paires de test.

### Visualisation des résultats

```python
def compute_accuracy(predictions, labels):
    return np.mean(np.equal(predictions.ravel() < 0.5, labels))

accuracy = compute_accuracy(pred, te_y)
print('* Accuracy on test set: %0.2f%%' % (100 * accuracy))

```

**Explication :**

- La fonction `compute_accuracy` calcule l'exactitude des prédictions.
- L'exactitude est calculée en comparant les prédictions aux étiquettes réelles.
- L'exactitude est affichée.

### Visualisation des paires d'images

```python
def plot_pairs(pairs, labels, title):
    plt.figure(figsize=(10, 4))
    for i in range(10):
        plt.subplot(2, 5, i + 1)
        plt.imshow(pairs[i][0].reshape(28, 28))
        plt.title('Pair %d' % (i + 1))
        plt.subplot(2, 5, i + 1 + 5)
        plt.imshow(pairs[i][1].reshape(28, 28))
        plt.title('Label: %d' % labels[i])
    plt.suptitle(title)
    plt.show()

plot_pairs(tr_pairs[:10], tr_y[:10], 'Training Pairs')
plot_pairs(te_pairs[:10], te_y[:10], 'Test Pairs')

```

**Explication :**

- La fonction `plot_pairs` affiche les paires d'images avec leurs étiquettes.
- Les paires d'entraînement et de test sont visualisées.

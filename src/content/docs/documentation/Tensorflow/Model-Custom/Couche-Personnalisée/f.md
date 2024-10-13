---
title: Couche Lambda
description: Couche Lambda
---

Les couches Lambda sont pratiques pour effectuer des transformations simples sur les données d'entrée directement dans le modèle. Voici un guide étape par étape pour créer et utiliser une couche Lambda.

## Étape 1 : Importer les bibliothèques nécessaires

```python
import tensorflow as tf
from tensorflow.keras.layers import Lambda, Input
from tensorflow.keras.models import Model

```

## Étape 2 : Définir une fonction de transformation

Définissez la fonction que vous souhaitez appliquer à vos données à l'intérieur de la couche Lambda. Par exemple, nous allons créer une fonction qui ajoute une constante à chaque élément des entrées.

```python
def ajouter_constante(x):
    return x + 10

```

## Étape 3 : Créer le modèle avec la couche Lambda

Utilisez la couche Lambda dans la définition de votre modèle. Nous allons créer un modèle simple pour illustrer cela.

```python
# Définir l'entrée
input_layer = Input(shape=(4,))

# Appliquer la couche Lambda
lambda_layer = Lambda(ajouter_constante)(input_layer)

# Ajouter une autre couche dense pour exemple
dense_layer = tf.keras.layers.Dense(2)(lambda_layer)

# Créer le modèle
model = Model(inputs=input_layer, outputs=dense_layer)

```

## Étape 4 : Compiler et afficher le modèle

Compilez le modèle et affichez son résumé pour vérifier la structure.

```python
# Compilation du modèle
model.compile(optimizer='adam', loss='mean_squared_error')

# Affichage du résumé du modèle
model.summary()

```

## Étape 5 : Utiliser le modèle

Vous pouvez maintenant utiliser ce modèle pour l'entraînement ou les prédictions, comme tout autre modèle Keras.

```python
# Exemple de données d'entrée
import numpy as np
input_data = np.array([[1, 2, 3, 4]])

# Prédiction
output_data = model.predict(input_data)
print(output_data)

```

## Exemple complet

Voici le code complet pour créer et utiliser une couche Lambda :

```python
import tensorflow as tf
from tensorflow.keras.layers import Lambda, Input
from tensorflow.keras.models import Model
import numpy as np

# Définir la fonction de transformation
def ajouter_constante(x):
    return x + 10

# Définir l'entrée
input_layer = Input(shape=(4,))

# Appliquer la couche Lambda
lambda_layer = Lambda(ajouter_constante)(input_layer)

# Ajouter une autre couche dense pour exemple
dense_layer = tf.keras.layers.Dense(2)(lambda_layer)

# Créer le modèle
model = Model(inputs=input_layer, outputs=dense_layer)

# Compilation du modèle
model.compile(optimizer='adam', loss='mean_squared_error')

# Affichage du résumé du modèle
model.summary()

# Exemple de données d'entrée
input_data = np.array([[1, 2, 3, 4]])

# Prédiction
output_data = model.predict(input_data)
print(output_data)

```

Dans cet exemple, la couche Lambda ajoute une constante de 10 à chaque élément des entrées avant de les passer à une couche Dense. C'est une façon simple et efficace de personnaliser les transformations des données dans un modèle TensorFlow en utilisant une couche Lambda.
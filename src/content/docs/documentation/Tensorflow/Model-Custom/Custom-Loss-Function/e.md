---
title: Utilisation de la fonction de perte personnalisée en utilisant une classe orientée objet
description: Utilisation de la fonction de perte personnalisée en utilisant une classe orientée objet
---

Définir une fonction de perte personnalisée en utilisant une classe orientée objet peut offrir plus de flexibilité et de réutilisabilité. Vous pouvez encapsuler la logique de la fonction de perte dans une classe, ce qui permet de gérer facilement les hyperparamètres et d'autres configurations.

Voici comment vous pouvez définir une fonction de perte personnalisée en utilisant une classe orientée objet en Python avec TensorFlow et Keras.

### Étape 1 : Importer les modules nécessaires

Commencez par importer les modules nécessaires de TensorFlow et Keras.

```python
import tensorflow as tf
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input, Dense
import tensorflow.keras.backend as K
import numpy as np

```

### Étape 2 : Définir la classe de la fonction de perte personnalisée

Définissez une classe pour encapsuler la logique de la fonction de perte personnalisée. Dans cet exemple, nous allons définir une classe pour la Huber Loss.

```python
class HuberLoss:
    def __init__(self, delta=1.0):
        self.delta = delta

    def __call__(self, y_true, y_pred):
        error = y_true - y_pred
        abs_error = K.abs(error)
        quadratic_part = K.minimum(abs_error, self.delta)
        linear_part = abs_error - quadratic_part
        loss = 0.5 * K.square(quadratic_part) + self.delta * linear_part
        return K.mean(loss)

```

### Étape 3 : Définir le modèle

Définissez un modèle simple pour la régression en utilisant l'API Functional de Keras.

```python
# Définir l'entrée
input_layer = Input(shape=(1,))

# Définir les couches
x = Dense(units=64, activation='relu')(input_layer)
x = Dense(units=64, activation='relu')(x)
output_layer = Dense(units=1, activation='linear')(x)

# Créer le modèle
model = Model(inputs=input_layer, outputs=output_layer)

```

### Étape 4 : Compiler le modèle avec la fonction de perte personnalisée

Compilez le modèle en utilisant l'optimiseur Adam et la fonction de perte personnalisée encapsulée dans la classe.

```python
# Définir l'hyperparamètre delta
delta = 1.0

# Créer une instance de la classe de perte personnalisée
huber_loss = HuberLoss(delta)

# Compiler le modèle avec la fonction de perte personnalisée
model.compile(optimizer='adam', loss=huber_loss, metrics=['mean_absolute_error'])

```

### Étape 5 : Préparer les données

Préparez les données d'entraînement et de test.

```python
# Exemple de données d'entraînement
xs = np.random.rand(100, 1)
ys = 2 * xs + np.random.randn(100, 1) * 0.1

# Entraîner le modèle
model.fit(xs, ys, epochs=50, batch_size=32)

```

### Étape 6 : Tester le modèle

Testez le modèle avec des exemples d'entrée.

```python
# Exemple de test
test_x = np.array([[0.5]])
pred = model.predict(test_x)
print(pred)

```

### Exemple complet

Voici un exemple complet de l'implémentation de la Huber Loss en utilisant une classe orientée objet :

```python
import tensorflow as tf
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input, Dense
import tensorflow.keras.backend as K
import numpy as np

# Définir la classe de la fonction de perte personnalisée
class HuberLoss:
    def __init__(self, delta=1.0):
        self.delta = delta

    def __call__(self, y_true, y_pred):
        error = y_true - y_pred
        abs_error = K.abs(error)
        quadratic_part = K.minimum(abs_error, self.delta)
        linear_part = abs_error - quadratic_part
        loss = 0.5 * K.square(quadratic_part) + self.delta * linear_part
        return K.mean(loss)

# Définir l'entrée
input_layer = Input(shape=(1,))

# Définir les couches
x = Dense(units=64, activation='relu')(input_layer)
x = Dense(units=64, activation='relu')(x)
output_layer = Dense(units=1, activation='linear')(x)

# Créer le modèle
model = Model(inputs=input_layer, outputs=output_layer)

# Définir l'hyperparamètre delta
delta = 1.0

# Créer une instance de la classe de perte personnalisée
huber_loss = HuberLoss(delta)

# Compiler le modèle avec la fonction de perte personnalisée
model.compile(optimizer='adam', loss=huber_loss, metrics=['mean_absolute_error'])

# Exemple de données d'entraînement
xs = np.random.rand(100, 1)
ys = 2 * xs + np.random.randn(100, 1) * 0.1

# Entraîner le modèle
model.fit(xs, ys, epochs=50, batch_size=32)

# Exemple de test
test_x = np.array([[0.5]])
pred = model.predict(test_x)
print(pred)

```

### Explication détaillée

1. **Définir la classe de la fonction de perte personnalisée :**
   - La classe `HuberLoss` encapsule la logique de la fonction de perte Huber. Elle prend un hyperparamètre `delta` lors de l'initialisation et implémente la méthode `__call__` pour calculer la perte.
2. **Définir le modèle :**
   - Utilisez l'API Functional de Keras pour définir un modèle simple pour la régression.
3. **Compiler le modèle :**
   - Compilez le modèle avec l'optimiseur Adam et la fonction de perte personnalisée encapsulée dans la classe `HuberLoss`.
4. **Préparer les données :**
   - Préparez les données d'entraînement et de test.
5. **Tester le modèle :**
   - Testez le modèle avec des exemples d'entrée.

En utilisant une classe orientée objet pour définir une fonction de perte personnalisée, vous pouvez encapsuler la logique de la perte et gérer facilement les hyperparamètres, ce qui rend le code plus modulaire et réutilisable.

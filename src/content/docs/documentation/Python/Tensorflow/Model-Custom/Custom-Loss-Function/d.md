---
title: Utilisation de la fonction de perte Huber
description: Utilisation de la fonction de perte Huber
---

## Utilisation de la fonction de perte Huber

La Huber Loss est une fonction de perte utilisée pour la régression qui combine les avantages de la perte quadratique (MSE) et de la perte absolue (MAE). Elle est particulièrement utile pour les données contenant des valeurs aberrantes, car elle est moins sensible aux valeurs aberrantes que la perte quadratique.

Voici comment implémenter la Huber Loss avec une fonction de perte personnalisée en utilisant TensorFlow et Keras.

### Étape 1 : Importer les modules nécessaires

Commencez par importer les modules nécessaires de TensorFlow et Keras.

```python
import tensorflow as tf
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input, Dense
import tensorflow.keras.backend as K

```

### Étape 2 : Définir la fonction de perte Huber

La fonction de perte Huber est définie comme suit :

`$L(y, f(x)) = \begin{cases}
    \frac{1}{2}(y - f(x))^2 & \text{for } |y - f(x)| \leq \delta \\
    \delta|y - f(x)| - \frac{1}{2}\delta^2 & \text{otherwise}
\end{cases}$`

où $delta$ est un paramètre qui contrôle la transition entre la perte quadratique et la perte absolue.

```python
def huber_loss(y_true, y_pred, delta=1.0):
    error = y_true - y_pred
    abs_error = K.abs(error)
    quadratic_part = K.minimum(abs_error, delta)
    linear_part = abs_error - quadratic_part
    loss = 0.5 * K.square(quadratic_part) + delta * linear_part
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

Compilez le modèle en utilisant l'optimiseur Adam et la fonction de perte Huber personnalisée.

```python
# Compiler le modèle
model.compile(optimizer='adam', loss=huber_loss, metrics=['mean_absolute_error'])

```

### Étape 5 : Préparer les données

Préparez les données d'entraînement et de test.

```python
import numpy as np

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

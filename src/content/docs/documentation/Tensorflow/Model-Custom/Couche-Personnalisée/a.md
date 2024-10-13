---
title: Couche quadratique
description: Couche quadratique
---

## **Introduction**

Dans ce tutoriel, nous allons définir une couche quadratique personnalisée dans TensorFlow. Cette couche effectuera une transformation quadratique sur ses entrées, de la forme


 $(ax^2 + bx + c), où (a), (b) et (c)$ sont des paramètres apprenables. Nous allons ensuite utiliser cette couche dans un modèle de réseau de neurones pour le dataset MNIST.

## Étape 1 : Importer les bibliothèques nécessaires

```python
import tensorflow as tf
from tensorflow.keras.layers import Layer
```

## Étape 2 : Définir la classe de la couche quadratique personnalisée

Nous allons définir une classe `SimpleQuadratic` qui hérite de la classe `Layer` de TensorFlow Keras.

```python
class SimpleQuadratic(Layer):
    def __init__(self, units=32, activation=None):
        super(SimpleQuadratic, self).__init__()
        self.units = units
        self.activation = tf.keras.activations.get(activation)
```

### Explication :

- `__init__` : Le constructeur initialise la couche avec le nombre d'unités et la fonction d'activation. Il appelle le constructeur de la classe parente `Layer` avec `super()`.
- `units` : Le nombre d'unités dans la couche.
- `activation` : La fonction d'activation à appliquer après la transformation quadratique. Nous utilisons `tf.keras.activations.get()` pour obtenir l'objet de la fonction d'activation correspondant à la chaîne de caractères passée.

## Étape 3 : Définir la méthode `build`

La méthode `build` est appelée une seule fois, lors de la première utilisation de la couche. Elle initialise les poids \(a\), \(b\) et \(c\).

```python
    def build(self, input_shape):
        # Initializer for weights a and b
        a_init = tf.random_normal_initializer()
        b_init = tf.random_normal_initializer()

        # Initializing 'a' with random values
        a_init_val = a_init(shape=(input_shape[-1], self.units), dtype='float32')
        self.a = tf.Variable(initial_value=a_init_val, trainable=True)

        # Initializing 'b' with random values
        b_init_val = b_init(shape=(input_shape[-1], self.units), dtype='float32')
        self.b = tf.Variable(initial_value=b_init_val, trainable=True)

        # Initializer for bias c
        c_init = tf.zeros_initializer()

        # Initializing 'c' with zeros
        c_init_val = c_init(shape=(self.units,), dtype='float32')
        self.c = tf.Variable(initial_value=c_init_val, trainable=True)
```

### Explication :

- `a_init` et `b_init` : Initialiseurs pour les poids $(a) et (b)$, utilisant une distribution normale.
- `a_init_val` et `b_init_val` : Valeurs initiales pour $(a) et (b)$, avec une forme compatible avec la multiplication matricielle.
- `c_init` : Initialiseur pour le biais $(c),$ utilisant des zéros.
- `c_init_val` : Valeur initiale pour $(c)$, avec une forme de vecteur.
- `self.a`, `self.b`, `self.c` : Variables TensorFlow trainables.

## Étape 4 : Définir la méthode `call`

La méthode `call` définit le calcul effectué par la couche. Elle applique la transformation quadratique et la fonction d'activation si elle est spécifiée.

```python
    def call(self, inputs):
        x_squared = tf.math.square(inputs)
        x_squared_times_a = tf.matmul(x_squared, self.a)
        x_times_b = tf.matmul(inputs, self.b)
        x2a_plus_xb_plus_c = x_squared_times_a + x_times_b + self.c

        if self.activation is not None:
            x2a_plus_xb_plus_c = self.activation(x2a_plus_xb_plus_c)

        return x2a_plus_xb_plus_c
```

### Explication :

- `x_squared` : Carré des entrées.
- `x_squared_times_a` : Multiplication matricielle entre \(x^2\) et \(a\).
- `x_times_b` : Multiplication matricielle entre \(x\) et \(b\).
- `x2a_plus_xb_plus_c` : Somme des trois termes.
- `self.activation` : Application de la fonction d'activation si elle est spécifiée.

## Étape 5 : Utiliser la couche quadratique dans un modèle

Nous allons maintenant utiliser notre couche quadratique personnalisée dans un modèle pour le dataset MNIST.

```python
# Charger le dataset MNIST
mnist = tf.keras.datasets.mnist
(x_train, y_train), (x_test, y_test) = mnist.load_data(path='/home/jovyan/work/mnist.npz')
x_train, x_test = x_train / 255.0, x_test / 255.0

# Définir le modèle
model = tf.keras.models.Sequential([
    tf.keras.layers.Flatten(input_shape=(28, 28)),
    SimpleQuadratic(128, activation='relu'),
    tf.keras.layers.Dropout(0.2),
    tf.keras.layers.Dense(10, activation='softmax')
])

# Compiler le modèle
model.compile(optimizer='adam',
              loss='sparse_categorical_crossentropy',
              metrics=['accuracy'])

# Entraîner le modèle
model.fit(x_train, y_train, epochs=5)

# Évaluer le modèle
model.evaluate(x_test, y_test)
```

### Explication :

- `mnist.load_data` : Charge les données MNIST.
- `x_train` et `x_test` : Normalisation des données (division par 255.0).
- `model` : Définition du modèle séquentiel.
    - `Flatten` : Aplatit les images de 28x28 en vecteurs de 784 éléments.
    - `SimpleQuadratic` : Notre couche quadratique personnalisée avec 128 unités et une activation ReLU.
    - `Dropout` : Couche de dropout pour la régularisation.
    - `Dense` : Couche dense de sortie avec 10 unités (une pour chaque classe) et une activation softmax.
- `compile` : Compilation du modèle avec l'optimiseur Adam, la fonction de perte sparse_categorical_crossentropy et la métrique d'accuracy.
- `fit` : Entraînement du modèle sur les données d'entraînement pendant 5 epochs.
- `evaluate` : Évaluation du modèle sur les données de test.

## Conclusion

Vous avez maintenant appris à définir une couche quadratique personnalisée dans TensorFlow et à l'utiliser dans un modèle de réseau de neurones pour le dataset MNIST. Cette approche vous permet de créer des couches personnalisées pour des transformations spécifiques et de les intégrer facilement dans vos modèles.
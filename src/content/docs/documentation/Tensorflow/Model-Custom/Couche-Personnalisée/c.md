---
title: Héritage de la classe Layer
description: Définition d'une couche personnalisée en héritant de la classe Layer
---

Voici un tutoriel détaillé en français sur la définition d'une classe de couche personnalisée en héritant de la classe `Layer` de TensorFlow.

### Définir une classe de couche personnalisée en héritant de la classe `Layer`

Dans ce tutoriel, nous allons créer une couche personnalisée en utilisant la classe `Layer` de TensorFlow. Cette couche effectuera une opération linéaire suivie d'une fonction d'activation.

### Étape 1 : Importer TensorFlow

```python
import tensorflow as tf

```

### Étape 2 : Définir la classe de la couche personnalisée

```python
class CouchePersonnalisee(tf.keras.layers.Layer):
    def __init__(self, units, activation=None, **kwargs):
        super(CouchePersonnalisee, self).__init__(**kwargs)
        self.units = units
        self.activation = tf.keras.activations.get(activation)

    def build(self, input_shape):
        self.w = self.add_weight(
            shape=(input_shape[-1], self.units),
            initializer='random_normal',
            trainable=True,
            name='weights'
        )
        self.b = self.add_weight(
            shape=(self.units,),
            initializer='zeros',
            trainable=True,
            name='bias'
        )

    def call(self, inputs):
        output = tf.matmul(inputs, self.w) + self.b
        if self.activation is not None:
            output = self.activation(output)
        return output

    def get_config(self):
        config = super(CouchePersonnalisee, self).get_config()
        config.update({
            'units': self.units,
            'activation': tf.keras.activations.serialize(self.activation)
        })
        return config

```

### Explication du code

1. **`__init__`** : Cette méthode initialise la couche avec le nombre d'unités et la fonction d'activation. Elle appelle le constructeur parent avec `super()`.
2. **`build`** : Cette méthode est appelée une seule fois, lors de la première utilisation de la couche. Elle crée les poids (`w`) et les biais (`b`) de la couche et les rend entraînables.
3. **`call`** : Cette méthode définit le calcul effectué par la couche. Elle réalise une multiplication matricielle entre les entrées et les poids, ajoute les biais, et applique la fonction d'activation si elle est spécifiée.
4. **`get_config`** : Cette méthode permet de sérialiser la configuration de la couche pour pouvoir la sauvegarder et la charger ultérieurement.

### Étape 3 : Utiliser la couche personnalisée dans un modèle

```python
# Création du modèle
model = tf.keras.Sequential([
    CouchePersonnalisee(64, activation='relu', input_shape=(32,)),
    CouchePersonnalisee(10, activation='softmax')
])

# Compilation du modèle
model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

# Affichage du résumé du modèle
model.summary()

```

### Explication de l'utilisation

- **Création du modèle** : Nous définissons un modèle séquentiel (`Sequential`) et ajoutons notre couche personnalisée avec 64 unités et une activation ReLU, suivie d'une autre couche personnalisée avec 10 unités et une activation softmax.
- **Compilation du modèle** : Nous compilons le modèle en spécifiant l'optimiseur, la fonction de perte et les métriques.
- **Résumé du modèle** : Nous affichons le résumé du modèle pour vérifier sa structure.

Ce tutoriel couvre les bases de la création et de l'utilisation d'une couche personnalisée en héritant de la classe `Layer` de TensorFlow. Vous pouvez étendre cette approche pour inclure des fonctionnalités plus avancées selon vos besoins spécifiques. Si vous avez des questions ou besoin de précisions supplémentaires, n'hésitez pas à me le faire savoir !
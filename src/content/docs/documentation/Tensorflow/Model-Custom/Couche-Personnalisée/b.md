---
title: Couche personnalisée avec activation
description: Couche personnalisée avec activation
---

Voici un exemple détaillé de comment définir une couche personnalisée incluant une fonction d'activation dans TensorFlow :

```python
import tensorflow as tf

class CustomLayerWithActivation(tf.keras.layers.Layer):
    def __init__(self, units, activation=None, **kwargs):
        super(CustomLayerWithActivation, self).__init__(**kwargs)
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
        config = super(CustomLayerWithActivation, self).get_config()
        config.update({
            'units': self.units,
            'activation': tf.keras.activations.serialize(self.activation)
        })
        return config

```

Explication des différentes parties :

1. `__init__`: Initialise la couche avec le nombre d'unités et la fonction d'activation.
2. `build`: Crée les poids et les biais de la couche. Cette méthode est appelée la première fois que la couche est utilisée.
3. `call`: Définit le calcul effectué par la couche. Ici, nous effectuons une multiplication matricielle, ajoutons le biais, puis appliquons la fonction d'activation si elle est spécifiée.
4. `get_config`: Permet de sérialiser la configuration de la couche, ce qui est utile pour sauvegarder et charger des modèles.

Utilisation de la couche personnalisée :

```python
# Création d'un modèle utilisant notre couche personnalisée
model = tf.keras.Sequential([
    CustomLayerWithActivation(64, activation='relu', input_shape=(32,)),
    CustomLayerWithActivation(10, activation='softmax')
])

# Compilation du modèle
model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

# Affichage du résumé du modèle
model.summary()

```

Cette approche vous permet de créer des couches personnalisées flexibles qui peuvent inclure diverses fonctions d'activation. Vous pouvez étendre cette classe pour inclure d'autres fonctionnalités spécifiques à vos besoins.
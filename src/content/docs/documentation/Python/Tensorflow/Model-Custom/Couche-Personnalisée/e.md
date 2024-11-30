---
title: Personnalisée versus Lambda
description: Couche Lambda
---

Les couches Lambda sont une classe de couche de TensorFlow qui permet de définir des opérations non linéaires.

Les couches Lambda sont utiles pour des opérations simples, mais les couches personnalisées offrent beaucoup plus de flexibilité et de fonctionnalités. Voici les principales différences :

## 1. Gestion de l'état

**Couche personnalisée** : Peut maintenir un état interne qui persiste entre les appels et s'entraîne avec le modèle.
**Couche Lambda** : Ne peut pas maintenir d'état persistant entre les appels.

Exemple :

```python
class CoucheAvecEtat(tf.keras.layers.Layer):
    def __init__(self, units):
        super(CoucheAvecEtat, self).__init__()
        self.units = units

    def build(self, input_shape):
        self.w = self.add_weight(shape=(input_shape[-1], self.units),
                                 initializer='random_normal',
                                 trainable=True)

    def call(self, inputs):
        return tf.matmul(inputs, self.w)

```

## 2. Paramètres entraînables

**Couche personnalisée** : Peut définir et gérer ses propres paramètres entraînables.
**Couche Lambda** : Ne peut pas avoir de paramètres entraînables propres.

## 3. Méthodes de configuration et de sérialisation

**Couche personnalisée** : Peut implémenter des méthodes comme `get_config()` pour la sérialisation et la désérialisation.
**Couche Lambda** : Limitée en termes de configuration et de sérialisation.

Exemple :

```python
def get_config(self):
    config = super().get_config()
    config.update({"units": self.units})
    return config

```

## 4. Comportement différent en mode entraînement et inférence

**Couche personnalisée** : Peut avoir un comportement différent en mode entraînement et en mode inférence.
**Couche Lambda** : Ne peut pas distinguer entre les modes d'entraînement et d'inférence.

Exemple :

```python
def call(self, inputs, training=None):
    if training:
        # Comportement spécifique à l'entraînement
        return inputs + tf.random.normal(tf.shape(inputs))
    else:
        # Comportement en inférence
        return inputs

```

## 5. Initialisation complexe et logique de construction

**Couche personnalisée** : Peut avoir une logique d'initialisation complexe dans `__init__` et `build`.
**Couche Lambda** : Limitée à une fonction simple sans initialisation complexe.

## 6. Gestion des formes d'entrée/sortie

**Couche personnalisée** : Peut gérer et valider les formes d'entrée/sortie de manière complexe.
**Couche Lambda** : Ne peut pas effectuer de validation ou de gestion complexe des formes.

## 7. Intégration avec d'autres API TensorFlow

**Couche personnalisée** : Peut s'intégrer plus profondément avec d'autres API TensorFlow, comme les métriques ou les callbacks.
**Couche Lambda** : Interaction limitée avec les autres composants de TensorFlow.

## 8. Réutilisabilité et encapsulation

**Couche personnalisée** : Offre une meilleure encapsulation et réutilisabilité du code.
**Couche Lambda** : Moins réutilisable et plus difficile à maintenir pour des opérations complexes.

En conclusion, bien que les couches Lambda soient utiles pour des transformations simples, les couches personnalisées offrent une flexibilité, une puissance et une intégration beaucoup plus grandes avec l'écosystème TensorFlow. Elles sont essentielles pour créer des architectures de réseaux neuronaux complexes et sur mesure.
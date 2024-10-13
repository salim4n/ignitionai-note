---
title: Couche personnalisée avec activation
description: Couche personnalisée avec activation
---

Lorsque vous créez une couche personnalisée dans TensorFlow, il y a deux composants essentiels à comprendre et à implémenter :

## 1. L'état (State)

L'état d'une couche représente les variables internes qui sont apprises ou mises à jour pendant l'entraînement du modèle. Ces variables sont généralement initialisées dans la méthode `build()` de la couche.

### Caractéristiques de l'état 

- Il comprend généralement les poids et les biais de la couche.
- Ces variables sont créées à l'aide de `self.add_weight()`.
- Elles sont persistantes et mises à jour pendant l'entraînement.
- L'état est spécifique à chaque instance de la couche.

### Exemple 

```python
def build(self, input_shape):
    self.kernel = self.add_weight(
        "kernel",
        shape=[input_shape[-1], self.units],
        initializer="glorot_uniform",
        trainable=True
    )
    self.bias = self.add_weight(
        "bias",
        shape=[self.units],
        initializer="zeros",
        trainable=True
    )

```

## 2. Le calcul (Computation)

Le calcul définit comment la couche transforme ses entrées en sorties. Il est généralement implémenté dans la méthode `call()` de la couche.

### Caractéristiques du calcul 

- Il définit l'opération effectuée sur les entrées.
- Il utilise l'état (poids, biais) pour effectuer la transformation.
- Il peut inclure des opérations non linéaires (fonctions d'activation).
- Le calcul est exécuté chaque fois que la couche est appelée sur des données.

### Exemple 

```python
def call(self, inputs):
    return tf.matmul(inputs, self.kernel) + self.bias

```

## Importance de la distinction

La séparation entre l'état et le calcul est cruciale pour plusieurs raisons :

1. **Flexibilité** : Elle permet de réutiliser le même calcul avec différents états.
2. **Efficacité** : L'état n'a besoin d'être initialisé qu'une seule fois, tandis que le calcul est effectué à chaque passage de données.
3. **Sérialisation** : Elle facilite la sauvegarde et le chargement des modèles, car l'état peut être sérialisé indépendamment du calcul.
4. **Optimisation** : TensorFlow peut optimiser séparément la gestion de l'état et l'exécution du calcul.

En résumé, une couche personnalisée bien conçue sépare clairement la définition de son état (variables apprenables) de son calcul (transformation des entrées). Cette séparation est au cœur de la flexibilité et de l'efficacité des couches dans TensorFlow.
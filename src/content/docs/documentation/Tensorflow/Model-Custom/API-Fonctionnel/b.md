---
title: API Functional
description: API Functional
---

## Résumé

L'API fonctionnelle de TensorFlow offre plus de flexibilité et de contrôle par rapport à l'API séquentielle. Elle permet de créer des modèles complexes avec plusieurs entrées/sorties et des couches partagées. Voici les principaux points abordés dans ce cours :

1. Définition d'entrées, de couches et du modèle
2. Construction d'un modèle produit plusieurs sorties
3. Création d'un réseau Siamese

### Points clés à considérer

- L'API fonctionnelle est particulièrement utile pour :
  - Les réseaux complexes comme les réseaux résiduels ou Siamese
  - Les modèles avec plusieurs entrées/sorties
  - Le partage de couches entre différents parties du modèle
- Elle offre plus de contrôle sur la structure du modèle que l'API séquentielle
- Permet de créer des architectures personnalisées adaptées aux besoins spécifiques

### Exemple de code

Voici un exemple simple d'utilisation de l'API fonctionnelle pour construire un modèle avec deux sorties :

```python
from tensorflow.keras.layers import Input, Dense
from tensorflow.keras.models import Model

# Définir l'entrée
inputs = Input(shape=(784,), name='digits')

# Ajouter les couches
x = Dense(64, activation='relu')(inputs)
x = Dense(64, activation='relu')(x)
outputs = Dense(2, name='predictions')(x)

# Construire le modèle
model = Model(inputs=inputs, outputs=outputs)

# Visualiser le graphique du modèle
model.summary()

# Compiler et entraîner le modèle
model.compile(optimizer='adam', loss='mse')

```

### Bonnes pratiques

- Utilisez l'API fonctionnelle lorsque vous avez besoin de plus de flexibilité
- Partagez des couches entre différentes parties du modèle quand c'est pertinent
- Visualisez toujours le graphique du modèle pour vérifier sa structure
- Compilez et entraînez le modèle comme avec l'API séquentielle

# API Fonctionnelle de TensorFlow

[C1_W1.pdf](https://prod-files-secure.s3.us-west-2.amazonaws.com/11b5a9db-0d61-41fc-9598-c7c6b5db565c/62897f32-908d-43c1-8a81-986ba62da499/C1_W1.pdf)

## Introduction

L'API fonctionnelle de TensorFlow est une façon flexible de créer des modèles complexes avec des architectures non linéaires. Contrairement à l'API séquentielle, l'API fonctionnelle permet de définir des modèles avec des topologies plus avancées, telles que des modèles multi-entrées/multi-sorties ou des modèles avec des couches partagées.

## Concepts clés

1. **Tenseurs** : Objets de base représentant les données dans TensorFlow.
2. **Couches** : Opérations appliquées aux tenseurs.
3. **Modèle** : Graphe de couches interconnectées.

## Création d'un modèle avec l'API fonctionnelle

### Étape 1 : Définir les entrées

```python
from tensorflow import keras

inputs = keras.Input(shape=(784,))

```

### Étape 2 : Définir les couches

```python
dense = keras.layers.Dense(64, activation='relu')
x = dense(inputs)
x = keras.layers.Dense(64, activation='relu')(x)
outputs = keras.layers.Dense(10, activation='softmax')(x)

```

### Étape 3 : Créer le modèle

```python
model = keras.Model(inputs=inputs, outputs=outputs, name='mnist_model')

```

## Avantages de l'API fonctionnelle

1. **Flexibilité** : Permet de créer des architectures complexes.
2. **Réutilisabilité** : Les couches peuvent être partagées entre différentes parties du modèle.
3. **Visualisation** : Facilite la visualisation du graphe du modèle.

## Cas d'utilisation avancés

### Modèles multi-entrées

```python
input_a = keras.Input(shape=(32,))
input_b = keras.Input(shape=(32,))
x = keras.layers.Concatenate()([input_a, input_b])
output = keras.layers.Dense(1)(x)
model = keras.Model(inputs=[input_a, input_b], outputs=output)

```

### Modèles multi-sorties

```python
inputs = keras.Input(shape=(64,))
x = keras.layers.Dense(64, activation='relu')(inputs)
output1 = keras.layers.Dense(32, activation='sigmoid')(x)
output2 = keras.layers.Dense(10, activation='softmax')(x)
model = keras.Model(inputs=inputs, outputs=[output1, output2])

```

## Bonnes pratiques

1. Nommez vos couches pour une meilleure lisibilité.
2. Utilisez `model.summary()` pour visualiser l'architecture du modèle.
3. Pensez à la réutilisabilité des couches lors de la conception de modèles complexes.

## Conclusion

L'API fonctionnelle de TensorFlow offre une grande flexibilité pour créer des architectures de modèles complexes. Elle est particulièrement utile pour les projets nécessitant des topologies non linéaires ou des modèles avec plusieurs entrées ou sorties.

Citations:
[1] https://www.tensorflow.org/guide/keras/functional_api
[2] https://medium.com/thedeephub/sequential-vs-functional-vs-subclassing-api-in-tensorflow-8bfcfe91859d
[3] https://stackoverflow.com/questions/58092176/keras-sequential-vs-functional-api-for-multi-task-learning-neural-network
[4] https://medium.com/@rfajri912/an-introduction-to-tensorflows-functional-api-building-flexible-neural-network-architectures-634fd585959d
[5] https://goodboychan.github.io/python/coursera/tensorflow/deeplearning.ai/2022/02/05/01-Tensorflow2-Functional-API.html
[6] https://pub.aimind.so/demystifying-tensorflows-sequential-api-and-functional-api-a-comprehensive-guide-c68689df40ba
[7] https://github.com/Ankit-Kumar-Saini/Coursera_TensorFlow_Advanced_Techniques_Specialization
[8] https://www.youtube.com/watch?v=pAhPiF3yiXI

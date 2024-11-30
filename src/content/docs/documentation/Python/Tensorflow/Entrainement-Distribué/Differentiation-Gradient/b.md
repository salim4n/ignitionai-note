---
title : Gradient Tape
description : Gradient Tape
---

`tf.GradientTape` est une API puissante de TensorFlow qui permet de calculer les dérivées (gradients) des fonctions de perte par rapport aux variables du modèle. Cela est essentiel pour l'optimisation des modèles de machine learning, car les gradients sont utilisés pour mettre à jour les poids du modèle pendant l'entraînement.

Voici un exemple complet de l'utilisation de `tf.GradientTape` pour calculer les dérivées d'une fonction de perte :

### Étape 1 : Importer les bibliothèques nécessaires

Tout d'abord, assurez-vous d'importer les bibliothèques nécessaires.

```python
import tensorflow as tf
from tensorflow.keras import layers

```

### Étape 2 : Définir le modèle

Définissez un modèle simple pour l'exemple. Pour cet exemple, nous utiliserons un modèle avec quelques couches de convolution et de dense.

```python
class SimpleModel(tf.keras.Model):
    def __init__(self):
        super(SimpleModel, self).__init__()
        self.conv1 = layers.Conv2D(32, (3, 3), activation='relu')
        self.flatten = layers.Flatten()
        self.dense1 = layers.Dense(128, activation='relu')
        self.dense2 = layers.Dense(10)

    def call(self, inputs):
        x = self.conv1(inputs)
        x = self.flatten(x)
        x = self.dense1(x)
        return self.dense2(x)
```

### Étape 3 : Préparer les données

Préparez vos données d'entraînement et de test. Pour cet exemple, nous utiliserons le jeu de données MNIST.

```python
(x_train, y_train), (x_test, y_test) = tf.keras.datasets.mnist.load_data()
x_train, x_test = x_train / 255.0, x_test / 255.0
x_train = x_train[..., tf.newaxis]
x_test = x_test[..., tf.newaxis]

```

### Étape 4 : Utiliser `tf.GradientTape` pour calculer les gradients

Utilisez `tf.GradientTape` pour enregistrer les opérations et calculer les gradients de la fonction de perte par rapport aux variables du modèle.

```python
# Instancier le modèle
model = SimpleModel()

# Définir la fonction de perte
loss_fn = tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True)

# Définir l'optimiseur
optimizer = tf.keras.optimizers.Adam()

# Utiliser tf.GradientTape pour calculer les gradients
with tf.GradientTape() as tape:
    predictions = model(x_train[:10])  # Utiliser un sous-ensemble des données pour l'exemple
    loss = loss_fn(y_train[:10], predictions)

# Calculer les gradients
gradients = tape.gradient(loss, model.trainable_variables)

# Appliquer les gradients à l'optimiseur
optimizer.apply_gradients(zip(gradients, model.trainable_variables))

# Afficher les gradients
for var, grad in zip(model.trainable_variables, gradients):
    print(f"Variable: {var.name}, Gradient: {grad.numpy()}")

```

### Explication

1. **Définition du modèle** : Nous définissons un modèle simple avec quelques couches de convolution et de dense.
2. **Préparation des données** : Nous préparons les données d'entraînement et de test en utilisant le jeu de données MNIST.
3. **Utilisation de `tf.GradientTape`** :
    - Nous utilisons `tf.GradientTape` pour enregistrer les opérations et calculer les gradients de la fonction de perte par rapport aux variables du modèle.
    - Nous définissons la fonction de perte et l'optimiseur.
    - Nous enregistrons les opérations de prédiction et de calcul de la perte dans le contexte de `tf.GradientTape`.
    - Nous calculons les gradients en utilisant `tape.gradient`.
    - Nous appliquons les gradients à l'optimiseur en utilisant `optimizer.apply_gradients`.
    - Nous affichons les gradients pour chaque variable du modèle.

### Conclusion

`tf.GradientTape` est une API puissante qui permet de calculer les dérivées des fonctions de perte par rapport aux variables du modèle. Cela est essentiel pour l'optimisation des modèles de machine learning, car les gradients sont utilisés pour mettre à jour les poids du modèle pendant l'entraînement. En utilisant `tf.GradientTape`, vous pouvez contrôler le processus de calcul des gradients et appliquer des optimisations personnalisées si nécessaire.
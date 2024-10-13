---
title: Utilisation de la classe Model
description: Utilisation de la classe Model
---

La classe `tf.keras.Model` de TensorFlow offre une variété de fonctions et de méthodes qui peuvent être héritées et utilisées pour construire et manipuler des modèles de manière flexible et puissante. Voici une description de certaines des fonctions les plus importantes que vous pouvez hériter de la classe `tf.keras.Model` :

### 1. `__init__`

La méthode `__init__` est utilisée pour initialiser les couches et les paramètres du modèle. Vous devez appeler `super(MyModel, self).__init__()` pour initialiser la classe parente.

```python
class MyModel(tf.keras.Model):
    def __init__(self):
        super(MyModel, self).__init__()
        self.dense1 = layers.Dense(64, activation='relu')
        self.dense2 = layers.Dense(64, activation='relu')
        self.dense3 = layers.Dense(10)

```

### 2. `call`

La méthode `call` définit le flux de données à travers le modèle. Elle est appelée lorsque vous passez des données au modèle.

```python
def call(self, inputs):
    x = self.dense1(inputs)
    x = self.dense2(x)
    return self.dense3(x)

```

### 3. `compile`

La méthode `compile` configure le modèle pour l'entraînement. Vous spécifiez l'optimiseur, la fonction de perte et les métriques.

```python
model.compile(optimizer='adam',
              loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True),
              metrics=['accuracy'])

```

### 4. `fit`

La méthode `fit` entraîne le modèle sur les données fournies.

```python
model.fit(x_train, y_train, epochs=5)

```

### 5. `evaluate`

La méthode `evaluate` évalue le modèle sur les données de test.

```python
model.evaluate(x_test, y_test)

```

### 6. `predict`

La méthode `predict` génère des prédictions pour les données d'entrée.

```python
predictions = model.predict(x_test)

```

### 7. `summary`

La méthode `summary` imprime un résumé de l'architecture du modèle.

```python
model.summary()

```

### 8. `save` et `load_model`

Les méthodes `save` et `load_model` permettent de sauvegarder et de charger le modèle.

```python
model.save('my_model.h5')
loaded_model = tf.keras.models.load_model('my_model.h5')

```

### 9. `save_weights` et `load_weights`

Les méthodes `save_weights` et `load_weights` permettent de sauvegarder et de charger uniquement les poids du modèle.

```python
model.save_weights('my_model_weights.h5')
model.load_weights('my_model_weights.h5')

```

### 10. `layers`

La propriété `layers` retourne une liste des couches du modèle.

```python
layers = model.layers

```

### 11. `trainable_variables`

La propriété `trainable_variables` retourne une liste des variables entraînables du modèle.

```python
trainable_vars = model.trainable_variables

```

### 12. `non_trainable_variables`

La propriété `non_trainable_variables` retourne une liste des variables non entraînables du modèle.

```python
non_trainable_vars = model.non_trainable_variables

```

### 13. `train_on_batch`

La méthode `train_on_batch` entraîne le modèle sur un seul lot de données.

```python
model.train_on_batch(x_batch, y_batch)

```

### 14. `test_on_batch`

La méthode `test_on_batch` évalue le modèle sur un seul lot de données.

```python
model.test_on_batch(x_batch, y_batch)

```

### 15. `reset_metrics`

La méthode `reset_metrics` réinitialise les métriques du modèle.

```python
model.reset_metrics()

```

Ces fonctions et méthodes offrent une grande flexibilité pour construire, entraîner, évaluer et manipuler des modèles de manière efficace. Vous pouvez les utiliser pour personnaliser et optimiser vos modèles selon vos besoins spécifiques.
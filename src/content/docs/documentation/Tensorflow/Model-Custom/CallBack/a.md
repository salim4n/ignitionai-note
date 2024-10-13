---
title: Introduction aux callbacks
description: Utilisation de callbacks
---

[Google Colab](https://colab.research.google.com/github/https-deeplearning-ai/tensorflow-3-public/blob/main/Course%201%20-%20Custom%20Models%2C%20Layers%20and%20Loss%20Functions/Week%205%20-%20Callbacks/C1_W5_Lab_1_exploring-callbacks.ipynb)

Les callbacks sont des outils puissants en TensorFlow et Keras qui permettent de personnaliser et de contrôler le comportement du modèle pendant l'entraînement. Ils peuvent être utilisés pour effectuer diverses tâches à différents moments du processus d'entraînement, comme après chaque époque ou chaque batch. Voici une description des tâches courantes que les callbacks peuvent accomplir :

### 1. Sauvegarde du modèle

Les callbacks peuvent être utilisés pour sauvegarder le modèle à des intervalles réguliers ou lorsque certaines conditions sont remplies.

```python
from tensorflow.keras.callbacks import ModelCheckpoint

checkpoint = ModelCheckpoint(filepath='model.h5', save_best_only=True)

```

### 2. Réduction du taux d'apprentissage

Les callbacks peuvent ajuster le taux d'apprentissage de l'optimiseur en fonction de certaines conditions, comme la stagnation de la perte de validation.

```python
from tensorflow.keras.callbacks import ReduceLROnPlateau

reduce_lr = ReduceLROnPlateau(monitor='val_loss', factor=0.2, patience=5, min_lr=0.001)
```

### 3. Arrêt prématuré

Les callbacks peuvent arrêter l'entraînement si une métrique surveillée ne s'améliore plus après un certain nombre d'époques.

```python
from tensorflow.keras.callbacks import EarlyStopping

early_stopping = EarlyStopping(monitor='val_loss', patience=10)
```

### 4. Enregistrement des logs

Les callbacks peuvent enregistrer les métriques d'entraînement et de validation dans un fichier CSV pour une analyse ultérieure.

```python
from tensorflow.keras.callbacks import CSVLogger

csv_logger = CSVLogger('training.log')
```

### 5. Affichage des progrès

Les callbacks peuvent afficher les progrès de l'entraînement dans la console ou dans une interface utilisateur graphique.

```python
from tensorflow.keras.callbacks import ProgbarLogger

progbar = ProgbarLogger(count_mode='steps')
```

### 6. Enregistrement des événements TensorBoard

Les callbacks peuvent enregistrer les événements d'entraînement pour une visualisation avec TensorBoard.

```python
from tensorflow.keras.callbacks import TensorBoard

tensorboard = TensorBoard(log_dir='./logs')
```

### 7. Personnalisation des callbacks

Vous pouvez également créer des callbacks personnalisés pour effectuer des tâches spécifiques à vos besoins. Par exemple, vous pouvez créer un callback pour envoyer des notifications ou pour effectuer des opérations de prétraitement des données.

```python
class CustomCallback(tf.keras.callbacks.Callback):
    def on_epoch_end(self, epoch, logs=None):
        print(f"End of epoch {epoch}, loss: {logs['loss']}")

custom_callback = CustomCallback()
```

### Utilisation des callbacks

Pour utiliser les callbacks, vous les passez à la méthode `fit` du modèle.

```python
callbacks = [checkpoint, reduce_lr, early_stopping, csv_logger, progbar, tensorboard, custom_callback]

model.fit(x_train, y_train, epochs=50, validation_data=(x_val, y_val), callbacks=callbacks)
```

### Résumé des tâches courantes

1. **Sauvegarde du modèle** : Sauvegarder le modèle à des intervalles réguliers ou lorsque certaines conditions sont remplies.
2. **Réduction du taux d'apprentissage** : Ajuster le taux d'apprentissage de l'optimiseur en fonction de certaines conditions.
3. **Arrêt prématuré** : Arrêter l'entraînement si une métrique surveillée ne s'améliore plus.
4. **Enregistrement des logs** : Enregistrer les métriques d'entraînement et de validation dans un fichier CSV.
5. **Affichage des progrès** : Afficher les progrès de l'entraînement dans la console ou dans une interface utilisateur graphique.
6. **Enregistrement des événements TensorBoard** : Enregistrer les événements d'entraînement pour une visualisation avec TensorBoard.
7. **Personnalisation des callbacks** : Créer des callbacks personnalisés pour effectuer des tâches spécifiques.

Les callbacks offrent une grande flexibilité pour personnaliser et contrôler le processus d'entraînement, ce qui peut être très utile pour améliorer les performances du modèle et pour surveiller son comportement.

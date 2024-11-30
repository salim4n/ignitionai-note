---
title : Créer un callback personnalisé
description : Créer un callback personnalisé et l'assigner à l'entraînement d'un modèle en TensorFlow/Keras
---

Créer un callback personnalisé peut être très utile dans de nombreux scénarios où les callbacks intégrés de TensorFlow/Keras ne répondent pas à vos besoins spécifiques. Voici quelques exemples de situations où vous pourriez vouloir créer un callback personnalisé :

### 1. Enregistrement de métriques personnalisées

Si vous avez des métriques spécifiques que vous souhaitez surveiller et enregistrer pendant l'entraînement, vous pouvez créer un callback personnalisé pour les calculer et les enregistrer.

```python
class CustomMetricsCallback(tf.keras.callbacks.Callback):
    def on_epoch_end(self, epoch, logs=None):
        logs = logs or {}
        custom_metric = self.calculate_custom_metric(self.model)
        logs['custom_metric'] = custom_metric
        print(f"End of epoch {epoch}, custom_metric: {custom_metric}")

    def calculate_custom_metric(self, model):
        # Calculer une métrique personnalisée
        # Par exemple, la précision sur un ensemble de données spécifique
        x_custom, y_custom = self.custom_data
        y_pred = model.predict(x_custom)
        custom_metric = tf.keras.metrics.categorical_accuracy(y_custom, y_pred).numpy().mean()
        return custom_metric

    def set_custom_data(self, x_custom, y_custom):
        self.custom_data = (x_custom, y_custom)

# Utilisation du callback
custom_callback = CustomMetricsCallback()
custom_callback.set_custom_data(x_custom, y_custom)

model.fit(x_train, y_train, epochs=10, callbacks=[custom_callback])

```

### 2. Sauvegarde de modèles intermédiaires

Si vous souhaitez sauvegarder des modèles intermédiaires à des intervalles spécifiques ou en fonction de certaines conditions, vous pouvez créer un callback personnalisé pour le faire.

```python
class IntermediateModelSaver(tf.keras.callbacks.Callback):
    def __init__(self, save_interval):
        super(IntermediateModelSaver, self).__init__()
        self.save_interval = save_interval

    def on_epoch_end(self, epoch, logs=None):
        if (epoch + 1) % self.save_interval == 0:
            self.model.save(f'model_epoch_{epoch + 1}.h5')
            print(f"Model saved at epoch {epoch + 1}")

# Utilisation du callback
intermediate_saver = IntermediateModelSaver(save_interval=5)

model.fit(x_train, y_train, epochs=50, callbacks=[intermediate_saver])

```

### 3. Notifications en temps réel

Si vous souhaitez envoyer des notifications en temps réel (par exemple, par email ou via une application de messagerie) lorsque certaines conditions sont remplies pendant l'entraînement, vous pouvez créer un callback personnalisé pour le faire.

```python
class NotificationCallback(tf.keras.callbacks.Callback):
    def on_epoch_end(self, epoch, logs=None):
        if logs.get('val_loss') < 0.1:
            self.send_notification(f"Model has reached a validation loss of {logs['val_loss']} at epoch {epoch}")

    def send_notification(self, message):
        # Envoyer une notification (par exemple, par email)
        print(f"Notification: {message}")

# Utilisation du callback
notification_callback = NotificationCallback()

model.fit(x_train, y_train, epochs=50, callbacks=[notification_callback])

```

### 4. Visualisation des résultats intermédiaires

Si vous souhaitez visualiser les résultats intermédiaires de l'entraînement (par exemple, des images générées par un modèle GAN) à chaque époque, vous pouvez créer un callback personnalisé pour le faire.

```python
class VisualizationCallback(tf.keras.callbacks.Callback):
    def on_epoch_end(self, epoch, logs=None):
        self.visualize_results(epoch)

    def visualize_results(self, epoch):
        # Générer et visualiser des résultats intermédiaires
        generated_images = self.model.predict(self.sample_data)
        # Afficher ou sauvegarder les images générées
        print(f"Generated images at epoch {epoch}")

    def set_sample_data(self, sample_data):
        self.sample_data = sample_data

# Utilisation du callback
visualization_callback = VisualizationCallback()
visualization_callback.set_sample_data(sample_data)

model.fit(x_train, y_train, epochs=50, callbacks=[visualization_callback])

```

### 5. Ajustement dynamique des hyperparamètres

Si vous souhaitez ajuster dynamiquement certains hyperparamètres (par exemple, le taux d'apprentissage) en fonction de certaines conditions pendant l'entraînement, vous pouvez créer un callback personnalisé pour le faire.

```python
class DynamicLearningRateCallback(tf.keras.callbacks.Callback):
    def on_epoch_end(self, epoch, logs=None):
        if logs.get('val_loss') > 0.5:
            new_lr = self.model.optimizer.lr.numpy() * 0.5
            tf.keras.backend.set_value(self.model.optimizer.lr, new_lr)
            print(f"Learning rate reduced to {new_lr} at epoch {epoch}")

# Utilisation du callback
dynamic_lr_callback = DynamicLearningRateCallback()

model.fit(x_train, y_train, epochs=50, callbacks=[dynamic_lr_callback])

```

### Conclusion

Ces exemples montrent comment créer des callbacks personnalisés pour répondre à des besoins spécifiques pendant l'entraînement d'un modèle. Les callbacks personnalisés offrent une grande flexibilité pour ajouter des fonctionnalités supplémentaires et contrôler le processus d'entraînement de manière plus fine.
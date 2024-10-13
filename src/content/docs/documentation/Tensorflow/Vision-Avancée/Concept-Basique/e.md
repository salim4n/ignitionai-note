---
title : Fine-tuning Options
description : Fine-tuning Options
---

L'apprentissage par transfert offre plusieurs options de conception pour adapter un modèle pré-entraîné à une nouvelle tâche. Ces options permettent de tirer parti des connaissances apprises par le modèle pré-entraîné tout en ajustant le modèle pour qu'il soit performant sur la nouvelle tâche. Voici les principales options de conception lors de l'utilisation de l'apprentissage par transfert :

## 1. Utilisation des poids pré-entraînés

### Fine-tuning (ajustement fin)

Le fine-tuning consiste à ajuster les poids du modèle pré-entraîné en fonction des nouvelles données. Cela implique de dégeler certaines ou toutes les couches du modèle pré-entraîné et de les entraîner sur les nouvelles données.

### Exemple de fine-tuning

```python
import tensorflow as tf
from tensorflow.keras.applications import VGG16
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Dense, Flatten

# Charger le modèle VGG16 pré-entraîné sans les couches supérieures
base_model = VGG16(weights='imagenet', include_top=False, input_shape=(224, 224, 3))

# Ajouter des couches supérieures pour la nouvelle tâche
x = base_model.output
x = Flatten()(x)
x = Dense(256, activation='relu')(x)
predictions = Dense(2, activation='softmax')(x)

# Créer le modèle final
model = Model(inputs=base_model.input, outputs=predictions)

# Définir les couches à entraîner
for layer in base_model.layers:
    layer.trainable = True

# Compiler le modèle
model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

# Charger vos données d'entraînement et de validation
# train_data, train_labels, val_data, val_labels = ...

# Entraîner le modèle
model.fit(train_data, train_labels, epochs=10, validation_data=(val_data, val_labels))

```

### Feature extraction (extraction de caractéristiques)

L'extraction de caractéristiques consiste à utiliser les couches inférieures du modèle pré-entraîné pour extraire des caractéristiques des nouvelles données, puis à entraîner un nouveau classificateur sur ces caractéristiques. Les couches inférieures du modèle pré-entraîné sont gelées (non entraînables).

### Exemple d'extraction de caractéristiques

```python
import tensorflow as tf
from tensorflow.keras.applications import VGG16
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Dense, Flatten

# Charger le modèle VGG16 pré-entraîné sans les couches supérieures
base_model = VGG16(weights='imagenet', include_top=False, input_shape=(224, 224, 3))

# Ajouter des couches supérieures pour la nouvelle tâche
x = base_model.output
x = Flatten()(x)
x = Dense(256, activation='relu')(x)
predictions = Dense(2, activation='softmax')(x)

# Créer le modèle final
model = Model(inputs=base_model.input, outputs=predictions)

# Geler les couches du modèle pré-entraîné
for layer in base_model.layers:
    layer.trainable = False

# Compiler le modèle
model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

# Charger vos données d'entraînement et de validation
# train_data, train_labels, val_data, val_labels = ...

# Entraîner le modèle
model.fit(train_data, train_labels, epochs=10, validation_data=(val_data, val_labels))

```

## 2. Remplacement des couches supérieures

Le remplacement des couches supérieures consiste à remplacer les couches supérieures du modèle pré-entraîné par de nouvelles couches adaptées à la nouvelle tâche. Les couches inférieures du modèle pré-entraîné sont généralement gelées (non entraînables).

### Exemple de remplacement des couches supérieures

```python
import tensorflow as tf
from tensorflow.keras.applications import VGG16
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Dense, Flatten

# Charger le modèle VGG16 pré-entraîné sans les couches supérieures
base_model = VGG16(weights='imagenet', include_top=False, input_shape=(224, 224, 3))

# Ajouter de nouvelles couches supérieures pour la nouvelle tâche
x = base_model.output
x = Flatten()(x)
x = Dense(256, activation='relu')(x)
predictions = Dense(2, activation='softmax')(x)

# Créer le modèle final
model = Model(inputs=base_model.input, outputs=predictions)

# Geler les couches du modèle pré-entraîné
for layer in base_model.layers:
    layer.trainable = False

# Compiler le modèle
model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

# Charger vos données d'entraînement et de validation
# train_data, train_labels, val_data, val_labels = ...

# Entraîner le modèle
model.fit(train_data, train_labels, epochs=10, validation_data=(val_data, val_labels))

```

## 3. Entraînement progressif

L'entraînement progressif consiste à entraîner d'abord les couches supérieures du modèle tout en gelant les couches inférieures, puis à dégeler progressivement les couches inférieures et à les entraîner avec un taux d'apprentissage plus faible.

### Exemple d'entraînement progressif

```python
import tensorflow as tf
from tensorflow.keras.applications import VGG16
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Dense, Flatten

# Charger le modèle VGG16 pré-entraîné sans les couches supérieures
base_model = VGG16(weights='imagenet', include_top=False, input_shape=(224, 224, 3))

# Ajouter des couches supérieures pour la nouvelle tâche
x = base_model.output
x = Flatten()(x)
x = Dense(256, activation='relu')(x)
predictions = Dense(2, activation='softmax')(x)

# Créer le modèle final
model = Model(inputs=base_model.input, outputs=predictions)

# Geler les couches du modèle pré-entraîné
for layer in base_model.layers:
    layer.trainable = False

# Compiler le modèle
model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

# Charger vos données d'entraînement et de validation
# train_data, train_labels, val_data, val_labels = ...

# Entraîner les couches supérieures
model.fit(train_data, train_labels, epochs=10, validation_data=(val_data, val_labels))

# Décongeler les couches inférieures et les entraîner avec un taux d'apprentissage plus faible
for layer in base_model.layers:
    layer.trainable = True

model.compile(optimizer=tf.keras.optimizers.Adam(1e-5), loss='categorical_crossentropy', metrics=['accuracy'])

# Entraîner le modèle complet
model.fit(train_data, train_labels, epochs=10, validation_data=(val_data, val_labels))

```

## Conclusion

L'apprentissage par transfert offre plusieurs options de conception pour adapter un modèle pré-entraîné à une nouvelle tâche. Ces options incluent le fine-tuning, l'extraction de caractéristiques, le remplacement des couches supérieures et l'entraînement progressif. Chaque option a ses propres avantages et peut être choisie en fonction des besoins spécifiques de la tâche et des données disponibles. En utilisant ces techniques, vous pouvez tirer parti des connaissances apprises par le modèle pré-entraîné pour améliorer les performances sur la nouvelle tâche, même avec des jeux de données plus petits.
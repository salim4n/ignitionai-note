---
title: Description des nouveaux type de modèles avec API Functional
description: API Functional
---

L'API Functional de Keras offre une grande flexibilité pour créer des architectures de modèles complexes et non linéaires. Voici quelques types de modèles avancés que vous pouvez construire avec l'API Functional :

### 1. Modèles avec des chemins de données multiples

Les modèles avec des chemins de données multiples permettent de traiter différentes parties des données d'entrée de manière distincte avant de les combiner. Cela est particulièrement utile pour les tâches de traitement du langage naturel (NLP) ou de traitement d'images où différentes caractéristiques doivent être traitées séparément.

```python
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input, Dense, concatenate

# Définir les entrées
input_a = Input(shape=(32,))
input_b = Input(shape=(128,))

# Définir les chemins de données
x = Dense(64, activation='relu')(input_a)
y = Dense(64, activation='relu')(input_b)

# Combiner les chemins de données
combined = concatenate([x, y])

# Ajouter une couche de sortie
output = Dense(1, activation='sigmoid')(combined)

# Créer le modèle
model = Model(inputs=[input_a, input_b], outputs=output)

# Compiler le modèle
model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

# Résumé du modèle
model.summary()

```

### 2. Modèles avec des couches partagées

Les modèles avec des couches partagées permettent de réutiliser des couches dans différentes parties du modèle. Cela est utile pour les architectures comme les réseaux siamois, où les mêmes couches sont appliquées à différentes entrées.

```python
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input, Dense

# Définir les entrées
input_a = Input(shape=(32,))
input_b = Input(shape=(32,))

# Définir une couche partagée
shared_layer = Dense(64, activation='relu')

# Appliquer la couche partagée aux deux entrées
x = shared_layer(input_a)
y = shared_layer(input_b)

# Combiner les sorties
combined = concatenate([x, y])

# Ajouter une couche de sortie
output = Dense(1, activation='sigmoid')(combined)

# Créer le modèle
model = Model(inputs=[input_a, input_b], outputs=output)

# Compiler le modèle
model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

# Résumé du modèle
model.summary()

```

### 3. Modèles avec des architectures résiduelles

Les modèles avec des architectures résiduelles (ResNet) utilisent des connexions de saut pour permettre aux gradients de circuler plus facilement à travers le réseau, ce qui facilite l'entraînement de réseaux très profonds.

```python
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input, Dense, Add

# Définir l'entrée
input_layer = Input(shape=(32,))

# Définir une couche résiduelle
x = Dense(64, activation='relu')(input_layer)
residual = Dense(64, activation='relu')(x)
residual = Add()([x, residual])

# Ajouter une couche de sortie
output = Dense(1, activation='sigmoid')(residual)

# Créer le modèle
model = Model(inputs=input_layer, outputs=output)

# Compiler le modèle
model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

# Résumé du modèle
model.summary()

```

### 4. Modèles avec des architectures en forme de U (U-Net)

Les modèles en forme de U (U-Net) sont couramment utilisés pour la segmentation d'images. Ils combinent des chemins de contraction et d'expansion pour capturer des caractéristiques à différentes échelles.

```python
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input, Conv2D, MaxPooling2D, UpSampling2D, concatenate

# Définir l'entrée
input_layer = Input(shape=(128, 128, 1))

# Chemin de contraction
c1 = Conv2D(64, (3, 3), activation='relu', padding='same')(input_layer)
c1 = Conv2D(64, (3, 3), activation='relu', padding='same')(c1)
p1 = MaxPooling2D((2, 2))(c1)

c2 = Conv2D(128, (3, 3), activation='relu', padding='same')(p1)
c2 = Conv2D(128, (3, 3), activation='relu', padding='same')(c2)
p2 = MaxPooling2D((2, 2))(c2)

# Chemin d'expansion
u3 = UpSampling2D((2, 2))(p2)
u3 = concatenate([u3, c2])
c3 = Conv2D(128, (3, 3), activation='relu', padding='same')(u3)
c3 = Conv2D(128, (3, 3), activation='relu', padding='same')(c3)

u4 = UpSampling2D((2, 2))(c3)
u4 = concatenate([u4, c1])
c4 = Conv2D(64, (3, 3), activation='relu', padding='same')(u4)
c4 = Conv2D(64, (3, 3), activation='relu', padding='same')(c4)

# Couche de sortie
output = Conv2D(1, (1, 1), activation='sigmoid')(c4)

# Créer le modèle
model = Model(inputs=input_layer, outputs=output)

# Compiler le modèle
model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

# Résumé du modèle
model.summary()

```

### Conclusion

L'API Functional de Keras permet de créer des architectures de modèles complexes et flexibles. Elle est particulièrement utile pour les modèles avec des chemins de données multiples, des couches partagées, des architectures résiduelles, et des architectures en forme de U. Cette flexibilité permet de concevoir des modèles adaptés à des tâches spécifiques et complexes, offrant ainsi une grande puissance et une grande polyvalence pour les chercheurs et les ingénieurs en apprentissage automatique.

---
title : Boucle d’entraînement custom et fine-tuning d’un modèle
description : Boucle d’entraînement custom et fine-tuning d’un modèle
---
Dans cette section, nous allons :

- Créer une boucle d’entraînement sur mesure.
- Apprendre à ajuster un modèle existant avec un petit jeu de données (5 exemples).
- Contrôler les gradients et les mises à jour des poids pour améliorer les performances malgré la taille réduite des données.

---

## 1. **Pourquoi utiliser une boucle d'entraînement personnalisée ?**

Une boucle d’entraînement personnalisée permet de **mieux contrôler** le processus d’entraînement d’un modèle. Cela peut être utile quand :

- Tu as **peu de données** et que tu souhaites plus de flexibilité.
- Tu veux ajuster finement l’entraînement (choisir manuellement ce que tu fais à chaque itération).
- Les approches préconstruites (comme `model.fit`) ne suffisent pas ou sont trop rigides pour ton scénario.

Dans cet exemple, nous allons implémenter une boucle personnalisée pour affiner un modèle avec **seulement 5 exemples d’entraînement**.

---

## 2. **Étape 1 : Préparer les données et le modèle**

Nous allons utiliser un petit jeu de données fictif avec seulement 5 exemples d’entraînement. Supposons que nous utilisons **ResNet-50** pré-entraîné sur **ImageNet** comme modèle de base, que nous allons affiner.

### **Préparer les données**

Voici comment on pourrait créer un mini-jeu de données avec 5 exemples d’entraînement :

```python
import numpy as np

# Créer 5 exemples de données (images 224x224 avec 3 canaux)
x_train = np.random.rand(5, 224, 224, 3).astype(np.float32)

# Créer des labels fictifs (par exemple, pour 10 classes)
y_train = np.random.randint(0, 10, size=(5,))

# Convertir les labels en format one-hot
y_train = tf.keras.utils.to_categorical(y_train, num_classes=10)

```

### **Charger un modèle pré-entraîné**

Nous allons utiliser **ResNet-50** pré-entraîné, mais seulement pour extraire des caractéristiques. Nous ajouterons ensuite une petite tête de classification.

```python
import tensorflow as tf
from tensorflow.keras.applications import ResNet50
from tensorflow.keras import layers, models

# Charger ResNet-50 pré-entraîné sur ImageNet sans la dernière couche (top layer)
base_model = ResNet50(weights='imagenet', include_top=False, input_shape=(224, 224, 3))

# Geler les couches du modèle de base pour ne pas les entraîner
base_model.trainable = False

# Ajouter une nouvelle tête de classification
model = models.Sequential([
    base_model,
    layers.GlobalAveragePooling2D(),
    layers.Dense(256, activation='relu'),
    layers.Dropout(0.5),
    layers.Dense(10, activation='softmax')  # 10 classes
])

# Afficher la structure du modèle
model.summary()

```

---

## 3. **Étape 2 : Configurer la boucle d'entraînement personnalisée**

Au lieu d'utiliser `model.fit()`, nous allons définir manuellement une boucle d’entraînement. Cela nous donne un contrôle total sur le processus d’optimisation, les calculs de pertes, et la gestion des gradients.

### **Définir la fonction de perte et l'optimiseur**

```python
# Choisir une fonction de perte pour la classification multi-classes
loss_fn = tf.keras.losses.CategoricalCrossentropy()

# Choisir un optimiseur pour ajuster les poids
optimizer = tf.keras.optimizers.Adam(learning_rate=1e-4)

```

---

### **Dérouler une boucle d'entraînement personnalisée**

Nous allons créer une boucle pour itérer sur nos 5 exemples, calculer les pertes et appliquer les gradients pour ajuster les poids du modèle.

### **Étape 3 : Mise en œuvre de la boucle d’entraînement**

```python
# Nombre d'epochs
epochs = 10

# Itérer sur les epochs
for epoch in range(epochs):
    print(f'Start of epoch {epoch+1}')

    # Initialiser une variable pour suivre la perte
    total_loss = 0.0

    # Itérer sur chaque exemple d'entraînement (5 exemples dans ce cas)
    for i in range(len(x_train)):
        x = x_train[i:i+1]  # Extraire un exemple d'entraînement
        y = y_train[i:i+1]  # Extraire le label correspondant

        with tf.GradientTape() as tape:
            # Faire une prédiction sur cet exemple
            predictions = model(x, training=True)

            # Calculer la perte pour cet exemple
            loss = loss_fn(y, predictions)

        # Calculer les gradients par rapport aux poids du modèle
        gradients = tape.gradient(loss, model.trainable_weights)

        # Appliquer les gradients pour mettre à jour les poids
        optimizer.apply_gradients(zip(gradients, model.trainable_weights))

        # Accumuler la perte pour l'afficher à la fin de l'epoch
        total_loss += loss.numpy()

    # Afficher la perte moyenne de l'epoch
    print(f'Loss at epoch {epoch+1}: {total_loss / len(x_train)}')

```

### **Explication de la boucle** :

1. **GradientTape** : C'est un contexte dans lequel TensorFlow "enregistre" les opérations effectuées afin de calculer les gradients plus tard. Ici, nous utilisons `GradientTape` pour suivre le calcul de la perte.
2. **`optimizer.apply_gradients`** : Une fois les gradients calculés, nous les appliquons pour ajuster les poids du modèle en utilisant l'optimiseur choisi.
3. **Itération manuelle** : Contrairement à `model.fit()`, nous contrôlons ici chaque aspect de l’entraînement, en traitant un exemple à la fois et en calculant explicitement les gradients.

---

## 4. **Étape 4 : Ajustements spécifiques pour peu de données**

Avec seulement 5 exemples d’entraînement, le modèle risque de **surapprendre** (overfitting). Voici quelques techniques pour minimiser ce problème :

### **Régularisation et dropout** :

- **Dropout** : Nous avons ajouté une couche de **dropout** pour ignorer aléatoirement certains neurones pendant l’entraînement. Cela aide à éviter le surapprentissage en simulant un ensemble de modèles différents.
- **Poids pré-entraînés** : En utilisant des poids pré-entraînés de ResNet-50, nous bénéficions des connaissances acquises sur de grands ensembles de données comme ImageNet, ce qui est crucial avec des petits jeux de données.

### **Ajuster le taux d’apprentissage** :

Avec seulement quelques exemples, il est souvent utile d’utiliser un taux d’apprentissage très faible pour éviter que les poids ne changent trop drastiquement.

```python
optimizer = tf.keras.optimizers.Adam(learning_rate=1e-5)  # Réduire le taux d'apprentissage

```

---

## 5. **Étape 5 : Évaluation sur les 5 exemples**

Après chaque epoch, nous pouvons évaluer le modèle sur nos 5 exemples pour vérifier les performances et éviter le surajustement.

### **Évaluation sur les exemples d'entraînement** :

```python
# Évaluer les prédictions après l'entraînement
for i in range(len(x_train)):
    x = x_train[i:i+1]
    y_true = y_train[i]

    # Faire une prédiction
    predictions = model(x, training=False)
    predicted_class = tf.argmax(predictions, axis=-1)
    true_class = tf.argmax(y_true, axis=-1)

    print(f'Exemple {i+1}: True class: {true_class.numpy()}, Predicted class: {predicted_class.numpy()}')

```

---

## 6. **Conclusion**

En résumé, voici les étapes pour mettre en œuvre une boucle d’entraînement personnalisée afin d’affiner un modèle avec seulement 5 exemples d’entraînement :

1. **Préparer un petit jeu de données** (5 exemples dans ce cas).
2. **Charger un modèle pré-entraîné** (comme ResNet-50) et ajouter des couches personnalisées.
3. **Configurer une boucle d’entraînement personnalisée** qui inclut le calcul des gradients et l'application de mises à jour des poids.
4. **Utiliser des techniques pour éviter le surapprentissage** (dropout, régularisation, faible taux d’apprentissage).
5. **Évaluer les performances** sur les quelques exemples pour s’assurer que le modèle apprend correctement.

Malgré la petite taille du jeu de données, cette approche permet de tirer parti des poids pré-entraînés tout en ajustant finement le modèle sur une nouvelle tâche.
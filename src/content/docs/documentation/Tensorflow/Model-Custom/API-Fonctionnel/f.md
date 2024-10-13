---
title: Modèles multi-sorties
description: Modèles multi-sorties
---

**Introduction**

Dans de nombreux problèmes de machine learning, il est nécessaire de prédire plusieurs sorties à partir d'une seule entrée. Par exemple, dans un problème de classification multi-étiquette, on peut vouloir prédire plusieurs étiquettes pour une seule image. Dans un problème de régression multi-variable, on peut vouloir prédire plusieurs valeurs continues pour une seule entrée. Les modèles multi-sorties sont conçus pour résoudre ce type de problèmes.

**Architecture d'un modèle multi-sorties**

Un modèle multi-sorties est composé de plusieurs sorties, chacune correspondant à une tâche spécifique. Chaque sortie est associée à une fonction de perte et à une métrique d'évaluation spécifique. L'architecture d'un modèle multi-sorties peut varier en fonction du problème à résoudre, mais elle est généralement composée des éléments suivants :

- Un réseau neuronal partagé : c'est le réseau neuronal qui traite les entrées et produit des représentations intermédiaires.
- Des têtes de sortie : ce sont des réseaux neuronaux spécialisés qui prennent les représentations intermédiaires en entrée et produisent les sorties finales.
- Des fonctions de perte : chaque sortie est associée à une fonction de perte qui mesure la différence entre la sortie prédite et la sortie réelle.
- Des métriques d'évaluation : chaque sortie est associée à une métrique d'évaluation qui évalue la qualité de la prédiction.

**Types de modèles multi-sorties**

Il existe plusieurs types de modèles multi-sorties, notamment :

- **Modèle multi-sorties partagé** : dans ce type de modèle, le réseau neuronal partagé est suivi d'un seul réseau neuronal qui produit toutes les sorties.
- **Modèle multi-sorties non partagé** : dans ce type de modèle, chaque sortie est associée à un réseau neuronal spécialisé qui prend les entrées en compte.
- **Modèle multi-sorties hiérarchique** : dans ce type de modèle, les sorties sont organisées hiérarchiquement, avec des sorties de niveau supérieur qui dépendent des sorties de niveau inférieur.

**Implémentation avec TensorFlow**

TensorFlow propose plusieurs outils pour implémenter des modèles multi-sorties, notamment :

- **La classe `tf.keras.Model`** : cette classe permet de définir un modèle multi-sorties en spécifiant les entrées, les sorties et les fonctions de perte.
- **La classe `tf.keras.layers.MultiOutput`** : cette classe permet de définir un réseau neuronal qui produit plusieurs sorties.
- **La fonction `tf.keras.losses`** : cette fonction permet de définir les fonctions de perte pour chaque sortie.

Exemple de code :

```python
import tensorflow as tf

# Définition du modèle multi-sorties
inputs = tf.keras.Input(shape=(784,))
x = tf.keras.layers.Dense(64, activation='relu')(inputs)
x = tf.keras.layers.Dense(64, activation='relu')(x)

# Définition des sorties
output1 = tf.keras.layers.Dense(10, activation='softmax')(x)
output2 = tf.keras.layers.Dense(1, activation='sigmoid')(x)

# Définition du modèle
model = tf.keras.Model(inputs=inputs, outputs=[output1, output2])

# Compilation du modèle
model.compile(optimizer='adam',
              loss=['categorical_crossentropy', 'binary_crossentropy'],
              metrics=['accuracy'])

# Entraînement du modèle
model.fit(X_train, [y_train1, y_train2], epochs=10)

```

Dans cet exemple, nous définissons un modèle multi-sorties qui prend en entrée des images de taille 784 et produit deux sorties : une sortie de classification multi-étiquette avec 10 classes et une sortie de régression binaire. Le modèle est compilé avec la fonction de perte `categorical_crossentropy` pour la première sortie et `binary_crossentropy` pour la deuxième sortie. Les métriques d'évaluation sont la précision pour la première sortie et l'erreur quadratique moyenne pour la deuxième sortie.

**Conclusion**

Les modèles multi-sorties sont des outils puissants pour résoudre des problèmes de machine learning complexes. TensorFlow propose plusieurs outils pour implémenter ces modèles, notamment la classe `tf.keras.Model` et la fonction `tf.keras.losses`. En suivant les étapes décrites dans cette documentation, vous pouvez créer vos propres modèles multi-sorties pour résoudre vos problèmes de machine learning.

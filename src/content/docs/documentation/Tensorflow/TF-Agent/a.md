---
title : Introduction à TF-Agents
description : Introduction à TF-Agents
---

**Introduction**

TF-Agents est une bibliothèque de TensorFlow pour l'apprentissage par renforcement. Elle permet de créer des agents qui peuvent apprendre à prendre des décisions dans des environnements complexes. Dans ce tutoriel, nous allons créer un agent qui apprend à jouer au jeu de Pong.

**Installation**

Pour commencer, vous devez installer TF-Agents. Vous pouvez le faire en utilisant pip :

```
pip install tf-agents
```

**Création de l'environnement**

Le premier pas pour créer un agent est de définir l'environnement dans lequel il va apprendre. Dans ce cas, nous allons utiliser le jeu de Pong. Nous allons créer un environnement de jeu de Pong en utilisant la bibliothèque Gym :

```python
import gym

env = gym.make('Pong-v0')
```

**Création de l'agent**

Maintenant que nous avons défini l'environnement, nous pouvons créer l'agent. Nous allons utiliser la classe `TF-agent` de TF-Agents :

```python
import tf_agents

agent = tf_agents.agents.DQN(
    env,
    q_network=tf.keras.models.Sequential([
        tf.keras.layers.Dense(64, activation='relu', input_shape=(4,)),
        tf.keras.layers.Dense(64, activation='relu'),
        tf.keras.layers.Dense(env.action_space.n)
    ]),
    optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
    epsilon_greedy=0.1
)
```

Dans cet exemple, nous utilisons la classe `DQN` pour créer un agent qui utilise l'algorithme Q-learning. Nous définissons également le réseau neuronal qui sera utilisé pour apprendre la fonction de valeur.

**Entraînement de l'agent**

Maintenant que nous avons créé l'agent, nous pouvons l'entraîner. Nous allons utiliser la méthode `train` de l'agent pour l'entraîner pendant 1000 épisodes :

```python
agent.train(env, num_episodes=1000)
```

**Évaluation de l'agent**

Après avoir entraîné l'agent, nous pouvons l'évaluer. Nous allons utiliser la méthode `evaluate` de l'agent pour évaluer sa performance pendant 100 épisodes :

```python
agent.evaluate(env, num_episodes=100)
```

**Résultats**

Après avoir entraîné et évalué l'agent, nous pouvons afficher les résultats. Nous allons utiliser la méthode `summary` de l'agent pour afficher un résumé de ses performances :

```python
agent.summary()
```

Cela affichera un résumé des performances de l'agent, y compris sa récompense moyenne et son taux de réussite.

**Conclusion**

Dans ce tutoriel, nous avons créé un agent d'apprentissage par renforcement qui a appris à jouer au jeu de Pong en utilisant la bibliothèque TF-Agents. Nous avons défini l'environnement, créé l'agent, l'avons entraîné et évalué, et avons affiché les résultats. Nous espérons que ce tutoriel vous a été utile pour comprendre comment utiliser TF-Agents pour créer des agents d'apprentissage par renforcement.

**Code complet**

Voici le code complet pour ce tutoriel :

```python
import gym
import tf_agents

# Création de l'environnement
env = gym.make('Pong-v0')

# Création de l'agent
agent = tf_agents.agents.DQN(
    env,
    q_network=tf.keras.models.Sequential([
        tf.keras.layers.Dense(64, activation='relu', input_shape=(4,)),
        tf.keras.layers.Dense(64, activation='relu'),
        tf.keras.layers.Dense(env.action_space.n)
    ]),
    optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
    epsilon_greedy=0.1
)

# Entraînement de l'agent
agent.train(env, num_episodes=1000)

# Évaluation de l'agent
agent.evaluate(env, num_episodes=100)

# Résultats
agent.summary()
```

Notez que ce code nécessite d'avoir installé les bibliothèques Gym et TF-Agents.

**Nombre de neurones dans la couche d'entrée (4)**

La couche d'entrée du réseau neuronal a 4 neurones, car l'environnement de jeu de Pong fournit 4 informations à l'agent :

- La position de la balle sur l'axe x
- La position de la balle sur l'axe y
- La vitesse de la balle sur l'axe x
- La vitesse de la balle sur l'axe y

Ces 4 informations sont suffisantes pour décrire l'état du jeu et permettre à l'agent de prendre des décisions.

**Nombre de neurones dans les couches cachées (64)**

Le nombre de neurones dans les couches cachées est un choix arbitraire, mais il est courant de choisir un nombre pair pour faciliter la mise en œuvre de l'algorithme de backpropagation. Dans ce cas, j'ai choisi 64 neurones pour les couches cachées.

Il est important de noter que le nombre de neurones dans les couches cachées affecte la capacité du réseau neuronal à apprendre des modèles complexes. Un nombre trop petit de neurones peut entraîner une capacité de généralisation insuffisante, tandis qu'un nombre trop grand de neurones peut entraîner une sur-adaptation.

**Nombre de couches (2)**

J'ai choisi de mettre en œuvre deux couches cachées pour ce réseau neuronal. Cela permet de capturer des modèles non linéaires dans les données et de généraliser mieux que avec une seule couche cachée.

Il est important de noter que le nombre de couches affecte la profondeur du réseau neuronal et sa capacité à apprendre des modèles complexes. Un nombre trop grand de couches peut entraîner une sur-adaptation et une difficulté à entraîner le réseau.

**Fonction d'activation (ReLU)**

J'ai choisi la fonction d'activation ReLU (Rectified Linear Unit) pour les couches cachées. La fonction ReLU est une fonction d'activation non linéaire qui prend en entrée un nombre réel et renvoie 0 si l'entrée est négative, et l'entrée elle-même si elle est positive.

La fonction ReLU est une choix populaire pour les couches cachées car elle est simple à mettre en œuvre, rapide à calculer et permet de capturer des modèles non linéaires dans les données.

**Autres choix de conception**

Il existe de nombreux autres choix de conception qui pourraient être pris en compte lors de la mise en œuvre d'un réseau neuronal pour l'apprentissage par renforcement. Voici quelques exemples :

- La fonction de perte : j'ai choisi la fonction de perte MSE (Mean Squared Error) pour ce réseau neuronal. D'autres fonctions de perte, telles que la fonction de perte de cross-entropie, pourraient être utilisées pour des problèmes de classification.
- L'algorithme d'optimisation : j'ai choisi l'algorithme d'optimisation Adam pour ce réseau neuronal. D'autres algorithmes d'optimisation, tels que l'algorithme de gradient descendant, pourraient être utilisés pour entraîner le réseau.
- La taille de l'ensemble d'entraînement : j'ai choisi de mettre en œuvre un ensemble d'entraînement de 1000 épisodes pour ce réseau neuronal. La taille de l'ensemble d'entraînement affecte la qualité de l'apprentissage et la généralisation du réseau.

En résumé, les choix de conception pour ce réseau neuronal sont les suivants :

- Nombre de neurones dans la couche d'entrée : 4
- Nombre de neurones dans les couches cachées : 64
- Nombre de couches : 2
- Fonction d'activation : ReLU
- Fonction de perte : MSE
- Algorithme d'optimisation : Adam
- Taille de l'ensemble d'entraînement : 1000 épisodes

Ces choix de conception sont arbitraires et pourraient être modifiés pour améliorer les performances du réseau neuronal.
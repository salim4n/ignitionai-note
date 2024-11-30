---
title : Modes d'exécution
description : Modes d'exécution
---

En TensorFlow, il existe deux modes principaux d'exécution : le mode basé sur les graphes (graph-based execution) et le mode d'exécution immédiate (eager execution). Chacun de ces modes a ses propres avantages et inconvénients, et ils sont utilisés dans différents contextes en fonction des besoins spécifiques de l'utilisateur.

### Mode basé sur les graphes (Graph-Based Execution)

### Description

Dans le mode basé sur les graphes, les opérations TensorFlow sont définies en tant que nœuds dans un graphe de calcul. Ce graphe représente le flux de données et les dépendances entre les opérations. Le graphe est ensuite exécuté dans une session TensorFlow, où les opérations sont évaluées dans l'ordre défini par le graphe.

### Avantages

1. **Optimisation** : Le mode basé sur les graphes permet à TensorFlow d'optimiser le graphe de calcul avant l'exécution. Cela peut inclure des optimisations telles que la fusion d'opérations, l'élimination des opérations redondantes, et la parallélisation des calculs.
2. **Distribution** : Le mode basé sur les graphes est bien adapté pour l'exécution distribuée sur plusieurs dispositifs (CPU, GPU, TPU) ou machines. Les opérations peuvent être placées sur différents dispositifs pour maximiser l'utilisation des ressources.
3. **Portabilité** : Les graphes peuvent être sauvegardés et exécutés sur différentes plateformes, ce qui facilite le déploiement des modèles.

### Inconvénients

1. **Débogage** : Le débogage des graphes de calcul peut être plus difficile, car les opérations ne sont pas exécutées immédiatement. Les erreurs peuvent être plus difficiles à diagnostiquer.
2. **Complexité** : La construction et la gestion des graphes peuvent être plus complexes, surtout pour les utilisateurs débutants.

### Exemple

```python
import tensorflow as tf

# Créer un graphe de calcul
a = tf.constant(5)
b = tf.constant(3)
c = tf.add(a, b)

# Créer une session et exécuter le graphe
with tf.Session() as sess:
    result = sess.run(c)
    print(result)  # Output: 8

```

### Mode d'exécution immédiate (Eager Execution)

### Description

Dans le mode d'exécution immédiate, les opérations TensorFlow sont exécutées immédiatement lorsqu'elles sont définies. Cela signifie que chaque opération est évaluée dès qu'elle est appelée, sans avoir besoin de construire un graphe de calcul.

### Avantages

1. **Débogage** : Le mode d'exécution immédiate facilite le débogage, car les opérations sont exécutées immédiatement et les erreurs peuvent être diagnostiquées plus facilement.
2. **Simplicité** : Le mode d'exécution immédiate est plus intuitif et plus facile à utiliser, surtout pour les utilisateurs débutants. Il permet une programmation plus interactive et plus flexible.
3. **Compatibilité** : Le mode d'exécution immédiate est plus compatible avec les outils de débogage et de visualisation Python standard.

### Inconvénients

1. **Optimisation** : Le mode d'exécution immédiate peut ne pas bénéficier des mêmes optimisations que le mode basé sur les graphes, ce qui peut entraîner des performances légèrement inférieures.
2. **Distribution** : Le mode d'exécution immédiate peut être moins bien adapté pour l'exécution distribuée sur plusieurs dispositifs ou machines.

### Exemple

```python
import tensorflow as tf

# Activer le mode d'exécution immédiate
tf.config.experimental_run_functions_eagerly(True)

# Exécuter des opérations immédiatement
a = tf.constant(5)
b = tf.constant(3)
c = tf.add(a, b)

print(c.numpy())  # Output: 8
```

### Comparaison

| Caractéristique | Mode basé sur les graphes (Graph-Based Execution) | Mode d'exécution immédiate (Eager Execution) |
| --- | --- | --- |
| **Exécution** | Les opérations sont définies dans un graphe et exécutées dans une session. | Les opérations sont exécutées immédiatement lorsqu'elles sont définies. |
| **Optimisation** | Permet des optimisations de graphe avant l'exécution. | Moins d'optimisations de graphe. |
| **Débogage** | Plus difficile à déboguer. | Plus facile à déboguer. |
| **Complexité** | Plus complexe à utiliser. | Plus simple et intuitif. |
| **Distribution** | Bien adapté pour l'exécution distribuée. | Moins bien adapté pour l'exécution distribuée. |
| **Portabilité** | Les graphes peuvent être sauvegardés et exécutés sur différentes plateformes. | Moins de portabilité pour les graphes. |

### Conclusion

Le choix entre le mode basé sur les graphes et le mode d'exécution immédiate dépend des besoins spécifiques de l'utilisateur. Le mode basé sur les graphes est généralement utilisé pour les applications de production où les performances et l'optimisation sont critiques, tandis que le mode d'exécution immédiate est plus adapté pour le développement interactif et le débogage. TensorFlow 2.x a adopté le mode d'exécution immédiate par défaut pour simplifier l'utilisation et améliorer l'expérience de développement.
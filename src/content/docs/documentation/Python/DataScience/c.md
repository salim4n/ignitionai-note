---
title: Qu'est-ce que le Clustering k-means ?
description: Qu'est-ce que le Clustering k-means ?
---

Le **clustering k-means** est une méthode d'apprentissage non supervisée qui permet de regrouper des données en plusieurs clusters (ou groupes) sur la base de leur similarité. C’est une technique courante dans le cadre de la théorie des machines pour analyser et segmenter des jeux de données.

### 1. **Comprendre le Clustering k-means**

Le **k-means** est un algorithme itératif qui divise un ensemble de données en **k groupes distincts**. Chaque groupe est formé de manière à ce que les points à l’intérieur d’un même cluster soient plus similaires entre eux qu’aux points des autres clusters.

Voici les principales étapes de l'algorithme k-means :

1. **Choisir un nombre de clusters, k**.
2. **Initialiser k centroides** aléatoirement (les centres des clusters).
3. **Attribuer chaque point de données** au centroïde le plus proche (en utilisant une mesure de distance, typiquement la distance euclidienne).
4. **Mettre à jour les centroides** : recalculer la position des centroïdes en prenant la moyenne des points de chaque cluster.
5. Répéter les étapes 3 et 4 jusqu'à convergence (c'est-à-dire que les positions des centroïdes ne changent plus ou que les changements deviennent négligeables).

### 2. **Application du k-means dans un notebook Jupyter**

Voici comment mettre en œuvre un clustering k-means en Python en utilisant **Scikit-learn** et **Matplotlib** pour visualiser les clusters.

### a) **Installation des packages nécessaires**

```python
!pip install numpy pandas scikit-learn matplotlib

```

### b) **Chargement des données**

Nous allons commencer par créer ou charger un ensemble de données. Par exemple, nous utiliserons un jeu de données fictif pour illustrer.

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import make_blobs

# Générer des données factices avec 3 clusters
X, y = make_blobs(n_samples=300, centers=3, cluster_std=0.60, random_state=0)

# Visualiser les points
plt.scatter(X[:, 0], X[:, 1])
plt.title('Données factices')
plt.show()

```

### c) **Exécuter l'algorithme k-means**

Ensuite, nous utiliserons l'algorithme k-means pour regrouper les points en trois clusters.

```python
from sklearn.cluster import KMeans

# Définir le nombre de clusters
kmeans = KMeans(n_clusters=3)

# Ajuster le modèle k-means aux données
kmeans.fit(X)

# Prédire les clusters pour chaque point
y_kmeans = kmeans.predict(X)

# Visualiser les clusters
plt.scatter(X[:, 0], X[:, 1], c=y_kmeans, cmap='viridis')

# Visualiser les centroides
centroids = kmeans.cluster_centers_
plt.scatter(centroids[:, 0], centroids[:, 1], s=300, c='red', marker='x')
plt.title('Clusters et Centroides')
plt.show()

```

### d) **Interpréter les résultats**

Les **clusters** sont représentés par différentes couleurs, et les **centroides** (points rouges en "X") sont les centres des groupes détectés. L'algorithme k-means regroupe les points similaires dans des clusters, permettant ainsi de mieux comprendre la structure des données.

### e) **Choisir le bon nombre de clusters (méthode du coude)**

Un défi courant avec k-means est de déterminer la bonne valeur de **k**. La méthode du **coude** est une technique courante pour cela. Elle consiste à exécuter k-means pour différents nombres de clusters et à tracer la somme des distances au carré entre les points et leur centroïde (l’inertie). Le "coude" dans le graphique indique le bon nombre de clusters.

```python
inertia = []
for k in range(1, 10):
    kmeans = KMeans(n_clusters=k)
    kmeans.fit(X)
    inertia.append(kmeans.inertia_)

# Tracer le graphique de la méthode du coude
plt.plot(range(1, 10), inertia, 'bx-')
plt.xlabel('Nombre de clusters')
plt.ylabel('Inertie')
plt.title('Méthode du coude')
plt.show()

```

Dans ce graphique, le "coude" indique le nombre optimal de clusters (k) à choisir.

### 3. **Application concrète du k-means dans un contexte MLOps**

Le clustering k-means est largement utilisé dans des applications **MLOps** pour segmenter des ensembles de données et pour diverses tâches comme :

- **Segmentation de la clientèle** : Regrouper les clients en fonction de comportements d'achat similaires.
- **Détection d'anomalies** : En modélisant des groupes normaux, les points qui tombent loin des clusters peuvent être détectés comme anomalies.
- **Prétraitement des données** : En identifiant des clusters dans les données, vous pouvez fournir des fonctionnalités supplémentaires pour améliorer les modèles de Machine Learning supervisé.

### 4. **Considérations supplémentaires**

- **Sensibilité aux données initiales** : Les clusters initiaux (centroides) sont choisis aléatoirement, donc différentes exécutions de k-means peuvent donner des résultats légèrement différents. Utiliser **k-means++** est une méthode d'initialisation qui améliore la convergence.
- **Forme des clusters** : k-means fonctionne mieux avec des clusters sphériques (basés sur la distance euclidienne). Pour des formes de clusters plus complexes, des algorithmes comme **DBSCAN** ou **Mean Shift** peuvent être plus appropriés.

---

### Conclusion

L'**algorithme k-means** est un outil simple mais puissant pour le **clustering** et la **segmentation des données**. En comprenant les concepts fondamentaux du clustering et en mettant en pratique l’algorithme avec des outils comme **Scikit-learn** et **Jupyter Notebooks**, vous pouvez l’appliquer à divers cas d’usage en Data Science et MLOps, comme la segmentation de clients, la détection d’anomalies, et la réduction de dimensionnalité.

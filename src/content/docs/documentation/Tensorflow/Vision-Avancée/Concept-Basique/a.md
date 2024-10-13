---
title : localisation vs détection
description : Concept basique
---

### Introduction

Dans le domaine de la vision par ordinateur, la localisation d'objets et la détection d'objets sont deux tâches fondamentales mais distinctes. Comprendre la différence entre ces deux concepts est crucial pour aborder des problèmes plus complexes en vision par ordinateur.

### Localisation d'objets

La localisation d'objets consiste à identifier la position d'un objet spécifique dans une image. Cette tâche implique généralement de déterminer les coordonnées d'une boîte englobante (bounding box) autour de l'objet. La localisation d'objets est souvent utilisée dans des applications où l'on s'intéresse à la position d'un objet particulier, comme la reconnaissance de visages ou la détection de véhicules.

### Exemple de localisation d'objets

Supposons que nous avons une image contenant un chat. La tâche de localisation d'objets consisterait à déterminer les coordonnées de la boîte englobante autour du chat.

```python
import tensorflow as tf
import matplotlib.pyplot as plt

# Charger une image contenant un chat
image_path = 'path_to_cat_image.jpg'
image = tf.io.read_file(image_path)
image = tf.image.decode_jpeg(image)

# Afficher l'image
plt.imshow(image)
plt.axis('off')
plt.show()

# Coordonnées de la boîte englobante autour du chat (exemple)
bbox = [100, 150, 300, 350]  # [xmin, ymin, xmax, ymax]

# Dessiner la boîte englobante sur l'image
fig, ax = plt.subplots(1)
ax.imshow(image)
rect = plt.Rectangle((bbox[0], bbox[1]), bbox[2]-bbox[0], bbox[3]-bbox[1], linewidth=2, edgecolor='r', facecolor='none')
ax.add_patch(rect)
plt.axis('off')
plt.show()

```

### Détection d'objets

La détection d'objets, en revanche, consiste à identifier et à localiser plusieurs objets dans une image. Cette tâche implique non seulement de déterminer les coordonnées des boîtes englobantes autour des objets, mais aussi de classer ces objets en différentes catégories. La détection d'objets est utilisée dans des applications où l'on s'intéresse à la présence et à la position de plusieurs objets, comme la surveillance vidéo ou la conduite autonome.

### Exemple de détection d'objets

Supposons que nous avons une image contenant plusieurs objets, comme des voitures, des piétons et des vélos. La tâche de détection d'objets consisterait à déterminer les coordonnées des boîtes englobantes autour de chaque objet et à classer ces objets en différentes catégories.

```python
import tensorflow as tf
import matplotlib.pyplot as plt

# Charger une image contenant plusieurs objets
image_path = 'path_to_multi_object_image.jpg'
image = tf.io.read_file(image_path)
image = tf.image.decode_jpeg(image)

# Afficher l'image
plt.imshow(image)
plt.axis('off')
plt.show()

# Coordonnées des boîtes englobantes autour des objets (exemple)
bboxes = [
    [100, 150, 300, 350],  # Voiture
    [400, 200, 550, 300],  # Piéton
    [600, 100, 700, 200]   # Vélo
]

# Dessiner les boîtes englobantes sur l'image
fig, ax = plt.subplots(1)
ax.imshow(image)
for bbox in bboxes:
    rect = plt.Rectangle((bbox[0], bbox[1]), bbox[2]-bbox[0], bbox[3]-bbox[1], linewidth=2, edgecolor='r', facecolor='none')
    ax.add_patch(rect)
plt.axis('off')
plt.show()

```

### Comparaison entre la localisation d'objets et la détection d'objets

| Localisation d'objets | Détection d'objets |
| --- | --- |
| Identifie la position d'un objet spécifique | Identifie et localise plusieurs objets |
| Détermine les coordonnées d'une boîte englobante autour de l'objet | Détermine les coordonnées des boîtes englobantes autour des objets et classe ces objets |
| Utilisé pour des applications où l'on s'intéresse à la position d'un objet particulier | Utilisé pour des applications où l'on s'intéresse à la présence et à la position de plusieurs objets |

### Conclusion

La localisation d'objets et la détection d'objets sont deux tâches fondamentales en vision par ordinateur. La localisation d'objets se concentre sur la détermination de la position d'un objet spécifique, tandis que la détection d'objets implique l'identification et la localisation de plusieurs objets dans une image. Comprendre la différence entre ces deux concepts est crucial pour aborder des problèmes plus complexes en vision par ordinateur.
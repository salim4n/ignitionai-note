---
title : segmentation d'instances vs segmentation sémantique
description : Concept basique
---

Dans le domaine de la vision par ordinateur, la segmentation sémantique et la segmentation d'instances sont deux tâches fondamentales mais distinctes. Comprendre la différence entre ces deux concepts est crucial pour aborder des problèmes plus complexes en vision par ordinateur.

## Segmentation sémantique

La segmentation sémantique consiste à diviser une image en segments ou régions distinctes, où chaque segment correspond à une classe d'objet spécifique. L'objectif est de classer chaque pixel de l'image en une catégorie prédéfinie. Par exemple, dans une image de rue, chaque pixel peut être classé comme appartenant à une voiture, à un piéton, à la route, etc.

### Exemple de segmentation sémantique

Supposons que nous avons une image contenant plusieurs objets, comme des voitures, des piétons et des vélos. La tâche de segmentation sémantique consisterait à produire un masque de pixels où chaque pixel est étiqueté avec la classe de l'objet auquel il appartient.

```python
import tensorflow as tf
import matplotlib.pyplot as plt
import numpy as np

# Charger une image contenant plusieurs objets
image_path = 'path_to_multi_object_image.jpg'
image = tf.io.read_file(image_path)
image = tf.image.decode_jpeg(image)

# Afficher l'image
plt.imshow(image)
plt.axis('off')
plt.show()

# Masque de segmentation sémantique (exemple)
semantic_mask = np.zeros_like(image[:,:,0])
semantic_mask[100:300, 150:350] = 1  # Voiture
semantic_mask[400:550, 200:300] = 2  # Piéton
semantic_mask[600:700, 100:200] = 3  # Vélo

# Afficher le masque de segmentation sémantique
plt.imshow(semantic_mask, cmap='jet')
plt.axis('off')
plt.show()

```

## Segmentation d'instances

La segmentation d'instances, en revanche, consiste à identifier et à segmenter chaque instance individuelle d'une classe d'objet dans une image. L'objectif est de délimiter précisément les contours de chaque objet individuel et de les distinguer les uns des autres. Par exemple, dans une image de rue, chaque voiture, chaque piéton et chaque vélo serait segmenté et identifié individuellement.

### Exemple de segmentation d'instances

Supposons que nous avons une image contenant plusieurs objets, comme des voitures, des piétons et des vélos. La tâche de segmentation d'instances consisterait à produire des masques de pixels où chaque masque correspond à une instance individuelle d'un objet.

```python
import tensorflow as tf
import matplotlib.pyplot as plt
import numpy as np

# Charger une image contenant plusieurs objets
image_path = 'path_to_multi_object_image.jpg'
image = tf.io.read_file(image_path)
image = tf.image.decode_jpeg(image)

# Afficher l'image
plt.imshow(image)
plt.axis('off')
plt.show()

# Masques de segmentation d'instances (exemple)
instance_masks = [
    np.zeros_like(image[:,:,0]),  # Masque pour la première voiture
    np.zeros_like(image[:,:,0]),  # Masque pour le premier piéton
    np.zeros_like(image[:,:,0])   # Masque pour le premier vélo
]

instance_masks[0][100:300, 150:350] = 1  # Première voiture
instance_masks[1][400:550, 200:300] = 2  # Premier piéton
instance_masks[2][600:700, 100:200] = 3  # Premier vélo

# Afficher les masques de segmentation d'instances
fig, ax = plt.subplots(1, len(instance_masks), figsize=(15, 5))
for i, mask in enumerate(instance_masks):
    ax[i].imshow(mask, cmap='jet')
    ax[i].axis('off')
plt.show()

```

## Comparaison entre la segmentation sémantique et la segmentation d'instances

| Segmentation sémantique | Segmentation d'instances |
| --- | --- |
| Divise l'image en segments ou régions distinctes correspondant à des classes d'objets spécifiques | Identifie et segmente chaque instance individuelle d'une classe d'objet |
| Classe chaque pixel de l'image en une catégorie prédéfinie | Délimite précisément les contours de chaque objet individuel et les distingue les uns des autres |
| Utilisé pour des applications où l'on s'intéresse à la classification de chaque pixel | Utilisé pour des applications où l'on s'intéresse à l'identification et à la segmentation de chaque instance individuelle d'un objet |

## Conclusion

La segmentation sémantique et la segmentation d'instances sont deux tâches fondamentales en vision par ordinateur. La segmentation sémantique se concentre sur la classification de chaque pixel de l'image en une catégorie prédéfinie, tandis que la segmentation d'instances implique l'identification et la segmentation de chaque instance individuelle d'un objet. Comprendre la différence entre ces deux concepts est crucial pour aborder des problèmes plus complexes en vision par ordinateur.

Dans les cours suivants, nous explorerons des techniques avancées pour la segmentation sémantique et la segmentation d'instances, ainsi que des applications pratiques de ces concepts.
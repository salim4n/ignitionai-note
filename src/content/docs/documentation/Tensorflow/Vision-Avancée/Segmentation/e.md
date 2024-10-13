---
title : Métriques de performance
description : Métriques de performance
---

Lorsqu'on évalue un modèle de **segmentation d'images**, il est essentiel d'utiliser des métriques qui reflètent précisément la qualité des prédictions. Deux des métriques les plus utilisées pour cette tâche sont l'**Intersection over Union (IoU)** et le **Dice Score**. Ces métriques permettent de comparer les zones segmentées par le modèle avec les annotations correctes (ground truth) afin de mesurer la performance.

---

### **1. Intersection over Union (IoU)**

### **Définition :**

L'**Intersection over Union (IoU)**, parfois appelée **Jaccard Index**, mesure la similarité entre la prédiction et la vérité terrain (ground truth). Cette métrique est largement utilisée dans la segmentation d'objets et la segmentation sémantique.

Elle se calcule en divisant la **zone d'intersection** entre les pixels prédits et les pixels réels par la **zone d'union** de ces deux ensembles. Cela permet de quantifier la mesure dans laquelle les zones segmentées par le modèle se chevauchent avec les zones attendues.

### **Formule IoU** :

\[
IoU = \frac{|A \cap B|}{|A \cup B|}
\]
Où :

- \( A \) est l'ensemble des pixels de la prédiction.
- \( B \) est l'ensemble des pixels de la vérité terrain.
- \( |A \cap B| \) est l'intersection des pixels prédits et des pixels attendus.
- \( |A \cup B| \) est l'union des pixels prédits et des pixels attendus.

### **Exemple** :

Imaginons que le modèle prédit un masque de segmentation et que l'annotation correcte couvre 80 pixels. Si 60 de ces pixels prédits sont corrects (c'est-à-dire présents dans l'annotation), et que le modèle prédit 100 pixels en tout, l'IoU sera :
\[
IoU = \frac{60}{(100 + 80 - 60)} = \frac{60}{120} = 0.5
\]

Un IoU de 0.5 signifie que 50% de la zone totale de l'union est correctement prédite par le modèle.

### **Avantages et inconvénients** :

- **Avantages** : Simple à interpréter, particulièrement utile pour évaluer la précision des prédictions sur des objets distincts dans une image.
- **Inconvénients** : Peut être trop sévère si les prédictions ont une faible intersection avec le ground truth, surtout lorsque les objets sont petits.

### **Exemple d'implémentation d'IoU en TensorFlow :**

```python
import tensorflow as tf

def iou_score(y_true, y_pred, smooth=1e-6):
    # Convertir les prédictions et les labels en booléens (0 ou 1)
    y_true = tf.cast(y_true, tf.float32)
    y_pred = tf.cast(tf.round(y_pred), tf.float32)

    # Intersection entre les pixels prédits et ceux du ground truth
    intersection = tf.reduce_sum(y_true * y_pred)

    # Union entre les pixels prédits et ceux du ground truth
    union = tf.reduce_sum(y_true) + tf.reduce_sum(y_pred) - intersection

    # Calcul de l'IoU
    iou = (intersection + smooth) / (union + smooth)

    return iou

```

---

### **2. Dice Score (Dice Coefficient)**

### **Définition :**

Le **Dice Score** (ou **Dice Coefficient**, parfois appelé **F1 Score pour la segmentation**) est une autre métrique qui mesure la similarité entre la prédiction et la vérité terrain. Contrairement à l'IoU, il met davantage l'accent sur l'**équilibre entre la précision et le rappel** (comme le F1-Score en classification).

### **Formule du Dice Score** :

\[
\text{Dice} = \frac{2 \times |A \cap B|}{|A| + |B|}
\]
Où :

- \( A \) est l'ensemble des pixels de la prédiction.
- \( B \) est l'ensemble des pixels de la vérité terrain.
- \( |A \cap B| \) est l'intersection des deux ensembles.

### **Exemple** :

Si le modèle prédit 100 pixels comme appartenant à une classe, et que 80 de ces pixels sont corrects par rapport aux 80 pixels annotés dans le ground truth, le Dice Score sera :
\[
\text{Dice} = \frac{2 \times 80}{100 + 80} = \frac{160}{180} \approx 0.89
\]
Ce score est plus indulgent que l'IoU dans ce cas, car il accorde plus d'importance à l'intersection relative à la somme des pixels prédits et réels.

### **Avantages et inconvénients** :

- **Avantages** : Le Dice Score est souvent plus élevé que l'IoU pour des prédictions proches mais imparfaites, ce qui peut être utile dans des applications où la précision doit être valorisée.
- **Inconvénients** : Il est moins intuitif que l'IoU, et peut être moins sensible aux erreurs pour de petits objets segmentés.

### **Exemple d'implémentation du Dice Score en TensorFlow :**

```python
def dice_score(y_true, y_pred, smooth=1e-6):
    # Convertir les prédictions et les labels en booléens (0 ou 1)
    y_true = tf.cast(y_true, tf.float32)
    y_pred = tf.cast(tf.round(y_pred), tf.float32)

    # Intersection entre les pixels prédits et ceux du ground truth
    intersection = tf.reduce_sum(y_true * y_pred)

    # Calcul du Dice Score
    dice = (2. * intersection + smooth) / (tf.reduce_sum(y_true) + tf.reduce_sum(y_pred) + smooth)

    return dice

```

---

### **3. Comparaison entre IoU et Dice Score**

| **Caractéristique** | **Intersection over Union (IoU)** | **Dice Score** |
| --- | --- | --- |
| **Formule** | \( \frac{ | A \cap B |
| **Sensibilité** | Plus sensible aux erreurs de petite intersection | Plus indulgent dans les petites erreurs |
| **Interprétation** | Mesure la proportion d'intersection sur l'union | Mesure la similarité globale (précision et rappel) |
| **Range des valeurs** | [0, 1], 1 étant parfait | [0, 1], 1 étant parfait |
| **Utilisation** | Couramment utilisé pour l'évaluation de la segmentation d'objets | Utile pour évaluer la segmentation de petites régions |
| **Rigueur** | Plus strict | Moins strict, favorise les résultats "proches" |

---

### **4. Cas pratique : Évaluation d'un modèle de segmentation**

Imaginons que vous ayez entraîné un modèle de segmentation sur un dataset et que vous souhaitez évaluer sa performance à l'aide de l'IoU et du Dice Score.

### **Exemple d'évaluation en TensorFlow** :

```python
# Charger le modèle de segmentation entraîné
model = tf.keras.models.load_model('path_to_your_model')

# Prédictions sur un lot de données de test
test_images, test_labels = ...  # Charger les images et labels de test
predictions = model.predict(test_images)

# Calculer les métriques IoU et Dice Score
iou = iou_score(test_labels, predictions)
dice = dice_score(test_labels, predictions)

print(f"IoU: {iou.numpy()}")
print(f"Dice Score: {dice.numpy()}")

```

Dans cet exemple, nous utilisons le modèle prédit pour calculer les scores IoU et Dice sur les données de test. Ces scores permettent d'évaluer la qualité de la segmentation produite par le modèle sur des exemples non vus.

---

### **Conclusion**

- L'**Intersection over Union (IoU)** et le **Dice Score** sont des métriques essentielles pour évaluer les modèles de segmentation.
- L'IoU est rigoureux, mesurant la proportion d'intersection sur l'union, et est souvent utilisé pour des tâches nécessitant des prédictions très précises.
- Le **Dice Score** est plus indulgent dans les petites erreurs et met l'accent sur l'équilibre entre la précision et le rappel.

Ces deux métriques sont complémentaires, et il est souvent recommandé de les utiliser conjointement pour obtenir une évaluation complète de la performance d'un modèle de segmentation.
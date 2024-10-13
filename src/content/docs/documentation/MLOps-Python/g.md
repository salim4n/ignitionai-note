---
title: Utilisation des GPUs pour MLOps
description: Utilisation des GPUs pour MLOps
---

Apprendre à exploiter les **GPUs pour MLOps** est crucial, car les GPU permettent d'accélérer le calcul intensif nécessaire à l'entraînement et à l'inférence des modèles de machine learning, particulièrement pour des tâches impliquant de grandes quantités de données et des réseaux neuronaux profonds. L'utilisation efficace des GPU dans un pipeline de MLOps permet de réduire les temps d'exécution, d'améliorer l'efficacité des modèles et de faciliter le déploiement à grande échelle.

### 1. **Pourquoi utiliser les GPUs en MLOps ?**

Les **GPU** (Graphics Processing Units) sont conçus pour traiter des opérations parallèles massivement, contrairement aux **CPU** qui gèrent mieux des opérations séquentielles. Cela les rend idéaux pour les tâches ML comme :

- L'entraînement des réseaux de neurones profonds (DNNs).
- L'accélération des algorithmes d'optimisation pour l'entraînement des modèles.
- La gestion de tâches de calcul parallèle pour le prétraitement des données.

En MLOps, il est essentiel de configurer un environnement qui tire parti de cette accélération pour les étapes comme :

- L'entraînement et l'évaluation de modèles.
- L'inférence en temps réel ou en batch.
- La détection d'anomalies sur des flux de données en temps réel.

---

### 2. **Configurer les GPUs pour l'entraînement de modèles**

La première étape pour tirer parti des GPUs dans un environnement de MLOps est de configurer ton environnement. Il y a plusieurs manières de le faire, que ce soit sur des machines locales avec des GPUs NVIDIA ou dans le cloud, via des services comme **AWS**, **Google Cloud**, ou **Azure** qui offrent des instances avec des GPUs.

### a) **Vérifier la disponibilité des GPUs en local**

Pour utiliser les GPUs avec des frameworks comme **TensorFlow** ou **PyTorch**, il faut d'abord s'assurer que ton environnement dispose du support **CUDA**, l'API de calcul parallèle de NVIDIA, ainsi que des drivers appropriés.

1.  **Installer les drivers NVIDIA et CUDA Toolkit** :
    - Tu peux les installer à partir du site officiel de [NVIDIA CUDA Toolkit](https://developer.nvidia.com/cuda-toolkit).
    - Ensuite, vérifie que CUDA est bien installé :
      ```bash
      nvcc --version

      ```
2.  **Vérifier la disponibilité des GPUs avec Python et TensorFlow** :
    TensorFlow et PyTorch ont des modules intégrés pour détecter les GPUs disponibles.
        Avec **TensorFlow** :

        ```python
        import tensorflow as tf

        # Liste les GPUs disponibles
        print("GPUs disponibles : ", tf.config.list_physical_devices('GPU'))

        ```

        Avec **PyTorch** :

        ```python
        import torch

        if torch.cuda.is_available():
            print("GPU disponible :", torch.cuda.get_device_name(0))
        else:
            print("Aucun GPU trouvé")

        ```

Des services comme **Google Cloud Platform (GCP)**, **AWS**, et **Azure** permettent de provisionner des instances avec des GPUs puissants. Ces plateformes offrent des machines virtuelles spécialisées comme **NVIDIA Tesla** pour l'entraînement de modèles.

### b) **Utilisation des GPUs dans le cloud**

- **GCP** : Instances avec GPU via Google Compute Engine (GCE) ou Google AI Platform.
- **AWS** : Instances GPU EC2, comme les familles `p2` et `p3`.
- **Azure** : Machines virtuelles (VM) spécialisées avec GPU pour le ML.

Pour provisionner une instance GPU sur **AWS** avec l'AWS CLI :

```bash
aws ec2 run-instances \\
    --instance-type p3.2xlarge \\
    --image-id ami-xyz123 \\
    --count 1

```

---

### 3. **Exploiter les GPUs dans les frameworks de Machine Learning**

### a) **Utilisation des GPUs avec TensorFlow**

TensorFlow utilise automatiquement les GPU si disponibles. Pour voir un exemple concret, voici comment entraîner un modèle sur un GPU :

1.  **Installation de TensorFlow avec support GPU** :

    ```bash
    pip install tensorflow-gpu

    ```

2.  **Exemple d'entraînement de modèle avec TensorFlow sur GPU** :

    ```python
    import tensorflow as tf
    from tensorflow.keras import layers, models

    # Charger un dataset exemple (CIFAR-10)
    (train_images, train_labels), (test_images, test_labels) = tf.keras.datasets.cifar10.load_data()

    # Prétraitement simple
    train_images, test_images = train_images / 255.0, test_images / 255.0

    # Définir un modèle simple
    model = models.Sequential([
        layers.Conv2D(32, (3, 3), activation='relu', input_shape=(32, 32, 3)),
        layers.MaxPooling2D((2, 2)),
        layers.Conv2D(64, (3, 3), activation='relu'),
        layers.MaxPooling2D((2, 2)),
        layers.Flatten(),
        layers.Dense(64, activation='relu'),
        layers.Dense(10, activation='softmax')
    ])

    # Compiler le modèle
    model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])

    # Entraîner le modèle
    model.fit(train_images, train_labels, epochs=10, validation_data=(test_images, test_labels))

    ```

3.  **Contrôler l'utilisation du GPU dans TensorFlow** :
    Si tu souhaites entraîner un modèle sur un GPU spécifique, tu peux le spécifier :
        ```python
        with tf.device('/GPU:0'):
            model.fit(train_images, train_labels, epochs=10)

        ```

### b) **Utilisation des GPUs avec PyTorch**

Avec **PyTorch**, tu dois explicitement déplacer ton modèle et tes données sur le GPU.

1. **Exemple d'entraînement de modèle avec PyTorch sur GPU** :

   ```python
   import torch
   import torch.nn as nn
   import torch.optim as optim
   from torchvision import datasets, transforms

   # Charger un dataset exemple (MNIST)
   transform = transforms.Compose([transforms.ToTensor(), transforms.Normalize((0.5,), (0.5,))])
   trainset = datasets.MNIST('./data', download=True, train=True, transform=transform)
   trainloader = torch.utils.data.DataLoader(trainset, batch_size=64, shuffle=True)

   # Définir un modèle simple
   class SimpleNet(nn.Module):
       def __init__(self):
           super(SimpleNet, self).__init__()
           self.fc1 = nn.Linear(28*28, 128)
           self.fc2 = nn.Linear(128, 10)

       def forward(self, x):
           x = x.view(-1, 28*28)
           x = torch.relu(self.fc1(x))
           x = self.fc2(x)
           return x

   model = SimpleNet()

   # Déplacer le modèle sur le GPU
   device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
   model.to(device)

   # Optimizer et loss
   optimizer = optim.SGD(model.parameters(), lr=0.01)
   loss_fn = nn.CrossEntropyLoss()

   # Entraîner le modèle
   for epoch in range(10):
       for images, labels in trainloader:
           images, labels = images.to(device), labels.to(device)

           optimizer.zero_grad()
           output = model(images)
           loss = loss_fn(output, labels)
           loss.backward()
           optimizer.step()

   ```

---

### 4. **Surveillance et gestion des ressources GPU en MLOps**

L'un des aspects critiques en MLOps est de surveiller et d'optimiser l'utilisation des GPU pour éviter la sous-utilisation ou la saturation.

### a) **Surveiller l'utilisation des GPU avec `nvidia-smi`**

`nvidia-smi` est un outil en ligne de commande fourni par NVIDIA qui permet de surveiller l'utilisation des GPU en temps réel.

- **Afficher l'état des GPUs** :
  ```bash
  nvidia-smi

  ```

Cela fournit des informations comme l'utilisation de la mémoire GPU, la température, l'utilisation du GPU, et les processus en cours.

### b) **Optimisation de l'utilisation des GPU**

Certaines optimisations courantes pour maximiser l'utilisation des GPU incluent :

- **Augmenter la taille des batchs** pendant l'entraînement pour utiliser plus efficacement la mémoire du GPU.
- **Désactiver l'utilisation du GPU** pour certaines tâches si nécessaire (comme les opérations de prétraitement).
- **Utiliser des frameworks comme Horovod** pour l'entraînement distribué sur plusieurs GPUs.

---

### 5. **Exploiter les GPUs dans un pipeline MLOps automatisé**

Dans un pipeline MLOps, tu souhaites intégrer l'utilisation des GPU dans un processus automatisé de CI/CD. Cela inclut :

- Lancer automatiquement des scripts d'entraînement sur des machines avec GPU.
- Déployer des modèles entraînés avec GPU sur des serveurs dédiés à l'inférence rapide (par exemple, déployer des modèles sur des instances GPU avec des APIs HTTP).

Par exemple, avec un pipeline CI/CD, tu peux configurer des scripts pour lancer l'entraînement sur un GPU automatiquement à chaque mise à jour du code.

```yaml
# Exemple de configuration CI/CD avec GitLab pour entraîner sur GPU
stages:
  - train

train_model:
  stage: train
  image: tensorflow/tensorflow:latest-gpu

  script:
    - python train.py --epochs 10 --model_output 'model.pkl'
```

---

### Conclusion

Exploiter les **GPUs en MLOps** permet de réduire le temps de calcul pour les modèles de machine learning complexes. Que ce soit en utilisant des frameworks comme TensorFlow ou PyTorch, ou en configurant des pipelines automatisés avec des instances GPU dans le cloud, il est essentiel de bien comprendre comment configurer, surveiller et optimiser l'utilisation des GPUs pour maximiser l'efficacité du pipeline ML.

Les prochaines étapes consistent à approfondir ces concepts, à configurer des instances GPU en production, et à intégrer ces configurations dans un pipeline automatisé de CI/CD pour des workflows MLOps optimisés.

---
title: 🚀 ONNX Runtime  Le Couteau Suisse du Déploiement ML
description: 🚀 ONNX Runtime  Le Couteau Suisse du Déploiement ML
---

Pourquoi ONNX Runtime est devenu incontournable pour le déploiement de modèles ML en production ! 🧵

## 1. 🌐 ONNX Runtime Web

**WebAssembly Power**

- Performance proche du natif
- Support CPU avec SIMD
- Chargement optimisé des modèles
- Utilisation efficace de la mémoire

**Intégration Web**

- Support React/Vue/Angular
- API JavaScript intuitive
- Workers pour non-blocage du thread principal
- Progressive loading des modèles

## 2.📱ONNX Runtime Mobile

**Optimisations iOS**

- Support CoreML backend
- Integration Metal API
- Optimisations ARM64
- AOT compilation support
- Optimisations Android

**Support NNAPI backend**

- Optimisations ARM Mali GPU
- Snapdragon GPU support
- Integration Android NDK

## 3.☁️ ONNX Runtime Cloud

**Optimisations Serveur**

- Multi-threading optimisé
- Support CUDA/ROCm/DirectML
- Batch processing intelligent
- Memory management avancé

**Déploiement**

- API REST native
- Support gRPC
- Monitoring intégré
- Auto-tuning des paramètres

## 4.🖥️ ONNX Runtime Edge

**Optimisations Hardware**

- Support CPU (x86/ARM)
- Support GPU embarqué
- Accélérateurs ML dédiés
- DSP support

**Fonctionnalités Edge**

- Empreinte mémoire minimale
- Quantification dynamique
- Exécution offline
- Profiling intégré

🛠️ Fonctionnalités Transversales

**Optimisations Automatiques**

- Fusion des opérateurs
- Élimination de code mort
- Layout optimisation
- Memory planning
- Constant folding

**Quantification**

- QDQ (Quantization-Dequantization)
- Calibration automatique
- Support INT8/FP16/BF16
- Quantification par opérateur

**Formats Supportés**

- PyTorch export direct
- TensorFlow conversion
- Keras export
- scikit-learn pipeline
- RAPIDS (cuML)

## 💡 Points Forts

**Performance**

- Optimisations spécifiques par plateforme
- Réduction automatique de latence
- Gestion mémoire optimale

**Compatibilité**

- Support multi-frameworks
- Conversion bidirectionnelle
- Versions stables par plateforme

**Extensibilité**

- Custom operators
- Custom execution providers
- Graph transformations personnalisées

## 🔧 Tips d'Utilisation

**Utilisez SessionOptions pour configurer :**

- Nombre de threads
- Providers d'exécution
- Optimisation graph
- Allocation mémoire

**Optimisez vos inputs :**

- Batch processing
- Memory pinning
- Input binding
- Shape inference

**Monitoring :**

- Profiling intégré
- Métriques de performance
- Analyse des bottlenecks
- Memory tracking

## 💻 Exemples d'initialisation dans différents langages

**Python** :

```python
import onnxruntime as ort

# Configuration optimisée
sess_options = ort.SessionOptions()
sess_options.graph_optimization_level = ort.GraphOptimizationLevel.ORT_ENABLE_ALL
sess_options.optimized_model_filepath = "optimized_model.onnx"

# Sélection providers
providers = [
    ('CUDAExecutionProvider', {
        'device_id': 0,
        'arena_extend_strategy': 'kNextPowerOfTwo',
    }),
    'CPUExecutionProvider'
]

# Création session
session = ort.InferenceSession("model.onnx",
                             sess_options=sess_options,
                             providers=providers)
```

**TypeScript** :

```typescript
import * as ort from "onnxruntime-web"

async function initializeONNXModel() {
  try {
    // Configuration des options
    const options: ort.InferenceSession.SessionOptions = {
      executionProviders: ["wasm"],
      graphOptimizationLevel: "all",
      enableCpuMemArena: true,
      executionMode: "sequential",
    }

    // Création de la session
    const session = await ort.InferenceSession.create("model.onnx", options)

    // Préparation des données d'entrée
    const inputTensor = new ort.Tensor(
      "float32",
      new Float32Array([
        /* vos données */
      ]),
      [1, 3, 224, 224] // exemple de shape pour une image
    )

    // Inférence
    const results = await session.run({
      input: inputTensor,
    })

    return results
  } catch (error) {
    console.error("ONNX Runtime erreur:", error)
    throw error
  }
}
```

**C#** :

```csharp
using Microsoft.ML.OnnxRuntime;
using Microsoft.ML.OnnxRuntime.Tensors;

public class ONNXModelRunner
{
    private InferenceSession _session;

    public ONNXModelRunner(string modelPath)
    {
        // Configuration des options
        var sessionOptions = new SessionOptions();
        sessionOptions.GraphOptimizationLevel = GraphOptimizationLevel.ORT_ENABLE_ALL;

        // Configuration des providers d'exécution
        sessionOptions.AppendExecutionProvider_CUDA();
        sessionOptions.AppendExecutionProvider_CPU();

        // Initialisation de la session
        _session = new InferenceSession(modelPath, sessionOptions);
    }

    public async Task<float[]> RunInference(float[] inputData, int[] inputShape)
    {
        try
        {
            // Création du tenseur d'entrée
            var tensor = new DenseTensor<float>(inputData, inputShape);

            // Préparation des inputs
            var inputs = new List<NamedOnnxValue>
            {
                NamedOnnxValue.CreateFromTensor("input", tensor)
            };

            // Exécution de l'inférence
            using (var results = _session.Run(inputs))
            {
                // Récupération et conversion des résultats
                var outputTensor = results.First().AsTensor<float>();
                return outputTensor.ToArray();
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Erreur durant l'inférence: {ex.Message}");
            throw;
        }
    }
}
```

## 🔍 Analyse Détaillée

### 🌐 TypeScript (Web) Implementation

```typescript
import * as ort from "onnxruntime-web"

async function initializeONNXModel() {
  // Configuration
  const options: ort.InferenceSession.SessionOptions = {
    executionProviders: ["wasm"],
    graphOptimizationLevel: "all",
    enableCpuMemArena: true,
    executionMode: "sequential",
  }
  // ...
}
```

#### 📝 Points Clés TypeScript

1. **Choix du Provider (`executionProviders: ['wasm']`)** :

   - Utilise WebAssembly pour performance proche du natif
   - Alternative possible : `webgl` pour calculs GPU
   - Le provider WASM est le plus stable pour le web
   - Support SIMD si disponible dans le navigateur

2. **Optimisations** :

   ```typescript
   graphOptimizationLevel: "all" // Optimisations maximales
   enableCpuMemArena: true // Pool de mémoire réutilisable
   executionMode: "sequential" // Meilleur pour modèles simples
   ```

   - `parallel` disponible pour modèles complexes
   - Memory arena réduit la fragmentation
   - Optimisations incluent fusion d'opérateurs

3. **Gestion Tenseurs** :

   ```typescript
   const inputTensor = new ort.Tensor(
     "float32", // Type de données
     new Float32Array([
       /*...*/
     ]), // Données brutes
     [1, 3, 224, 224] // Shape (B,C,H,W)
   )
   ```

   - Support TypedArrays natif
   - Shapes validés à la création
   - Optimisé pour transferts WebGL

4. **Asynchronicité** :

   ```typescript
   const results = await session.run({
     input: inputTensor,
   })
   ```

   - Non-bloquant pour l'UI
   - Gestion propre des erreurs
   - Support Worker threads

### 🔷 C# Implementation

```csharp
using Microsoft.ML.OnnxRuntime;
using Microsoft.ML.OnnxRuntime.Tensors;

public class ONNXModelRunner
{
    private InferenceSession _session;
    // ...
}
```

#### 📝 Points Clés C Sharp

1. **Configuration Session** :

   ```csharp
   var sessionOptions = new SessionOptions();
   sessionOptions.GraphOptimizationLevel = GraphOptimizationLevel.ORT_ENABLE_ALL;

   sessionOptions.AppendExecutionProvider_CUDA();
   sessionOptions.AppendExecutionProvider_CPU();
   ```

   - Ordre des providers important (cascade)
   - CUDA prioritaire si disponible
   - Fallback automatique sur CPU
   - Optimisations natives Windows

2. **Gestion Ressources** :

   ```csharp
   using (var results = _session.Run(inputs))
   {
       var outputTensor = results.First().AsTensor<float>();
       return outputTensor.ToArray();
   }
   ```

   - Pattern `using` pour libération mémoire
   - Gestion déterministe des ressources
   - Prevention memory leaks

3. **Tenseurs Optimisés** :

   ```csharp
   var tensor = new DenseTensor<float>(inputData, inputShape);
   ```

   - Layout mémoire contigu
   - Support types génériques
   - Optimisé pour SIMD
   - Zero-copy quand possible

4. **Error Handling** :

   ```csharp
   try
   {
       // Operations...
   }
   catch (Exception ex)
   {
       Console.WriteLine($"Erreur durant l'inférence: {ex.Message}");
       throw;
   }
   ```

   - Exceptions typées
   - Logging intégré
   - Stack trace préservé

### 💡 Optimisations Avancées

#### TypeScript (Web)

1. **Chargement Modèle** :

   ```typescript
   // Préchargement
   const modelUrl = "model.onnx"
   const response = await fetch(modelUrl)
   const arrayBuffer = await response.arrayBuffer()

   // Initialisation avec buffer
   const session = await ort.InferenceSession.create(arrayBuffer, options)
   ```

2. **WebWorker Integration** :

   ```typescript
   // worker.ts
   if (ort.env.wasm.numThreads > 1) {
     ort.env.wasm.numThreads = navigator.hardwareConcurrency
   }
   ```

### C sharp

1. **CUDA Optimizations** :

   ```csharp
   sessionOptions.AppendExecutionProvider_CUDA(new CUDAExecutionProviderOptions {
       DeviceId = 0,
       ArenaExtendStrategy = ArenaExtendStrategy.NextPowerOfTwo,
       CudnnConvAlgoSearch = CudnnConvAlgoSearch.EXHAUSTIVE
   });
   ```

2. **Memory Pinning** :

   ```csharp
   using var pinned = new PinnedMemory<float>(inputData);
   var tensor = pinned.CreateTensor(inputShape);
   ```

## 🎯 Recommandations d'Usage

1. **Web (TypeScript)**

   - Utilisez `webgl` pour modèles CNNs
   - Préchargez les modèles
   - Activez SIMD si possible
   - Monitoring performance avec `Performance.now()`

2. **Desktop/Server (C#)**
   - Réutilisez les sessions
   - Profitez du multi-threading
   - Utilisez memory pinning
   - Monitoring avec ETW ou perf counters

[Contenu précédent inchangé jusqu'à la section cas d'usage...]

## 🎯 Cas d'Usage

### 1. 🌐 Web Applications

- **Vision par Ordinateur dans le Navigateur**

  - Détection d'objets en temps réel
  - Segmentation d'images côté client
  - Filtres style Instagram
  - OCR dans le navigateur

  ```typescript
  // Exemple: Inférence temps réel webcam
  const processVideoFrame = async videoElement => {
    const tensor = await imageToTensor(videoElement)
    return await session.run({ input: tensor })
  }
  ```

### 2. 📱 Applications Mobiles

- **Expériences AR/VR**
  - Face tracking
  - Hand pose estimation
  - 3D object detection
  - Style transfer en temps réel
- **Applications Offline**
  - Analyse de documents hors connexion
  - Traduction locale
  - Speech-to-text embarqué

### 3. 🏢 Entreprise

- **Migration Progressive**

  ```mermaid
  graph LR
    A[TensorFlow] --> B[ONNX]
    C[PyTorch] --> B
    D[Keras] --> B
    B --> E[Production Unifiée]
  ```

- **MLOps Standardisé**
  - Pipeline unique multi-frameworks
  - Déploiement unifié
  - Monitoring centralisé
  - A/B testing simplifié

### 4. 🔋 Edge/IoT

- **Smart Devices**
  - Reconnaissance vocale embarquée
  - Analyse vidéo en temps réel
  - Maintenance prédictive
  - Détection d'anomalies

### 5. 🚀 Cas Concrets Par Industrie

**E-commerce**

- Recherche visuelle
- Recommandations temps réel
- Sizing virtuel
- Détection de contrefaçons

**Industrie**

- Contrôle qualité visuel
- Prédiction maintenance
- Optimisation production
- Inspection automatisée

**Finance**

- Détection fraude temps réel
- Trading algorithmique
- KYC automatisé
- Analysis documents

**Santé**

- Analyse d'images médicales
- Monitoring patients
- Diagnostic assisté
- Analyse signaux vitaux

### 6. 📊 Benchmarks Types

**Vision Par Ordinateur**

```
ResNet-50
- TensorFlow: 23ms
- ONNX Runtime: 15ms
- Gain: ~35%
```

**NLP**

```
BERT-base
- PyTorch: 32ms
- ONNX Runtime: 21ms
- Gain: ~34%
```

### 7. 🎓 Points d'Attention

**Quand Utiliser**

- ✅ Besoin multi-plateformes
- ✅ Migration frameworks ML
- ✅ Optimisation performance
- ✅ Standardisation déploiement

**Quand Éviter**

- ❌ Modèles très spécifiques
- ❌ Besoins temps réel extrêmes
- ❌ Contraintes taille critiques
- ❌ Hardware très spécialisé

### 8. 🛣️ Guide Migration Type

1. Export modèle → ONNX
2. Validation équivalence
3. Optimisation spécifique
4. Tests performance
5. Déploiement graduel
6. Monitoring production

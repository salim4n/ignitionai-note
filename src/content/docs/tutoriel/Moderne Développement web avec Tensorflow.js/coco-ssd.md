---
title: Coco-SSD
description: Découverte du package @tensorflow-models/coco-ssd
---

## Introduction à la Détection d'Objets avec TensorFlow.js et React

Dans cet article, nous allons créer une application simple utilisant TensorFlow.js pour détecter des objets en temps réel via une webcam. Nous utiliserons le modèle COCO-SSD pour la détection et React pour'interface utilisateur.

## Prérequis

Avant de commencer, assurez-vous d'avoir Node.js installé sur votre machine Vous pouvez vérifier cela en exécutant `node -v` dans votre terminal. Nous utiliserons également le gestionnaire de pa npm (ou) pour gérer nos dépendances.

## Installation des Dépendances

Créez une nouvelle application React avec TypeScript et installez TensorFlow ainsi que la bibliothèque COCO-SSD pour détection d'objets :

```bash
npx create-app tfjs-object-detection --template types
cd tfjs-object-detection
npm install @tensorflow/tfjs @tensorflow-models/coco-ssd antd react-webcam

```

## Explication du Code

Voici le code complet de notre composant React. Nous allons le décortiquer partie par partie pour mieux comprendre son fonctionnement.

```tsx
import { drawRect } from "../utils/utils";
import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";
import { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import { load as cocoSSDLoad, type ObjectDetection } from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";
import { message, Row, Select, Spin } from "antd";

export default function Chapter2() {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameras, setCameras] =State([]);
  detectInterval:JS.Timer;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCamerasthen(setCameras);
  }, []);

  async function getCameras()    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter(device => device.kind === "videoinput  }

  async function runCoco() {
    // Load network
    setLoading(true    const net = await cocoSSDLoad();
    setLoading(false);
    if (net) {
      message.success("COCO-SSD model loaded successfully!");
    }

    // Loop to detect objects
    detectInterval = setInterval(() => {
      runObjectDetection(net);
    }, );
 }

  function showMyVideo() {
    if (
      webcamRef.current !== null &&
 webcamRef.current.video?.readyState === 4
    ) {
      // Get video properties
      const myVideoWidth = webcamRef.current.video.videoWidth;
      const myVideoHeight = webcamRef.current.video.videoHeight;

      // Set video width and height
      webcamRef.current.video.width = myVideoWidth;
      webcamRef.current.video.height myVideoHeight;
    }
  }

  async function runObjectDetection(net: ObjectDetection) {
    if (
      canvasRef.current &&
      webcamRef.current !== null &&
      webcamRef.current.video?.readyState === 4
    ) {
      // Set canvas height and width
      canvasRef.current.width = webcamRef.current.video.videoWidth;
      canvasRef.current.height = webcamRef.current.video.videoHeight;

      // Make detections
      const detectedObjects = await net.detect(
        webcamRef.current.video,
        undefined,
        0.5
      );

      // Draw mesh
      const context = canvasRef.current.getContext("2d");
      if (context) {
        // Update drawing utility
        drawRect(detectedObjects, context);
      }
    }
  }

  useEffect(() => {
    showMy();
    runCoco();

    return () => {
      tf.disposeVariables();
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Row>
        <Spin spinning={loading} size="large" />
        <Select
          options={cameras.map(camera => ({
            label: camera.label,
            value: cameraId,
          }))}
          onChange={value => {
            setCameras(cameras.filter(camera => camera.deviceId === value));
          }}
          placeholder="Select camera"
          style={{ marginBottom: 20, borderRadius: 10, width: 200 }}
        />
      </Row>
      <Row>
        <canvas ref={canvasRef} className="absolute"></canvas>
        <Webcam
          controls={true}
         Name="rounded-lg"
          ref={webcamRef}
          audiofalse}
        />
      </Row>
    </div>
 );
}

```

### Importation des Modules

Nous commençons par importer les modules nécessaires, tels que TensorFlow.js, le modèle COCO-SSD pour la détection d'ets, les composants d'interface utilisateur d'`antd`, et `react-webcam` pour l'accès à la webcam.

```tsx
import { drawRect } from "../utils/utils";
import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";
import { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import { load as cocoSSDLoad, type ObjectDetection } from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";
import { message Row, Select, Spin } from "antd";

```

### Initialisation des États et Références

Nous utilisons `use` pour accéder à la webcam et au canvas, et `useState` pour gérer les caméras disponibles et l'état de chargement.

```tsx
const webcamRef = use<Webcam>(null)
const canvasRef = useRef<HTMLCanvasElement>(null)
const [cameras, setCameras] = useState([])
let detectInterval: NodeJS.Timer
const [loading, setLoading] = useState(false)
```

### Récupération des Caméras

`getCameras` utilise l'API `navigator.mediaDevices` pour lister les dispositifs vidéo disponibles.

```tsx
async function getCameras() {
  const devices = await navigator.mediaDevices.enumerateDevices()
  return devices.filter(device => device.kind === "videoinput")
}
```

### Chargement du Modèle COCO-SSD

`runCoco` charge le modèle COCO-SSD et démarre une boucle de détection d'objets toutes les 500 ms.

```tsx
async function runCoco() {
 Loading(true);
  const net = await cocoSSDLoad();
  setLoading(false);
  if (net {
    message.success("COCO-SSD model successfully  }

  detectInterval = setInterval(() => {
    runObjectDetection(net);
  }, 500);
}

```

### Configuration de la Vidéo

`showMyVideo` ajuste les propriétés de la vidéo pour correspondre aux dimensions actuelles.

```tsx
function showMyVideo() {
 if (
    webcamRef.current !== null &&
    webcamRef.current.video?.readyState === 4
  ) {
    const myVideoWidth = webcamRef.current.videoWidth;
    const myVideoHeight = webcamRef.current.video.videoHeight    webcamRef.current.video.width myVideoWidth;
    webcamRef.current.video.height = myVideoHeight;
  }
}

```

### Détection d'Objets

`runObjectDetection` utilise le modèle pour détecter des objets le flux vidéo et dessine des rectangles autour des objets détectés.

```tsx
async function runObjectDetection(net: ObjectDetection) {
  if (
    canvasRef.current &&
    webcamRef.current !== null &&
    webcamRef.current.video?.readyState === 4
  ) {
    canvasRef.current.width = webcamRef.current.video.videoWidth
    canvasRef.current.height = webcamRef.current.video.videoHeight

    const detectedObjects = await net.detect(
      webcamRef.current.video,
      undefined,
      0.5
    )

    const context = canvasRef.current.getContext("2d")
    if (context) {
      drawRect(detectedObjects, context)
    }
  }
}
```

### Intégration avec React

Dans notre hook `useEffect`, nous configurons la vidéo et démarrons le modèle COCO-SSD lorsque le composant est monté.

```tsx
useEffect(() => {
  showMyVideo()
  runCoco()

  return () => {
    tf.disposeVariables()
  }
}, [])
```

### Interface Utilisateur

Nous utilisons `antd` pour afficher un indicateur de chargement et une liste déroulante pour sélectionner la caméra. Le composant `Webcam` affiche la vidéo direct, et le `canvas` superpose les détections.

```tsx
return (
  <div className="flex flex-col items-center justify-center-screen">
    <Row>
      <Spin spinningloading} size="large" />
      <Select
        options={cameras.map(camera => ({
          label: camera,
          value: camera.deviceId,
        }))}
        onChange={value => {
          setCameras(cameras.filter(camera => camera.deviceId === value));
 }}
        placeholder="Select camera"
        style={{ marginBottom: 20, borderRadius: 10, width: 200 }}
      />
    </Row>
    <Row>
      <canvas ref={canvasRef} className="absolute"></canvas>
      <Webcam controls={true}
        className="rounded-lg"
        ref={webcamRef}
        audio={false}
      />
    </Row>
  </div>
);

```

## Conclusion

Dans cet article nous avons créé une application de détection d’objets en temps réel en utilisant TensorFlow.js et React. Nous avons utilisé le modèle COCO-SSD pour détecter les à l'aide d'une webcam. Vous pouvez maintenant essayer d'ajouter des fonctionnalités supplémentaires, comme le changement de modèle ou'ajustement des paramètres de détection.

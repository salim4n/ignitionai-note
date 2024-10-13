---
title: Découverte du framework TFJS
description: Découverte du framework TFJS
---

Dans cet article, nous allons explorer comment créer votre propre système de sécurité qui utilise TensorFlow.js pour détecter la présence d'une personne dans les caméras de votre ordinateur. Cette démonstration montre comment l'intelligence artificielle peut être intégrée dans des applications web pour créer des fonctionnalités innovantes et interactives

Cette article est redigé dans le but de vous faire une première découverte et donc de s'abstraire des difficultées, mais ne vous en faites pas, le prochain article est consacré à la manipulation des tenseurs

En hébergement, j'utilise azure et vercel, libre à vous d'adapter le code pour utiliser vos hébergeurs favoris

Verisure ne passera plus jamais chez vous après cette article. 😉

### Qu'est-ce que TensorFlow.js ?

TensorFlow.js est une bibliothèque open-source qui permet d'exécuter des modèles de machine learning directement dans le navigateur ou sur Node.js.

Elle offre la possibilité de déployer des modèles entraînés avec TensorFlow sur des applications web, facilitant ainsi l'intégration de l'IA dans les applications front-end.

### Pourquoi utiliser TensorFlow.js ?

- **Simplicité** : Intégration facile dans les applications web.
- **Performance** : Exécution rapide des modèles de machine learning grâce à l'utilisation de WebGL et WebAssembly.
- **Flexibilité** : Possibilité de déployer des modèles pré-entraînés ou d'entraîner des modèles directement dans le navigateur.

## Ok et maintenant commençons

Avant toute chose il vous faut node.js, un éditeur de code et git.

Ensuite vous pouvez cloner ce projet github.
[![pretorian-system](https://img.shields.io/badge/pretorian_system-%230077B5.svg?logo=github&logoColor=white)](https://github.com/salim4n/pretorian-system)

```bash
git clone https://github.com/salim4n/pretorian-system.git
```

Vous pouvez tester l'app ici :
[![pretorian-system](https://img.shields.io/badge/pretorian_system-8A2BE2)](https://web-pretorian-system.azurewebsites.net/)

C'est une implémentation extrêmement simple d'un modèle de detection d'objet, l'objectif ? Envoyer une notification telegram à chaque detections de personne. Dans ce projet on utilise azure pour la persistance des données. Azure table pour l'utilisateur et azure blob pour le stockage des detections. Vous pouvez utiliser ce code et heberger à votre guise, de mon côté je paye **zéro euro** pour ce projet sur azure.

**C’est une application next.js avec typescript et tailwind-css.**

**Voici l’architecture du projet :**
![alt](./src/assets/arch_pretorian.webp)
**Il y'a beaucoup de code mais concentrons nous sur l'implémentation de tensorflow.js et donc du composant** `Board.tsx`

**Imports et Dépendances**

- Le code commence par importer les bibliothèques et les composants nécessaires, notamment `TensorFlow.js`, `coco-ssd` pour la détection d'objets, `react-webcam` pour accéder à la webcam, et divers composants d'interface utilisateur.

```tsx
"use client"
import "@tensorflow/tfjs-backend-cpu"
import "@tensorflow/tfjs-backend-webgl"
import { useRef, useEffect, useState } from "react"
import {
  load as cocoSSDLoad,
  type ObjectDetection,
} from "@tensorflow-models/coco-ssd"
import * as tf from "@tensorflow/tfjs"
import Webcam from "react-webcam"
import { Detected, sendPicture } from "@/app/lib/send-detection/action"
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card"
```

**Composant Board**

- Ce composant est le cœur de l'application. Il gère la détection d'objets, la capture d'images et l'affichage des caméras disponibles.
- Le composant utilise plusieurs états pour gérer les caméras disponibles (`cameras`), l'état de chaque caméra (`cameraChecked`), le modèle de détection d'objets (`net`), et l'état de chargement du modèle (`modelLoading`).
- Il utilise également une référence `webcamRefs` pour stocker les instances de `Webcam` pour chaque caméra.

```tsx
export default function Board({ user}) {
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([])
  const webcamRefs = useRef<Webcam[]>([])
  const [net, setNet] = useState<ObjectDetection | null>(null)
  const [cameraChecked, setCameraChecked] = useState<boolean[]>([])
  const [modelLoading, setModelLoading] = useState(true)
```

**Chargement du Modèle de Détection**

- La fonction `runCocoSsd()` est appelée pour charger le modèle de détection d'objets `coco-ssd` de TensorFlow.js.
- Une fois le modèle chargé, `setModelLoading(false)` est appelé pour indiquer que le chargement est terminé.

```tsx
async function runCocoSsd() {
  const loadedNet = await cocoSSDLoad()
  setNet(loadedNet)
  setModelLoading(false)
}
```

**Détection d'Objets et Capture d'Images**

- La fonction `runObjectDetection()` est appelée régulièrement (toutes les 3 secondes) pour détecter les objets dans l'image de chaque caméra activée.
- Lorsqu'une personne est détectée, la fonction `sendPicture()` est appelée pour envoyer l'image capturée et les informations de détection.

```tsx
async function runObjectDetection(net: ObjectDetection) {
  webcamRefs.current.forEach(async webcam => {
    if (webcam !== null && webcam.video?.readyState === 4) {
      const objectDetected = await net.detect(webcam.video, undefined, 0.5)
      objectDetected.forEach(async o => {
        if (o.class === "person") {
          const body = {
            detected: o,
            picture: webcam.getScreenshot({ width: 640, height: 480 }),
          }
          await sendPicture(body as Detected, user)
        }
      })
    }
  })
}
```

**Cycle de Vie et Nettoyage**

- Dans le `useEffect()` qui suit le chargement du modèle, un intervalle est défini pour appeler régulièrement `runObjectDetection()`.
- Lors du démontage du composant, l'intervalle est effacé, et les ressources TensorFlow.js sont libérées.

```tsx
useEffect(() => {
  if (net) {
    const detectInterval = setInterval(() => {
      runObjectDetection(net)
    }, 3000)

    return () => {
      clearInterval(detectInterval)
      net?.dispose()
      tf.disposeVariables()
    }
  }
}, [net])
```

**Gestion du Composant lors du chargement du modèle**

- Lorsque le modèle est en cours de chargement, un écran de chargement avec un avatar et un badge est affiché.

```tsx
if (modelLoading) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
      <Card className="m-3 z-50">
        <CardContent className="m-5">
          <div className="w-full text-center flex justify-center items-center">
            <Avatar className="w-48 h-48">
              <AvatarImage src="/icon.jpeg" />
              <AvatarFallback>PR</AvatarFallback>
            </Avatar>
            <Badge variant="default" className="mt-4">
              <strong className="ml-4">
                {modelLoading && "Chargement du modèle de reconnaissance"}
              </strong>
            </Badge>
          </div>
        </CardContent>
      </Card>
      <Card className="m-3 w-full lg:col-span-2 flex-grow">
        <CardContent>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card key={index}>
                <CardHeader>
                  <Skeleton className="w-full h-10" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="w-full h-40" />
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
```

**Affichage du Composant**

- Lorsque le modèle est chargé, le composant affiche une carte pour chaque caméra disponible, avec un interrupteur pour activer/désactiver la caméra et l'affichage de la capture vidéo.

```tsx
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
      {cameras.map((camera, index) => (
        <Card key={index} className="flex flex-col items-center mt-5">
          <CardHeader>
            <CardTitle>{camera.label}</CardTitle>
            <CardDescription>
              <div className="flex item-center">
              <Switch
                id={camera.deviceId}
                defaultChecked
                checked={cameraChecked[index]}
                onCheckedChange={(checked) => {
                  setCameraChecked((prev) => prev.map((_, i) => i === index ? checked : _))
                }}
                className="m-1 relative"
              />
               <strong>
                {
                  cameraChecked[index] ? 'On' : 'Off'
                }
               </strong>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
          {cameraChecked[index] && (
            <Webcam
              audio={false}
              videoConstraints={{
                deviceId: camera.deviceId,
              }}
              ref={(el) => {
                if (el) {
                  webcamRefs.current[index] = el
                }
              }}
              key={index}
              width={640}
              height={480}
              className='m-1 rounded-md border-gray-500 border-2'
            />
          )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
```

Vous voyez, je vous avais prévenu que nous allions commencé tout doucement 😄.

Ici, nous avons utilisé un node package manager mis à disposition pour l'inférence du modèle, nous n'avons pas à gérer manuellement les dépendances complexes ou la configuration des environnements d'exécution spécifiques à l'IA. Grâce à l'utilisation de TensorFlow.js et des packages tels que `@tensorflow-models/coco-ssd`, tout le processus d'intégration, de chargement et d'exécution du modèle se fait de manière automatisée et optimisée. Ces packages gèrent les détails sous-jacents tels que le chargement des poids du modèle, l'initialisation des tensors, et l'optimisation des calculs pour tirer parti des capacités de traitement disponible, que ce soit sur CPU ou GPU via WebGL. Cela permet de concentrer les efforts sur le développement des fonctionnalités spécifiques à l'application, comme la logique de capture d'image et la réaction aux résultats de l'inférence, plutôt que sur la gestion de l'infrastructure de machine learning.

Et voila c'est déjâ terminé, encore une fois on reste simple pour cette première découverte.

Mais je vous promet que le prochain article va être très très intéressant.

Si jamais tout cela ne vous intéresse pas mais que vous aimeriez bien utiliser des modèles *Computer Vision* dans vos projets ou même *NLP*, je vous invite fortement à vous diriger du côté de **Mediapipe** ou de **Transformers.js**

---
title: Speech Command
description: Découverte du package @tensorflow-models/speech-commands
---

# Introduction aux Commandes Vocales avec TensorFlow.js et React

Dans cet article, nous allons créer une application simple utilisant TensorFlow.js pour reconnaître des commandes vocales. Nous utiliserons la bibliothèque `@tensorflow-models/speech-commands` pour charger un modèle pré-entraîné et React pour construire notre interface utilisateur.

## Prérequis

Avant de commencer, assurez-vous d'avoir Node.js installé sur votre machine. Vous pouvez vérifier cela en exécutant `node -v` dans votre terminal. Nous utiliserons également le gestionnaire de paquets npm (ou yarn) pour les dépendances nécessaires.

## Installation des dépendances

Pour créer notre application, nous allons utiliser Create React App avec TypeScript. Ouvrez votre terminal et exécutez les commandes suivantes pour créer une nouvelle application React et installer TensorFlow.js ainsi que la bibliothèque de commandes vocales :

```
npx create-react-app tfjs-speech --template typescript
cd tfjs-speech
npm install @tensorflow/tfjs @tensorflow-models/speech-commands antd

```

## Explication du Code

Voici le code complet de notre composant React. Nous allons le décortiquer partie par partie pour mieux comprendre son fonctionnement.

```tsx
import React from "react";
import { Button, Card, Col, Descriptions, Row, Spin } from "antd";
import { useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjsimport * as speechCommands from "@tensorflow-models/speech-commands";
import { SoundFilled } from "@ant-design/icons";

export default function Chapter3() {
  const [recognizer, setRecognizer] = useState<speechCommands.SpeechCommandRecognizer | null>(null);
  const [labels, setLabels] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [recording, setRecording] = useState<boolean>(false);
  const [indexPred, setIndexPred] = useState<number | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  async function loadModel() {
    await tf.setBackend("webgl");
    const recognizer = speechCommands.create("BROWSER_FFT");
    await recognizer.ensureModelLoaded();
    return recognizer;
  }

  useEffect(() => {
    if (recognizer) return;
    setLoading(true);
    loadModel().then(res => {
      setRecognizer(res);
      setLabels(res.wordLabels());
      setLoading(false);
    });
    return () {
      tf.disposeVariables();
    };
  }, [recognizer]);

  if (loading) return <Spin fullscreen={true} tip="loading..." />;

  return (
    <>
      <Row>
        <Col span={24} className="m-4">
          <Card title="Speech Commands">
            <p>
              Speech Commands is a dataset of 65,000 one-second long utterances
              of 20 short words, by thousands of different people It was
              collected by Google and released under a CC BY license. It is
              useful for benchmarking models for speech recognition. The dataset
              is available for download from the TensorFlow Datasets catalog.
            </p>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col span={24} className="m-4">
          <Card>
            <Button
              type="primary"
              ghost
              className="m-4"
              onClick={() => {
                if (recording) {
                  recognizer.stopListening();
                  setRecording(false);
                } else {
                  recognizer.listen(
                    async ({ scores, spectrogram: { frameSize, data } }) => {
                      setIndexPred(scores.indexOf(Math.max(...scores)));
                    },
                    {
                      overlapFactor: 0.999,
                      includeSpectrogram: true,
                      invokeCallbackOnNoiseAndUnknown: true,
                      probabilityThreshold: 0.75,
                    }
                  );
                  setRecording(true);
                }
              }}
            >
              <SoundFilled />
              {recording ? "Stop" : "Start"} Recording
            </Button>
            <Card>
              <Descriptions>
                <Descriptions.Item
                  label="Predicted Word                  contentStyle={{ color: "navy", fontSize: 24 }}
                >
                  {indexPred !== null ? labels[indexPred] : "None"}
                </Descriptions.Item>
              </Descriptions>
              <canvas ref={canvasRef} style={{ width: "100%", height: 200 }}></canvas>
            </Card>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col span={24} className="m-4">
          <Card title="Labels">
            <Descriptions>
              {labels.map((label, i) => (
                <Descriptions.Item key={i} label={i}>
                  {label}
                </Descriptions.Item>
              ))}
            </Descriptions>
          </Card>
        </Col>
      </Row>
    </>
  );
}

```

### Importation des Modules

Nous commençons par les modules nécessaires. Nous utilisons React pour créer des composants, `antd` pour les composants d'interface utilisateur, TensorFlow.js pour le traitement des données audio, et la bibliothèque de commandes vocales pour la reconnaissance vocale.

```tsx
import React from "react"
import { Button, Card, Col, Descriptions, Row, Spin } from "antd"
import { useEffect, useState } from "react"
import * as tf from "@tensorflow/tfjs"
import * as speechCommands from "@tensorflow-models/speech-commands"
import { SoundFilled } from "@ant-design/icons"
```

### Initialisation des États

Nous définissons plusieurs états pour gérer notre reconnaissance vocale :

- `recognizer`: pour stocker notre modèle de reconnaissance vocale.
- `labels`: pour stocker les étiquettes des mots que le modèle peut reconnaître.
- `loading`: pour indiquer si le modèle est en cours de chargement.
- `recording`: pour indiquer si l'application est en train'enregistrer.
- `indexPred pour stocker l'indice du mot prédit.
- `canvasRef`: une référence pour notre élément `canvas`.

```tsx
const [recognizer, setRecognizer] =
  useState<speechCommands.SpeechCommandRecognizer | null>(null)
const [labels, setLabels] = useState<string[]>([])
const [loading, setLoading] = use<boolean>(true)
const [recording, setRecording] = useState<boolean>(false)
const [indexPred, setIndexPred] = useState<number | null>(null)
const canvasRef = React.useRef<HTMLCanvasElement>(null)
```

### Chargement du Modèle

Nous définissons une fonction `loadModel` pour charger le modèle de reconnaissance vocale. Nous utilisons `tf.setBackend("webgl")` pour définir le backend de TensorFlow.js sur WebGL, ce qui améliore les performances.

```tsx
async function loadModel() {
  await tf.setBackend("webgl")
  const recognizer = speechCommands.create("BROWSER_FFT")
  await recognizer.ensureModelLoaded()
  return recognizer
}
```

### Utilisation de `useEffect` pour Charger le Modèle

Nous utilisons le hook `useEffect` pour charger le modèle lorsque le composant est monté. Si le `recognizer` est déjà défini, nous ne faisons rien. Sinon, nous chargeons le modèle et mettons à jour les états `recognizer` et `labels`.

```tsx
useEffect(() => {
  if (recognizer) return
  setLoading(true)
  loadModel().then(res => {
    setRecognizer(res)
    setLabels(res.wordLabels())
    setLoading(false)
  })
  return () => {
    tf.disposeVariables()
  }
}, [recognizer])
```

Affichage d'un Indicateur de Chargement

Si le modèle est en cours de chargement, nous affichons un indicateur de chargement.

```tsx
 (loading) return <Spin fullscreen={true} tip="loading..." />;

```

### Interface Utilisateur

Nous utilisons les composants de `antd` pour créer notre interface utilisateur. Nous avons un bouton pour démarrer et arrêter l'enregistrement, et un affichage des mots prédits.

```tsx
return (
  <>
    <Row>
      <Col span={24} className="m-4">
        <Card title="Speech Commands">
          <p>
            Speech Commands is a dataset of 65,000 one-second long utterances
            of 20 short words, by thousands of different people. It was
            collected by Google and released under a CC BY license. It is
            useful for benchmarking models for speech recognition The dataset
            is available for download from the TensorFlow Datasets catalog.
          </p>
        </Card>
      </Col>
    </Row>
    <Row>
      <Col span={24} className="m-4">
        <Card>
         Button
            type="primary
            className="m-4"
            onClick={() => {
              if (recording) {
                recognizer.stopListening();
                setRecording(false);
              } else {
                recognizer.listen(
                  async ({ scores, spectrogram: { frameSize, data } }) => {
                    setIndexPred(scores.indexOf(Math.max(...scores)));
                  },
                  {
                    overlapFactor: 0.999,
                    includeSpectrogram: true,
                    invokeCallbackOnNoiseAndUnknown: true,
                    probabilityThreshold:0.75,
                  }
                );
                setRecording(true);
              }
            }}
          >
            <SoundFilled />
            {recording ? "Stop" : "Start"} Recording
          </Button>
          <Card>
            <Descriptions>
              <Descriptions.Item
                label="Predicted"
                contentStyle={{ color: "navy", fontSize: 24 }}
              >
                {indexPred !== null ? labels[indexPred] : "None"}
              </Descriptions.Item>
            </Descriptions>
            <canvas ref={canvasRef} style={{ width: "100%", height: 200 }}></canvas>
          </Card>
        </Card>
 </Col>
    </Row>
    <Row>
      <Col span={24} className="m-4">
        <Card title="Labels">
          <Descriptions>
            {labels.map((label, i) => (
              <Descriptions.Item key={i} label={i}>
                {label}
              </Descriptions.Item>
            ))}
          </Descriptions>
        </Card>
      </Col>
    </Row>
  </>
);

```

### Explication du Bouton d'Enregistrement

Lorsque l'utilisateur clique sur le bouton, nous commençons ou arrêtons l'écoute des commandes vocales. Si nous enregistrons, nous appelons `recognizer.listen` avec une fonction de rappel qui met à jour l'indice du mot prédit (`indexPred`). Sinon, nous arrêtons l'écoute.

```tsx
<Button
  type="primary"
  ghost
  className="m-4"
  onClick={() => {
    if (recording) {
      recognizer.stopListening();
      setRecording(false);
    } else {
      recognizer.listen(
        async ({ scores, spectrogram: { frameSize, data } }) => {
          setIndexPred(scores.indexOf(Math.max(...scores)));
        },
        {
          overlapFactor: 0.,
          includeSpectrogram true,
          invokeCallbackOnNoiseAndUnknown: true,
          probabilityThreshold: 0.75,
        }
      );
      setRecording(true);
    }
  }}
>
  <SoundFilled />
  {recording ? "Stop" : "Start"} Recording
</Button>

```

### Affichage des Mots Prédits

Nous affichons les mots prédits en utilisant le composant `Descriptions` de `antd`. Si `indexPred` est défini, nous affichons le mot correspondant, sinon nous affichons "None".

```tsx
<Card>
  <Descriptions>
    <Descriptions.Item
      label="Predicted Word"
      contentStyle={{ color: "navy", fontSize: 24 }}>
      {indexPred !== null ? labels[indexPred] : "None"}
    </Descriptions.Item>
  </Descriptions>
  <canvas ref={canvasRef} style={{ width: "100%", height: 200 }}></canvas>
</Card>
```

### Affichage destiquettes

Enfin, nous affichons toutes les étiquettes que le modèle peut reconnaître

```tsx
<Card title="Labels">
<Descriptions>
{labels.map((, i) => (
<Descriptions.Item key={i} label={i}>
{label}
</Descriptions.Item>
))}
</Descriptions>
</Card>
```

## Conclusion

Dans cet article, nous avons créé une application simple pour reconnaître des commandes vocales en utilisant TensorFlow.js et React. Nous avons utilisé la bibliothèque `@tensorflow-models/speech-commands` pour charger un modèle pré-entraîné et `antd` pour créer notre interface utilisateur. Vous pouvez désormais expérimenter avec d'autres modèles et fonctionnalités pour améliorer cette application.

---

J'espère que cet article vous aidera à comprendre comment utiliser TensorFlow.js avec React pour créer des applications de reconnaissance vocale. Si vous avez des questions ou des commentaires, n'hésitez pas à les laisser ci.

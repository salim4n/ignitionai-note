---
title: Votre premier modèle
description: Créer un modèle de machine learning avec des données synthétiques
---

## Créer un Modèle de Machine Learning avec des Données Synthétiques

[![tfjs-playground](https://img.shields.io/badge/tfjs_playground-%230077B5.svg?logo=github&logoColor=white)](https://github.com/salim4n/tfjs-playground/blob/main/app/page.tsx)

Dans cet article, nous allons créer une application React utilisant TensorFlow.js. Cette application génère des données aléatoires, crée un modèle de machine learning, entraîne ce modèle, et effectue des prédictions. Nous avons également ajouté des éléments d' pour améliorer l'expérience utilisateur.

## Prérequis

Assurez-vous d'avoir Node.js installé et utilisez npm pour installer les bibliothèques nécessaires.

## Installation des Dépendances

Créez une nouvelle application React avec TypeScript et installez TensorFlow.js et les bibliothèques de visualisation :

```bash
npx create-react-app tfjs-fake-data --template typescript
cd tfjs-fake-data
npm install @tensorflow/tfjs @tensorflow/tfjs-vis antd

```

## Explication du Code

Voici le code complet de notre composant React. Nous allons expliquer chaque partie en détail.

```tsx
import * as tf from "@tensorflow/tfjs";
import * as tfvis from "@tensorflow/tfjs-vis";
import { Button, Card, Spin, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import {
  drawHistogram,
  drawModelSummary,
  drawTable,
  drawScatterPlot,
  drawLine,
  drawChartOfEachFeatureOfOneDataset,
  drawHeatMap,
} from "./utils/visor/draw";
import { generateColumns } from "./utils/utils";

type Data = {
  a: number // features
  b: number // features
  c: number // features
  d: number // features
  e: number // labels
}

export default Home() {
  const [data, setData] = useState<Data[]>()
  const [loading, setLoading] = useState<boolean>(false)
  const [model, setModel] = useState<tf.Sequential | null>(null);
  const [visor, setVisor] = useState<any>();

  useEffect(() => {
    const visor = tfvis.visor();
    visor.el.style.color = "";
    setVisor(visor);

    return () => {
      tf.disposeVariables();
    };
  }, []);

  async function run() {
    setLoading(true);
    tf.tidy(() => {
      const dataToDisplay = Array.from({ length: 1000 }, () ({
        a: Math.random(),
        b: Math.random(),
        c: Math.random(),
        d: Math.random(),
        e: Math.random(),
      }));
      setData(dataToDisplay);

      const name = "Data Generated";
      drawTable(dataToDisplay, name, "Data Table");
      drawHistogram(dataToDisplay, name, "Data Histogram");
      drawScatterPlot(dataToDisplay, name, "Data Scatter Plot");
      drawLine(dataToDisplay, name, "Data Line Plot");
      drawBarChartOfEachFeatureOfOneDataset(
        dataToDisplay,
        name,
        "Data Bar Chart"
      );
 drawHeatMap(dataToDisplay, name, "Data Heat Map");
      setLoading(false);
    });
  }

  async function createModel() {
    setLoading(true);
    const model = tfquential();
    model.add(
      tf.layers.dense({ units: 64, inputShape: [4], activation: "relu" })
    );
    model.add(tf.layers.dense({ units: 1 }));
    model.compile({ loss: "meanSquaredError", optimizer: "adam" });
    drawModelSummary(model, "Model Summary", "Model Summary");
    setLoading(false);

    const features = data.map((d: any) => [d.a, d.b, d.c, d.d]);
    const labels = data.map((d: any) => d.e);
    const xs = tf.tensor2d(features);
    const ys = tf.tensor2d(labels, [labels.length, 1]);
    await model.fit(xs, ys, {
      batchSize: 32,
      epochs: 20,
      callbacks: tfvis.show.fitCallbacks(
        { name: "Training Performance", tab: "Training" },
        ["loss", "mse", "mae", "mape", "acc"]
      ),
    });
    setModel(model);
  }

  async function predict() {
    tf.tidy(() => {
      const xs = tf.linspace(0, 1, 40).reshape([-1, 4]);
      const preds = model.predict(xs) as tf.Tensor;
     vis.render.table(
        { name: "Predictions", tab: "Predictions" },
        {
          headers: ["X", "Predicted Y"],
          values: Array.from(xs.dataSync()).map((val, i) => [
            val,
            preds.dataSync()[i],
          ]),
        }
      );
    });
  }

  if (loading) return <Spin fullscreen={true} tip="Loading" />;

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {data ? (
        <>
          {model ? (
            <Button type="primary" onClick={predict} className="m-3">
              Predict
            </Button>
          ) : (
            <>
              <Button type="primary" onClick={createModel} className="m-3">
                Create Model
              </Button>
            </>
          )}
          <Button type="primary" onClick={() => visor.toggle()} className="m-3">
            Toggle Visor
          </Button>
          <div>
            <Tag color={"orange"}>Tensorflow.js</Tag>
            <Tag color={"purple"}>We gonna use a, b, c, d to predict e</Tag>
          </div>
          <Table dataSource={data} columns={generateColumns(data)} />
        </>
      ) : (
        <Button type="primary" onClick={run}>
          Load Fake Random Data
        </Button>
      )}
    </div>
  );
}
```

---

```tsx
import * as tf from "@tensorflow/tfjs"
import * as tfvis from "@tensorflow/tfjs-vis"
import { Button, Card, Spin, Table, Tag } from "antd"
import { useEffect, useState } from "react"
import {
  drawHistogram,
  drawModelSummary,
  drawTable,
  drawScatterPlot,
  drawLine,
  drawBarChartOfEachFeatureOfOneDataset,
  drawHeatMap,
} from "./utils/visor/draw"
import { generateColumns } from "./utils/utils"
```

Ce bloc de code prépare l'environnement en important plusieurs bibliothèques et outils pour :

1. Utiliser TensorFlow.js et visualiser des données ou des modèles avec `tfvis`.
2. Afficher des composants UI stylisés à l'aide d'Ant Design.
3. Utiliser les hooks `useState` et `useEffect` pour gérer l'état et les effets secondaires dans les composants React.
4. Fournir des fonctions utilitaires pour créer des graphiques et gérer la structure des tableaux de données.

```tsx
type Data = {
  a: number // features
  b: number // features
  c: number // features
  d: number // features
  e: number // labels
}
```

### Propriétés du type `Data`

1. **`a: number`** :
   - `a` est une propriété de type `number`, ce qui signifie que la valeur associée à cette clé doit être un nombre.
   - Dans ce contexte, `a` représente une **feature** (caractéristique), une donnée d'entrée pour un modèle de machine learning. Une feature est une variable ou un attribut qui sert à faire des prédictions.
2. **`b: number`** :
   - Même chose que pour `a`, `b` est une **feature** (une autre caractéristique), et sa valeur doit également être un nombre.
3. **`c: number`** :
   - `c` est une autre **feature**, toujours de type `number`.
4. **`d: number`** :
   - `d` représente une quatrième **feature**, également de type `number`.
5. **`e: number`** :
   - `e` représente une **label** (étiquette), c'est-à-dire la cible ou la sortie à prédire par le modèle de machine learning. C'est aussi un `number`.
   - Les **labels** sont les réponses correctes que l'on cherche à prédire en fonction des features. Par exemple, si les features `a`, `b`, `c`, et `d` sont des caractéristiques mesurées chez une personne, `e` pourrait être son âge, son revenu, ou une autre donnée à prédire.

```tsx
const [data, setData] = useState<Data[]>()
const [loading, setLoading] = useState<boolean>(false)
const [model, setModel] = useState<tf.Sequential | null>(null)
const [visor, setVisor] = useState<any>()
```

1. **`data`** et **`setData`** : Utilisation de `useState` pour stocker et gérer un tableau de données de type `Data[]`. Ce sera l'ensemble des features et labels utilisé, potentiellement pour un modèle de machine learning.
2. **`loading`** et **`setLoading`** : Gestion de l'état de chargement via un booléen (`true` si l'application est en cours de chargement, `false` sinon). Par défaut, il est défini à `false`.
3. **`model`** et **`setModel`** : Stocke un modèle séquentiel TensorFlow (`tf.Sequential`) ou `null` si aucun modèle n'est défini. Cela permet de gérer l'instance du modèle ML dans React.
4. **`visor`** et **`setVisor`** : Stocke l'état du "visor" (outil de visualisation, type non précisé ici). `any` est utilisé car le type exact du visor n'est pas spécifié.

Ce code configure des états pour les données, le modèle, le chargement, et les outils de visualisation dans un composant React.

```tsx
useEffect(() => {
  const visor = tfvis.visor()
  visor.el.style.color = "black"
  setVisor(visor)

  return () => {
    tf.disposeVariables()
  }
}, [])
```

1. **`useEffect`** : Ce hook s'exécute une fois au montage du composant (grâce au tableau vide `[]`).
2. **Initialisation du visor** :
   - La fonction `tfvis.visor()` crée un outil de visualisation (le "visor").
   - On change la couleur du texte à `black` en modifiant son style via `visor.el.style.color`.
   - Puis, on stocke cet objet `visor` dans l'état avec `setVisor(visor)`.
3. **Nettoyage lors du démontage** :
   - La fonction retournée par `useEffect` s'exécute au démontage du composant.
   - Elle utilise `tf.disposeVariables()` pour libérer les variables TensorFlow allouées en mémoire, afin d'éviter les fuites de mémoire.

Ce code initialise un outil de visualisation (visor) et nettoie les variables TensorFlow quand le composant est détruit.

```tsx
async function run() {
  setLoading(true)
  const dataToDispalay: Data[] = Array.from({ length: 1000 }, () => ({
    a: Math.random(),
    b: Math.random(),
    c: Math.random(),
    d: Math.random(),
    e: Math.random(),
  }))
  setData(dataToDispalay)
  const name = "Data Generated"
  drawTable(dataToDispalay, name, "Data Table")
  drawHistogram(dataToDispalay, name, "Data Histogram")
  drawScatterPlot(dataToDispalay, name, "Data Scatter Plot")
  drawLine(dataToDispalay, name, "Data Line Plot")
  drawBarChartOfEachFeatureOfOneDataset(dataToDispalay, name, "Data Bar Chart")
  drawHeatMap(dataToDispalay, name, "Data Heat Map")
  setLoading(false)
}
```

- **`setLoading(true)`** : Active l'indicateur de chargement avant de commencer les opérations asynchrones.
- **Génération de données** :
  - `Array.from({ length: 1000 }, ...)` crée un tableau de 1000 objets, chacun ayant des propriétés `a`, `b`, `c`, `d`, et `e` avec des valeurs aléatoires générées par `Math.random()`.
- **Mise à jour de l'état avec `setData(dataToDispalay)`** : Les données générées sont stockées dans l'état `data`.
- **Visualisation des données** :
  - Plusieurs fonctions de dessin sont appelées (`drawTable`, `drawHistogram`, etc.) pour afficher des graphiques et tableaux des données générées.
  - Chaque fonction prend les données, un nom (ici `"Data Generated"`), et un titre pour la visualisation.
- **`setLoading(false)`** : Désactive l'indicateur de chargement une fois toutes les opérations terminées.

```tsx
async function createModel() {
  setLoading(true)
  const { xs, ys } = tf.tidy(() => {
    const model = tf.sequential()
    model.add(
      tf.layers.dense({ units: 64, inputShape: [4], activation: "relu" })
    )
    model.add(tf.layers.dense({ units: 1 }))
    model.compile({ loss: "meanSquaredError", optimizer: "adam" })
    drawModelSummary(model, "Model Summary", "Model Summary")

    const features = data.map((d: any) => [d.a, d.b, d.c, d.d])
    const labels = data.map((d: any) => d.e)
    const xs = tf.tensor2d(features)
    const ys = tf.tensor2d(labels, [labels.length, 1])
    return { xs, ys }
  })
  await model.fit(xs, ys, {
    batchSize: 32,
    epochs: 20,
    callbacks: tfvis.show.fitCallbacks(
      { name: "Training Performance", tab: "Training" },
      ["loss", "mse", "mae", "mape", "acc"]
    ),
  })
  setModel(model)
  setLoading(false)
}
```

### 1. **`async function createModel()`**

La fonction `createModel` est définie comme **asynchrone** (avec `async`), car elle va effectuer des tâches qui prennent du temps, comme l'entraînement du modèle. Les tâches asynchrones permettent d'attendre l'achèvement d'une opération (comme l'entraînement) avant de passer à la suite, tout en ne bloquant pas l'exécution du reste du code.

---

### 2. **`setLoading(true)`**

Cette ligne change l'état de `loading` à `true` pour indiquer que le processus de création et d'entraînement du modèle a commencé. Cela peut être utilisé pour afficher une animation de chargement ou désactiver certaines actions de l'utilisateur pendant le traitement.

---

### 3. **`const { xs, ys } = tf.tidy(() => { ... })`**

- **`tf.tidy`** : Cette fonction permet de limiter l'utilisation de la mémoire en nettoyant automatiquement toutes les variables TensorFlow qui ne sont plus nécessaires après l'exécution de la fonction. Cela est important dans un contexte de machine learning, où la création répétée de tenseurs (objets contenant des données) peut rapidement consommer beaucoup de mémoire.
- Les variables `xs` (features) et `ys` (labels) sont définies dans ce bloc de code.

---

### 4. **`const model = tf.sequential()`**

- **`tf.sequential()`** : Cette fonction crée un modèle séquentiel, c’est-à-dire un modèle constitué de couches empilées les unes après les autres. Un modèle séquentiel est le choix le plus simple pour des réseaux de neurones classiques.

---

### 5. **`model.add(tf.layers.dense({ units: 64, inputShape: [4], activation: "relu" }))`**

- **`model.add`** : Cette méthode permet d'ajouter une couche au modèle.
- **`tf.layers.dense`** : Crée une couche de neurones denses, c'est-à-dire une couche où chaque neurone est connecté à chaque entrée de la couche précédente.
  - **`units: 64`** : Le nombre de neurones dans cette couche. Ici, on en définit 64, ce qui signifie que la couche comportera 64 neurones.
  - **`inputShape: [4]`** : La forme des données d'entrée. Cela signifie que chaque exemple d'entrée aura 4 caractéristiques (comme `a`, `b`, `c`, `d` dans les données).
  - **`activation: "relu"`** : La fonction d'activation utilisée est ReLU (Rectified Linear Unit), couramment utilisée dans les réseaux de neurones pour introduire de la non-linéarité.

---

### 6. **`model.add(tf.layers.dense({ units: 1 }))`**

Cette deuxième couche dense contient un seul neurone de sortie. Il n’y a pas de fonction d'activation car on veut simplement une valeur numérique en sortie (prédiction), généralement dans un problème de régression.

---

### 7. **`model.compile({ loss: "meanSquaredError", optimizer: "adam" })`**

- **`model.compile`** : Prépare le modèle pour l'entraînement en spécifiant la fonction de perte et l'optimiseur.
  - **`loss: "meanSquaredError"`** : La fonction de perte est l'erreur quadratique moyenne, couramment utilisée dans les tâches de régression. Elle mesure la différence entre les valeurs prédites et les valeurs réelles.
  - **`optimizer: "adam"`** : Adam est un optimiseur populaire qui combine les avantages de deux autres méthodes d'optimisation (Adagrad et RMSProp), souvent utilisé en deep learning pour accélérer la convergence.

---

### 8. **`drawModelSummary(model, "Model Summary", "Model Summary")`**

Cette ligne utilise une fonction de visualisation (probablement importée dans un autre fichier) pour afficher un résumé du modèle créé (avec ses couches, ses dimensions, etc.). Cela permet de vérifier visuellement la structure du modèle.

---

### 9. **`const features = data.map((d: any) => [d.a, d.b, d.c, d.d])`**

- Cette ligne extrait les **features** (caractéristiques) de l'ensemble de données `data`. Chaque objet de `data` contient les propriétés `a`, `b`, `c`, et `d`, qui sont regroupées dans un tableau pour chaque exemple.
- **`map`** : Cette méthode crée un nouveau tableau en appliquant une fonction à chaque élément de `data`.

---

### 10. **`const labels = data.map((d: any) => d.e)`**

- Ici, on extrait les **labels** (étiquettes ou valeurs à prédire) de chaque objet `data`, en prenant la propriété `e`.

---

### 11. **`const xs = tf.tensor2d(features)`**

- **`tf.tensor2d`** : Crée un tenseur 2D à partir du tableau des features. Les tenseurs sont des structures de données utilisées dans TensorFlow pour représenter des matrices de données.
  - Les **features** sont transformées en un tenseur de dimension (1000, 4), où 1000 est le nombre d'exemples et 4 est le nombre de caractéristiques.

---

### 12. **`const ys = tf.tensor2d(labels, [labels.length, 1])`**

- Les **labels** sont transformés en un tenseur 2D de dimension (1000, 1), où chaque label est une seule valeur. `labels.length` est utilisé pour s'assurer que la dimension est correcte.

---

### 13. **`return { xs, ys }`**

Cette ligne retourne les tenseurs `xs` (features) et `ys` (labels), pour qu'ils soient utilisés ensuite dans l'entraînement du modèle.

---

### 14. **`await model.fit(xs, ys, { ... })`**

- **`model.fit`** : Lance l'entraînement du modèle avec les données `xs` (features) et `ys` (labels).
  - **`batchSize: 32`** : Le modèle sera entraîné en utilisant des lots de 32 exemples à chaque étape (une stratégie courante pour accélérer l'entraînement tout en gérant la mémoire).
  - **`epochs: 20`** : Le modèle sera entraîné pendant 20 époques, c'est-à-dire que le modèle passera 20 fois sur l'intégralité des données.
  - **`callbacks: tfvis.show.fitCallbacks(...)`** : Permet d'afficher des graphiques en temps réel pour suivre les performances pendant l'entraînement (perte, précision, etc.).

---

### 15. **`setModel(model)`**

Une fois l'entraînement terminé, le modèle entraîné est stocké dans l'état `model`.

---

### 16. **`setLoading(false)`**

Enfin, l'état de `loading` est mis à `false`, indiquant que le processus d'entraînement est terminé.

```tsx
async function predict() {
  tf.tidy(() => {
    const xs = tf.linspace(0, 1, 40).reshape([-1, 4])
    const preds = model.predict(xs) as tf.Tensor
    tfvis.render.table(
      { name: "Predictions", tab: "Predictions" },
      {
        headers: ["X", "Predicted Y"],
        values: Array.from(xs.dataSync()).map((val, i) => [
          val,
          preds.dataSync()[i],
        ]),
      }
    )
  })
}
```

Cette fonction génère des données d'entrée, les passe dans le modèle pour obtenir des prédictions, et affiche ces résultats dans un tableau via `tfvis`.

```tsx
return (
  <div className="flex flex-col items-center justify-center h-screen">
    {data ? (
      <>
        {model ? (
          <Button type="primary" onClick={predict} className="m-3">
            Predict
          </Button>
        ) : (
          <>
            <Button type="primary" onClick={createModel} className="m-3">
              Create Model
            </Button>
          </>
        )}
        <Button type="primary" onClick={() => visor.toggle()} className="m-3">
          Toggle Visor
        </Button>
        <div>
          <Tag color={"orange"}>Tensorflow.js</Tag>
          <Tag color={"purple"}>We gonna use a,b,c,d to predict e</Tag>
        </div>
        <Table dataSource={data} columns={generateColumns(data)} />
      </>
    ) : (
      <Button type="primary" onClick={run}>
        Load Fake Random Data
      </Button>
    )}
  </div>
)
```

- **Structure principale** : Le composant est un conteneur vertical centré (flexbox) qui occupe toute la hauteur de l'écran (`h-screen`).
- **Si les données existent (`data`)** :
  - Si le modèle est créé (`model`), on affiche un bouton **Predict** pour faire des prédictions.
  - Sinon, un bouton **Create Model** est affiché pour créer le modèle.
  - Un bouton **Toggle Visor** permet d'afficher ou masquer le visor de TensorFlow.js.
  - Deux **Tags** affichent des informations sur TensorFlow.js et le but de la prédiction (prédire `e` à partir de `a`, `b`, `c`, `d`).
  - Une **Table** est rendue pour afficher les données, avec des colonnes générées dynamiquement par `generateColumns`.
- **Si les données n'existent pas** :
  - Un bouton **Load Fake Random Data** permet de générer des données factices en appelant la fonction `run`.

Cette interface permet de charger des données, créer un modèle, faire des prédictions et visualiser les résultats, avec des boutons et des informations contextuelles.

### Conclusion

- Création d'une application React utilisant TensorFlow.js pour générer des données aléatoires, créer et entraîner un modèle de machine learning, et effectuer des prédictions
- Utilisation de bibliothèques comme TensorFlow.js, tfvis, et Ant Design pour la visualisation et l'interface utilisateur
- Génération de 1000 points de données aléatoires avec 5 caractéristiques (a, b, c, d, e), où e est la valeur à prédire
- Création d'un modèle séquentiel avec deux couches denses, utilisant ReLU comme fonction d'activation et l'erreur quadratique moyenne comme fonction de perte
- Entraînement du modèle sur 20 époques avec un lot de 32 exemples, en utilisant l'optimiseur Adam
- Visualisation des performances d'entraînement et des prédictions à l'aide de graphiques et tableaux interactifs
- Interface utilisateur permettant de charger des données, créer le modèle, faire des prédictions et basculer l'affichage du visor

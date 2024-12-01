---
title: Construire une Vector Database From Scratch avec TensorFlow.js
description: Construire une Vector Database From Scratch avec TensorFlow.js
---

Une **Vector Database** est un concept fondamental pour de nombreuses applications d'intelligence artificielle, comme la recherche sémantique, les systèmes de recommandation ou encore l'analyse de similarité. Ce projet montre comment en construire une version simplifiée en utilisant **TensorFlow.js** pour l'encodage et la recherche de vecteurs.

---

## Pourquoi une Vector Database ?

Lorsqu'on traite des données textuelles ou multimédias, il est souvent nécessaire de représenter ces données sous une forme que les ordinateurs peuvent manipuler efficacement : des **vecteurs**. Les vecteurs sont des représentations numériques qui capturent les relations sémantiques entre les éléments. Par exemple :

- Deux phrases similaires auront des vecteurs proches.
- Une image et une description correspondante peuvent partager des caractéristiques vectorielles similaires.

Dans une Vector Database, nous stockons ces vecteurs et offrons des moyens efficaces de rechercher ceux qui sont les plus proches d'un vecteur donné (par exemple, la représentation d'une requête utilisateur).

---

## Architecture Générale du Projet

1. **Encodage** : Transformer une phrase en vecteur à l'aide d'un modèle pré-entraîné comme le **Universal Sentence Encoder**.
2. **Stockage** : Conserver ces vecteurs avec leurs identifiants dans une structure simple.
3. **Recherche** : Comparer un vecteur de requête avec les vecteurs existants pour trouver les éléments les plus proches, en utilisant une mesure de similarité comme la distance cosinus.

---

### Étape 1 : Encodage des Phrases avec TensorFlow.js

Le cœur de notre Vector DB repose sur le **Universal Sentence Encoder (USE)**, un modèle capable de transformer des phrases en vecteurs numériques. Avec TensorFlow.js, ce modèle peut être chargé directement dans le navigateur.

#### Chargement du Modèle

Voici comment charger le modèle USE dans TensorFlow.js :

```typescript
import * as tf from '@tensorflow/tfjs';
import * as use from '@tensorflow-models/universal-sentence-encoder';

export class VectorDb {
  private model: use.UniversalSentenceEncoder | null = null;

  // Charger le modèle au démarrage
  async loadModel() {
    this.model = await use.load();
    console.log('Modèle chargé avec succès !');
  }
}
```

**Explication** :  

- `use.load()` charge le modèle dans le navigateur.
- Ce modèle peut encoder une phrase ou un texte en un vecteur à 512 dimensions.

---

#### Encodage d'une Phrase

Une fois le modèle chargé, nous pouvons encoder une phrase. Chaque phrase est transformée en un vecteur dense.

```typescript
async addSentence(id: string, sentence: string) {
  if (!this.model) throw new Error('Modèle non chargé');
  
  // Encodage de la phrase
  const embeddings = await this.model.embed([sentence]);
  console.log(`Vecteur pour "${sentence}" :`, embeddings.arraySync());
}
```

**Explication** :  

- `embed` transforme un tableau de phrases en vecteurs.
- Chaque vecteur est un tableau de 512 nombres représentant la phrase.

---

### Étape 2 : Stockage des Vecteurs

Une fois encodés, les vecteurs doivent être stockés pour pouvoir être comparés lors de futures recherches. Une structure simple comme un tableau peut suffire pour notre démonstration.

```typescript
private vectors: { id: string; vector: tf.Tensor }[] = [];

async addSentence(id: string, sentence: string) {
  if (!this.model) throw new Error('Modèle non chargé');
  
  const embeddings = await this.model.embed([sentence]);
  this.vectors.push({ id, vector: embeddings });
  console.log(`Phrase ajoutée avec l'ID : ${id}`);
}
```

**Explication** :  

- Chaque vecteur est stocké avec un identifiant (`id`) pour pouvoir retrouver l'élément original.
- Dans une implémentation avancée, on utiliserait une base de données optimisée pour les recherches vectorielles, comme **Faiss** ou **Pinecone**.

---

### Étape 3 : Recherche Vectorielle

Pour rechercher les vecteurs les plus proches, nous utilisons une mesure de similarité appelée **cosine similarity** (distance cosinus). Plus deux vecteurs pointent dans la même direction, plus leur similarité est grande.

#### Calcul de la Similarité Cosinus

Voici une fonction qui calcule la similarité cosinus entre deux vecteurs :

```typescript
function cosineSimilarity(vectorA: tf.Tensor, vectorB: tf.Tensor): tf.Scalar {
  const dotProduct = tf.sum(tf.mul(vectorA, vectorB));
  const normA = tf.sqrt(tf.sum(tf.pow(vectorA, 2)));
  const normB = tf.sqrt(tf.sum(tf.pow(vectorB, 2)));
  return dotProduct.div(normA.mul(normB));
}
```

**Explication** :  

- Le produit scalaire (`dotProduct`) mesure l'alignement entre deux vecteurs.
- Les normes (`normA` et `normB`) normalisent les vecteurs pour obtenir une valeur entre -1 et 1.

---

#### Trouver les Meilleurs Résultats

Nous comparons le vecteur de requête avec tous les vecteurs stockés et retournons les résultats les plus similaires.

```typescript
search(query: string, topK: number = 5) {
  if (!this.model) throw new Error('Modèle non chargé');
  
  const queryEmbedding = this.model.embed([query]);
  const scores = this.vectors.map(({ id, vector }) => ({
    id,
    score: cosineSimilarity(queryEmbedding, vector).dataSync()[0],
  }));
  
  return scores
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}
```

**Explication** :  

- `map` calcule la similarité pour chaque vecteur.
- Les scores sont triés pour retourner les `topK` résultats.

---

### Interface Utilisateur avec React

Pour rendre cette démonstration interactive, nous intégrons le tout dans une modal avec React :

```tsx
import React from 'react';
import { VectorDb } from './VectorDb';

const VectorDbDemo: React.FC = () => {
  const [db, setDb] = React.useState<VectorDb | null>(null);

  React.useEffect(() => {
    const initDb = async () => {
      const vectorDb = new VectorDb();
      await vectorDb.loadModel();
      setDb(vectorDb);
    };
    initDb();
  }, []);

  return (
    <div>
      <h1>Vector DB Demo</h1>
      <p>Ajoutez des phrases et recherchez des correspondances !</p>
      {/* Formulaires pour ajouter des phrases et effectuer des recherches */}
    </div>
  );
};

export default VectorDbDemo;
```

---

### Résultat Final

Avec cette démonstration, vous pouvez :

1. **Ajouter des phrases** : Encodez et stockez des phrases dans la Vector DB.
2. **Rechercher des correspondances** : Trouvez les phrases les plus proches d'une requête.
3. **Comprendre les bases des Vector DB** : Approfondissez vos connaissances sur l'encodage, la similarité cosinus et la gestion des vecteurs.

Essayez cette démo directement sur mon site [IgnitionAI](https://www.ignitionai.fr). 🎉
(cliquez juste sur l'icone de base de données, ça va vous ouvrir la démo)

---

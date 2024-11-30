---
title : Interroger une BDD SQL
description : Interroger une BDD SQL
---

Créer une chaîne pour interagir avec une base de données SQL en utilisant **LangChain** est une excellente option pour exécuter des requêtes dynamiques tout en utilisant un modèle de langage pour générer, valider ou interpréter les résultats. LangChain propose des outils spécifiques comme le **`SqlDatabaseChain`** pour cette tâche.

---

### **1. Dépendances nécessaires**

Assurez-vous d'installer les dépendances :

```bash
npm install langchain sqlite3 dotenv
```

Si vous utilisez une autre base de données, installez le driver correspondant :  

- PostgreSQL : `npm install pg`
- MySQL : `npm install mysql2`

---

### **2. Configuration initiale**

Créez un fichier `.env` pour gérer vos informations sensibles (par exemple, la chaîne de connexion à la base de données).

```env
SQLITE_DB_PATH=./your_database.sqlite
OPENAI_API_KEY=your_openai_api_key
```

---

### **3. Étapes principales**

#### **Étape 1 : Initialiser la connexion SQL**

Voici un exemple pour SQLite :

```typescript
import { SqlDatabase } from "langchain/sql_db";
import sqlite3 from "sqlite3";
import dotenv from "dotenv";

dotenv.config();

async function initializeDatabase() {
  const db = new sqlite3.Database(process.env.SQLITE_DB_PATH!);
  return new SqlDatabase(db);
}
```

Pour une autre base de données (PostgreSQL, MySQL), vous devrez remplacer SQLite par un driver adapté.

---

#### **Étape 2 : Configurer le modèle LLM**

Créez un modèle GPT-4 ou GPT-3.5 pour générer ou interpréter les requêtes SQL.

```typescript
import { OpenAIChat } from "langchain/llms/openai";

const llm = new OpenAIChat({
  openAIApiKey: process.env.OPENAI_API_KEY!,
  temperature: 0.0, // Réponses déterministes pour les requêtes SQL
});
```

---

#### **Étape 3 : Construire la chaîne SQL**

Utilisez `SqlDatabaseChain` pour relier la base de données et le modèle LLM.

```typescript
import { SqlDatabaseChain } from "langchain/chains";

async function createSQLChain() {
  const sqlDatabase = await initializeDatabase();

  const sqlChain = SqlDatabaseChain.fromLLM(llm, sqlDatabase, {
    returnDirect: true, // Renvoie directement les résultats de la requête SQL
  });

  return sqlChain;
}
```

---

#### **Étape 4 : Exécuter une requête via la chaîne**

Utilisez la chaîne pour exécuter des requêtes dynamiques.

```typescript
async function runSQLQuery(userQuery: string) {
  const sqlChain = await createSQLChain();

  try {
    const response = await sqlChain.run(userQuery);
    console.log("Résultat de la requête :", response);
  } catch (error) {
    console.error("Erreur lors de l'exécution de la requête :", error);
  }
}

// Exemple d'exécution
const query = "Donne-moi les 5 derniers utilisateurs inscrits dans la table 'users'.";
runSQLQuery(query).catch(console.error);
```

---

### **4. Exemple de résultat**

Si la base de données contient une table `users` avec des colonnes `id`, `name`, et `created_at`, et que vous exécutez :

```text
Donne-moi les 5 derniers utilisateurs inscrits dans la table 'users'.
```

La chaîne générera la requête SQL suivante :

```sql
SELECT * FROM users ORDER BY created_at DESC LIMIT 5;
```

Et affichera un résultat similaire à :

```text
Résultat de la requête :
[
  { id: 101, name: "Alice", created_at: "2024-11-28 12:30:00" },
  { id: 102, name: "Bob", created_at: "2024-11-27 14:15:00" },
  ...
]
```

---

### **5. Points importants**

1. **Validation des requêtes SQL** : Utilisez un `outputParser` pour valider les requêtes générées ou filtrer les résultats.
2. **Sécurité** :
   - Évitez les injections SQL en limitant les champs que le LLM peut manipuler.
   - Fournissez un schéma explicite pour guider le modèle.
3. **Personnalisation des résultats** :
   - Utilisez les options de LangChain pour transformer les résultats en JSON, texte formaté, ou tout autre format adapté.
4. **Gestion des erreurs** : Gérez les cas où la table ou la colonne demandée n'existe pas.

---

### **6. Étapes suivantes**

- **Documenter le schéma de la base de données** pour guider le modèle.
- **Créer une UI** : Connectez cette chaîne à une application React/Next.js pour permettre aux utilisateurs de poser des questions dynamiques.
- **Monitorer l'utilisation** : Tracez les requêtes et réponses pour améliorer la précision du modèle.

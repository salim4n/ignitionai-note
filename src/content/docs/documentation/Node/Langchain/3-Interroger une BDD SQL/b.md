---
title: Implémentation d'une chaîne avec SQL Database
description: Implémentation d'une chaîne avec SQL Database
---

Voici une implémentation détaillée pour **créer une chaîne avec SQL Database** et exécuter des requêtes via **LangChain** en TypeScript.

---

### **1. Installer les dépendances nécessaires**

Si ce n'est pas encore fait, installez les packages :

```bash
npm install langchain sqlite3 dotenv
```

Pour d'autres bases de données (PostgreSQL, MySQL), ajoutez les drivers correspondants :

- PostgreSQL : `npm install pg`
- MySQL : `npm install mysql2`

---

### **2. Configuration initiale**

Créez un fichier `.env` pour stocker les informations sensibles :

```env
SQLITE_DB_PATH=./database.sqlite
OPENAI_API_KEY=your_openai_api_key
```

---

### **3. Créer une base de données SQLite**

Voici un exemple de création d'une base SQLite avec une table `users` :

```sql
-- Fichier: schema.sql

CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insérez quelques données factices
INSERT INTO users (name, email) VALUES ('Alice', 'alice@example.com');
INSERT INTO users (name, email) VALUES ('Bob', 'bob@example.com');
INSERT INTO users (name, email) VALUES ('Charlie', 'charlie@example.com');
```

Pour initialiser cette base, utilisez un outil comme **sqlite3** ou un script Node.js.

---

### **4. Implémentation en TypeScript**

#### **Étape 1 : Initialiser la base de données**

Connectez-vous à la base de données SQLite.

```typescript
import { SqlDatabase } from "langchain/sql_db";
import sqlite3 from "sqlite3";
import dotenv from "dotenv";

dotenv.config();

async function initializeDatabase() {
  const sqliteDb = new sqlite3.Database(process.env.SQLITE_DB_PATH!);
  return new SqlDatabase(sqliteDb);
}
```

---

#### **Étape 2 : Configurer le modèle LLM**

Utilisez **OpenAI** pour générer ou analyser les requêtes SQL.

```typescript
import { OpenAIChat } from "langchain/llms/openai";

const llm = new OpenAIChat({
  openAIApiKey: process.env.OPENAI_API_KEY!,
  temperature: 0.0, // Recommandé pour des requêtes SQL précises
});
```

---

#### **Étape 3 : Créer une chaîne SQL**

Associez la base de données et le modèle pour exécuter des requêtes.

```typescript
import { SqlDatabaseChain } from "langchain/chains";

async function createSQLChain() {
  const sqlDatabase = await initializeDatabase();

  const sqlChain = SqlDatabaseChain.fromLLM(llm, sqlDatabase, {
    returnDirect: true, // Renvoie directement les résultats SQL
  });

  return sqlChain;
}
```

---

#### **Étape 4 : Exécuter des requêtes**

Voici un exemple de fonction pour exécuter une requête utilisateur via la chaîne SQL.

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
const query = "Liste les utilisateurs avec leur date d'inscription.";
runSQLQuery(query).catch(console.error);
```

---

### **5. Exemple de résultat**

Si vous exécutez la requête :

```text
Liste les utilisateurs avec leur date d'inscription.
```

LangChain génère et exécute cette requête SQL :

```sql
SELECT name, email, created_at FROM users;
```

Et vous obtenez :

```text
Résultat de la requête :
[
  { name: "Alice", email: "alice@example.com", created_at: "2024-11-29 12:30:00" },
  { name: "Bob", email: "bob@example.com", created_at: "2024-11-28 10:20:00" },
  { name: "Charlie", email: "charlie@example.com", created_at: "2024-11-27 08:45:00" }
]
```

---

### **6. Améliorations possibles**

#### **Validation et Parsing**

Ajoutez un **outputParser** pour valider ou formater la sortie.

```typescript
import { StrOutputParser } from "langchain/schema/outputParser";

const outputParser = new StrOutputParser();
const sqlChain = SqlDatabaseChain.fromLLM(llm, sqlDatabase, {
  outputParser,
});
```

#### **Guidage du modèle**

Fournissez un schéma de la base pour guider le modèle. Par exemple :

```typescript
const schema = `
  La base de données contient une table 'users' avec les colonnes :
  - id (INTEGER)
  - name (TEXT)
  - email (TEXT)
  - created_at (TIMESTAMP)
`;

const sqlChain = SqlDatabaseChain.fromLLM(llm, sqlDatabase, {
  llm,
  returnDirect: true,
  llmPromptPrefix: schema,
});
```

#### **UI pour requêtes dynamiques**

- Connectez cette chaîne à une interface Next.js ou React.
- Permettez aux utilisateurs de poser des questions dynamiques.

---

### **7. Cas d'utilisation avancés**

- **Dashboards dynamiques** : Générer des rapports SQL à la volée.
- **Analyse des données** : Résumer ou expliquer les données d'une table.
- **Automatisation** : Exécuter des requêtes sur la base pour des pipelines de traitement.

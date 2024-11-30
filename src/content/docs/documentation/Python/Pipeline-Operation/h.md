---
title: Configuration des tests GitHub Actions pour Azure Functions
description: Configuration des tests GitHub Actions pour Azure Functions
---

## Introduction

L'automatisation des tests pour vos Azure Functions à l'aide de GitHub Actions est une étape cruciale dans le processus MLOps. Elle permet de s'assurer que vos fonctions fonctionnent correctement avant leur déploiement, réduisant ainsi les risques d'erreurs en production.

## Prérequis

- Un compte GitHub avec un dépôt contenant vos Azure Functions
- Un compte Azure avec des Azure Functions déployées
- Python 3.8 ou supérieur (pour cet exemple)
- Pytest pour l'exécution des tests

## Structure du projet

Voici une structure de projet typique pour des Azure Functions avec des tests :

```
project_root/
│
├── .github/
│   └── workflows/
│       └── azure-functions-test.yml
│
├── MyAzureFunction/
│   ├── __init__.py
│   └── function.py
│
├── tests/
│   ├── __init__.py
│   └── test_function.py
│
├── requirements.txt
└── host.json

```

## Écriture des tests

Créez un fichier `test_function.py` dans le dossier `tests/`. Voici un exemple de test pour une fonction Azure :

```python
import azure.functions as func
import json
from MyAzureFunction import function

def test_my_function():
    # Création d'une requête mock
    req = func.HttpRequest(
        method='GET',
        body=None,
        url='/api/MyAzureFunction',
        params={'name': 'Test'}
    )

    # Appel de la fonction
    resp = function.main(req)

    # Vérification de la réponse
    assert resp.status_code == 200
    assert json.loads(resp.get_body()) == {"message": "Hello, Test!"}

```

## Configuration de GitHub Actions

Créez un fichier `.github/workflows/azure-functions-test.yml` avec le contenu suivant :

```yaml
name: Azure Functions CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2

      - name: Set up Python
        uses: actions/setup-python@v2
        with:
          python-version: "3.8"

      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt

      - name: Run tests
        run: |
          pip install pytest
          pytest tests/ -v

      - name: Upload test results
        uses: actions/upload-artifact@v2
        with:
          name: pytest-results
          path: pytest.xml
        if: ${{ always() }}
```

## Intégration avec Azure

Pour déployer automatiquement vos fonctions après les tests réussis, ajoutez les étapes suivantes à votre workflow :

```yaml
- name: "Login via Azure CLI"
  uses: azure/login@v1
  with:
    creds: ${{ secrets.AZURE_CREDENTIALS }}

- name: "Deploy to Azure Functions"
  uses: Azure/functions-action@v1
  with:
    app-name: your-function-app-name
    package: ${{ env.AZURE_FUNCTIONAPP_PACKAGE_PATH }}
```

N'oubliez pas de configurer le secret `AZURE_CREDENTIALS` dans les paramètres de votre dépôt GitHub.

## Bonnes pratiques

1. **Tests isolés** : Assurez-vous que chaque test est indépendant et peut s'exécuter seul.
2. **Mocking** : Utilisez des mocks pour simuler les services externes comme les bases de données ou les API.
3. **Couverture de code** : Ajoutez des outils de couverture de code comme `coverage.py` pour mesurer l'efficacité de vos tests.
4. **Tests de performance** : Incluez des tests de charge pour vérifier les performances de vos fonctions.
5. **Environnements de test** : Utilisez des environnements de test séparés pour éviter d'affecter la production.

## Dépannage

- **Erreurs d'importation** : Assurez-vous que votre structure de projet est correcte et que Python peut trouver vos modules.
- **Échecs de déploiement** : Vérifiez les logs de GitHub Actions et d'Azure pour identifier les problèmes.
- **Temps d'exécution longs** : Optimisez vos tests ou utilisez le parallélisme dans GitHub Actions.

## Conclusion

La mise en place de tests automatisés avec GitHub Actions pour vos Azure Functions est une étape essentielle dans le processus MLOps. Elle permet de détecter rapidement les problèmes, d'améliorer la qualité du code et de faciliter l'intégration continue et le déploiement continu (CI/CD) de vos modèles de machine learning.

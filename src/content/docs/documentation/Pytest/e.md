---
title: Écrire et exécuter des tests avec des fonctions et des classes
description: Écrire et exécuter des tests avec des fonctions et des classes
---

### 1. Tests avec des fonctions

Dans Pytest, la façon la plus simple d'écrire des tests est d'utiliser des **fonctions**. Une fonction de test est une fonction Python ordinaire, mais elle suit certaines conventions :

- Le nom de la fonction de test commence par `test_`.
- Elle utilise des **assertions** pour vérifier si le comportement du code est correct.

### Exemple simple avec une fonction

```python
# Exemple : Fonction à tester
def add(a, b):
    return a + b

# Test fonctionnel avec Pytest
def test_add_positive_numbers():
    assert add(3, 4) == 7  # Vérification que 3 + 4 donne bien 7

def test_add_negative_numbers():
    assert add(-1, -1) == -2  # Vérification que -1 + -1 donne bien -2

```

Ces tests sont ensuite exécutés avec Pytest via la ligne de commande :

```bash
pytest

```

Pytest recherchera automatiquement toutes les fonctions dont le nom commence par `test_` et exécutera ces tests.

### 2. Tests avec des classes

Quand tu veux regrouper des tests qui partagent une même configuration ou des comportements similaires, tu peux utiliser des **classes**. Chaque méthode de test dans la classe doit suivre la même convention : son nom doit commencer par `test_`. Une classe peut contenir plusieurs méthodes de test et des méthodes communes à tous les tests (comme `setup` et `teardown`).

### Exemple de test avec une classe

```python
# Exemple : Classe de tests pour la fonction 'add'
class TestAddFunction:
    # Setup : Fonction appelée avant chaque test (facultatif)
    def setup_method(self):
        self.x = 10
        self.y = 5

    # Test fonctionnel sur des nombres positifs
    def test_add_positive(self):
        assert add(self.x, self.y) == 15

    # Test fonctionnel sur des nombres négatifs
    def test_add_negative(self):
        assert add(-self.x, -self.y) == -15

    # Test avec un cas mixte (positif et négatif)
    def test_add_mixed(self):
        assert add(self.x, -self.y) == 5

```

### a) `setup_method` et `teardown_method`

- **`setup_method`** : Cette méthode est exécutée avant chaque test pour initialiser les variables ou préparer l'environnement nécessaire.
- **`teardown_method`** : Peut être utilisé pour nettoyer ou réinitialiser l’environnement après chaque test, bien qu'il ne soit pas montré ici.

L’avantage de structurer les tests avec des classes est que tu peux regrouper des tests logiquement liés ensemble et éviter la répétition de code en initialisant des ressources communes dans le `setup_method`.

### 3. Comparaison : Fonctions vs Classes

| **Fonctions**                 | **Classes**                                                   |
| ----------------------------- | ------------------------------------------------------------- |
| Simples et directes           | Plus adaptées pour des tests complexes ou des suites de tests |
| Faciles à écrire et rapides   | Organisation plus claire avec `setup` et `teardown`           |
| Pas de besoin d'organisation  | Idéales pour regrouper des tests similaires                   |
| Parfait pour des tests isolés | Recommandé pour des tests qui partagent des configurations    |

### 4. Utilisation de `pytest.fixture` pour les fonctions et classes

En plus des méthodes `setup_method` et `teardown_method` pour les classes, **Pytest** propose un mécanisme plus flexible pour réutiliser du code dans les tests via les **fixtures**.

### Exemple avec une fixture

```python
import pytest

# Fixture pour préparer des données réutilisables
@pytest.fixture
def sample_data():
    return {'a': 10, 'b': 5}

# Utilisation dans une fonction de test
def test_add_with_fixture(sample_data):
    assert add(sample_data['a'], sample_data['b']) == 15

```

Ici, la fixture `sample_data` est injectée dans la fonction de test `test_add_with_fixture`. Pytest gère l’initialisation et la fourniture de la fixture automatiquement, ce qui rend les tests plus modulaires et réutilisables.

Les **fixtures** fonctionnent aussi avec des classes. Chaque méthode de test peut recevoir des fixtures comme argument, et elles sont exécutées avant chaque test.

### 5. Écriture et exécution des tests : Bonnes pratiques

### a) **Nommer les tests clairement**

Les noms des tests doivent refléter le comportement qu'ils testent. Par exemple, `test_add_positive_numbers` est bien plus explicite que `test_add`.

### b) **Tester un seul comportement par test**

Chaque test doit idéalement vérifier un seul aspect du comportement de la fonction. Cela permet de comprendre rapidement ce qui a échoué et rend le diagnostic plus simple.

### c) **Utiliser `pytest.mark.parametrize` pour tester plusieurs cas**

Au lieu de créer plusieurs tests pour différentes entrées, Pytest propose un mécanisme appelé **paramétrisation** qui permet d'exécuter le même test avec différentes données d'entrée.

Exemple de paramétrisation :

```python
import pytest

@pytest.mark.parametrize("a, b, expected", [
    (1, 2, 3),
    (2, 3, 5),
    (-1, -1, -2),
    (10, -5, 5)
])
def test_add_parametrized(a, b, expected):
    assert add(a, b) == expected

```

Cela permet de couvrir plusieurs scénarios avec un seul test, rendant le code plus compact et les tests plus efficaces.

### 6. Exécuter les tests

### a) Exécuter tous les tests

Pour exécuter tous les tests dans ton projet, utilise simplement la commande :

```bash
pytest

```

### b) Exécuter des tests spécifiques

Si tu souhaites exécuter uniquement un fichier ou une classe de tests spécifiques, tu peux préciser leur chemin :

```bash
pytest test_add.py  # Exécute les tests dans ce fichier
pytest test_add.py::TestAddFunction  # Exécute uniquement les tests dans cette classe

```

### c) Générer un rapport détaillé

Ajoute `-v` (verbeux) pour obtenir des détails sur chaque test exécuté :

```bash
pytest -v

```

### 7. Résumé : Écrire et exécuter des tests avec fonctions et classes

- **Les fonctions** sont idéales pour écrire des tests simples et isolés, en utilisant des assertions pour valider le comportement du code.
- **Les classes** permettent de regrouper des tests logiquement liés et offrent des méthodes pour initialiser et nettoyer l’environnement avec `setup_method` et `teardown_method`.
- **Pytest** facilite l'écriture de tests, l’organisation avec des classes, l'utilisation de fixtures pour éviter les répétitions, et la paramétrisation pour tester différents scénarios.
- **Exécuter les tests régulièrement** et utiliser des options comme `v` pour obtenir plus de détails est essentiel pour maintenir la qualité du code.

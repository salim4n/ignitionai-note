---
title: Apprendre à tester du code Python
description: Apprendre à tester du code Python
---

### 1. Qu'est-ce que tester le code Python ?

Tester le code Python consiste à valider que le code fait ce pour quoi il est conçu. Les tests unitaires sont des petits tests qui se concentrent sur une fonction ou une méthode, testant son comportement avec différentes entrées. Les tests aident à :

- **Vérifier le bon fonctionnement des fonctions**.
- **Attraper les bugs** avant qu'ils ne se propagent dans le projet.
- **Faciliter la maintenance** en s’assurant que les modifications futures n’introduisent pas de régressions (nouveaux bugs).

### 2. Pytest : un outil pour tester le code Python

**Pytest** est un framework populaire et puissant pour tester du code Python. Il est facile à utiliser, extensible et supporte les tests simples ainsi que les tests complexes.

### Installation de Pytest

Si tu n’as pas encore installé Pytest, tu peux l’installer avec la commande suivante :

```bash
pip install pytest

```

### 3. Comment écrire un test avec Pytest

### a) Créer une fonction à tester

Prenons une fonction simple, par exemple, une fonction qui calcule la somme des nombres dans une liste :

```python
# sum_list.py
def sum_list(numbers):
    return sum(numbers)

```

### b) Créer un fichier de test

Pour tester cette fonction, crée un fichier de test, souvent nommé avec un préfixe `test_`. Le fichier doit être dans le même répertoire ou dans un sous-répertoire dédié aux tests (comme `tests/`).

```python
# test_sum_list.py
from sum_list import sum_list

def test_sum_list_basic():
    numbers = [1, 2, 3, 4, 5]
    result = sum_list(numbers)
    assert result == 15

```

### c) Lancer le test

Pour exécuter les tests, il suffit de lancer Pytest depuis la ligne de commande :

```bash
pytest

```

Pytest trouvera automatiquement tous les fichiers qui commencent par `test_` et exécutera les fonctions qui commencent par `test_`.

### 4. Utiliser les **assertions** dans Pytest

L'outil de base pour vérifier les résultats des tests est l’**assertion**. Une assertion compare une sortie attendue avec la sortie réelle de la fonction testée.

Exemple d'assertion simple :

```python
assert sum_list([1, 2, 3]) == 6

```

Si cette assertion échoue, Pytest fournira un rapport indiquant pourquoi l’assertion a échoué.

### 5. Tester plusieurs scénarios

### a) Cas normaux

Pour tester du code Python efficacement, il faut couvrir plusieurs scénarios. Prenons quelques exemples supplémentaires pour notre fonction `sum_list`.

```python
def test_sum_list_empty():
    assert sum_list([]) == 0

def test_sum_list_negative():
    assert sum_list([-1, -2, -3]) == -6

def test_sum_list_mixed():
    assert sum_list([-1, 2, 3, -4]) == 0
```

- `test_sum_list_empty` vérifie si la fonction fonctionne avec une liste vide.
- `test_sum_list_negative` teste si elle gère correctement les nombres négatifs.
- `test_sum_list_mixed` teste un mélange de nombres positifs et négatifs.

### b) Tester les exceptions

Si une fonction doit lever une exception dans certaines conditions, Pytest permet de tester cela avec le gestionnaire `pytest.raises()`.

Prenons un exemple où on modifie `sum_list` pour lever une exception si l’entrée n’est pas une liste :

```python
# sum_list.py
def sum_list(numbers):
    if not isinstance(numbers, list):
        raise TypeError("Input must be a list")
    return sum(numbers)
```

On peut tester cette exception comme suit :

```python
# test_sum_list.py
import pytest
from sum_list import sum_list

def test_sum_list_raises_typeerror():
    with pytest.raises(TypeError, match="Input must be a list"):
        sum_list("not a list")
```

Ce test vérifie que la fonction lève une `TypeError` lorsqu'elle reçoit une chaîne au lieu d'une liste.

### 6. Paramétrer les tests avec **`pytest.mark.parametrize`**

Pour éviter de répéter le même test avec différentes entrées, tu peux utiliser `@pytest.mark.parametrize` pour exécuter un test sur plusieurs ensembles de données.

```python
# test_sum_list.py
import pytest
from sum_list import sum_list

@pytest.mark.parametrize("input_list, expected", [
    ([1, 2, 3], 6),
    ([], 0),
    ([-1, -2, -3], -6),
    ([1, -1, 1, -1], 0),
])
def test_sum_list(input_list, expected):
    assert sum_list(input_list) == expected

```

Ici, le même test est exécuté quatre fois avec des ensembles d’entrées différents. Cela rend les tests plus compacts et évite la duplication.

### 7. Structurer les tests : classes et fixtures

### a) Organiser les tests dans des classes

Si plusieurs tests partagent une même configuration ou se rapportent à la même fonctionnalité, il est pratique de les regrouper dans une classe.

```python
# test_sum_list.py
class TestSumList:
    def test_sum_list_basic(self):
        assert sum_list([1, 2, 3]) == 6

    def test_sum_list_empty(self):
        assert sum_list([]) == 0

```

Les classes permettent de structurer tes tests et d’éviter la redondance.

### b) Utiliser des fixtures pour la configuration

Les **fixtures** dans Pytest sont des fonctions spéciales qui configurent un environnement ou des données pour les tests. Par exemple, si tu as besoin de préparer des données avant d'exécuter des tests, une fixture peut t’aider à éviter la répétition.

```python
# test_sum_list.py
import pytest

@pytest.fixture
def sample_list():
    return [1, 2, 3]

def test_sum_list_with_fixture(sample_list):
    assert sum_list(sample_list) == 6

```

Ici, la fixture `sample_list` prépare une liste d'exemple, que tu peux utiliser dans plusieurs tests.

### 8. Intégrer Pytest dans le flux de développement

- **Exécuter les tests fréquemment** : Plus tôt tu détectes un bug, plus il est facile à corriger. Intègre l’exécution des tests dans ton flux de travail.
- **Utiliser des outils de CI (Intégration Continue)** comme GitHub Actions, GitLab CI, ou Jenkins pour exécuter automatiquement les tests à chaque modification du code.
- **Mesurer la couverture de code** avec des outils comme `pytest-cov` pour s’assurer que toutes les parties importantes du code sont testées.

### 9. Outils supplémentaires pour tester le code Python

- **`unittest`** : La bibliothèque de test unitaire intégrée à Python, bien qu’elle soit plus verbeuse que Pytest.
- **`tox`** : Utilisé pour tester ton code sur plusieurs versions de Python et vérifier les dépendances.
- **`mock`** : Utilisé pour simuler (ou "mock") des objets ou des fonctions pendant les tests, utile notamment pour les tests unitaires qui dépendent d'API externes.

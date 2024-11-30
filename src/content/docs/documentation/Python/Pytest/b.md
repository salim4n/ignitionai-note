---
title: Apprendre à écrire des tests utiles
description: Apprendre à écrire des tests utiles
---

### 1. **Qu'est-ce qu'un test utile ?**

Un **test utile** doit :

- Cibler les comportements critiques de la fonction ou du système.
- Couvrir les scénarios normaux (cas courants), les limites et les cas d'échec (cas extrêmes ou incorrects).
- Fournir des retours clairs et précis en cas de succès ou d'échec.
- Être facile à maintenir et à comprendre pour d’autres développeurs.

### 2. **Les bonnes pratiques pour écrire des tests utiles**

### a) Couvrir les cas de base, les cas limites, et les cas d'échec

Pour écrire un test utile, il est important de penser à **différents types de scénarios** :

- **Cas normaux** : les conditions d'utilisation courantes.
- **Cas limites** : tester les valeurs proches des extrêmes (comme zéro, des chaînes vides, des listes vides, etc.).
- **Cas d'échec** : s'assurer que la fonction gère correctement les erreurs.

### Exemple : Cas normal, limite, et d'échec

Prenons un exemple d'une fonction qui additionne deux nombres :

```python
# adder.py
def add(a, b):
    return a + b

```

Voici comment on peut écrire des tests utiles :

```python
# test_adder.py
from adder import add

def test_add_normal_case():
    assert add(2, 3) == 5

def test_add_zero_case():
    assert add(0, 5) == 5

def test_add_negative_case():
    assert add(-1, -1) == -2

def test_add_float_case():
    assert add(2.5, 3.2) == 5.7

def test_add_invalid_input():
    try:
        add("a", 3)
    except TypeError:
        assert True
    else:
        assert False, "Expected TypeError"

```

- **Cas normaux** : `test_add_normal_case` teste le comportement typique (addition de deux entiers).
- **Cas limite** : `test_add_zero_case` vérifie comment la fonction gère l'addition avec zéro.
- **Cas d'échec** : `test_add_invalid_input` vérifie qu'une `TypeError` est levée si l'entrée est incorrecte.

### b) Utiliser des **assertions claires**

Les tests doivent toujours avoir des **assertions** claires et directes pour vérifier le comportement attendu. Plus les assertions sont précises, plus il sera facile de diagnostiquer un échec. Pytest donne des rapports détaillés, donc même un simple `assert` peut fournir des informations précieuses en cas d'échec.

```python
def test_add_example():
    result = add(10, 5)
    assert result == 15, f"Expected 15 but got {result}"

```

Si le test échoue, le message `Expected 15 but got {result}` apparaîtra dans le rapport de test, ce qui facilite la compréhension de l’erreur.

### c) Séparer les cas d'usage

Évite de tester trop de choses dans un même test. Cela rend les erreurs difficiles à diagnostiquer. Il est préférable de créer plusieurs tests courts et ciblés.

Par exemple, plutôt que d’écrire un test unique pour vérifier plusieurs cas, sépare-les en plusieurs tests distincts :

```python
def test_add_positive_numbers():
    assert add(3, 7) == 10

def test_add_negative_numbers():
    assert add(-3, -7) == -10

def test_add_mixed_sign_numbers():
    assert add(-3, 7) == 4

```

Chaque test couvre un scénario précis, ce qui simplifie la localisation des erreurs.

### 3. **Organiser et structurer les tests**

### a) Groupes de tests avec des classes ou des fonctions paramétrées

Quand tu as plusieurs tests qui concernent une même fonctionnalité, tu peux les regrouper dans une classe pour mieux organiser ton code.

```python
# test_add.py
class TestAdd:
    def test_add_integers(self):
        assert add(2, 3) == 5

    def test_add_floats(self):
        assert add(2.1, 3.2) == 5.3

```

### b) Utiliser Pytest Parametrize pour éviter la duplication

Pytest permet d'utiliser `@pytest.mark.parametrize` pour exécuter un test sur plusieurs entrées sans dupliquer le code.

```python
import pytest

@pytest.mark.parametrize("a, b, expected", [
    (2, 3, 5),
    (0, 5, 5),
    (-1, -1, -2),
    (2.5, 3.2, 5.7),
])
def test_add_parametrized(a, b, expected):
    assert add(a, b) == expected

```

Cela évite d’écrire plusieurs tests pour chaque combinaison de paramètres. Pytest va exécuter le même test pour chaque ensemble de valeurs (`a, b, expected`).

### 4. **Tester les effets de bord**

Si ta fonction modifie des objets externes (comme des fichiers ou des bases de données), il est important de tester ces **effets de bord**.

### Exemple : Test de l’écriture dans un fichier

Supposons que ta fonction écrive dans un fichier. Tu dois vérifier que le contenu du fichier est bien ce que tu attends après l'exécution.

```python
# file_writer.py
def write_to_file(content, file_path):
    with open(file_path, 'w') as file:
        file.write(content)

```

Voici un test pour vérifier que l'écriture dans le fichier fonctionne correctement :

```python
# test_file_writer.py
import os
from file_writer import write_to_file

def test_write_to_file(tmpdir):
    file_path = os.path.join(tmpdir, "test.txt")
    write_to_file("Hello, World!", file_path)

    with open(file_path, 'r') as file:
        content = file.read()

    assert content == "Hello, World!"

```

Ici, `tmpdir` est un répertoire temporaire fourni par Pytest pour éviter de manipuler directement les fichiers du système.

### 5. **Bonus : Couverture de code**

Pour savoir si tes tests couvrent bien ton code, tu peux utiliser des outils comme `pytest-cov`, qui te montrent quelles parties de ton code ne sont pas couvertes par les tests.

Pour installer `pytest-cov` et l'utiliser :

```bash
pip install pytest-cov
pytest --cov=mon_module

```

Cela te donne un rapport sur les parties de ton code qui ne sont pas testées.

### Résumé du second objectif : Écrire des tests utiles

- **Couvre les cas de base, les cas limites, et les cas d'échec.**
- **Utilise des assertions claires** pour diagnostiquer rapidement les erreurs.
- **Sépare les tests en scénarios distincts** pour améliorer la lisibilité et le débogage.
- **Utilise des classes ou `@pytest.mark.parametrize`** pour organiser et éviter la duplication.
- **Teste les effets de bord** pour t’assurer que les actions (comme écrire dans un fichier) se passent comme prévu.

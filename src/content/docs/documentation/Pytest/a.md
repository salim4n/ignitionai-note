---
title: Tester les échecs avec Pytest
description: Tester les échecs avec Pytest
---

Pytest fournit une fonctionnalité intégrée pour vérifier si une fonction soulève l'exception attendue. Pour cela, on peut utiliser `pytest.raises()`. Cette méthode est particulièrement utile pour tester des scénarios où une fonction échoue intentionnellement dans certaines conditions.

## Exemple 1 : Tester qu'une exception est levée

Supposons que nous ayons une fonction qui divise deux nombres et qu'on veuille tester qu'elle lève une exception lorsque le dénominateur est zéro (ce qui est une erreur courante de division par zéro).

```python
# division.py
def divide(a, b):
    if b == 0:
        raise ValueError("Division by zero is not allowed.")
    return a / b

```

Ici, si `b` est égal à zéro, la fonction lève une exception `ValueError`. Voyons comment écrire un test pour cet échec :

```python
# test_division.py
import pytest
from division import divide

def test_divide_by_zero():
    with pytest.raises(ValueError, match="Division by zero is not allowed."):
        divide(10, 0)

```

Dans ce test :

- `pytest.raises(ValueError)` s'assure que la fonction lève bien l'exception `ValueError` quand `b = 0`.
- L'argument `match` permet de vérifier que le message d'erreur correspond à ce que nous attendons.

### 2. Tester les échecs dans d'autres cas

Outre les exceptions, vous pouvez également tester des situations où une fonction échoue en termes de retour de valeurs incorrectes ou de comportements inattendus.

### Exemple 2 : Tester le mauvais retour d'une fonction

Imaginons une fonction qui prend une chaîne et la transforme en entier. Si la chaîne n'est pas un nombre valide, elle doit retourner -1.

```python
# parse.py
def parse_to_int(value):
    try:
        return int(value)
    except ValueError:
        return -1

```

On peut tester les échecs avec une chaîne qui ne peut pas être convertie en entier :

```python
# test_parse.py
from parse import parse_to_int

def test_parse_invalid_string():
    result = parse_to_int("invalid_number")
    assert result == -1

```

Ici, nous testons que la fonction renvoie bien `-1` lorsque la chaîne passée n'est pas un nombre valide.

### 3. Utiliser Pytest pour suivre les échecs et les erreurs

Quand vous utilisez Pytest, si un test échoue, Pytest génère un rapport détaillé sur la nature de l'échec, y compris les informations sur les assertions échouées ou les exceptions non gérées. Cela permet de localiser et de corriger facilement les erreurs.

Pour exécuter les tests, il suffit de lancer la commande suivante dans le terminal, dans le répertoire contenant vos fichiers de tests :

```bash
pytest

```

### Résumé de l'objectif 1 : Tester les échecs

- Vous avez appris à utiliser `pytest.raises()` pour tester si une exception est correctement levée.
- Vous avez vu comment tester que votre fonction gère correctement les valeurs incorrectes.
- Vous avez compris l'importance de tester les échecs pour rendre votre code plus robuste.

---
title: Introduction
description: Définir une classe de modèle personnalisée
---

1. **Flexibilité accrue** :
    - Permet d'implémenter des architectures complexes avec des branches des boucles ou des conditions qui ne sont pas facilement réalisables avec les API fonctionnelle ou séquent.
2. **Gestion personnalisée du passage des données** :
    - Vous pouvez définir comment les données traversent les différentes couches, ce qui est particulièrement utile pour des opérations non standard.
3. **Intégration facile de la logique personnalisée** :
    - Vous pouvez inclure calculs spécifiques, comme des pertes personnalisées ou des métriques, directement dans le modèle.
4. **Réutilisation du code** :
    - Créer des composants modulaires qui peuvent être réutilisés dans d'autres modèles.
5. **Debugging amélioré** :
    - Facilite le suivi et la modification des étapes individuelles dans le traitement des données.
6. **Contrôle total sur l'entraînement** :
    - Personnalisation complète des boucles d'entraînement y compris l'ajout de fonctions de call-back ou d'ajustements dynamiques.
7. **Meilleure organisation du code** :
    - Regroupe la logique de construction, d'entraînement et d'évaluation d'un modèle dans une seule classe, ce qui facilite la compréhension et la maintenance.

### Conclusion

En résumé, définir une classe de modèle personnalisée offre une liberté et un contrôle complets sur la structure et le comportement du modèle. Cela est particulièrement avantage pour les projets complexes ou lorsqu'une personnalisation fine est nécessaire.
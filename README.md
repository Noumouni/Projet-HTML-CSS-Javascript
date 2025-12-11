# Rio Ascension — Idle Clicker Ninja

## Description

Rio Ascension est un idle clicker inspiré de l’univers ninja. Clique pour accumuler du Rio, débloque des rangs, augmente ton CPS (Chakra Per Second) et atteins le rang Kage.

## Fonctionnalités

- Progression par rangs (Genin → Kage) avec récompenses CPS équilibrées
- Sauvegarde locale automatique (localStorage)

- Animations immersives:
  - Features: fade-up + scale
  - Icônes: pulsation chakra
  - Mécaniques: glow reveal
  - Images: dissolution fluide sans cadre
- Scroll reveal performant (IntersectionObserver)
- Compteur marketing dynamique (simulateur de joueurs)

## Installation

1. Place tous les fichiers à la racine:
   - `index.html`
   - `style.css`
   - `script.js`
   - `Assets/` (images, vidéos)
2. Ouvre `index.html` dans ton navigateur.

## Structure HTML

- Header fixe avec icônes sociales (Font Awesome)
- Hero section avec titre dégradé animé et bouton “Jouer”
- Sections: À propos, Fonctionnalités, Mécaniques, Progression, Vidéo, Marketing, Témoignages
- Footer stable et centré

## Notes techniques

- Le bouton “Jouer” a un feedback visuel (scale) au clic.
- Les grilles `.features-grid` et `.cards` utilisent `display:flex` + `flex-wrap` pour éviter l’empilement vertical.
- Le scroll reveal est déclenché via IntersectionObserver (pas de double logique).
- Les nombres dans le HUD sont formatés via `formatCompact`.

## Crédits

Développé par Noumouni & Florine — 2025

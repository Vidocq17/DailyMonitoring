# Split Workout Refactor + Glassmorphism Design

**Date:** 2026-05-21  
**Scope:** WorkoutFormSplit.vue, WorkoutChartsSplit.vue, base.css  
**Constraint:** Ne pas toucher aux fichiers PPL

---

## Problème

`WorkoutFormSplit.vue` et `WorkoutChartsSplit.vue` dupliquent les mêmes données statiques :
- Liste des groupes musculaires (`groupes_muscu` / `groupTabs`)
- Exercices par groupe (`exercisesBySession` / `groups`)
- Mapping label→key (`labelToKey` / `exercises`)
- Couleurs par groupe et valeurs min/max (uniquement dans Charts)

Bugs actuels dans les couleurs : TRICEPS et PECS partagent le même rouge, ISCHIOS_FESSIERS et DOS partagent le même gris.

---

## Approche retenue : A

Fichier `.ts` pur exportant des constantes statiques. Zéro overhead runtime, importé directement par les deux composants.

---

## Section 1 — Fichier de données partagé

**Nouveau fichier :** `src/data/splitWorkoutData.ts`

### Exports

```ts
export const MUSCLE_GROUPS: readonly MuscleGroup[]
export type MuscleGroup = 'PECS' | 'DOS' | 'EPAULES' | 'QUADRICEPS' | 'BICEPS' | 'TRICEPS' | 'ISCHIOS_FESSIERS'

export const GROUP_COLORS: Record<MuscleGroup, string>
// Couleurs corrigées (plus de doublons) :
// PECS → rouge,  DOS → slate,  EPAULES → orange
// QUADRICEPS → vert,  BICEPS → rose,  TRICEPS → violet,  ISCHIOS_FESSIERS → teal

export interface Exercise {
  label: string
  key: string
  group: MuscleGroup
  min: number
  max: number
}

export const EXERCISES: Exercise[]         // 41 exercices, source unique
export const EXERCISES_BY_GROUP: Record<MuscleGroup, string[]>  // dérivé
export const LABEL_TO_KEY: Record<string, string>               // dérivé
```

### Suppressions dans les composants

| Supprimé de FormSplit | Supprimé de ChartsSplit |
|---|---|
| `groupes_muscu` | `groupTabs` |
| `exercisesBySession` | `groups` |
| `labelToKey` | `exercises` |
| — | `minValues` |
| — | `maxValues` |

---

## Section 2 — Design system glassmorphism

**Fichier modifié :** `src/assets/styles/base.css`

### Nouvelles variables CSS

```css
/* Light */
--color-surface: rgba(255, 255, 255, 0.75)
--color-light: rgba(243, 244, 246, 0.6)
--glass-blur: blur(12px)
--glass-border: rgba(255, 255, 255, 0.4)
--shadow-card: 0 4px 24px rgba(0, 0, 0, 0.08)
--shadow-card-hover: 0 8px 32px rgba(0, 0, 0, 0.14)

/* Dark */
--color-surface: rgba(30, 30, 30, 0.7)
--color-light: rgba(41, 41, 41, 0.6)
--glass-border: rgba(255, 255, 255, 0.08)
--shadow-card: 0 4px 24px rgba(0, 0, 0, 0.3)
--shadow-card-hover: 0 8px 48px rgba(0, 0, 0, 0.45)
```

### Nouvelle classe utilitaire `.glass-card`

```css
.glass-card {
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-card);
  transition: box-shadow 0.2s, transform 0.2s;
}
.glass-card:hover {
  box-shadow: var(--shadow-card-hover);
  transform: translateY(-2px);
}
```

### Boutons

`border-radius` global → `14px` (plus arrondi). Gradient inchangé.

### Application dans les composants Split

- Conteneur principal `WorkoutChartsSplit` : ajouter `glass-card`
- Cartes individuelles des charts : remplacer styles inline par `glass-card`
- Conteneur `WorkoutFormSplit` : ajouter `glass-card`

---

## Fichiers touchés

| Fichier | Action |
|---|---|
| `src/data/splitWorkoutData.ts` | **Créer** |
| `src/Views/Add/WorkoutFormSplit.vue` | Modifier (imports + classes) |
| `src/Views/Charts/WorkoutChartsSplit.vue` | Modifier (imports + classes) |
| `src/assets/styles/base.css` | Modifier (vars + `.glass-card`) |
| `src/assets/styles/main.css` | Modifier (`border-radius` boutons) |

**Fichiers PPL : non touchés.**

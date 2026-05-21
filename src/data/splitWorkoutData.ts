export const MUSCLE_GROUPS = [
  'PECS',
  'DOS',
  'EPAULES',
  'QUADRICEPS',
  'BICEPS',
  'TRICEPS',
  'ISCHIOS_FESSIERS',
] as const

export type MuscleGroup = (typeof MUSCLE_GROUPS)[number]

export const GROUP_COLORS: Record<MuscleGroup, string> = {
  PECS: 'rgb(239, 68, 68)',
  DOS: 'rgb(100, 116, 139)',
  EPAULES: 'rgb(255, 150, 0)',
  QUADRICEPS: 'rgb(100, 200, 100)',
  BICEPS: 'rgb(255, 150, 255)',
  TRICEPS: 'rgb(168, 85, 247)',
  ISCHIOS_FESSIERS: 'rgb(20, 184, 166)',
}

export interface Exercise {
  label: string
  key: string
  group: MuscleGroup
  min: number
  max: number
}

export const EXERCISES: Exercise[] = [
  // PECS
  { label: 'Développé couché barre', key: 'developpe_couche_barre', group: 'PECS', min: 15, max: 110 },
  { label: 'Développé incliné haltères', key: 'developpe_incline_halteres', group: 'PECS', min: 5, max: 40 },
  { label: 'Écarté à la poulie', key: 'ecarte_poulie', group: 'PECS', min: 2.5, max: 40 },
  { label: 'Pec deck', key: 'chest_press_machine', group: 'PECS', min: 10, max: 120 },
  { label: 'Presse pectorale machine', key: 'chest_press_machine', group: 'PECS', min: 10, max: 120 },
  { label: 'Écartés bas-haut à la poulie', key: 'ecartes_bas_haut_poulie', group: 'PECS', min: 0, max: 60 },
  // DOS
  { label: 'Tractions', key: 'tractions_assistees', group: 'DOS', min: 0, max: 80 },
  { label: 'Tirage vertical', key: 'tirage_vertical_poulie', group: 'DOS', min: 0, max: 100 },
  { label: 'Rowing barre', key: 'rowing_barre', group: 'DOS', min: 20, max: 100 },
  { label: 'Rowing unnilateral poulie haute', key: 'rowing_unilateral_poulie', group: 'DOS', min: 0, max: 100 },
  { label: 'Rowing unilateral haltères', key: 'rowing_unilateral_halteres', group: 'DOS', min: 5, max: 40 },
  { label: 'Rowing poitrine appuyée', key: 'rowing_poitrine_appuyee', group: 'DOS', min: 0, max: 100 },
  { label: 'Tirage poulie basse', key: 'tirage_poulie_basse', group: 'DOS', min: 20, max: 120 },
  { label: 'Pullover câble', key: 'pullover_cable', group: 'DOS', min: 5, max: 60 },
  { label: 'Reverse cable crossover', key: 'reverse_cable', group: 'DOS', min: 2.5, max: 40 },
  // EPAULES
  { label: 'Développé militaire barre', key: 'developpe_militaire_barre', group: 'EPAULES', min: 10, max: 60 },
  { label: 'Élévations latérales haltères', key: 'elevations_laterales_halteres', group: 'EPAULES', min: 2.5, max: 20 },
  { label: 'Oiseau haltères / câble', key: 'oiseau_halteres_cable', group: 'EPAULES', min: 2.5, max: 25 },
  { label: 'Shrug haltères', key: 'shrug_halteres', group: 'EPAULES', min: 10, max: 60 },
  { label: 'Farmer Walk', key: 'farmer_walk', group: 'EPAULES', min: 10, max: 30 },
  // QUADRICEPS
  { label: 'Squat barre', key: 'squat', group: 'QUADRICEPS', min: 20, max: 200 },
  { label: 'Squat barre guidée', key: 'squat_barre', group: 'QUADRICEPS', min: 20, max: 200 },
  { label: 'Presse inclinée', key: 'presse_incline', group: 'QUADRICEPS', min: 60, max: 160 },
  { label: 'Fentes marchées', key: 'fentes_marchees', group: 'QUADRICEPS', min: 0, max: 40 },
  { label: 'Bulgarian split squat', key: 'bulgarian_split_squat', group: 'QUADRICEPS', min: 0, max: 100 },
  { label: 'Leg extension', key: 'leg_extension', group: 'QUADRICEPS', min: 10, max: 120 },
  { label: 'Mollets', key: 'mollets', group: 'QUADRICEPS', min: 0, max: 120 },
  // BICEPS
  { label: 'Curl incliné haltères', key: 'curl_halteres', group: 'BICEPS', min: 2.5, max: 30 },
  { label: 'Curl marteau haltères', key: 'curl_marteau_halteres', group: 'BICEPS', min: 2.5, max: 30 },
  { label: 'Curl Baleysien', key: 'curl_baleysien', group: 'BICEPS', min: 0, max: 60 },
  { label: 'Curl marteau poulie', key: 'curl_marteau_poulie', group: 'BICEPS', min: 0, max: 60 },
  { label: 'Curl barre EZ', key: 'curl_barre', group: 'BICEPS', min: 10, max: 80 },
  { label: 'Avant-bras / Grip', key: 'grip_halteres', group: 'BICEPS', min: 5, max: 60 },
  // TRICEPS
  { label: 'Skullcrusher barre EZ', key: 'skullcrusher', group: 'TRICEPS', min: 5, max: 60 },
  { label: 'Pushdown câble', key: 'pushdown_cable', group: 'TRICEPS', min: 5, max: 30 },
  { label: 'extension overhead', key: 'extension_overhead', group: 'TRICEPS', min: 5, max: 30 },
  { label: 'Dips', key: 'dips', group: 'TRICEPS', min: 0, max: 50 },
  // ISCHIOS_FESSIERS
  { label: 'Soulevé de terre roumain', key: 'souleve_de_terre', group: 'ISCHIOS_FESSIERS', min: 20, max: 200 },
  { label: 'Hip thrust', key: 'hip_thrust', group: 'ISCHIOS_FESSIERS', min: 20, max: 220 },
  { label: 'Leg curl', key: 'leg_curl', group: 'ISCHIOS_FESSIERS', min: 10, max: 120 },
  { label: 'Abducteurs machine', key: 'leg_abduction', group: 'ISCHIOS_FESSIERS', min: 10, max: 140 },
  { label: 'Adducteurs machine', key: 'leg_adduction', group: 'ISCHIOS_FESSIERS', min: 0, max: 100 },
]

export const EXERCISES_BY_GROUP = MUSCLE_GROUPS.reduce(
  (acc, group) => {
    acc[group] = EXERCISES.filter((e) => e.group === group).map((e) => e.label)
    return acc
  },
  {} as Record<MuscleGroup, string[]>,
)

export const LABEL_TO_KEY: Record<string, string> = Object.fromEntries(
  EXERCISES.map((e) => [e.label, e.key]),
)

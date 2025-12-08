// src/types/index.ts

export interface WorkoutEntry {
  id: number
  exercise_name: string
  weight: number
  created_at: string
}

export type ExerciseKey =
  | 'developpe_couche_barre'
  | 'developpe_incline_halteres'
  | 'developpe_militaire_barre'
  | 'chest_press_machine'
  | 'dips_assistes'
  | 'elevations_laterales_halteres'
  | 'skullcrusher'
  | 'tractions_assistees'
  | 'rowing_barre'
  | 'tirage_vertical_poulie'
  | 'reverse_cable'
  | 'shrug_halteres'
  | 'curl_barre'
  | 'curl_halteres'
  | 'grip_halteres'
  | 'squat_barre'
  | 'souleve_de_terre'
  | 'presse_a_cuisses'
  | 'leg_curl'
  | 'leg_extension'
  | 'leg_abduction'
  | 'leg_adduction'
  | 'mollets'

export interface DailyEntry {
  id: number
  date_du_jour: string
  kcal: number
  glucides: number
  lipides: number
  proteines: number
  pas: number
  eau: number
  poids: number

  sport: boolean
  seance: string | null

  cardio: boolean
  km: number | null
  typeof_cardio: string | null

  abdos: boolean
}

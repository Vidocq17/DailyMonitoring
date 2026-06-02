// src/types/index.ts

export interface WorkoutEntry {
  id: number
  exercise_name: string
  weight: number
  created_at: string
}

export type ExerciseKey = string

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

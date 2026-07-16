import { defineStore } from 'pinia'
import { supabase } from '../../supabaseClient'
import type { WorkoutEntry, ExerciseKey } from '@/types'
import { track } from "@decode-analytics/sdk"

const WORKOUT_STORAGE_KEY = 'workout_entries_v1'

type RunRow = {
  id: string
  duration_sec: number
  distance_km: number
  comment: string | null
  created_at: string
}

function loadInitialWorkoutEntries(): WorkoutEntry[] {
  if (typeof window === 'undefined') return []
  const raw = localStorage.getItem(WORKOUT_STORAGE_KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw) as WorkoutEntry[]
  } catch {
    console.warn('Impossible de parser workout_entries_v1 depuis localStorage')
    return []
  }
}

function persistWorkoutEntries(entries: WorkoutEntry[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(WORKOUT_STORAGE_KEY, JSON.stringify(entries))
  } catch (e) {
    console.warn('Impossible de sauvegarder les workout entries en localStorage', e)
  }
}

export const useWorkoutStore = defineStore('workout', {
  state: () => ({
    entries: loadInitialWorkoutEntries() as WorkoutEntry[],
    runs: [] as RunRow[], // ✅ jamais undefined
  }),

  actions: {
    async fetchWeights(): Promise<void> {
      const { data, error } = await supabase
        .from('workout_weights')
        .select('*')
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Erreur fetchWeights:', error)
        // OFFLINE : on garde les données locales existantes
        return
      }

      this.entries = (data as WorkoutEntry[]) || []
      persistWorkoutEntries(this.entries)
    },

    getExerciseWeights(exerciseKey: ExerciseKey): WorkoutEntry[] {
      return this.entries
        .filter((e) => e.exercise_name === exerciseKey)
        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    },

    async addWeight(exerciseKey: ExerciseKey, weight: number): Promise<void> {
      const { error } = await supabase.from('workout_weights').insert({
        exercise_name: exerciseKey,
        weight: Number(weight),
      })

      if (error) {
        console.error('Erreur addWeight:', error)
        return
      }

      await this.fetchWeights()
      track('workout_weight_added', {
        metadata: {
          exercise: exerciseKey,
        },
      })
    },

    getBestWeight(exerciseKey: ExerciseKey): number | null {
      const weights = this.entries
        .filter((e) => e.exercise_name === exerciseKey)
        .map((e) => e.weight)

      if (!weights.length) return null

      if (exerciseKey !== 'dips_assistes' && exerciseKey !== 'tractions_assistees') {
        return Math.max(...weights)
      }
      return Math.min(...weights)
    },

    // ✅ RUNS (nouveau)
    async fetchRuns(): Promise<void> {
      const { data, error } = await supabase
        .from('runs')
        .select('id, duration_sec, distance_km, comment, created_at')
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Erreur fetchRuns:', error)
        // même stratégie que fetchWeights : ne pas throw pour éviter crash UI
        return
      }

      this.runs = (data ?? []) as RunRow[]
    },

    async addRun(payload: { duration_sec: number; distance_km: number; comment?: string }): Promise<void> {
      const { error } = await supabase.from('runs').insert({
        duration_sec: payload.duration_sec,
        distance_km: payload.distance_km,
        comment: payload.comment ?? null,
      })

      if (error) {
        console.error('Erreur addRun:', error)
        return
      }

      // ✅ optionnel mais pratique : refresh direct
      await this.fetchRuns()
    },
  },

  getters: {
    bestPaceSecPerKm: (state): number | null => {
      const paces = (state.runs ?? [])
        .filter((r) => typeof r.distance_km === 'number' && r.distance_km > 0)
        .map((r) => r.duration_sec / r.distance_km)

      if (!paces.length) return null
      return Math.min(...paces)
    },
  },
})

import { defineStore } from 'pinia'
import { supabase } from '../../supabaseClient'
import type { WorkoutEntry, ExerciseKey } from '@/types'

const WORKOUT_STORAGE_KEY = 'workout_entries_v1'

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
        .sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
        )
    },

    async addWeight(exerciseKey: ExerciseKey, weight: number): Promise<void> {
      const { error } = await supabase
        .from('workout_weights')
        .insert({
          exercise_name: exerciseKey,
          weight: Number(weight),
        })

      if (error) {
        console.error('Erreur addWeight:', error)
        return
      }

      await this.fetchWeights()
      // fetchWeights appelle déjà persistWorkoutEntries
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
  },
})

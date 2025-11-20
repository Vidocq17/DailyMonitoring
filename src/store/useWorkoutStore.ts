import { defineStore } from 'pinia'
import { supabase } from '../../supabaseClient'
import type { WorkoutEntry, ExerciseKey } from '../types/index'

export const useWorkoutStore = defineStore('workout', {
  state: () => ({
    entries: [] as WorkoutEntry[],
  }),

  actions: {
    async fetchWeights(): Promise<void> {
      const { data, error } = await supabase
        .from('workout_weights')
        .select('*')
        .order('created_at', { ascending: true })

      if (error) {
        console.error(error)
        return
      }

      this.entries = (data as WorkoutEntry[]) || []
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

      await this.fetchWeights() // recharge les données proprement
    },

    getBestWeight(exerciseKey: ExerciseKey): number | null {
      const weights = this.entries
        .filter((e) => e.exercise_name === exerciseKey)
        .map((e) => e.weight)

      if (!weights.length) return null

      // Correction : ta condition était incorrecte (OR -> toujours vrai)
      if (exerciseKey !== 'dips_assistes' && exerciseKey !== 'tractions_assistees') {
        return Math.max(...weights)
      }

      return Math.min(...weights)
    },
  },
})

import { defineStore } from 'pinia'
import { supabase } from '../../supabaseClient'

export const useWorkoutStore = defineStore('workout', {
  state: () => ({
    entries: [],
  }),
  actions: {
    async fetchWeights() {
      const { data } = await supabase.from('workout_weights').select('*')
      this.entries = data || []
    },
    getExerciseWeights(exerciseKey) {
      return this.entries
        .filter((e) => e.exercise_name === exerciseKey)
        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    },
    async addWeight(exerciseKey, weight) {
      const { data } = await supabase
        .from('workout_weights')
        .insert([{ exercise_name: exerciseKey, weight }])
      if (data) this.entries.push(...data)
    },
  },
})

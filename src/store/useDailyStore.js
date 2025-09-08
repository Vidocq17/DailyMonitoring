import { defineStore } from 'pinia'
import { supabase } from '../../supabaseClient'

export const useDailyStore = defineStore('daily', {
  state: () => ({
    entries: [],
  }),
  actions: {
    // filtrer par date décroissante
    async fetchDaily() {
      const { data, error } = await supabase.from('daily_monitoring').select('*')
      if (!error) {
        this.entries = data.sort((a, b) => new Date(b.date_du_jour) - new Date(a.date_du_jour))
      }
    },

    async addDaily(newEntry) {
      const { data, error } = await supabase.from('daily_monitoring').insert(newEntry).select()

      if (!error && data) {
        this.entries.push(data[0])
      }
    },

    async updateDaily(id, updatedEntry) {
      const { data, error } = await supabase
        .from('daily_monitoring')
        .update(updatedEntry)
        .eq('id', id)
        .select()

      if (error) {
        console.error('Erreur update :', error)
        return
      }

      if (data && data.length > 0) {
        const index = this.entries.findIndex((e) => e.id === id)
        if (index !== -1) {
          this.entries.splice(index, 1, data[0]) // met à jour localement
        }
      }
    },

    getLastWeight() {
      if (this.entries.length === 0) return null
      const sortedEntries = [...this.entries].sort((a, b) => new Date(b.date) - new Date(a.date))
      return sortedEntries[0].weight || null
    },
  },
})

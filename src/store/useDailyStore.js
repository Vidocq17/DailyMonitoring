import { defineStore } from 'pinia'
import { supabase } from '../../supabaseClient'

export const useDailyStore = defineStore('daily', {
  state: () => ({
    entries: [],
  }),
  actions: {
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
          this.entries.splice(index, 1, data[0])
        }
      }
    },

    async deleteDaily(id) {
      const { error } = await supabase.from('daily_monitoring').delete().eq('id', id)
      if (error) {
        console.error('Erreur de suppression :', error)
        return
      }
      this.entries = this.entries.filter((entry) => entry.id !== id)
    },

    getLastWeight() {
      if (this.entries.length === 0) return null
      const sortedEntries = [...this.entries].sort(
        (a, b) => new Date(b.date_du_jour) - new Date(a.date_du_jour),
      )
      return sortedEntries[0].poids || null
    },

    getLastEntry() {
      if (this.entries.length === 0) return null
      const sortedEntries = [...this.entries].sort(
        (a, b) => new Date(b.date_du_jour) - new Date(a.date_du_jour),
      )
      return sortedEntries[0] || null
    },
  },
})

import { defineStore } from 'pinia'
import { supabase } from '../../supabaseClient'
import type { DailyEntry } from  '../types/index'

export const useDailyStore = defineStore('daily', {
  state: () => ({
    entries: [] as DailyEntry[],
  }),

  actions: {
    async fetchDaily(): Promise<void> {
      const { data, error } = await supabase
        .from('daily_monitoring')
        .select('*')
        .order('date_du_jour', { ascending: false })

      if (error) {
        console.error(error)
        return
      }

      this.entries = (data as DailyEntry[]) || []
    },

    async addDaily(newEntry: Omit<DailyEntry, 'id'>): Promise<void> {
      const { data, error } = await supabase
        .from('daily_monitoring')
        .insert(newEntry)
        .select()

      if (error) {
        console.error(error)
        return
      }

      if (data && data.length > 0) {
        this.entries.push(data[0] as DailyEntry)
      }
    },

    async updateDaily(id: number, updatedEntry: Partial<DailyEntry>): Promise<void> {
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
          this.entries[index] = data[0] as DailyEntry
        }
      }
    },

    async deleteDaily(id: number): Promise<void> {
      const { error } = await supabase.from('daily_monitoring').delete().eq('id', id)

      if (error) {
        console.error('Erreur suppression :', error)
        return
      }

      this.entries = this.entries.filter((entry) => entry.id !== id)
    },

    getLastWeight(): number | null {
      if (!this.entries.length) return null

      return (
        [...this.entries]
          .sort(
            (a, b) =>
              new Date(b.date_du_jour).getTime() -
              new Date(a.date_du_jour).getTime(),
          )[0].poids ?? null
      )
    },

    getLastEntry(): DailyEntry | null {
      if (!this.entries.length) return null

      return (
        [...this.entries].sort(
          (a, b) =>
            new Date(b.date_du_jour).getTime() -
            new Date(a.date_du_jour).getTime(),
        )[0] ?? null
      )
    },
  },
})

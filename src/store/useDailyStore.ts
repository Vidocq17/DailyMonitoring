import { defineStore } from 'pinia'
import { supabase } from '../../supabaseClient'
import type { DailyEntry } from '@/types'

const DAILY_STORAGE_KEY = 'daily_entries_v1'

function loadInitialEntriesFromStorage(): DailyEntry[] {
  if (typeof window === 'undefined') return []
  const raw = localStorage.getItem(DAILY_STORAGE_KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw) as DailyEntry[]
  } catch {
    console.warn('Impossible de parser daily_entries_v1 depuis localStorage')
    return []
  }
}

function persistEntries(entries: DailyEntry[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(DAILY_STORAGE_KEY, JSON.stringify(entries))
  } catch (e) {
    console.warn('Impossible de sauvegarder les daily entries en localStorage', e)
  }
}

export const useDailyStore = defineStore('daily', {
  state: () => ({
    // 🔥 au premier chargement, on essaie de charger depuis localStorage
    entries: loadInitialEntriesFromStorage() as DailyEntry[],
  }),

  actions: {
    async fetchDaily(): Promise<void> {
      const { data, error } = await supabase
        .from('daily_monitoring')
        .select('*')
        .order('date_du_jour', { ascending: false })

      if (error) {
        console.error(error)
        // ⚠️ très important : on NE vide PAS entries
        // -> si offline, on garde les données locales
        return
      }

      this.entries = (data as DailyEntry[]) || []
      persistEntries(this.entries)
    },

    async addDaily(newEntry: Omit<DailyEntry, 'id'>): Promise<void> {
      const { data, error } = await supabase.from('daily_monitoring').insert(newEntry).select()

      if (error) {
        console.error(error)
        return
      }

      if (data && data.length > 0) {
        this.entries.push(data[0] as DailyEntry)
        persistEntries(this.entries)
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
          persistEntries(this.entries)
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
      persistEntries(this.entries)
    },

    getLastWeight(): number | null {
      if (!this.entries.length) return null

      return (
        [...this.entries].sort(
          (a, b) => new Date(b.date_du_jour).getTime() - new Date(a.date_du_jour).getTime(),
        )[0].poids ?? null
      )
    },

    getLastEntry(): DailyEntry | null {
      if (!this.entries.length) return null

      return (
        [...this.entries].sort(
          (a, b) => new Date(b.date_du_jour).getTime() - new Date(a.date_du_jour).getTime(),
        )[0] ?? null
      )
    },
  },
})

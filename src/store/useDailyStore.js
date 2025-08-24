import { defineStore } from 'pinia'
import { supabase } from '../../supabaseClient'

export const useDailyStore = defineStore('daily', {
  state: () => ({
    entries: [],
    loading: false,
  }),
  actions: {
    async fetchDaily(month = null) {
      this.loading = true
      let query = supabase
        .from('daily_monitoring')
        .select('*')
        .order('date_du_jour', { ascending: true })
      if (month) {
        query = query.gte('date_du_jour', `${month}-01`).lte('date_du_jour', `${month}-31`)
      }
      const { data, error } = await query
      if (!error) this.entries = data
      this.loading = false
    },
    async addDaily(entry) {
      const { data, error } = await supabase.from('daily_monitoring').insert(entry).select() // important pour récupérer la ligne insérée

      if (error) {
        console.error('Erreur insert :', error)
        return
      }

      if (data && Array.isArray(data)) {
        this.entries.push(...data)
      } else {
        console.warn('Aucune donnée retournée par Supabase')
      }
    },
  },
})

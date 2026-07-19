<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useDailyStore } from './store/useDailyStore'
import { useToast } from 'vue-toastification'

const store = useDailyStore()
const toast = useToast()
const password = import.meta.env.VITE_PASSWORD
const passwordCheck = ref('')

// --- FILTRES ---
const fromDate = ref<string>('')
const toDate = ref<string>('')
const onlySport = ref(false)
const onlyCardio = ref(false)
const onlyAbdos = ref(false)

onMounted(() => {
  store.fetchDaily()
})

const canDelete = computed(() => passwordCheck.value !== '' && passwordCheck.value === password)

const deleteDaily = async (id: number) => {
  if (!confirm('Es-tu sûr de vouloir supprimer cette entrée ?')) return
  try {
    await store.deleteDaily(id)
    toast.success('Entrée supprimée ✅')
  } catch (err: any) {
    console.error(err)
    toast.error(err?.message || 'Une erreur est survenue lors de la suppression.')
  }
}

const filteredEntries = computed(() => {
  return [...store.entries]
    .filter((entry) => {
      const entryDate = new Date(entry.date_du_jour)

      if (fromDate.value) {
        const from = new Date(fromDate.value)
        if (entryDate < from) return false
      }

      if (toDate.value) {
        const to = new Date(toDate.value)
        to.setHours(23, 59, 59, 999)
        if (entryDate > to) return false
      }

      if (onlySport.value && !entry.sport) return false
      if (onlyCardio.value && !entry.cardio) return false
      if (onlyAbdos.value && !entry.abdos) return false

      return true
    })
    .sort((a, b) => new Date(b.date_du_jour).getTime() - new Date(a.date_du_jour).getTime())
})

const dayLabel = (dateStr: string) => {
  const entryDate = new Date(dateStr)
  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(today.getDate() - 1)

  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

  if (sameDay(entryDate, today)) return "Aujourd'hui"
  if (sameDay(entryDate, yesterday)) return 'Hier'
  return entryDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}
</script>

<template>
  <main class="mx-auto max-w-2xl space-y-6 px-5 pt-4 pb-8">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-on-surface">Historique</h2>
    </div>

    <!-- Mot de passe (suppression) -->
    <section class="rounded-xl bg-white p-5 ambient-shadow">
      <label class="block text-xs font-bold uppercase tracking-wide text-on-surface-variant">
        Mot de passe (pour supprimer)
        <input
          type="password"
          v-model="passwordCheck"
          placeholder="••••••••"
          class="mt-1 w-full rounded-lg border border-transparent bg-surface-container-low px-4 py-2 text-sm text-on-surface outline-none focus:border-primary"
        />
      </label>
      <p v-if="passwordCheck !== '' && !canDelete" class="mt-1 text-xs text-error">Mot de passe incorrect</p>
    </section>

    <!-- Filtres -->
    <section class="space-y-3 rounded-xl bg-white p-5 ambient-shadow">
      <div class="grid grid-cols-2 gap-3">
        <label class="flex flex-col text-xs font-semibold text-on-surface-variant">
          Du
          <input
            type="date"
            v-model="fromDate"
            class="mt-1 rounded-lg border-none bg-surface-container-low px-3 py-2 text-sm text-on-surface outline-none"
          />
        </label>
        <label class="flex flex-col text-xs font-semibold text-on-surface-variant">
          Au
          <input
            type="date"
            v-model="toDate"
            class="mt-1 rounded-lg border-none bg-surface-container-low px-3 py-2 text-sm text-on-surface outline-none"
          />
        </label>
      </div>
      <div class="flex flex-wrap gap-2">
        <button
          type="button"
          @click="onlySport = !onlySport"
          class="rounded-full px-4 py-2 text-xs font-bold transition-colors active-scale"
          :class="onlySport ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface-variant'"
        >
          Sport
        </button>
        <button
          type="button"
          @click="onlyCardio = !onlyCardio"
          class="rounded-full px-4 py-2 text-xs font-bold transition-colors active-scale"
          :class="onlyCardio ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface-variant'"
        >
          Cardio
        </button>
        <button
          type="button"
          @click="onlyAbdos = !onlyAbdos"
          class="rounded-full px-4 py-2 text-xs font-bold transition-colors active-scale"
          :class="onlyAbdos ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface-variant'"
        >
          Abdos
        </button>
      </div>
    </section>

    <!-- Feed -->
    <section class="space-y-4">
      <div
        v-for="entry in filteredEntries"
        :key="entry.id"
        class="space-y-4 rounded-xl border-l-4 bg-white p-5 ambient-shadow"
        :class="entry.sport || entry.cardio ? 'border-primary' : 'border-outline-variant'"
      >
        <div class="flex items-start justify-between">
          <div>
            <h3 class="text-lg font-bold text-on-surface">
              {{ new Date(entry.date_du_jour).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' }) }}
            </h3>
            <p class="text-xs font-semibold capitalize text-on-surface-variant">{{ dayLabel(entry.date_du_jour) }}</p>
          </div>
          <div class="flex gap-2">
            <span class="flex h-8 w-8 items-center justify-center rounded-full" :class="entry.sport ? 'bg-secondary-container/30 text-on-secondary-container' : 'bg-surface-container text-outline'">
              <span class="material-symbols-outlined text-[18px]" :class="{ filled: entry.sport }">fitness_center</span>
            </span>
            <span class="flex h-8 w-8 items-center justify-center rounded-full" :class="entry.cardio ? 'bg-primary/10 text-primary' : 'bg-surface-container text-outline'">
              <span class="material-symbols-outlined text-[18px]" :class="{ filled: entry.cardio }">directions_run</span>
            </span>
            <span class="flex h-8 w-8 items-center justify-center rounded-full" :class="entry.abdos ? 'bg-tertiary-container/20 text-tertiary' : 'bg-surface-container text-outline'">
              <span class="material-symbols-outlined text-[18px]" :class="{ filled: entry.abdos }">self_improvement</span>
            </span>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="rounded-lg bg-surface-container-low p-3">
            <span class="block text-[11px] font-bold uppercase text-on-surface-variant">Poids</span>
            <span class="text-lg font-bold text-primary">{{ entry.poids }} <small class="text-xs font-normal">kg</small></span>
          </div>
          <div class="rounded-lg bg-surface-container-low p-3">
            <span class="block text-[11px] font-bold uppercase text-on-surface-variant">Calories</span>
            <span class="text-lg font-bold text-primary">{{ entry.kcal }} <small class="text-xs font-normal">kcal</small></span>
          </div>
        </div>

        <div class="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-on-surface-variant">
          <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[16px]">directions_walk</span>{{ entry.pas }} pas</span>
          <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[16px]">water_drop</span>{{ entry.eau }} L</span>
          <span v-if="entry.sport" class="flex items-center gap-1"><span class="material-symbols-outlined text-[16px]">fitness_center</span>{{ entry.seance || 'Séance' }}</span>
          <span v-if="entry.cardio" class="flex items-center gap-1"><span class="material-symbols-outlined text-[16px]">directions_run</span>{{ entry.km || '-' }} km</span>
        </div>

        <div v-if="canDelete" class="flex justify-end pt-1">
          <button type="button" @click="deleteDaily(entry.id)" class="flex h-9 w-9 items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant active-scale hover:text-error">
            <span class="material-symbols-outlined text-[18px]">delete</span>
          </button>
        </div>
        <p v-else class="pt-1 text-right text-[11px] text-on-surface-variant">Mot de passe requis pour supprimer</p>
      </div>

      <div v-if="filteredEntries.length === 0" class="rounded-xl bg-white p-8 text-center text-sm text-on-surface-variant ambient-shadow">
        Aucune entrée pour cette période.
      </div>
    </section>
  </main>
</template>

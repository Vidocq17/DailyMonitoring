<script setup>
import { ref, computed, watch } from 'vue'
import { useWorkoutStore } from '@/store/useWorkoutStore'
import { useToast } from 'vue-toastification'
import { SESSIONS, EXERCISES_BY_SESSION, SESSION_LABEL_TO_KEY } from '@/data/sessionsWorkoutData'

const store = useWorkoutStore()
const toast = useToast()
const hasSubmitted = ref(false)
const isSubmitting = ref(false)

const password = import.meta.env.VITE_PASSWORD
const passwordCheck = ref('')

const session = ref('')
const rows = ref([{ exercise_name: '', weight: '' }])

const filteredExercises = computed(() => {
  if (!session.value) return []
  return EXERCISES_BY_SESSION[session.value]?.map((e) => e.label) ?? []
})

watch(session, () => {
  rows.value = [{ exercise_name: '', weight: '' }]
})

const isPasswordInvalid = computed(() => passwordCheck.value !== '' && passwordCheck.value !== password)

const isFormValid = computed(() => {
  return (
    session.value !== '' &&
    passwordCheck.value === password &&
    rows.value.length > 0 &&
    rows.value.every((r) => r.exercise_name !== '' && r.weight !== '')
  )
})

const addRow = () => {
  rows.value.push({ exercise_name: '', weight: '' })
}

const removeRow = (index) => {
  rows.value.splice(index, 1)
  if (rows.value.length === 0) addRow()
}

const resetForm = () => {
  session.value = ''
  rows.value = [{ exercise_name: '', weight: '' }]
  hasSubmitted.value = false
}

const saveWeights = async () => {
  hasSubmitted.value = true
  if (!isFormValid.value) {
    toast.error('Veuillez remplir tous les champs et saisir le mot de passe.')
    return
  }

  isSubmitting.value = true
  try {
    for (const row of rows.value) {
      const key = SESSION_LABEL_TO_KEY[row.exercise_name]
      if (!key) {
        toast.error(`Exercice inconnu : ${row.exercise_name}`)
        continue
      }
      await store.addWeight(key, parseFloat(row.weight))
    }
    toast.success('Séance enregistrée ✅')
    resetForm()
  } catch (err) {
    console.error(err)
    toast.error(err?.message || "Une erreur est survenue lors de l'enregistrement.")
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <main class="mx-auto max-w-2xl space-y-6 px-1">
    <!-- Mot de passe -->
    <section class="rounded-xl bg-white p-5 ambient-shadow">
      <label class="block text-xs font-bold uppercase tracking-wide text-on-surface-variant">
        Mot de passe
        <input
          type="password"
          v-model="passwordCheck"
          placeholder="••••••••"
          class="mt-1 w-full rounded-lg border bg-surface-container-low px-4 py-2 text-sm text-on-surface outline-none focus:border-primary"
          :class="hasSubmitted && isPasswordInvalid ? 'border-error' : 'border-transparent'"
        />
      </label>
      <p v-if="isPasswordInvalid || (hasSubmitted && passwordCheck === '')" class="mt-1 text-xs text-error">
        Mot de passe manquant ou incorrect
      </p>
    </section>

    <!-- Séance -->
    <section class="space-y-3">
      <h3 class="px-1 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Séance</h3>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="s in SESSIONS"
          :key="s"
          type="button"
          @click="session = s"
          class="rounded-full px-4 py-2 text-xs font-bold transition-colors active-scale"
          :class="session === s ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface-variant'"
        >
          {{ s }}
        </button>
      </div>
      <p v-if="hasSubmitted && session === ''" class="text-xs text-error">Sélectionne une séance</p>
    </section>

    <!-- Exercices (poids uniquement : la base ne stocke pas séries/reps) -->
    <section v-if="session" class="space-y-3">
      <div
        v-for="(row, i) in rows"
        :key="i"
        class="space-y-4 rounded-xl border bg-white p-5 ambient-shadow"
        :class="hasSubmitted && (row.exercise_name === '' || row.weight === '') ? 'border-error/40' : 'border-transparent'"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="flex-1 space-y-1">
            <span class="text-[11px] font-bold uppercase tracking-wide text-primary">Exercice {{ i + 1 }}</span>
            <select
              v-model="row.exercise_name"
              class="w-full rounded-lg border-none bg-surface-container-low px-3 py-2 text-sm font-semibold text-on-surface outline-none"
            >
              <option value="" disabled>Sélectionner un exercice</option>
              <option v-for="ex in filteredExercises" :key="ex" :value="ex">{{ ex }}</option>
            </select>
          </div>
          <button
            v-if="rows.length > 1"
            type="button"
            @click="removeRow(i)"
            class="mt-6 text-outline transition-colors hover:text-error"
          >
            <span class="material-symbols-outlined">delete</span>
          </button>
        </div>

        <div class="rounded-lg bg-surface-container-low p-3">
          <label class="mb-1 block text-[11px] font-bold uppercase text-outline-variant">Poids (kg)</label>
          <input
            v-model="row.weight"
            type="number"
            step="0.5"
            min="0"
            placeholder="0"
            class="w-full border-none bg-transparent p-0 text-xl font-bold text-on-surface outline-none"
          />
        </div>
      </div>

      <button
        type="button"
        @click="addRow"
        class="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-outline-variant py-4 text-on-surface-variant transition-colors active-scale hover:bg-surface-container-low"
      >
        <span class="material-symbols-outlined">add_circle</span>
        <span class="text-sm font-bold">Ajouter un exercice</span>
      </button>
    </section>

    <button
      type="button"
      :disabled="isSubmitting"
      @click="saveWeights"
      class="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 font-bold text-on-primary shadow-lg shadow-primary/20 transition-all active-scale hover:opacity-90 disabled:opacity-60"
    >
      {{ isSubmitting ? 'Enregistrement...' : 'Enregistrer la séance' }}
    </button>
  </main>
</template>

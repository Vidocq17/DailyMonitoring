<script setup>
import { ref, computed } from 'vue'
import { useDailyStore } from '@/store/useDailyStore'
import { useToast } from 'vue-toastification'

const store = useDailyStore()
const sportOptions = ['UPPER', 'LOWER', 'FULL BODY', 'CARDIO']
const cardioOptions = ['Course', 'Marche inclinée', 'Marche']
const toast = useToast()
const password = import.meta.env.VITE_PASSWORD
const passwordCheck = ref('')
const isSubmitting = ref(false)

const getDefaultForm = () => ({
  date_du_jour: new Date().toISOString().split('T')[0],
  kcal: '',
  glucides: '',
  lipides: '',
  proteines: '',
  pas: '',
  eau: '',
  poids: '',
  sport: false,
  seance: '',
  cardio: false,
  km: '',
  typeof_cardio: '',
  abdos: false,
})

const form = ref(getDefaultForm())
const hasSubmitted = ref(false)

const resetForm = () => {
  form.value = getDefaultForm()
  hasSubmitted.value = false
}

const isPasswordInvalid = computed(
  () => passwordCheck.value !== '' && passwordCheck.value !== password,
)

const isFormValid = computed(() => {
  const requiredFieldsFilled =
    passwordCheck.value === password &&
    form.value.kcal !== '' &&
    form.value.glucides !== '' &&
    form.value.lipides !== '' &&
    form.value.proteines !== '' &&
    form.value.pas !== '' &&
    form.value.eau !== '' &&
    form.value.poids !== ''

  const cardioValid =
    !form.value.cardio || (form.value.cardio && form.value.km !== '' && form.value.typeof_cardio !== '')

  return requiredFieldsFilled && cardioValid
})

const saveEntry = async () => {
  hasSubmitted.value = true
  if (!isFormValid.value) {
    toast.error('Veuillez remplir tous les champs obligatoires.')
    return
  }

  isSubmitting.value = true
  try {
    const payload = {
      date_du_jour: form.value.date_du_jour,
      kcal: Number(form.value.kcal),
      glucides: Number(form.value.glucides),
      lipides: Number(form.value.lipides),
      proteines: Number(form.value.proteines),
      pas: Number(form.value.pas),
      eau: Number(form.value.eau),
      poids: Number(form.value.poids),
      sport: form.value.sport,
      seance: form.value.sport && form.value.seance !== '' ? form.value.seance : null,
      cardio: form.value.cardio,
      km: form.value.cardio && form.value.km !== '' ? Number(form.value.km) : null,
      typeof_cardio: form.value.cardio && form.value.typeof_cardio !== '' ? form.value.typeof_cardio : null,
      abdos: form.value.abdos,
    }

    await store.addDaily(payload)
    toast.success('Entrée enregistrée ✅')
    resetForm()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } catch (err) {
    console.error(err)
    toast.error(err?.message || 'Une erreur est survenue lors de l’enregistrement.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <main class="mx-auto max-w-2xl space-y-8 px-5 pt-4">
    <section class="space-y-1">
      <h2 class="text-2xl font-bold text-on-surface">Mon suivi du jour</h2>
      <p class="text-sm text-on-surface-variant opacity-70">
        Enregistre tes métriques du jour pour rester sur la bonne voie.
      </p>
    </section>

    <!-- Mot de passe -->
    <section class="rounded-xl bg-white p-5 ambient-shadow">
      <label class="block text-xs font-bold uppercase tracking-wide text-on-surface-variant">
        Mot de passe
        <input
          type="password"
          v-model="passwordCheck"
          placeholder="••••••••"
          class="mt-1 w-full rounded-lg border bg-surface-container-low px-4 py-2 text-sm text-on-surface outline-none transition-colors focus:border-primary"
          :class="hasSubmitted && isPasswordInvalid ? 'border-error' : 'border-transparent'"
        />
      </label>
      <p v-if="isPasswordInvalid || (hasSubmitted && passwordCheck === '')" class="mt-1 text-xs text-error">
        Mot de passe manquant ou incorrect
      </p>
    </section>

    <form class="space-y-6" @submit.prevent="saveEntry">
      <!-- Métriques principales -->
      <div class="grid grid-cols-2 gap-4">
        <label class="rounded-xl border bg-white p-5 ambient-shadow transition-colors focus-within:border-primary/30" :class="hasSubmitted && form.poids === '' ? 'border-error' : 'border-transparent'">
          <div class="mb-2 flex items-start justify-between">
            <span class="material-symbols-outlined text-[20px] text-primary">scale</span>
            <span class="text-[11px] font-bold uppercase tracking-wide text-on-surface-variant">Poids</span>
          </div>
          <div class="flex items-baseline gap-1">
            <input v-model="form.poids" type="number" step="0.01" placeholder="00.0" class="w-full border-none bg-transparent p-0 text-xl font-bold text-on-surface outline-none placeholder:opacity-30" />
            <span class="text-xs font-semibold text-on-surface-variant">kg</span>
          </div>
        </label>

        <label class="rounded-xl border bg-white p-5 ambient-shadow transition-colors focus-within:border-primary/30" :class="hasSubmitted && form.kcal === '' ? 'border-error' : 'border-transparent'">
          <div class="mb-2 flex items-start justify-between">
            <span class="material-symbols-outlined text-[20px] text-primary">local_fire_department</span>
            <span class="text-[11px] font-bold uppercase tracking-wide text-on-surface-variant">Calories</span>
          </div>
          <div class="flex items-baseline gap-1">
            <input v-model="form.kcal" type="number" placeholder="0" class="w-full border-none bg-transparent p-0 text-xl font-bold text-on-surface outline-none placeholder:opacity-30" />
            <span class="text-xs font-semibold text-on-surface-variant">kcal</span>
          </div>
        </label>

        <label class="rounded-xl border bg-white p-5 ambient-shadow transition-colors focus-within:border-primary/30" :class="hasSubmitted && form.eau === '' ? 'border-error' : 'border-transparent'">
          <div class="mb-2 flex items-start justify-between">
            <span class="material-symbols-outlined text-[20px] text-primary">water_drop</span>
            <span class="text-[11px] font-bold uppercase tracking-wide text-on-surface-variant">Eau</span>
          </div>
          <div class="flex items-baseline gap-1">
            <input v-model="form.eau" type="number" step="0.1" placeholder="0.0" class="w-full border-none bg-transparent p-0 text-xl font-bold text-on-surface outline-none placeholder:opacity-30" />
            <span class="text-xs font-semibold text-on-surface-variant">L</span>
          </div>
        </label>

        <label class="rounded-xl border bg-white p-5 ambient-shadow transition-colors focus-within:border-primary/30" :class="hasSubmitted && form.pas === '' ? 'border-error' : 'border-transparent'">
          <div class="mb-2 flex items-start justify-between">
            <span class="material-symbols-outlined text-[20px] text-primary">directions_walk</span>
            <span class="text-[11px] font-bold uppercase tracking-wide text-on-surface-variant">Pas</span>
          </div>
          <div class="flex items-baseline gap-1">
            <input v-model="form.pas" type="number" placeholder="0" class="w-full border-none bg-transparent p-0 text-xl font-bold text-on-surface outline-none placeholder:opacity-30" />
          </div>
        </label>
      </div>

      <!-- Macros -->
      <div class="space-y-3">
        <h3 class="px-1 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Macronutriments</h3>
        <div class="space-y-3">
          <div class="flex items-center gap-4 rounded-xl border bg-surface-container-low px-4 py-3 transition-all focus-within:border-primary/30 focus-within:bg-white" :class="hasSubmitted && form.glucides === '' ? 'border-error' : 'border-transparent'">
            <span class="h-8 w-2 rounded-full bg-tertiary-fixed-dim"></span>
            <div class="flex-1">
              <label class="mb-0.5 block text-[11px] font-semibold text-on-surface-variant">Glucides</label>
              <input v-model="form.glucides" type="number" placeholder="0" class="h-6 w-full border-none bg-transparent p-0 font-bold text-on-surface outline-none" />
            </div>
            <span class="text-xs font-semibold text-outline">g</span>
          </div>

          <div class="flex items-center gap-4 rounded-xl border bg-surface-container-low px-4 py-3 transition-all focus-within:border-primary/30 focus-within:bg-white" :class="hasSubmitted && form.proteines === '' ? 'border-error' : 'border-transparent'">
            <span class="h-8 w-2 rounded-full bg-secondary-fixed"></span>
            <div class="flex-1">
              <label class="mb-0.5 block text-[11px] font-semibold text-on-surface-variant">Protéines</label>
              <input v-model="form.proteines" type="number" placeholder="0" class="h-6 w-full border-none bg-transparent p-0 font-bold text-on-surface outline-none" />
            </div>
            <span class="text-xs font-semibold text-outline">g</span>
          </div>

          <div class="flex items-center gap-4 rounded-xl border bg-surface-container-low px-4 py-3 transition-all focus-within:border-primary/30 focus-within:bg-white" :class="hasSubmitted && form.lipides === '' ? 'border-error' : 'border-transparent'">
            <span class="h-8 w-2 rounded-full bg-error-container"></span>
            <div class="flex-1">
              <label class="mb-0.5 block text-[11px] font-semibold text-on-surface-variant">Lipides</label>
              <input v-model="form.lipides" type="number" placeholder="0" class="h-6 w-full border-none bg-transparent p-0 font-bold text-on-surface outline-none" />
            </div>
            <span class="text-xs font-semibold text-outline">g</span>
          </div>
        </div>
      </div>

      <!-- Activité physique -->
      <div class="space-y-3">
        <h3 class="px-1 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Activité physique</h3>

        <label class="flex flex-col gap-3 rounded-xl bg-white p-4 ambient-shadow">
          <div class="flex cursor-pointer items-center justify-between">
            <span class="flex items-center gap-3 font-semibold text-on-surface">
              <span class="material-symbols-outlined text-secondary">fitness_center</span>
              Séance de sport effectuée
            </span>
            <input type="checkbox" v-model="form.sport" class="h-6 w-6 rounded-md accent-secondary" />
          </div>
          <select
            v-if="form.sport"
            v-model="form.seance"
            class="w-full rounded-lg border-none bg-surface-container-low px-3 py-2 text-sm text-on-surface outline-none"
          >
            <option value="">Type de séance (optionnel)</option>
            <option v-for="option in sportOptions" :key="option" :value="option">{{ option }}</option>
          </select>
        </label>

        <label class="flex flex-col gap-3 rounded-xl bg-white p-4 ambient-shadow">
          <div class="flex cursor-pointer items-center justify-between">
            <span class="flex items-center gap-3 font-semibold text-on-surface">
              <span class="material-symbols-outlined text-primary">directions_run</span>
              Cardio effectué
            </span>
            <input type="checkbox" v-model="form.cardio" class="h-6 w-6 rounded-md accent-primary" />
          </div>
          <div v-if="form.cardio" class="grid grid-cols-2 gap-3">
            <input
              v-model="form.km"
              type="number"
              step="0.01"
              placeholder="Km"
              class="rounded-lg border bg-surface-container-low px-3 py-2 text-sm text-on-surface outline-none"
              :class="hasSubmitted && form.km === '' ? 'border-error' : 'border-transparent'"
            />
            <select
              v-model="form.typeof_cardio"
              class="rounded-lg border bg-surface-container-low px-3 py-2 text-sm text-on-surface outline-none"
              :class="hasSubmitted && form.typeof_cardio === '' ? 'border-error' : 'border-transparent'"
            >
              <option value="">Type</option>
              <option v-for="option in cardioOptions" :key="option" :value="option">{{ option }}</option>
            </select>
          </div>
        </label>

        <label class="flex cursor-pointer items-center justify-between rounded-xl bg-white p-4 ambient-shadow">
          <span class="flex items-center gap-3 font-semibold text-on-surface">
            <span class="material-symbols-outlined text-tertiary">self_improvement</span>
            Abdos faits
          </span>
          <input type="checkbox" v-model="form.abdos" class="h-6 w-6 rounded-md accent-tertiary" />
        </label>
      </div>

      <button
        type="submit"
        :disabled="isSubmitting"
        class="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 font-bold text-on-primary shadow-lg shadow-primary/20 transition-all active-scale hover:opacity-90 disabled:opacity-60"
      >
        <span class="material-symbols-outlined filled">{{ isSubmitting ? 'sync' : 'save' }}</span>
        {{ isSubmitting ? 'Enregistrement...' : 'Enregistrer' }}
      </button>
    </form>
  </main>
</template>

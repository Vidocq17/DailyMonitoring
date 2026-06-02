<script setup>
import { ref, computed } from 'vue'
import { useDailyStore } from '@/store/useDailyStore'
import { useToast } from 'vue-toastification'

const store = useDailyStore()
// const sportOptions = ['Push', 'Pull', 'Legs', 'Full Body', 'Cardio']
const sportOptions = ['UPPER', 'LOWER', 'FULL BODY', 'CARDIO']
const cardioOptions = ['Course', 'Marche inclinée', 'Marche']
const toast = useToast()
const password = import.meta.env.VITE_PASSWORD
const passwordCheck = ref('')

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
    !form.value.cardio ||
    (form.value.cardio &&
      form.value.km !== '' &&
      form.value.typeof_cardio !== '')

  // Si tu veux que la séance devienne obligatoire quand sport = true :
  // const sportValid =
  //   !form.value.sport || (form.value.sport && form.value.seance !== '')

  return requiredFieldsFilled && cardioValid
})

const saveEntry = async () => {
  hasSubmitted.value = true
  if (!isFormValid.value) {
    toast.error('Veuillez remplir tous les champs obligatoires.')
    return
  }

  try {
    await store.addDaily({ ...form.value })
    toast.success('Entrée enregistrée ✅')
    resetForm()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } catch (err) {
    console.error(err)
    toast.error('Une erreur est survenue lors de l’enregistrement.')
  }
}
</script>

<template>
  <div class="flex flex-col items-center my-6 px-4">
    <div class="w-full max-w-3xl space-y-6">
      <div class="text-center space-y-1">
        <h2 class="text-2xl font-semibold">Nouvelle entrée quotidienne</h2>
        <p class="text-sm text-[var(--color-muted)]">
          Renseigne tes données du jour pour suivre ta progression.
        </p>
      </div>

      <div class="bg-[var(--color-light)] p-6 md:p-8 rounded-2xl w-full shadow-md border border-[var(--color-border)]">
        <!-- Mot de passe -->
        <div class="flex flex-col items-center gap-2 mb-6">
          <label class="w-full max-w-xs text-sm font-medium text-left">
            Mot de passe
            <input type="password" v-model="passwordCheck" placeholder="••••••••" class="w-full mt-1" :class="{'border-red-500': hasSubmitted && passwordCheck !== password}" />
          </label>
          <p v-if="isPasswordInvalid || (hasSubmitted && passwordCheck === '')" class="text-xs text-red-500">
            Mot de passe manquant ou incorrect
          </p>
        </div>

        <div class="space-y-6">
          <!-- Section nutrition -->
          <section class="border border-blue-700/50 rounded-2xl p-4 md:p-5 bg-[var(--color-surface)] space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="font-semibold text-base">Nutrition & poids</h3>
              <span class="badge badge-blue text-xs">Obligatoire</span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label class="flex flex-col text-sm font-medium">
                Kcal
                <input type="number" v-model="form.kcal" :class="{'border-red-500': hasSubmitted && form.kcal === ''}" required />
                <span v-if="hasSubmitted && form.kcal === ''" class="text-xs text-red-500 mt-1">Requis</span>
              </label>

              <label class="flex flex-col text-sm font-medium">
                Poids (kg)
                <input type="number" step="0.01" v-model="form.poids" :class="{'border-red-500': hasSubmitted && form.poids === ''}" required />
                <span v-if="hasSubmitted && form.poids === ''" class="text-xs text-red-500 mt-1">Requis</span>
              </label>

              <label class="flex flex-col text-sm font-medium">
                Pas
                <input type="number" v-model="form.pas" :class="{'border-red-500': hasSubmitted && form.pas === ''}" required />
                <span v-if="hasSubmitted && form.pas === ''" class="text-xs text-red-500 mt-1">Requis</span>
              </label>

              <label class="flex flex-col text-sm font-medium">
                Glucides (g)
                <input type="number" v-model="form.glucides" :class="{'border-red-500': hasSubmitted && form.glucides === ''}" required />
                <span v-if="hasSubmitted && form.glucides === ''" class="text-xs text-red-500 mt-1">Requis</span>
              </label>

              <label class="flex flex-col text-sm font-medium">
                Protéines (g)
                <input type="number" v-model="form.proteines" :class="{'border-red-500': hasSubmitted && form.proteines === ''}" required />
                <span v-if="hasSubmitted && form.proteines === ''" class="text-xs text-red-500 mt-1">Requis</span>
              </label>

              <label class="flex flex-col text-sm font-medium">
                Lipides (g)
                <input type="number" v-model="form.lipides" :class="{'border-red-500': hasSubmitted && form.lipides === ''}" required />
                <span v-if="hasSubmitted && form.lipides === ''" class="text-xs text-red-500 mt-1">Requis</span>
              </label>

              <label class="flex flex-col text-sm font-medium md:col-span-3">
                Eau (L)
                <input type="number" step="0.1" v-model="form.eau" :class="{'border-red-500': hasSubmitted && form.eau === ''}" required />
                <span v-if="hasSubmitted && form.eau === ''" class="text-xs text-red-500 mt-1">Requis</span>
              </label>
            </div>
          </section>

          <!-- Section activité -->
          <section class="border border-blue-700/50 rounded-2xl p-4 md:p-5 bg-[var(--color-surface)] space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="font-semibold text-base">Activité physique</h3>
              <span class="badge badge-green text-xs">Optionnel</span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <!-- Sport -->
              <div class="flex flex-col justify-center">
                <label class="flex items-center gap-2 text-sm font-medium">
                  <input type="checkbox" v-model="form.sport" />
                  Sport fait ?
                </label>
              </div>

              <label class="flex flex-col text-sm font-medium">
                Séance
                <select v-model="form.seance" :disabled="!form.sport">
                  <option value="">Sélectionner (optionnel)</option>
                  <option v-for="option in sportOptions" :key="option" :value="option">
                    {{ option }}
                  </option>
                </select>
              </label>

              <div class="flex flex-col justify-center">
                <label class="flex items-center gap-2 text-sm font-medium">
                  <input type="checkbox" v-model="form.abdos" />
                  Abdos faits ?
                </label>
              </div>

              <!-- Cardio -->
              <div class="flex flex-col justify-center">
                <label class="flex items-center gap-2 text-sm font-medium">
                  <input type="checkbox" v-model="form.cardio" />
                  Cardio fait ?
                </label>
              </div>

              <label class="flex flex-col text-sm font-medium">
                Km
                <input type="number" step="0.01" v-model="form.km" :disabled="!form.cardio" :required="form.cardio" :class="{'border-red-500': hasSubmitted && form.cardio && form.km === ''}" />
                <span v-if="hasSubmitted && form.cardio && form.km === ''" class="text-xs text-red-500 mt-1">Requis</span>
              </label>

              <label class="flex flex-col text-sm font-medium">
                Type de cardio
                <select v-model="form.typeof_cardio" :disabled="!form.cardio" :required="form.cardio" :class="{'border-red-500': hasSubmitted && form.cardio && form.typeof_cardio === ''}">
                  <option value="">Sélectionner</option>
                  <option v-for="option in cardioOptions" :key="option" :value="option">
                    {{ option }}
                  </option>
                </select>
                <span v-if="hasSubmitted && form.cardio && form.typeof_cardio === ''" class="text-xs text-red-500 mt-1">Requis</span>
              </label>
            </div>
          </section>
        </div>

        <div class="mt-6 flex justify-center">
          <button type="button" @click="saveEntry">
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

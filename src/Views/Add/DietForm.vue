<script setup>
import { ref, watch, computed } from 'vue'
import { useDailyStore } from '@/store/useDailyStore'
import { useToast } from 'vue-toastification'

const store = useDailyStore()
const sportOptions = ['Push', 'Pull', 'Legs', 'Full Body', 'Cardio']
const cardioOptions = ['Course', 'Marche inclinée', 'Marche']
const toast = useToast()
const password = import.meta.env.VITE_PASSWORD
const passwordCheck = ref(false)

const form = ref({
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

const resetForm = () => {
  form.value = {
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
  }
}

const saveEntry = async () => {
  await store.addDaily({ ...form.value })
  toast.success('Entrée enregistrée ✅')
  resetForm()
  window.alert('Entrée enregistrée avec succès !')
  window.scrollTo(0, 0)
}

watch(
  () => form.value.poids,
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
    form.value.poids !== '' &&
    form.value.km !== ''

  const sportValid = !form.value.sport || (form.value.sport && form.value.seance !== '')
  const cardioValid = !form.value.cardio || (form.value.cardio && form.value.typeof_cardio !== '')
  const abdosValid = form.value.abdos !== '' // Abdos is optional, so always valid

  return requiredFieldsFilled && sportValid && cardioValid && abdosValid
})
</script>

<template>
  <div class="flex flex-col items-center my-6">
    <h2>Nouvelle entrée</h2>
    <div class="bg-[var(--color-light)] p-8 rounded-2xl w-full max-w-10/12 flex flex-col items-center"
      style="box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1)">
      <div class="daily-form-data">

        <div class="flex items-center justify-center gap-3 mb-3">
          <input type="password" v-model="passwordCheck" placeholder="Mot de passe"
            class="p-2 border border-gray-300 rounded" />
          <span v-if="passwordCheck !== password" class="text-red-500">Mot de passe incorrect</span>
        </div>

        <section class="border border-blue-700 rounded-2xl p-4 grid grid-col-1 md:grid-cols-3 m-auto gap-[2rem] mb-5">
          <div class="flex flex-col items-center my-3 mx-0">
            <label>
              Kcal
              <input type="number" v-model="form.kcal" required />
            </label>
          </div>

          <div class="flex flex-col items-center my-3 mx-0">
            <label>
              Poids (kg)
              <input type="number" step="0.01" v-model="form.poids" required />
            </label>
          </div>

          <div class="flex flex-col items-center my-3 mx-0">
            <label>
              Pas
              <input type="number" v-model="form.pas" required />
            </label>
          </div>

          <div class="flex flex-col items-center my-3 mx-0">
            <label>
              Glucides (g)
              <input type="number" v-model="form.glucides" required />
            </label>
          </div>

          <div class="flex flex-col items-center my-3 mx-0">
            <label>
              Protéines (g)
              <input type="number" v-model="form.proteines" required />
            </label>
          </div>

          <div class="flex flex-col items-center my-3 mx-0">
            <label>
              Lipides (g)
              <input type="number" v-model="form.lipides" required />
            </label>
          </div>

          <div class="flex flex-col items-center my-3 mx-0">
            <label>
              Eau (L)
              <input type="number" step="0.1" v-model="form.eau" required />
            </label>
          </div>
        </section>

        <section class="border border-blue-700 rounded-2xl p-4 grid grid-col-1 md:grid-cols-3 m-auto gap-[2rem]">
          <div class="flex flex-col items-center my-3 mx-0">
            <label class="flex items-center gap-2.5 m-auto" style="flex-direction: row">
              <input type="checkbox" v-model="form.sport" />
              Sport fait ?
            </label>
          </div>

          <div class="flex flex-col items-center my-3 mx-0">
            <label>
              Séance (optionnel)
              <select v-model="form.seance" :disabled="!form.sport">
                <option value="" disabled>Sélectionner une séance</option>
                <option v-for="option in sportOptions" :key="option" :value="option">
                  {{ option }}
                </option>
              </select>
            </label>
          </div>

          <div class="flex flex-col items-center my-3 mx-0">
            <label class="flex items-center gap-2.5 m-auto" style="flex-direction: row">
              <input type="checkbox" v-model="form.abdos" />
              Abdos fait ?
            </label>
          </div>

          <div class="flex flex-col items-center my-3 mx-0">
            <label class="flex items-center gap-2.5 m-auto" style="flex-direction: row">
              <input type="checkbox" v-model="form.cardio" />
              Cardio fait ?
            </label>
          </div>

          <div class="flex flex-col items-center my-3 mx-0">
            <label>
              Km
              <input type="number" step="0.01" v-model="form.km" required />
            </label>
          </div>

          <div class="flex flex-col items-center my-3 mx-0">
            <label>
              Type de cardio
              <select v-model="form.typeof_cardio" :disabled="!form.cardio">
                <option value="" disabled>Sélectionner un type de cardio</option>
                <option v-for="option in cardioOptions" :key="option" :value="option">
                  {{ option }}
                </option>
              </select>
            </label>
          </div>


        </section>

      </div>

      <button @click="saveEntry" :disabled="!isFormValid">Enregistrer</button>
    </div>
  </div>
</template>

<style scoped>
@media (max-width: 600px) {
  .daily-form-data {
    grid-template-columns: repeat(1, 1fr);
    gap: 0.2rem;
  }

  label {
    display: flex;
    align-items: center;
    margin: auto;
  }

  .boolean-label {
    margin: auto;
  }

  button {
    width: 50% !important;
  }
}
</style>

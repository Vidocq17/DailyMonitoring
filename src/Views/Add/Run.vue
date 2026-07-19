<script setup lang="ts">
import { ref, computed } from 'vue'
import { useWorkoutStore } from '@/store/useWorkoutStore'
import { useToast } from 'vue-toastification'

const store = useWorkoutStore()
const toast = useToast()

const password = import.meta.env.VITE_PASSWORD
const passwordCheck = ref('')
const hasSubmitted = ref(false)

const form = ref({
  run_at: new Date().toISOString().slice(0, 16),
  duration: '',
  distance_km: '',
  comment: '',
})

const isPasswordInvalid = computed(
  () => passwordCheck.value !== '' && passwordCheck.value !== password,
)

function parseDurationToSeconds(input: string): number | null {
  const parts = input.trim().split(':').map((p) => p.trim())
  if (parts.length < 2 || parts.length > 3) return null

  const nums = parts.map((p) => Number(p))
  if (nums.some((n) => Number.isNaN(n) || n < 0)) return null

  let h = 0, m = 0, s = 0
  if (nums.length === 2) [m, s] = nums
  if (nums.length === 3) [h, m, s] = nums

  if (m >= 60 || s >= 60) return null
  return h * 3600 + m * 60 + s
}

const isFormValid = computed(() => {
  const sec = parseDurationToSeconds(form.value.duration)
  return (
    passwordCheck.value === password &&
    form.value.run_at !== '' &&
    sec !== null &&
    sec > 0
  )
})

const resetForm = () => {
  form.value = {
    run_at: new Date().toISOString().slice(0, 16),
    duration: '',
    distance_km: '',
    comment: '',
  }
  hasSubmitted.value = false
}

const saveRun = async () => {
  hasSubmitted.value = true
  if (!isFormValid.value) {
    toast.error('Remplis au minimum la date + durée et le mot de passe.')
    return
  }

  const duration_sec = parseDurationToSeconds(form.value.duration)
  if (!duration_sec) {
    toast.error('Durée invalide. Format attendu : mm:ss ou hh:mm:ss')
    return
  }

  const distance = form.value.distance_km === '' ? null : Number(form.value.distance_km)
  if (distance !== null && (Number.isNaN(distance) || distance < 0)) {
    toast.error('Distance invalide.')
    return
  }

  try {
    await store.addRun({
      run_at: new Date(form.value.run_at).toISOString(),
      duration_sec,
      distance_km: distance,
      comment: form.value.comment,
    })
    toast.success('Course enregistrée ✅')
    resetForm()
  } catch (e) {
    console.error(e)
    toast.error(e instanceof Error ? e.message : "Erreur lors de l'enregistrement.")
  }
}
</script>

<template>
  <main class="mx-auto max-w-2xl space-y-6 px-1">
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

    <form @submit.prevent="saveRun" class="space-y-4 rounded-xl bg-white p-5 ambient-shadow">
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label class="flex flex-col text-xs font-bold uppercase tracking-wide text-on-surface-variant">
          Date / heure
          <input
            type="datetime-local"
            v-model="form.run_at"
            class="mt-1 rounded-lg border bg-surface-container-low px-3 py-2 text-sm font-medium text-on-surface outline-none"
            :class="hasSubmitted && form.run_at === '' ? 'border-error' : 'border-transparent'"
          />
        </label>

        <label class="flex flex-col text-xs font-bold uppercase tracking-wide text-on-surface-variant">
          Durée (mm:ss ou hh:mm:ss)
          <input
            type="text"
            v-model="form.duration"
            placeholder="45:30 ou 01:02:15"
            class="mt-1 rounded-lg border bg-surface-container-low px-3 py-2 text-sm font-medium text-on-surface outline-none"
            :class="hasSubmitted && (!form.duration || !parseDurationToSeconds(form.duration)) ? 'border-error' : 'border-transparent'"
          />
        </label>

        <label class="flex flex-col text-xs font-bold uppercase tracking-wide text-on-surface-variant">
          Distance (km) (optionnel)
          <input
            type="number"
            v-model="form.distance_km"
            step="0.1"
            min="0"
            placeholder="10"
            class="mt-1 rounded-lg border border-transparent bg-surface-container-low px-3 py-2 text-sm font-medium text-on-surface outline-none"
          />
        </label>

        <label class="flex flex-col text-xs font-bold uppercase tracking-wide text-on-surface-variant md:col-span-2">
          Commentaire (optionnel)
          <input
            type="text"
            v-model="form.comment"
            placeholder="EF, fractionné, sensations..."
            class="mt-1 rounded-lg border border-transparent bg-surface-container-low px-3 py-2 text-sm font-medium text-on-surface outline-none"
          />
        </label>
      </div>

      <button
        type="submit"
        class="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 font-bold text-on-primary shadow-lg shadow-primary/20 transition-all active-scale hover:opacity-90"
      >
        Enregistrer
      </button>
    </form>
  </main>
</template>

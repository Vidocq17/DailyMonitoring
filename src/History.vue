<script setup>
import { ref, onMounted } from 'vue'
import { useDailyStore } from './store/useDailyStore'
import { useToast } from 'vue-toastification'

const store = useDailyStore()
const editingId = ref(null)
const editedEntry = ref({})
const toast = useToast()
const password = import.meta.env.VITE_PASSWORD
const passwordCheck = ref('')

onMounted(() => {
  store.fetchDaily()
})

const startEdit = (entry) => {
  editingId.value = entry.id
  editedEntry.value = { ...entry }
}

const cancelEdit = () => {
  editingId.value = null
  editedEntry.value = {}
}

const saveEdit = async () => {
  await store.updateDaily(editingId.value, editedEntry.value)
  editingId.value = null
  toast.success('Entrée mise à jour ✅')
}

const deleteDaily = async (id) => {
  if (confirm('Es-tu sûr de vouloir supprimer cette entrée ?')) {
    await store.deleteDaily(id)
    toast.success('Entrée supprimée ✅')
  }
}

const formattedDate = new Date().toLocaleDateString('fr-FR', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})
</script>

<template>
  <div
    class="p-6 md:p-8 my-6 rounded-2xl bg-[var(--color-light)] border border-[var(--color-border)] max-w-7xl mx-auto"
    style="box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08)"
  >
    <!-- TOP HEADER -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-2">
      <div>
        <h2 class="text-2xl font-semibold">Historique quotidien</h2>
        <p class="text-sm text-[var(--color-muted)]">Modifie ou supprime tes données passées.</p>
      </div>

      <p class="text-sm bg-[var(--color-surface)] px-3 py-1 rounded-lg border border-[var(--color-border)]">
        Date actuelle : <strong>{{ formattedDate }}</strong>
      </p>
    </div>

    <!-- PASSWORD -->
    <div class="flex flex-col items-center mb-6">
      <label class="w-full max-w-xs text-sm font-medium">
        Mot de passe
        <input
          type="password"
          v-model="passwordCheck"
          placeholder="••••••••"
          class="w-full mt-1"
        />
      </label>
      <p
        v-if="passwordCheck !== '' && passwordCheck !== password"
        class="text-xs text-red-500 mt-1"
      >
        Mot de passe incorrect
      </p>
    </div>

    <!-- TABLE -->
    <div class="overflow-x-auto">
      <table class="daily-table w-full border-collapse min-w-[950px] bg-[var(--color-surface)] rounded-lg">
        <thead>
          <tr>
            <th>Date</th>
            <th>Kcal</th>
            <th>Glucides</th>
            <th>Lipides</th>
            <th>Protéines</th>
            <th>Pas</th>
            <th>Eau</th>
            <th>Poids</th>
            <th>Sport</th>
            <th style="width: 140px">Séance</th>
            <th>Cardio</th>
            <th>Km</th>
            <th>Type cardio</th>
            <th>Abdos</th>
            <th class="text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="entry in store.entries" :key="entry.id">
            <!-- DATE -->
            <td>
              <input
                v-if="editingId === entry.id"
                v-model="editedEntry.date_du_jour"
                type="date"
              />
              <span v-else>{{ new Date(entry.date_du_jour).toLocaleDateString() }}</span>
            </td>

            <!-- NUMERIC FIELDS -->
            <td>
              <input v-if="editingId === entry.id" v-model="editedEntry.kcal" type="number" />
              <span v-else>{{ entry.kcal }}</span>
            </td>

            <td>
              <input v-if="editingId === entry.id" v-model="editedEntry.glucides" type="number" />
              <span v-else>{{ entry.glucides }}</span>
            </td>

            <td>
              <input v-if="editingId === entry.id" v-model="editedEntry.lipides" type="number" />
              <span v-else>{{ entry.lipides }}</span>
            </td>

            <td>
              <input v-if="editingId === entry.id" v-model="editedEntry.proteines" type="number" />
              <span v-else>{{ entry.proteines }}</span>
            </td>

            <td>
              <input v-if="editingId === entry.id" v-model="editedEntry.pas" type="number" />
              <span v-else>{{ entry.pas }}</span>
            </td>

            <td>
              <input
                v-if="editingId === entry.id"
                v-model="editedEntry.eau"
                type="number"
                step="0.1"
              />
              <span v-else>{{ entry.eau }}</span>
            </td>

            <td>
              <input
                v-if="editingId === entry.id"
                v-model="editedEntry.poids"
                type="number"
                step="0.01"
              />
              <span v-else>{{ entry.poids }}</span>
            </td>

            <!-- BOOLEAN BADGES -->
            <td>
              <input v-if="editingId === entry.id" type="checkbox" v-model="editedEntry.sport" />
              <span v-else :class="entry.sport ? 'badge badge-green' : 'badge badge-red'">
                {{ entry.sport ? 'Oui' : 'Non' }}
              </span>
            </td>

            <td>
              <input v-if="editingId === entry.id" v-model="editedEntry.seance" />
              <span v-else>{{ entry.seance || '-' }}</span>
            </td>

            <td>
              <input v-if="editingId === entry.id" type="checkbox" v-model="editedEntry.cardio" />
              <span v-else :class="entry.cardio ? 'badge badge-green' : 'badge badge-red'">
                {{ entry.cardio ? 'Oui' : 'Non' }}
              </span>
            </td>

            <td>
              <input v-if="editingId === entry.id" v-model="editedEntry.km" />
              <span v-else>{{ entry.km || '-' }}</span>
            </td>

            <td>
              <input v-if="editingId === entry.id" v-model="editedEntry.typeof_cardio" />
              <span v-else>{{ entry.typeof_cardio || '-' }}</span>
            </td>

            <td>
              <input v-if="editingId === entry.id" type="checkbox" v-model="editedEntry.abdos" />
              <span v-else :class="entry.abdos ? 'badge badge-green' : 'badge badge-red'">
                {{ entry.abdos ? 'Oui' : 'Non' }}
              </span>
            </td>

            <!-- ACTIONS -->
            <td class="text-center" v-if="password === passwordCheck">
              <div v-if="editingId === entry.id" class="flex gap-2 justify-center">
                <button class="btn btn-save" @click="saveEdit">💾</button>
                <button class="btn btn-cancel" @click="cancelEdit">❌</button>
              </div>
              <div v-else class="flex gap-2 justify-center">
                <button class="btn btn-edit" @click="startEdit(entry)">✏️</button>
                <button class="btn btn-cancel" @click="deleteDaily(entry.id)">🗑️</button>
              </div>
            </td>

            <td v-else class="text-center text-xs text-[var(--color-muted)]">
              Mot de passe requis
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useDailyStore } from './store/useDailyStore'
import ExportButton from '@/components/ExportButton.vue'

const store = useDailyStore()
const editingId = ref(null)
const editedEntry = ref({})

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
}

const date = new Date()
const formattedDate = date.toLocaleDateString('fr-FR', {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
})
</script>

<template>
  <div class="daily-container">
    <div class="title">
      <h2 class="daily-title">Historique</h2>
      <p>Date actuelle : {{ formattedDate }}</p>
      <ExportButton style="margin-top: 0; width: 15%" />
    </div>

    <div class="table-wrapper">
      <table class="daily-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Kcal</th>
            <th>Glucides</th>
            <th>Lipides</th>
            <th>Protéines</th>
            <th>Pas</th>
            <th>Eau (L)</th>
            <th>Poids</th>
            <th>Sport</th>
            <th style="width: 150px">Séance</th>
            <th>Cardio</th>
            <th>Km</th>
            <th>Type de cardio</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="entry in store.entries" :key="entry.id">
            <td>
              <input v-if="editingId === entry.id" v-model="editedEntry.date_du_jour" type="date" />
              <span v-else>{{ new Date(entry.date_du_jour).toLocaleDateString() }}</span>
            </td>
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
              <div v-if="editingId === entry.id">
                <button class="btn btn-save" @click="saveEdit">💾 Sauvegarder</button>
                <button class="btn btn-cancel" @click="cancelEdit">❌ Annuler</button>
              </div>
              <button v-else class="btn btn-edit" @click="startEdit(entry)">✏️ Modifier</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.daily-container {
  background: #fff;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.daily-title {
  font-weight: bold;
  margin-bottom: 20px;
}

.table-wrapper {
  overflow-x: auto;
}

.daily-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
}

.daily-table th {
  background: linear-gradient(to right, #3b82f6, #4f46e5);
  color: white;
  padding: 12px;
  font-size: 0.9rem;
  text-align: left;
}

.daily-table td {
  padding: 10px 12px;
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.95rem;
}

.daily-table tr:nth-child(odd) {
  background: #f9fafb;
}

.daily-table tr:hover {
  background: #eff6ff;
  transition: background 0.3s;
}

/* Badges */
.badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.badge-green {
  background: #dcfce7;
  color: #166534;
}

.badge-red {
  background: #fee2e2;
  color: #991b1b;
}

.badge-blue {
  background: #e0e7ff;
  color: #3730a3;
}

.empty {
  color: #9ca3af;
  font-style: italic;
}
.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
/* BTN */
.btn {
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 0.8rem;
  cursor: pointer;
  border: none;
  margin: 2px;
}

.btn-edit {
  background: #fef3c7;
  color: #92400e;
}

.btn-save {
  background: #dcfce7;
  color: #166534;
}

.btn-cancel {
  background: #fee2e2;
  color: #991b1b;
}

input[type='number'],
input[type='date'],
input[type='text'],
input[type='checkbox'] {
  padding: 4px 6px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.85rem;
}
</style>

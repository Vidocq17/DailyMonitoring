<script setup>
import { onMounted } from 'vue'
import { useDailyStore } from '../store/useDailyStore'

const store = useDailyStore()

onMounted(() => {
  store.fetchDaily()
})
</script>

<template>
  <div class="bg-white shadow p-6 rounded-xl">
    <h2 class="text-xl font-bold mb-4">Historique</h2>
    <table class="table-auto w-full text-left">
      <thead>
        <tr class="bg-gray-100">
          <th class="p-2">Date</th>
          <th class="p-2">Kcal</th>
          <th class="p-2">Glucides</th>
          <th class="p-2">Lipides</th>
          <th class="p-2">Protéines</th>
          <th class="p-2">Pas</th>
          <th class="p-2">Eau (L)</th>
          <th class="p-2">Poids</th>
          <th class="p-2">Sport</th>
          <th class="p-2">Séance</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="entry in store.entries" :key="entry.id" class="border-b">
          <td class="p-2">{{ entry.date_du_jour }}</td>
          <td class="p-2">{{ entry.kcal }}</td>
          <td class="p-2">{{ entry.glucides }}</td>
          <td class="p-2">{{ entry.lipides }}</td>
          <td class="p-2">{{ entry.proteines }}</td>
          <td class="p-2">{{ entry.pas }}</td>
          <td class="p-2">{{ entry.eau }}</td>
          <td class="p-2">{{ entry.poids }}</td>
          <td class="p-2">{{ entry.sport ? '✅' : '❌' }}</td>
          <td class="p-2">{{ entry.seance }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

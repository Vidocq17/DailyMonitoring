import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Primevue from 'primevue/config'
import App from './App.vue'
import { router } from '../router'
import { MotionPlugin } from '@vueuse/motion'
import { registerSW } from 'virtual:pwa-register'

import '@/assets/styles/main.css'
import '@/assets/styles/tailwind.css'

const app = createApp(App)

app.use(createPinia()).use(Primevue).use(router).use(MotionPlugin).mount('#app')

// 🔥 PWA : gestion des mises à jour
const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    // Ici tu peux :
    // - soit recharger automatiquement :
    updateSW(true)

    // - soit plus tard remplacer par un toast "Nouvelle version dispo – Recharger ?"
  },
  onOfflineReady() {
    // Optionnel : tu peux mettre un toast "L’app est prête à fonctionner hors ligne"
    console.log('L’app est prête à fonctionner hors ligne')
  },
})

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Primevue from 'primevue/config'
import App from './App.vue'
import { router } from '../router'
import { MotionPlugin } from '@vueuse/motion'
import { registerSW } from 'virtual:pwa-register'
import { init } from "@decode-analytics/sdk"

import '@/assets/styles/main.css'
import '@/assets/styles/tailwind.css'

const app = createApp(App)
init({
  appId: import.meta.env.VITE_ANALYTICS_APP_ID,
  endpoint: `${import.meta.env.VITE_ANALYTICS_API_URL}/collect`,
  periodicFlushMs: 10_000,
  captureSnapshot: true,
})
app
  .use(createPinia())
  .use(Primevue)
  .use(router)
  .use(MotionPlugin)
  .mount('#app')

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

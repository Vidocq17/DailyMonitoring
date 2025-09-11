import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Primevue from 'primevue/config'
import App from './App.vue'
import { router } from '../router'
import { MotionPlugin } from '@vueuse/motion'

import '@/assets/styles/main.css'
import '@/assets/styles/tailwind.css'

const app = createApp(App)
app.use(createPinia()).use(Primevue).use(router).use(MotionPlugin).mount('#app')

import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/App.vue'
import History from '@/History.vue'
import Stats from '@/Stats.vue'
import DailyForm from '@/components/DailyForm.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/add', component: DailyForm },
  { path: '/history', component: History },
  { path: '/stats', component: Stats }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})

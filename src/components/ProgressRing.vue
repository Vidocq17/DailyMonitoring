<script setup>
import { computed } from 'vue'

// Anneau de progression réutilisable (SVG, pas de dépendance externe).
// Le contenu central est libre via le slot par défaut, qui reçoit `pct`
// (le vrai pourcentage, PEUT dépasser 100 — ex: 19000 pas / 13000 = 146%)
// et `isOverflow` (true si l'objectif est dépassé).
//
// Au-delà de 100%, l'anneau principal reste plein et un second anneau plus
// fin (couleur `overflowClass`) fait un "tour bonus" à l'intérieur pour
// représenter le dépassement (146% -> anneau bonus rempli à 46%).
const props = defineProps({
  value: { type: Number, default: 0 },
  max: { type: Number, required: true },
  size: { type: Number, default: 64 },
  strokeWidth: { type: Number, default: 8 },
  trackClass: { type: String, default: 'stroke-surface-container' },
  progressClass: { type: String, default: 'stroke-primary' },
  overflowClass: { type: String, default: 'stroke-tertiary' },
})

const radius = computed(() => props.size / 2 - props.strokeWidth / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)

const rawPct = computed(() => {
  if (!props.max || props.max <= 0) return 0
  return Math.max(0, (props.value / props.max) * 100)
})
const pct = computed(() => Math.round(rawPct.value))
const isOverflow = computed(() => rawPct.value > 100)

// Anneau principal : ne dépasse jamais 100% de remplissage visuel
const ringPct = computed(() => Math.min(100, rawPct.value))
const offset = computed(() => circumference.value * (1 - ringPct.value / 100))

// Anneau bonus (dépassement), tour(s) au-delà de 100% ramenés à 0-100%
const overflowRadius = computed(() => Math.max(0, radius.value - props.strokeWidth - 3))
const overflowCircumference = computed(() => 2 * Math.PI * overflowRadius.value)
const overflowPct = computed(() => (isOverflow.value ? ((rawPct.value - 100) % 100) || 100 : 0))
const overflowOffset = computed(() => overflowCircumference.value * (1 - overflowPct.value / 100))
</script>

<template>
  <div class="relative flex shrink-0 items-center justify-center" :style="{ width: size + 'px', height: size + 'px' }">
    <svg :viewBox="`0 0 ${size} ${size}`" class="h-full w-full -rotate-90">
      <circle
        :cx="size / 2"
        :cy="size / 2"
        :r="radius"
        fill="none"
        :stroke-width="strokeWidth"
        :class="trackClass"
      />
      <circle
        :cx="size / 2"
        :cy="size / 2"
        :r="radius"
        fill="none"
        :stroke-width="strokeWidth"
        stroke-linecap="round"
        :class="progressClass"
        class="transition-[stroke-dashoffset] duration-700 ease-out"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="offset"
      />
      <!-- Tour bonus si objectif dépassé -->
      <circle
        v-if="isOverflow"
        :cx="size / 2"
        :cy="size / 2"
        :r="overflowRadius"
        fill="none"
        :stroke-width="Math.max(2, strokeWidth - 3)"
        stroke-linecap="round"
        :class="overflowClass"
        class="transition-[stroke-dashoffset] duration-700 ease-out"
        :stroke-dasharray="overflowCircumference"
        :stroke-dashoffset="overflowOffset"
      />
    </svg>
    <div class="absolute flex flex-col items-center justify-center">
      <slot :pct="pct" :is-overflow="isOverflow" />
    </div>
  </div>
</template>

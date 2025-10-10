export const strengthStandards = {
  '90': {
    bench_press: {
      beginner: 60,
      intermediate: 100,
      advanced: 130,
      elite: 170,
    },
    squat: {
      beginner: 80,
      intermediate: 140,
      advanced: 180,
      elite: 220,
    },
    deadlift: {
      beginner: 100,
      intermediate: 160,
      advanced: 200,
      elite: 250,
    },
  },
}

export function getStandards(bodyweightKg = 90) {
  const key = String(bodyweightKg)
  return strengthStandards[key] || null
}

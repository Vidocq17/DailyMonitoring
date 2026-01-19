# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview
Daily Monitoring is a Vue 3 + TypeScript Progressive Web App (PWA) for tracking diet, workout, and running activities. It uses Supabase for backend storage with offline-first localStorage caching.

## Development Commands

### Setup
```bash
npm install
```

### Development
```bash
npm run dev           # Start Vite dev server (typically http://localhost:5173)
```

### Building
```bash
npm run build         # Build for production (outputs to dist/)
npm run preview       # Preview production build locally
```

### Code Formatting
```bash
npm run format        # Format src/ with Prettier (semi: false, singleQuote: true, printWidth: 100)
```

## Architecture & Data Flow

### State Management (Pinia Stores)
The application uses Pinia for state management with three main stores in `src/store/`:

- **`useDailyStore.ts`**: Manages daily diet/activity entries with localStorage caching
  - Interacts with `daily_monitoring` Supabase table
  - Key methods: `fetchDaily()`, `addDaily()`, `updateDaily()`, `deleteDaily()`
  - Getters: `getLastWeight()`, `getLastEntry()`
  
- **`useWorkoutStore.ts`**: Manages workout weights and running data
  - Interacts with `workout_weights` and `runs` Supabase tables
  - Key methods: `fetchWeights()`, `addWeight()`, `fetchRuns()`, `addRun()`
  - Getters: `getExerciseWeights()`, `getBestWeight()`, `bestPaceSecPerKm`
  
- **`userPrefStore.ts`**: Manages user preferences (e.g., dark mode)

### Offline-First Strategy
All stores implement offline-first caching:
- Data is loaded from localStorage on initialization
- Fetch operations update both state and localStorage
- On fetch errors, local data is preserved (no clearing)
- Keys: `daily_entries_v1`, `workout_entries_v1`

### Routing Structure (`router.ts`)
- `/` - Homepage (landing page)
- `/add` - Add new entries (diet, workout, runs)
- `/history` - View historical daily entries
- `/stats` - Charts and statistics

### View Organization
Views are in `src/Views/` with sub-components organized by feature:

- **`Add/`** - Forms for data entry
  - `DietForm.vue` - Daily nutrition/activity tracking
  - `WorkoutFormPPL.vue` - Push/Pull/Legs workout tracking
  - `WorkoutFormSplit.vue` - Split routine workout tracking
  - `Run.vue` - Running activity tracking

- **`Charts/`** - Data visualization
  - `DietCharts.vue` - Nutrition trends
  - `WorkoutChartsPPL.vue` - PPL progress charts
  - `WorkoutChartsSplit.vue` - Split routine progress charts
  - `RunCharts.vue` - Running performance trends

### TypeScript Types (`src/types/index.ts`)
- **`DailyEntry`**: Diet and daily activity data structure (kcal, macros, steps, water, weight, sport flags)
- **`WorkoutEntry`**: Workout weight records (exercise_name, weight, timestamp)
- **`ExerciseKey`**: Union type of all supported exercises (33 exercises across chest, back, legs, arms)

### Supabase Integration
Client configured in `supabaseClient.ts` using environment variables:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_KEY`
- `VITE_PASSWORD` (app-specific authentication)

**Tables:**
- `daily_monitoring` - Daily diet and activity entries
- `workout_weights` - Exercise weight progressions
- `runs` - Running activity records (duration_sec, distance_km, comment)

### PWA Configuration
Progressive Web App features configured in `vite.config.js`:
- Service worker with `autoUpdate` registration
- Static asset caching (CacheFirst strategy, 30-day expiration)
- Offline support with automatic cache cleanup
- Manifest: "Daily Monitoring" / "DailyMonitor"
- Icons: `/pwa-192.png`, `/pwa-512.png`

## Key Technologies
- **Framework**: Vue 3 (Composition API)
- **Build Tool**: Vite 7
- **Language**: TypeScript (strict mode)
- **State**: Pinia
- **Routing**: Vue Router (web history mode)
- **UI Libraries**: PrimeVue 4, Tailwind CSS 4
- **Charts**: vue-chartjs
- **Animations**: @vueuse/motion
- **Backend**: Supabase
- **PWA**: vite-plugin-pwa

## Development Notes

### Import Aliases
- `@/` maps to `src/` directory (configured in both `vite.config.js` and `tsconfig.json`)

### Exercise Weight Logic
Most exercises track maximum weight as progress, but two exercises track minimum weight:
- `dips_assistes` (assisted dips)
- `tractions_assistees` (assisted pull-ups)

This is handled in `useWorkoutStore.ts` `getBestWeight()` getter.

### Node Version
Requires Node.js `^20.19.0 || >=22.12.0` (see `package.json` engines)

### Recommended IDE
VSCode with extensions:
- Vue.volar (Vue 3 language support)
- esbenp.prettier-vscode (code formatting)

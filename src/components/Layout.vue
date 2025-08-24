<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <nav class="bg-white shadow p-4 flex gap-4">
      <RouterLink to="/" class="hover:underline">Accueil</RouterLink>
      <RouterLink to="/history" class="hover:underline">Historique</RouterLink>
      <RouterLink to="/stats" class="hover:underline">Statistiques</RouterLink>
    </nav>
    <main class="flex-1 container mx-auto p-4">
      <slot />
    </main>
  </div>
</template>

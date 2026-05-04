<template>
  <div class="min-h-screen bg-mist text-ink antialiased">
    <AppHeader />
    <main class="mx-auto grid max-w-7xl gap-4 px-4 py-4 sm:px-6 lg:grid-cols-[360px_minmax(0,1fr)] lg:px-8">
      <aside class="space-y-4">
        <ParkFilters />
        <ParkList />
      </aside>
      <section class="grid gap-4 lg:grid-rows-[360px_minmax(0,1fr)]">
        <ParkMap />
        <ParkDetail />
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
const { loadData } = useParks()
onMounted(loadData)
</script>

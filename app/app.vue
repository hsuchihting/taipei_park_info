<template>
  <div class="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#7dd3fc_0%,#e0f7ff_38%,#f7ffd7_70%,#dcfce7_100%)] text-ink antialiased">
    <div class="pointer-events-none fixed inset-0 overflow-hidden">
      <div class="absolute left-[5%] top-8 h-14 w-28 rounded-full bg-white/80 shadow-soft before:absolute before:-left-4 before:top-5 before:h-12 before:w-12 before:rounded-full before:bg-white/80 after:absolute after:left-10 after:-top-5 after:h-16 after:w-16 after:rounded-full after:bg-white/80"></div>
      <div class="absolute right-[12%] top-28 h-10 w-24 rounded-full bg-white/70 before:absolute before:left-5 before:-top-4 before:h-12 before:w-12 before:rounded-full before:bg-white/70 after:absolute after:right-3 after:-top-2 after:h-10 after:w-10 after:rounded-full after:bg-white/70"></div>
      <div class="absolute -left-20 bottom-[-90px] h-56 w-[58vw] rounded-[50%] bg-grass/35"></div>
      <div class="absolute -right-24 bottom-[-120px] h-64 w-[64vw] rounded-[50%] bg-leaf/35"></div>
      <div class="absolute bottom-20 left-[8%] h-4 w-4 rounded-full bg-flower shadow-[26px_20px_0_#facc15,52px_-8px_0_#fb7185,92px_18px_0_#f97316,132px_-4px_0_#facc15]"></div>
      <div class="absolute right-[10%] top-10 h-20 w-20 rounded-full bg-sun shadow-[0_0_0_14px_rgba(250,204,21,0.18)]"></div>
    </div>
    <div class="relative">
    <AppHeader />
    <main class="mx-auto grid max-w-7xl gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[360px_minmax(0,1fr)] lg:px-8">
      <aside class="space-y-4">
        <ParkFilters />
        <ParkList />
      </aside>
      <section class="grid gap-4">
        <ParkDetail />
      </section>
    </main>
    <footer class="mx-auto max-w-7xl px-4 pb-6 text-center text-sm font-bold text-river/80 sm:px-6 lg:px-8">
      Copyright © {{ currentYear }} by Hsuchihting
    </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
const { loadData } = useParks()
const currentYear = ref(new Date().getFullYear())

onMounted(loadData)
</script>

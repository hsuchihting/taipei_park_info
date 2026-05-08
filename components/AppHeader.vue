<template>
  <section class="relative overflow-hidden border-b-4 border-white/70 bg-[linear-gradient(135deg,#38bdf8_0%,#7dd3fc_45%,#bbf7d0_100%)]">
    <div class="pointer-events-none absolute inset-0">
      <div class="absolute left-8 top-8 h-12 w-24 rounded-full bg-white/80 before:absolute before:-left-4 before:top-3 before:h-10 before:w-10 before:rounded-full before:bg-white/80 after:absolute after:left-9 after:-top-4 after:h-14 after:w-14 after:rounded-full after:bg-white/80"></div>
      <div class="absolute right-24 top-7 h-16 w-16 rounded-full bg-sun shadow-[0_0_0_12px_rgba(250,204,21,0.25)]"></div>
      <div class="absolute -bottom-16 left-[-8%] h-36 w-[58%] rounded-[50%] bg-grass/50"></div>
      <div class="absolute -bottom-20 right-[-10%] h-40 w-[62%] rounded-[50%] bg-leaf/50"></div>
    </div>
    <div class="mx-auto grid max-w-7xl gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[1fr_auto] lg:px-8">
      <div class="relative">
        <p class="inline-flex rounded-full bg-white/80 px-3 py-1 text-sm font-bold text-river shadow-soft">台北市、新北市、桃園市與防災公園資料整合</p>
        <h1 class="mt-3 text-3xl font-black tracking-normal text-ink sm:text-5xl">北北桃放電好幫手</h1>
        <p class="mt-2 max-w-2xl text-sm font-medium leading-6 text-ink/75 sm:text-base">找遊具、找草地、找可以跑跳的城市小天地。</p>
      </div>
      <div class="relative grid grid-cols-3 gap-2 text-center text-sm">
        <div class="rounded-md border-2 border-white bg-white/90 px-4 py-3 shadow-sticker">
          <div class="text-xl font-semibold text-ink">{{ stats.total ? formatNumber(stats.total) : '-' }}</div>
          <div class="font-bold text-river">總筆數</div>
        </div>
        <div class="rounded-md border-2 border-white bg-white/90 px-4 py-3 shadow-sticker">
          <div class="text-xl font-semibold text-clay">{{ stats.disaster ? formatNumber(stats.disaster) : '-' }}</div>
          <div class="font-bold text-clay">防災據點</div>
        </div>
        <div class="rounded-md border-2 border-white bg-white/90 px-4 py-3 shadow-sticker">
          <div class="text-xl font-semibold text-river">{{ stats.mappable ? formatNumber(stats.mappable) : '-' }}</div>
          <div class="font-bold text-moss">可定位</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { stats } = useParks()
</script>

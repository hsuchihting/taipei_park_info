<template>
  <section class="border-b border-ink/10 bg-white">
    <div class="mx-auto grid max-w-7xl gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[1fr_auto] lg:px-8">
      <div>
        <p class="text-sm font-medium text-moss">台北市、新北市、桃園市與防災公園資料整合</p>
        <h1 class="mt-1 text-2xl font-semibold tracking-normal text-ink sm:text-3xl">北北桃放電好幫手</h1>
      </div>
      <div class="grid grid-cols-3 gap-2 text-center text-sm">
        <div class="rounded-md border border-ink/10 bg-mist px-4 py-3">
          <div class="text-xl font-semibold text-ink">{{ stats.total ? formatNumber(stats.total) : '-' }}</div>
          <div class="text-ink/60">總筆數</div>
        </div>
        <div class="rounded-md border border-ink/10 bg-mist px-4 py-3">
          <div class="text-xl font-semibold text-clay">{{ stats.disaster ? formatNumber(stats.disaster) : '-' }}</div>
          <div class="text-ink/60">防災據點</div>
        </div>
        <div class="rounded-md border border-ink/10 bg-mist px-4 py-3">
          <div class="text-xl font-semibold text-river">{{ stats.mappable ? formatNumber(stats.mappable) : '-' }}</div>
          <div class="text-ink/60">可定位</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { stats } = useParks()
</script>

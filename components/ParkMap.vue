<template>
  <div class="rounded-md border-2 border-white bg-white/90 p-4 shadow-sticker backdrop-blur">
    <div class="flex flex-wrap items-center justify-between gap-2">
      <div>
        <h2 class="font-black text-river">座標分布</h2>
        <p class="text-sm font-medium text-ink/60">台北市與防災公園可定位；新北、桃園資料目前以地址查詢為主</p>
      </div>
      <div class="flex gap-2 text-xs font-bold">
        <span class="inline-flex items-center gap-1"><span class="h-2.5 w-2.5 rounded-full bg-moss"></span>公園</span>
        <span class="inline-flex items-center gap-1"><span class="h-2.5 w-2.5 rounded-full bg-river"></span>綠地/廣場</span>
        <span class="inline-flex items-center gap-1"><span class="h-2.5 w-2.5 rounded-full bg-clay"></span>防災</span>
      </div>
    </div>
    <div class="relative mt-3 h-[275px] overflow-hidden rounded-md border-2 border-sky/20 bg-[linear-gradient(180deg,#7dd3fc_0%,#dff7ff_48%,#bbf7d0_49%,#86efac_100%)]">
      <div class="absolute inset-0 opacity-80">
        <div class="absolute left-[8%] top-[16%] h-10 w-24 rounded-full bg-white/75 before:absolute before:left-5 before:-top-4 before:h-12 before:w-12 before:rounded-full before:bg-white/75 after:absolute after:right-5 after:-top-2 after:h-10 after:w-10 after:rounded-full after:bg-white/75"></div>
        <div class="absolute right-[12%] top-[12%] h-12 w-12 rounded-full bg-sun"></div>
        <div class="absolute bottom-[18%] left-[15%] h-4 w-[72%] rotate-[-10deg] rounded-full bg-sand/80"></div>
        <div class="absolute bottom-8 left-[10%] h-3 w-3 rounded-full bg-flower shadow-[24px_-6px_0_#facc15,54px_10px_0_#fb7185,84px_-2px_0_#f97316,124px_8px_0_#facc15]"></div>
      </div>
      <button
        v-for="point in mapPoints"
        :key="point.id"
        :title="point.name"
        :class="markerClass(point.id, point.disaster, point.type)"
        :style="{ left: `${point.x}%`, top: `${point.y}%` }"
        class="absolute -translate-x-1/2 -translate-y-1/2 rounded-full shadow"
        @click="selectPark(point.id)"
      />
      <div v-if="selectedPark" class="absolute bottom-3 left-3 right-3 rounded-md border-2 border-white bg-white/95 p-3 shadow-sticker">
        <div class="font-black text-moss">{{ selectedPark.name }}</div>
        <div class="mt-1 truncate text-sm font-medium text-ink/60">{{ selectedPark.address || '尚無地址資料' }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { filtered, selectedId, selectedPark, selectPark } = useParks()

const mapPoints = computed(() => {
  const points = filtered.value.filter(hasUsableCoord)
  const lons = points.map(p => p.longitude)
  const lats = points.map(p => p.latitude)
  const minLon = Math.min(...lons, 121.45)
  const maxLon = Math.max(...lons, 121.65)
  const minLat = Math.min(...lats, 24.95)
  const maxLat = Math.max(...lats, 25.18)
  const pad = 8
  return points.slice(0, 500).map(park => ({
    ...park,
    x: pad + ((park.longitude - minLon) / Math.max(maxLon - minLon, 0.01)) * (100 - pad * 2),
    y: 100 - pad - ((park.latitude - minLat) / Math.max(maxLat - minLat, 0.01)) * (100 - pad * 2)
  }))
})

function markerClass(id: string, disaster: unknown, type: string) {
  const color = disaster ? 'bg-clay' : type === '公園' ? 'bg-moss' : 'bg-river'
  const size = id === selectedId.value ? 'h-5 w-5 ring-4 ring-white' : 'h-3 w-3'
  return `${size} ${color}`
}
</script>

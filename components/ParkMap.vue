<template>
  <div class="rounded-md border border-ink/10 bg-white p-4 shadow-soft">
    <div class="flex flex-wrap items-center justify-between gap-2">
      <div>
        <h2 class="font-semibold">座標分布</h2>
        <p class="text-sm text-ink/60">台北市與防災公園可定位；新北資料目前以地址查詢為主</p>
      </div>
      <div class="flex gap-2 text-xs">
        <span class="inline-flex items-center gap-1"><span class="h-2.5 w-2.5 rounded-full bg-moss"></span>公園</span>
        <span class="inline-flex items-center gap-1"><span class="h-2.5 w-2.5 rounded-full bg-river"></span>綠地/廣場</span>
        <span class="inline-flex items-center gap-1"><span class="h-2.5 w-2.5 rounded-full bg-clay"></span>防災</span>
      </div>
    </div>
    <div class="relative mt-3 h-[275px] overflow-hidden rounded-md border border-ink/10 bg-[linear-gradient(135deg,#eef6ee,#e8f2f5)]">
      <div class="absolute inset-0 opacity-70">
        <div class="absolute left-[8%] top-[14%] h-[72%] w-[52%] rounded-full border border-white/70"></div>
        <div class="absolute right-[9%] top-[18%] h-[58%] w-[38%] rounded-full border border-white/70"></div>
        <div class="absolute bottom-[16%] left-[20%] h-1 w-[68%] rotate-[-18deg] rounded-full bg-river/20"></div>
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
      <div v-if="selectedPark" class="absolute bottom-3 left-3 right-3 rounded-md bg-white/95 p-3 shadow-soft">
        <div class="font-semibold">{{ selectedPark.name }}</div>
        <div class="mt-1 truncate text-sm text-ink/60">{{ selectedPark.address || '尚無地址資料' }}</div>
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
  const size = id === selectedId.value ? 'h-4 w-4 ring-4 ring-white' : 'h-2.5 w-2.5'
  return `${size} ${color}`
}
</script>

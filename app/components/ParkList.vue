<template>
  <div class="rounded-md border-2 border-white bg-white/90 p-4 shadow-sticker backdrop-blur">
    <div class="flex items-center justify-between">
      <h2 class="font-black text-moss">搜尋結果</h2>
      <span class="rounded-full bg-sky/15 px-3 py-1 text-sm font-bold text-river">{{ formatNumber(filtered.length) }} 筆</span>
    </div>
    <div class="mt-3 max-h-[58vh] space-y-2 overflow-auto pr-1">
      <button
        v-for="park in visibleParks"
        :key="park.id"
        type="button"
        class="w-full rounded-md border-2 p-3 text-left transition"
        :class="park.id === selectedId ? 'border-grass bg-sand shadow-sticker' : 'border-sky/20 bg-cloud/90 hover:border-grass hover:bg-white'"
        @click="selectPark(park.id)"
      >
        <div class="flex items-start justify-between gap-3">
          <div>
            <div class="font-black leading-snug text-ink">{{ park.name }}</div>
            <div class="mt-1 text-sm font-semibold text-river">{{ park.city }}{{ park.district ? ` · ${park.district}` : '' }}</div>
          </div>
          <span v-if="park.disaster" class="shrink-0 rounded bg-clay px-2 py-1 text-xs font-extrabold text-white">防災</span>
        </div>
        <div class="mt-2 flex flex-wrap gap-1.5">
          <span
            v-for="t in getParkTags(park).slice(0, 4)"
            :key="t"
            class="rounded-full bg-white px-2 py-1 text-xs font-bold text-moss shadow-sm"
          >{{ t }}</span>
        </div>
      </button>
      <div v-if="filtered.length === 0" class="rounded-md border-2 border-sky/20 bg-cloud p-4 text-sm font-medium text-ink/60">
        找不到符合條件的公園。
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { filtered, selectedId, selectPark } = useParks()
const visibleParks = computed(() => filtered.value.slice(0, 160))
</script>

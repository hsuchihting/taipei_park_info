<template>
  <div class="rounded-md border border-ink/10 bg-white p-4">
    <div class="flex items-center justify-between">
      <h2 class="font-semibold">搜尋結果</h2>
      <span class="text-sm text-ink/60">{{ formatNumber(filtered.length) }} 筆</span>
    </div>
    <div class="mt-3 max-h-[58vh] space-y-2 overflow-auto pr-1">
      <button
        v-for="park in visibleParks"
        :key="park.id"
        type="button"
        class="w-full rounded-md border p-3 text-left transition"
        :class="park.id === selectedId ? 'border-moss bg-mist' : 'border-ink/10 bg-white hover:border-moss/60'"
        @click="selectPark(park.id)"
      >
        <div class="flex items-start justify-between gap-3">
          <div>
            <div class="font-semibold leading-snug">{{ park.name }}</div>
            <div class="mt-1 text-sm text-ink/60">{{ park.city }}{{ park.district ? ` · ${park.district}` : '' }}</div>
          </div>
          <span v-if="park.disaster" class="shrink-0 rounded bg-clay px-2 py-1 text-xs font-medium text-white">防災</span>
        </div>
        <div class="mt-2 flex flex-wrap gap-1.5">
          <span
            v-for="t in getParkTags(park).slice(0, 4)"
            :key="t"
            class="rounded px-2 py-1 text-xs font-medium bg-ink/5 text-ink/70"
          >{{ t }}</span>
        </div>
      </button>
      <div v-if="filtered.length === 0" class="rounded-md border border-ink/10 bg-white p-4 text-sm text-ink/60">
        找不到符合條件的公園。
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { filtered, selectedId, selectPark } = useParks()
const visibleParks = computed(() => filtered.value.slice(0, 160))
</script>

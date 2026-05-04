<template>
  <div v-if="!park.disaster" class="rounded-md border border-ink/10 bg-white p-4">
    <h3 class="font-semibold">防災資訊</h3>
    <p class="mt-2 text-sm text-ink/60">此公園目前未列入防災公園資料。</p>
  </div>
  <div v-else-if="!park.disaster.complete" class="rounded-md border border-clay/20 bg-clay/5 p-4">
    <h3 class="font-semibold text-clay">防災資訊</h3>
    <p class="mt-2 text-sm text-ink/70">已列入防災公園清單，但容量與應變單位資料尚未完整提供。</p>
  </div>
  <div v-else class="rounded-md border border-clay/20 bg-clay/5 p-4">
    <h3 class="font-semibold text-clay">防災資訊</h3>
    <div class="mt-3 grid grid-cols-2 gap-2 text-sm">
      <div class="rounded bg-white p-3">
        <div class="text-ink/50">收容人數</div>
        <div class="mt-1 text-lg font-semibold">{{ formatNumber(park.disaster.capacity) }}</div>
      </div>
      <div class="rounded bg-white p-3">
        <div class="text-ink/50">收容面積</div>
        <div class="mt-1 text-lg font-semibold">{{ formatNumber(park.disaster.areaM2) }}</div>
      </div>
    </div>
    <dl class="mt-3 space-y-2 text-sm">
      <div v-for="[label, value] in details" :key="label">
        <dt class="text-ink/50">{{ label }}</dt>
        <dd class="mt-0.5 text-ink/75">{{ value || '尚無資料' }}</dd>
      </div>
    </dl>
  </div>
</template>

<script setup lang="ts">
import type { Park } from '~/composables/useParks'

const props = defineProps<{ park: Park }>()

const details = computed(() => {
  const d = props.park.disaster!
  const total = d.amounts.reduce((s, n) => s + n, 0)
  return [
    ['醫院', d.hospital],
    ['消防', d.fire],
    ['警察', d.police],
    ['設備數量', `${formatNumber(total)} 項次`]
  ]
})
</script>

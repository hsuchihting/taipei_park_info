<template>
  <div class="rounded-md border border-ink/10 bg-white p-5 shadow-soft">
    <div v-if="!selectedPark" class="flex h-full min-h-[260px] items-center justify-center text-center text-ink/60">
      從左側選擇一座公園，查看完整資訊。
    </div>
    <div v-else class="grid gap-5 xl:grid-cols-[1fr_300px]">
      <div>
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="t in getParkTags(selectedPark)"
                :key="t"
                class="rounded px-2 py-1 text-xs font-medium"
                :class="t.includes('容納') ? 'bg-clay/10 text-clay' : 'bg-ink/5 text-ink/70'"
              >{{ t }}</span>
            </div>
            <h2 class="mt-3 text-2xl font-semibold">{{ selectedPark.name }}</h2>
            <p v-if="selectedPark.englishName" class="mt-1 text-sm text-ink/50">{{ selectedPark.englishName }}</p>
          </div>
          <a
            v-if="googleMapsUrl"
            :href="googleMapsUrl"
            target="_blank"
            rel="noreferrer"
            class="rounded-md bg-ink px-4 py-2 text-sm font-medium text-white transition hover:bg-moss"
          >開啟地圖</a>
        </div>

        <dl class="mt-5 grid gap-3 sm:grid-cols-2">
          <InfoCard label="城市" :value="selectedPark.city" />
          <InfoCard label="行政區" :value="selectedPark.district || '尚無資料'" />
          <InfoCard label="地址" :value="selectedPark.address || '尚無資料'" />
          <InfoCard label="管理單位" :value="selectedPark.management || '尚無資料'" />
          <InfoCard label="電話" :value="selectedPark.phone || '尚無資料'" />
          <InfoCard label="開放時間" :value="selectedPark.openingHours || '尚無資料'" />
          <InfoCard label="面積" :value="selectedPark.areaM2 ? `${formatNumber(selectedPark.areaM2)} 平方公尺` : '尚無資料'" />
          <InfoCard label="資料完整度" :value="selectedPark.completeness" />
        </dl>

        <p v-if="selectedPark.description" class="mt-5 max-h-28 overflow-auto rounded-md bg-mist p-4 text-sm leading-6 text-ink/75">
          {{ selectedPark.description }}
        </p>

        <div class="mt-5 grid gap-4 md:grid-cols-3">
          <ChipSection title="運動設施" :items="selectedPark.sports" />
          <ChipSection title="遊憩遊具" :items="[...selectedPark.recreation, ...selectedPark.playground]" />
          <ChipSection title="服務設施" :items="selectedPark.services" />
        </div>
      </div>

      <aside class="space-y-4">
        <DisasterPanel :park="selectedPark" />
        <div class="rounded-md border border-ink/10 bg-mist p-4">
          <h3 class="font-semibold">交通資訊</h3>
          <p class="mt-2 text-sm leading-6 text-ink/70">{{ selectedPark.transit || '尚無資料' }}</p>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
const { selectedPark } = useParks()

const googleMapsUrl = computed(() => {
  const p = selectedPark.value
  if (!p) return ''
  if (p.mapUrl) return p.mapUrl
  if (p.address) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${p.city} ${p.address}`)}`
  return ''
})
</script>

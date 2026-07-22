<template>
  <div class="rounded-md border-2 border-white bg-white/90 p-4 shadow-sticker backdrop-blur">
    <label class="text-sm font-bold text-river">
      搜尋
      <input
        v-model="search"
        type="search"
        placeholder="公園名稱、地址、行政區、設施"
        class="mt-2 w-full rounded-md border-2 border-sky/35 bg-cloud px-3 py-2 text-base font-medium outline-none ring-sky/20 placeholder:text-ink/40 focus:border-sky focus:ring-4"
      />
    </label>

    <div class="mt-4">
      <div class="text-sm font-bold text-moss">城市</div>
      <div class="mt-2 grid grid-cols-2 gap-2">
        <button
          v-for="[value, label] in cityOptions"
          :key="value"
          type="button"
          :class="filterClass(city === value)"
          @click="city = value"
        >{{ label }}</button>
      </div>
    </div>

    <div class="mt-4">
      <div class="text-sm font-bold text-moss">使用情境</div>
      <div class="mt-2 grid grid-cols-2 gap-2">
        <button
          v-for="[value, label] in scenarioOptions"
          :key="value"
          type="button"
          :class="filterClass(scenario === value)"
          @click="scenario = value"
        >{{ label }}</button>
      </div>
    </div>

    <div class="mt-4 grid grid-cols-2 gap-3">
      <label class="text-sm font-bold text-river">
        行政區
        <select v-model="district" class="mt-2 w-full rounded-md border-2 border-sky/30 bg-cloud px-3 py-2 outline-none focus:border-sky">
          <option value="">全部</option>
          <option v-for="d in districts" :key="d" :value="d">{{ d }}</option>
        </select>
      </label>
      <label class="text-sm font-bold text-river">
        排序
        <select v-model="sort" class="mt-2 w-full rounded-md border-2 border-sky/30 bg-cloud px-3 py-2 outline-none focus:border-sky">
          <option value="relevance">推薦</option>
          <option value="area">面積大到小</option>
          <option value="capacity">防災容量大到小</option>
          <option value="name">名稱</option>
        </select>
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
const { city, scenario, district, sort, search, districts } = useParks()

const cityOptions: Array<[string, string]> = [
  ['all', '全部'],
  ['臺北市', '臺北'],
  ['新北市', '新北'],
  ['桃園市', '桃園'],
  ['臺中市', '臺中']
]

const scenarioOptions: Array<[string, string]> = [
  ['all', '全部'],
  ['family', '親子'],
  ['sport', '運動'],
  ['service', '設施'],
  ['disaster', '防災']
]

function filterClass(active: boolean) {
  const base = 'rounded-md border-2 px-3 py-2 text-sm font-extrabold shadow-sm transition'
  return active
    ? `${base} border-moss bg-grass text-white shadow-sticker`
    : `${base} border-sky/25 bg-sand/80 text-ink hover:border-sky hover:bg-cloud hover:text-river`
}
</script>

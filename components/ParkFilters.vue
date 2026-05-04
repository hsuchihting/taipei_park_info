<template>
  <div class="rounded-md border border-ink/10 bg-white p-4 shadow-soft">
    <label class="text-sm font-medium text-ink/70">
      搜尋
      <input
        v-model="search"
        type="search"
        placeholder="公園名稱、地址、行政區、設施"
        class="mt-2 w-full rounded-md border border-ink/15 bg-white px-3 py-2 text-base outline-none ring-moss/20 placeholder:text-ink/40 focus:border-moss focus:ring-4"
      />
    </label>

    <div class="mt-4">
      <div class="text-sm font-medium text-ink/70">城市</div>
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
      <div class="text-sm font-medium text-ink/70">使用情境</div>
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
      <label class="text-sm font-medium text-ink/70">
        行政區
        <select v-model="district" class="mt-2 w-full rounded-md border border-ink/15 bg-white px-3 py-2 outline-none focus:border-moss">
          <option value="">全部</option>
          <option v-for="d in districts" :key="d" :value="d">{{ d }}</option>
        </select>
      </label>
      <label class="text-sm font-medium text-ink/70">
        排序
        <select v-model="sort" class="mt-2 w-full rounded-md border border-ink/15 bg-white px-3 py-2 outline-none focus:border-moss">
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

const cityOptions = [
  ['all', '全部'],
  ['臺北市', '臺北'],
  ['新北市', '新北'],
  ['桃園市', '桃園']
]

const scenarioOptions = [
  ['all', '全部'],
  ['family', '親子'],
  ['sport', '運動'],
  ['service', '設施'],
  ['disaster', '防災']
]

function filterClass(active: boolean) {
  const base = 'rounded-md border px-3 py-2 text-sm font-medium transition'
  return active
    ? `${base} border-moss bg-moss text-white`
    : `${base} border-ink/10 bg-white text-ink/70 hover:border-moss hover:text-moss`
}
</script>

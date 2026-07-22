<template>
  <section class="rounded-md border-2 border-white bg-[linear-gradient(180deg,#ffffff,#f8fdff)] p-4 shadow-sm">
    <h3 class="font-black text-moss">{{ title }}</h3>
    <div class="mt-3 flex flex-wrap gap-1.5">
      <span
        v-for="item in unique.slice(0, 18)"
        :key="item"
        class="rounded-full bg-sand px-2 py-1 text-xs font-bold text-ink/75"
      >{{ item }}</span>
      <span v-if="unique.length === 0" class="text-sm font-medium text-ink/45">尚無資料</span>
    </div>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{ title: string; items: string[] }>()
const unique = computed(() => [...new Set(props.items)])
</script>

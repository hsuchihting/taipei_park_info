<template>
  <section class="rounded-md border border-ink/10 bg-white p-4">
    <h3 class="font-semibold">{{ title }}</h3>
    <div class="mt-3 flex flex-wrap gap-1.5">
      <span
        v-for="item in unique.slice(0, 18)"
        :key="item"
        class="rounded px-2 py-1 text-xs font-medium bg-ink/5 text-ink/70"
      >{{ item }}</span>
      <span v-if="unique.length === 0" class="text-sm text-ink/45">尚無資料</span>
    </div>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{ title: string; items: string[] }>()
const unique = computed(() => [...new Set(props.items)])
</script>

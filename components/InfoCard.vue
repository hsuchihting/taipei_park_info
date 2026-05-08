<template>
  <div class="rounded-md border-2 border-sky/15 bg-cloud/80 p-3">
    <dt class="text-xs font-extrabold text-river">{{ label }}</dt>
    <dd class="mt-1 break-words text-sm font-semibold text-ink">{{ value }}</dd>
  </div>
</template>

<script setup lang="ts">
defineProps<{ label: string; value: string }>()
</script>

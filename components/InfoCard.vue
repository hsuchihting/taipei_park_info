<template>
  <div class="rounded-md border border-ink/10 bg-white p-3">
    <dt class="text-xs font-medium text-ink/50">{{ label }}</dt>
    <dd class="mt-1 break-words text-sm text-ink">{{ value }}</dd>
  </div>
</template>

<script setup lang="ts">
defineProps<{ label: string; value: string }>()
</script>

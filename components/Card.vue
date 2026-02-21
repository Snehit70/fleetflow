<template>
  <div class="bg-white rounded-lg shadow p-6">
    <div v-if="title" class="text-sm text-gray-500 mb-1">{{ title }}</div>
    <div v-if="value !== undefined" class="text-2xl font-bold">{{ value }}</div>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
  value?: string | number
}>()
</script>

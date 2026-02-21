<template>
  <div class="mb-6 flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold text-gray-900">{{ title }}</h1>
      <p v-if="subtitle" class="text-gray-500 mt-1">{{ subtitle }}</p>
    </div>
    <div v-if="$slots.actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
}>()
</script>

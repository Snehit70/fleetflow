<template>
  <div class="flex items-center gap-2">
    <div class="relative w-10 h-10">
      <!-- Background circle -->
      <svg class="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
        <circle
          cx="18"
          cy="18"
          r="16"
          fill="none"
          :stroke="bgColor"
          stroke-width="3"
        />
        <circle
          cx="18"
          cy="18"
          r="16"
          fill="none"
          :stroke="color"
          stroke-width="3"
          :stroke-dasharray="`${percentage}, 100`"
          stroke-linecap="round"
        />
      </svg>
      <!-- Score text -->
      <div class="absolute inset-0 flex items-center justify-center">
        <span :class="['text-xs font-bold', textColor]">{{ score }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  score: number
}

const props = defineProps<Props>()

const percentage = computed(() => props.score)

const color = computed(() => {
  if (props.score >= 80) return 'hsl(var(--success))'
  if (props.score >= 60) return 'hsl(var(--warning))'
  return 'hsl(var(--danger))'
})

const bgColor = computed(() => {
  if (props.score >= 80) return 'hsl(var(--success) / 0.2)'
  if (props.score >= 60) return 'hsl(var(--warning) / 0.2)'
  return 'hsl(var(--danger) / 0.2)'
})

const textColor = computed(() => {
  if (props.score >= 80) return 'text-success'
  if (props.score >= 60) return 'text-warning'
  return 'text-danger'
})
</script>

<template>
  <div :class="['inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium', badgeClass]">
    <svg v-if="status === 'expired'" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
    <svg v-else-if="status === 'expiring'" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
    <svg v-else class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
    <span>{{ displayText }}</span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  expiry: string
}

const props = defineProps<Props>()

const now = new Date()
const expiryDate = computed(() => new Date(props.expiry))
const daysUntilExpiry = computed(() => {
  const diff = expiryDate.value.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
})

const status = computed(() => {
  if (daysUntilExpiry.value < 0) return 'expired'
  if (daysUntilExpiry.value <= 30) return 'expiring'
  return 'valid'
})

const displayText = computed(() => {
  if (status.value === 'expired') {
    const days = Math.abs(daysUntilExpiry.value)
    return `Expired ${days} day${days !== 1 ? 's' : ''} ago`
  }
  if (status.value === 'expiring') {
    return `${daysUntilExpiry.value} day${daysUntilExpiry.value !== 1 ? 's' : ''} left`
  }
  return expiryDate.value.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  })
})

const badgeClass = computed(() => {
  switch (status.value) {
    case 'expired':
      return 'bg-danger/15 text-danger'
    case 'expiring':
      return 'bg-warning/15 text-warning'
    default:
      return 'bg-success/15 text-success'
  }
})
</script>

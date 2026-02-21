<template>
  <span :class="badgeClasses">
    <component :is="iconComponent" v-if="showIcon" class="w-3.5 h-3.5" />
    <span>{{ displayText }}</span>
  </span>
</template>

<script setup lang="ts">
type StatusType = 
  | 'AVAILABLE' | 'ON_TRIP' | 'IN_SHOP' | 'RETIRED'
  | 'ON_DUTY' | 'OFF_DUTY' | 'SUSPENDED'
  | 'DRAFT' | 'DISPATCHED' | 'COMPLETED' | 'CANCELLED'

interface Props {
  status: StatusType
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  showIcon: true
})

const statusConfig: Record<StatusType, { class: string; label: string; icon: string }> = {
  // Vehicle statuses
  AVAILABLE: { class: 'status-available', label: 'Available', icon: 'check-circle' },
  ON_TRIP: { class: 'status-on-trip', label: 'On Trip', icon: 'truck' },
  IN_SHOP: { class: 'status-in-shop', label: 'In Shop', icon: 'wrench' },
  RETIRED: { class: 'status-retired', label: 'Retired', icon: 'x-circle' },
  // Driver statuses
  ON_DUTY: { class: 'status-on-duty', label: 'On Duty', icon: 'user-check' },
  OFF_DUTY: { class: 'status-off-duty', label: 'Off Duty', icon: 'user-minus' },
  SUSPENDED: { class: 'status-suspended', label: 'Suspended', icon: 'alert-triangle' },
  // Trip statuses
  DRAFT: { class: 'status-draft', label: 'Draft', icon: 'file-text' },
  DISPATCHED: { class: 'status-dispatched', label: 'Dispatched', icon: 'send' },
  COMPLETED: { class: 'status-completed', label: 'Completed', icon: 'check-circle' },
  CANCELLED: { class: 'status-cancelled', label: 'Cancelled', icon: 'x-circle' },
}

const config = computed(() => statusConfig[props.status] || { class: 'badge-muted', label: props.status, icon: 'circle' })

const displayText = computed(() => config.value.label)

const sizeClasses = {
  sm: 'text-[10px] px-2 py-0.5',
  md: 'text-xs px-2.5 py-1',
  lg: 'text-sm px-3 py-1.5'
}

const badgeClasses = computed(() => [
  'status-badge',
  config.value.class,
  sizeClasses[props.size]
])

// Simple SVG icons as components
const icons: Record<string, any> = {
  'check-circle': {
    template: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`
  },
  'truck': {
    template: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`
  },
  'wrench': {
    template: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`
  },
  'x-circle': {
    template: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`
  },
  'user-check': {
    template: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>`
  },
  'user-minus': {
    template: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="23" y1="11" x2="17" y2="11"/></svg>`
  },
  'alert-triangle': {
    template: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`
  },
  'file-text': {
    template: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`
  },
  'send': {
    template: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`
  },
  'circle': {
    template: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>`
  }
}

const iconComponent = computed(() => {
  const iconName = config.value.icon
  return icons[iconName] || icons['circle']
})
</script>

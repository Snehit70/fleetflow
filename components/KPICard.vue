<template>
  <component
    :is="href ? 'NuxtLink' : 'div'"
    :to="href"
    :class="[
      'kpi-card group cursor-pointer',
      colorClasses[color]
    ]"
  >
    <div class="relative z-10">
      <div class="flex items-center justify-between mb-3">
        <div :class="['p-2 rounded-lg', iconBgClasses[color]]">
          <slot name="icon">
            <div class="w-5 h-5" v-html="defaultIcon" />
          </slot>
        </div>
        <div v-if="trend !== undefined" :class="['flex items-center gap-1 text-sm font-medium', trendColor]">
          <svg v-if="trend > 0" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            <polyline points="17 6 23 6 23 12" />
          </svg>
          <svg v-else-if="trend < 0" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
            <polyline points="17 18 23 18 23 12" />
          </svg>
          <span>{{ Math.abs(trend) }}%</span>
        </div>
      </div>
      
      <div class="kpi-value" :class="textColorClasses[color]">
        {{ displayValue }}
      </div>
      
      <div class="kpi-label flex items-center justify-between">
        <span>{{ title }}</span>
        <svg v-if="href" class="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </div>
    </div>
    
    <!-- Background Icon -->
    <div class="kpi-card-icon" v-html="backgroundIcon" />
  </component>
</template>

<script setup lang="ts">
interface Props {
  title: string
  value: number | string
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  trend?: number
  href?: string
  suffix?: string
  prefix?: string
  animated?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  color: 'primary',
  animated: true
})

const animatedValue = ref(0)
const displayValue = computed(() => {
  const val = props.animated && typeof props.value === 'number' 
    ? animatedValue.value 
    : props.value
  
  let display = String(val)
  if (props.prefix) display = props.prefix + display
  if (props.suffix) display = display + props.suffix
  return display
})

// Animate number on mount
onMounted(() => {
  if (props.animated && typeof props.value === 'number') {
    const duration = 800
    const start = performance.now()
    const end = props.value
    
    const animate = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      animatedValue.value = Math.round(end * eased)
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    
    requestAnimationFrame(animate)
  }
})

// Watch for value changes
watch(() => props.value, (newVal) => {
  if (props.animated && typeof newVal === 'number') {
    const duration = 500
    const start = performance.now()
    const startVal = animatedValue.value
    const end = newVal
    
    const animate = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      animatedValue.value = Math.round(startVal + (end - startVal) * eased)
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    
    requestAnimationFrame(animate)
  }
})

const trendColor = computed(() => {
  if (props.trend === undefined) return ''
  if (props.trend > 0) return 'text-success'
  if (props.trend < 0) return 'text-danger'
  return 'text-muted-foreground'
})

const colorClasses: Record<string, string> = {
  primary: 'border-l-4 border-l-primary',
  success: 'border-l-4 border-l-success',
  warning: 'border-l-4 border-l-warning',
  danger: 'border-l-4 border-l-danger',
  info: 'border-l-4 border-l-info',
}

const iconBgClasses: Record<string, string> = {
  primary: 'bg-primary/10 text-primary',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  danger: 'bg-danger/10 text-danger',
  info: 'bg-info/10 text-info',
}

const textColorClasses: Record<string, string> = {
  primary: 'text-primary',
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
  info: 'text-info',
}

// Default icons based on common KPI types
const defaultIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`

const backgroundIcon = `<svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`
</script>

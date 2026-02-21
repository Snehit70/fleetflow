<template>
  <div class="tooltip-wrapper" @mouseenter="show = true" @mouseleave="show = false">
    <slot />
    <Transition name="tooltip">
      <div v-if="show && text" class="tooltip" :class="positionClass">
        {{ text }}
        <div class="tooltip-arrow" :class="arrowClass" />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  text: string
  position?: 'top' | 'bottom' | 'left' | 'right'
}>(), {
  position: 'top'
})

const show = ref(false)

const positionClass = computed(() => {
  const positions = {
    top: 'tooltip-top',
    bottom: 'tooltip-bottom',
    left: 'tooltip-left',
    right: 'tooltip-right'
  }
  return positions[props.position]
})

const arrowClass = computed(() => {
  const arrows = {
    top: 'arrow-bottom',
    bottom: 'arrow-top',
    left: 'arrow-right',
    right: 'arrow-left'
  }
  return arrows[props.position]
})
</script>

<style scoped>
.tooltip-wrapper {
  @apply relative inline-block;
}

.tooltip {
  @apply absolute z-50 px-2.5 py-1.5 text-xs font-medium text-white bg-foreground rounded-md shadow-lg whitespace-nowrap;
}

.tooltip-top {
  @apply bottom-full left-1/2 -translate-x-1/2 mb-2;
}

.tooltip-bottom {
  @apply top-full left-1/2 -translate-x-1/2 mt-2;
}

.tooltip-left {
  @apply right-full top-1/2 -translate-y-1/2 mr-2;
}

.tooltip-right {
  @apply left-full top-1/2 -translate-y-1/2 ml-2;
}

.tooltip-arrow {
  @apply absolute w-2 h-2 bg-foreground rotate-45;
}

.arrow-bottom {
  @apply -bottom-1 left-1/2 -translate-x-1/2;
}

.arrow-top {
  @apply -top-1 left-1/2 -translate-x-1/2;
}

.arrow-left {
  @apply -left-1 top-1/2 -translate-y-1/2;
}

.arrow-right {
  @apply -right-1 top-1/2 -translate-y-1/2;
}

.tooltip-enter-active,
.tooltip-leave-active {
  transition: opacity 150ms ease, transform 150ms ease;
}

.tooltip-enter-from,
.tooltip-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(4px);
}

.tooltip-top.tooltip-enter-from,
.tooltip-top.tooltip-leave-to {
  transform: translateX(-50%) translateY(4px);
}

.tooltip-bottom.tooltip-enter-from,
.tooltip-bottom.tooltip-leave-to {
  transform: translateX(-50%) translateY(-4px);
}
</style>

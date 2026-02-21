<template>
  <Teleport to="body">
    <Transition name="slideover">
      <div v-if="modelValue" class="slideover-overlay" @click.self="close">
        <div class="slideover-panel">
          <!-- Header -->
          <div class="slideover-header">
            <h2 class="text-lg font-semibold">{{ title }}</h2>
            <button @click="close" class="p-2 hover:bg-muted rounded-lg transition-colors">
              <svg class="w-5 h-5 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <!-- Content -->
          <div class="slideover-content">
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  title: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

function close() {
  emit('update:modelValue', false)
}

// Close on escape key
onMounted(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && props.modelValue) {
      close()
    }
  }
  window.addEventListener('keydown', handleEscape)
  onUnmounted(() => window.removeEventListener('keydown', handleEscape))
})
</script>

<style scoped>
.slideover-overlay {
  @apply fixed inset-0 z-50 bg-black/50 backdrop-blur-sm;
}

.slideover-panel {
  @apply fixed right-0 top-0 h-full w-full max-w-md bg-card shadow-xl flex flex-col;
}

.slideover-header {
  @apply flex items-center justify-between px-6 py-4 border-b border-border;
}

.slideover-content {
  @apply flex-1 overflow-y-auto;
}

.slideover-enter-active {
  transition: opacity 200ms ease;
}

.slideover-enter-active .slideover-panel {
  transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1);
}

.slideover-leave-active {
  transition: opacity 150ms ease;
}

.slideover-leave-active .slideover-panel {
  transition: transform 200ms ease;
}

.slideover-enter-from,
.slideover-leave-to {
  opacity: 0;
}

.slideover-enter-from .slideover-panel,
.slideover-leave-to .slideover-panel {
  transform: translateX(100%);
}
</style>

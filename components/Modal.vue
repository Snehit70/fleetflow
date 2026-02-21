<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue: boolean
  title: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}>(), {
  size: 'md'
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const sizeClass = computed(() => {
  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  }
  return sizes[props.size]
})

function close() {
  emit('update:modelValue', false)
}

// Close on escape key
function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.modelValue) {
    close()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <ClientOnly>
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="modelValue" class="modal-overlay">
          <div class="modal-backdrop" @click="close" />
          <div :class="['modal-panel', sizeClass]">
            <!-- Header -->
            <div class="modal-header">
              <h2 class="text-xl font-semibold">{{ title }}</h2>
              <button 
                @click="close" 
                class="modal-close-btn"
              >
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <!-- Content -->
            <div class="modal-body">
              <slot />
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </ClientOnly>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.modal-panel {
  position: relative;
  width: 100%;
  background: hsl(var(--card));
  border-radius: 0.75rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  padding: 1.5rem;
  max-height: calc(100vh - 4rem);
  overflow-y: auto;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.modal-close-btn {
  padding: 0.5rem;
  margin: -0.5rem;
  margin-right: -0.5rem;
  border-radius: 0.5rem;
  color: hsl(var(--muted-foreground));
  transition: all 150ms ease;
}

.modal-close-btn:hover {
  background: hsl(var(--muted));
  color: hsl(var(--foreground));
}

.modal-body {
  /* Content styles */
}

/* Transition animations */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 200ms ease;
}

.modal-enter-active .modal-panel,
.modal-leave-active .modal-panel {
  transition: transform 200ms ease, opacity 200ms ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-panel,
.modal-leave-to .modal-panel {
  transform: scale(0.95);
  opacity: 0;
}
</style>

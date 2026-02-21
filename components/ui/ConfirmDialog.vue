<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="modal-overlay" @click.self="cancel">
        <div class="modal-content max-w-sm">
          <!-- Icon -->
          <div class="flex justify-center mb-4">
            <div :class="iconContainerClass">
              <component :is="icon" class="w-6 h-6" />
            </div>
          </div>

          <!-- Content -->
          <div class="text-center mb-6">
            <h3 class="text-lg font-semibold text-foreground mb-2">{{ title }}</h3>
            <p class="text-sm text-muted-foreground">{{ message }}</p>
          </div>

          <!-- Actions -->
          <div class="flex gap-3">
            <button 
              @click="cancel" 
              class="btn-secondary btn-md flex-1"
              :disabled="loading"
            >
              {{ cancelText }}
            </button>
            <button 
              @click="confirm" 
              :class="confirmButtonClass"
              :disabled="loading"
            >
              <svg v-if="loading" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" stroke-opacity="0.25" />
                <path d="M12 2a10 10 0 0 1 10 10" />
              </svg>
              <span v-else>{{ confirmText }}</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  isOpen: boolean
  title: string
  message: string
  type?: 'danger' | 'warning' | 'info'
  confirmText?: string
  cancelText?: string
  loading?: boolean
}>(), {
  type: 'danger',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  loading: false
})

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const iconContainerClass = computed(() => {
  const base = 'w-12 h-12 rounded-full flex items-center justify-center'
  const variants = {
    danger: 'bg-danger/10 text-danger',
    warning: 'bg-warning/10 text-warning',
    info: 'bg-info/10 text-info'
  }
  return `${base} ${variants[props.type]}`
})

const confirmButtonClass = computed(() => {
  const variants = {
    danger: 'btn-danger btn-md flex-1',
    warning: 'btn-primary btn-md flex-1',
    info: 'btn-primary btn-md flex-1'
  }
  return variants[props.type]
})

const icon = computed(() => {
  const icons = {
    danger: {
      template: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>`
    },
    warning: {
      template: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`
    },
    info: {
      template: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`
    }
  }
  return icons[props.type]
})

function confirm() {
  emit('confirm')
}

function cancel() {
  if (!props.loading) {
    emit('cancel')
  }
}

// Close on escape key
onMounted(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && props.isOpen && !props.loading) {
      cancel()
    }
  }
  window.addEventListener('keydown', handleEscape)
  onUnmounted(() => window.removeEventListener('keydown', handleEscape))
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 200ms ease;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 200ms ease, opacity 200ms ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: translate(-50%, -50%) scale(0.95);
  opacity: 0;
}
</style>

<template>
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="['toast', toastClasses[toast.type]]"
        >
          <div :class="['flex-shrink-0', iconClasses[toast.type]]">
            <component :is="icons[toast.type]" class="w-5 h-5" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-medium text-sm text-foreground">{{ toast.title }}</p>
            <p v-if="toast.message" class="text-sm text-muted-foreground mt-0.5">{{ toast.message }}</p>
          </div>
          <button
            @click="removeToast(toast.id)"
            class="flex-shrink-0 p-1 rounded hover:bg-muted transition-colors"
          >
            <svg class="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const { toasts, removeToast } = useToast()

const toastClasses: Record<string, string> = {
  success: 'toast-success',
  error: 'toast-error',
  warning: 'toast-warning',
  info: 'toast-info'
}

const iconClasses: Record<string, string> = {
  success: 'text-success',
  error: 'text-danger',
  warning: 'text-warning',
  info: 'text-info'
}

const icons = {
  success: {
    template: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`
  },
  error: {
    template: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`
  },
  warning: {
    template: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`
  },
  info: {
    template: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`
  }
}
</script>

<style scoped>
.toast-enter-active {
  animation: slide-in-right 250ms ease-out;
}

.toast-leave-active {
  animation: slide-out-right 200ms ease-out;
}

.toast-move {
  transition: transform 200ms ease;
}
</style>

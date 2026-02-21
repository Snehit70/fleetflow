<template>
  <div class="min-h-screen flex bg-background">
    <!-- Sidebar -->
    <aside class="w-64 bg-card border-r border-border flex flex-col fixed h-full z-40">
      <!-- Logo -->
      <div class="p-6 border-b border-border">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <svg class="w-6 h-6 text-primary-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="1" y="3" width="15" height="13" rx="2" />
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
          </div>
          <div>
            <h1 class="text-lg font-bold font-heading text-foreground">FleetFlow</h1>
            <p class="text-xs text-muted-foreground">Logistics Management</p>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
        <NuxtLink to="/" class="sidebar-nav-item" active-class="active">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
          </svg>
          Dashboard
        </NuxtLink>

        <NuxtLink 
          v-if="user && ['MANAGER', 'DISPATCHER'].includes(user.role)" 
          to="/vehicles" 
          class="sidebar-nav-item" 
          active-class="active"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="1" y="3" width="15" height="13" rx="2" />
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
            <circle cx="5.5" cy="18.5" r="2.5" />
            <circle cx="18.5" cy="18.5" r="2.5" />
          </svg>
          Vehicles
        </NuxtLink>

        <NuxtLink 
          v-if="user && ['MANAGER', 'DISPATCHER', 'SAFETY_OFFICER'].includes(user.role)" 
          to="/drivers" 
          class="sidebar-nav-item" 
          active-class="active"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          Drivers
        </NuxtLink>

        <NuxtLink 
          v-if="user && ['MANAGER', 'DISPATCHER', 'SAFETY_OFFICER'].includes(user.role)" 
          to="/trips" 
          class="sidebar-nav-item" 
          active-class="active"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" />
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
          </svg>
          Trips
        </NuxtLink>

        <NuxtLink 
          v-if="user && ['MANAGER', 'FINANCIAL_ANALYST'].includes(user.role)" 
          to="/maintenance" 
          class="sidebar-nav-item" 
          active-class="active"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
          </svg>
          Maintenance
        </NuxtLink>

        <NuxtLink 
          v-if="user && ['MANAGER', 'FINANCIAL_ANALYST'].includes(user.role)" 
          to="/expenses" 
          class="sidebar-nav-item" 
          active-class="active"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
          Expenses
        </NuxtLink>

        <NuxtLink 
          v-if="user && ['MANAGER', 'SAFETY_OFFICER', 'FINANCIAL_ANALYST'].includes(user.role)" 
          to="/analytics" 
          class="sidebar-nav-item" 
          active-class="active"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
          Analytics
        </NuxtLink>
      </nav>

      <!-- User Section -->
      <div class="p-4 border-t border-border">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span class="text-sm font-semibold text-primary">{{ userInitials }}</span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-foreground truncate">{{ user?.name || 'User' }}</p>
            <p class="text-xs text-muted-foreground">{{ formatRole(user?.role) }}</p>
          </div>
        </div>
        <button 
          @click="logout" 
          class="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-danger bg-danger/10 hover:bg-danger/20 transition-colors"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Logout
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 ml-64">
      <main class="p-6 lg:p-8">
        <slot />
      </main>
    </div>

    <!-- Toast Container -->
    <Toast />
  </div>
</template>

<script setup lang="ts">
const { logout, user } = useAuth()

const userInitials = computed(() => {
  const name = user.value?.name || 'U'
  return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
})

function formatRole(role?: string) {
  if (!role) return ''
  return role.replaceAll('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
}
</script>

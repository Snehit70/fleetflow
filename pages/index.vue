<template>
  <div>
    <!-- Page Header with Greeting -->
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ greeting }}, {{ userName }}!</h1>
        <p class="page-subtitle">Here's your fleet overview for {{ currentDate }}</p>
      </div>
      <div class="flex items-center gap-3">
        <NuxtLink to="/trips" class="btn-primary btn-md">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Trip
        </NuxtLink>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div v-for="i in 4" :key="i" class="card p-6">
        <div class="skeleton skeleton-shimmer h-4 w-24 mb-4 rounded" />
        <div class="skeleton skeleton-shimmer h-10 w-20 mb-2 rounded" />
        <div class="skeleton skeleton-shimmer h-3 w-32 rounded" />
      </div>
    </div>

    <template v-else>
      <!-- KPI Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="Active Fleet"
          :value="dashboard.activeFleet"
          color="info"
          href="/vehicles"
        >
          <template #icon>
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="1" y="3" width="15" height="13" rx="2" />
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
          </template>
        </KPICard>

        <KPICard
          title="Maintenance Alerts"
          :value="dashboard.maintenanceAlerts"
          color="warning"
          href="/maintenance"
        >
          <template #icon>
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
          </template>
        </KPICard>

        <KPICard
          title="Utilization Rate"
          :value="dashboard.utilizationRate"
          suffix="%"
          color="success"
          href="/analytics"
        >
          <template #icon>
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
          </template>
        </KPICard>

        <KPICard
          title="Pending Trips"
          :value="dashboard.pendingCargo"
          color="primary"
          href="/trips"
        >
          <template #icon>
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </template>
        </KPICard>
      </div>

      <!-- Quick Stats Row -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <!-- Fleet Overview Card -->
        <div class="card p-6 lg:col-span-2">
          <h3 class="text-lg font-semibold mb-4">Fleet Overview</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="text-center p-4 bg-muted rounded-lg">
              <div class="text-3xl font-bold text-foreground mb-1">{{ dashboard.totalVehicles }}</div>
              <div class="text-sm text-muted-foreground">Total Vehicles</div>
            </div>
            <div class="text-center p-4 bg-success/10 rounded-lg">
              <div class="text-3xl font-bold text-success mb-1">{{ vehiclesByStatus.available }}</div>
              <div class="text-sm text-muted-foreground">Available</div>
            </div>
            <div class="text-center p-4 bg-info/10 rounded-lg">
              <div class="text-3xl font-bold text-info mb-1">{{ vehiclesByStatus.onTrip }}</div>
              <div class="text-sm text-muted-foreground">On Trip</div>
            </div>
            <div class="text-center p-4 bg-warning/10 rounded-lg">
              <div class="text-3xl font-bold text-warning mb-1">{{ vehiclesByStatus.inShop }}</div>
              <div class="text-sm text-muted-foreground">In Shop</div>
            </div>
          </div>
        </div>

        <!-- Driver Stats Card -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold mb-4">Driver Status</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-sm text-muted-foreground">Total Drivers</span>
              <span class="text-lg font-bold">{{ dashboard.totalDrivers }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-muted-foreground">On Duty</span>
              <span class="text-lg font-bold text-success">{{ driversByStatus.onDuty }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-muted-foreground">Off Duty</span>
              <span class="text-lg font-bold text-muted-foreground">{{ driversByStatus.offDuty }}</span>
            </div>
            <NuxtLink to="/drivers" class="btn-secondary btn-sm w-full justify-center mt-4">
              View All Drivers
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold mb-4">Quick Actions</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <NuxtLink to="/trips" class="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors group">
            <div class="p-3 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
              </svg>
            </div>
            <span class="text-sm font-medium">New Trip</span>
          </NuxtLink>

          <NuxtLink to="/vehicles" class="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:border-info hover:bg-info/5 transition-colors group">
            <div class="p-3 rounded-full bg-info/10 text-info group-hover:bg-info group-hover:text-info-foreground transition-colors">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="1" y="3" width="15" height="13" rx="2" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
            </div>
            <span class="text-sm font-medium">Add Vehicle</span>
          </NuxtLink>

          <NuxtLink to="/drivers" class="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:border-success hover:bg-success/5 transition-colors group">
            <div class="p-3 rounded-full bg-success/10 text-success group-hover:bg-success group-hover:text-success-foreground transition-colors">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
                <line x1="20" y1="8" x2="20" y2="14" />
                <line x1="23" y1="11" x2="17" y2="11" />
              </svg>
            </div>
            <span class="text-sm font-medium">Add Driver</span>
          </NuxtLink>

          <NuxtLink to="/maintenance" class="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:border-warning hover:bg-warning/5 transition-colors group">
            <div class="p-3 rounded-full bg-warning/10 text-warning group-hover:bg-warning group-hover:text-warning-foreground transition-colors">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
              </svg>
            </div>
            <span class="text-sm font-medium">Log Maintenance</span>
          </NuxtLink>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: ['auth', 'role'],
  roles: ['MANAGER', 'DISPATCHER', 'SAFETY_OFFICER', 'FINANCIAL_ANALYST']
})

const { user } = useAuth()

const dashboard = ref({
  totalVehicles: 0,
  totalDrivers: 0,
  activeFleet: 0,
  maintenanceAlerts: 0,
  utilizationRate: 0,
  pendingCargo: 0
})

const vehiclesByStatus = ref({
  available: 0,
  onTrip: 0,
  inShop: 0,
  retired: 0
})

const driversByStatus = ref({
  onDuty: 0,
  offDuty: 0,
  suspended: 0
})

const loading = ref(true)

const userName = computed(() => {
  return user.value?.name?.split(' ')[0] || 'User'
})

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
})

const currentDate = computed(() => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

onMounted(async () => {
  try {
    // Fetch dashboard data (always available)
    const dashboardData = await $fetch('/api/analytics/dashboard')
    dashboard.value = dashboardData
    
    // Fetch vehicles (may fail for some roles)
    try {
      const vehicles = await $fetch<any[]>('/api/vehicles')
      const vehicleStatusCount = { available: 0, onTrip: 0, inShop: 0, retired: 0 }
      vehicles.forEach((v: any) => {
        if (v.status === 'AVAILABLE') vehicleStatusCount.available++
        else if (v.status === 'ON_TRIP') vehicleStatusCount.onTrip++
        else if (v.status === 'IN_SHOP') vehicleStatusCount.inShop++
        else if (v.status === 'RETIRED') vehicleStatusCount.retired++
      })
      vehiclesByStatus.value = vehicleStatusCount
    } catch {
      // Use dashboard data as fallback
      vehiclesByStatus.value = {
        available: dashboardData.totalVehicles - dashboardData.activeFleet - dashboardData.maintenanceAlerts,
        onTrip: dashboardData.activeFleet,
        inShop: dashboardData.maintenanceAlerts,
        retired: 0
      }
    }
    
    // Fetch drivers (may fail for some roles)
    try {
      const drivers = await $fetch<any[]>('/api/drivers')
      const driverStatusCount = { onDuty: 0, offDuty: 0, suspended: 0 }
      drivers.forEach((d: any) => {
        if (d.status === 'ON_DUTY') driverStatusCount.onDuty++
        else if (d.status === 'OFF_DUTY') driverStatusCount.offDuty++
        else if (d.status === 'SUSPENDED') driverStatusCount.suspended++
      })
      driversByStatus.value = driverStatusCount
    } catch {
      // Use dashboard data as fallback
      driversByStatus.value = {
        onDuty: dashboardData.totalDrivers,
        offDuty: 0,
        suspended: 0
      }
    }
    
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})
</script>

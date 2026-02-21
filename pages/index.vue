<template>
  <div class="p-6">
    <PageHeader title="Dashboard" subtitle="Fleet overview at a glance" />
    
    <div v-if="loading" class="flex justify-center py-10">
      <div class="text-xl">Loading...</div>
    </div>

    <div v-else>
      <!-- KPI Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <UCard>
          <div class="text-center">
            <div class="text-3xl font-bold text-primary">{{ dashboard.activeFleet }}</div>
            <div class="text-sm text-gray-500 mt-1">Active Fleet</div>
          </div>
        </UCard>

        <UCard>
          <div class="text-center">
            <div class="text-3xl font-bold text-orange-500">{{ dashboard.maintenanceAlerts }}</div>
            <div class="text-sm text-gray-500 mt-1">Maintenance Alerts</div>
          </div>
        </UCard>

        <UCard>
          <div class="text-center">
            <div class="text-3xl font-bold text-green-500">{{ dashboard.utilizationRate }}%</div>
            <div class="text-sm text-gray-500 mt-1">Utilization Rate</div>
          </div>
        </UCard>

        <UCard>
          <div class="text-center">
            <div class="text-3xl font-bold text-yellow-500">{{ dashboard.pendingCargo }}</div>
            <div class="text-sm text-gray-500 mt-1">Pending Cargo</div>
          </div>
        </UCard>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UCard>
          <template #header>
            <h3 class="font-semibold">Total Vehicles</h3>
          </template>
          <div class="text-4xl font-bold">{{ dashboard.totalVehicles }}</div>
        </UCard>

        <UCard>
          <template #header>
            <h3 class="font-semibold">Total Drivers</h3>
          </template>
          <div class="text-4xl font-bold">{{ dashboard.totalDrivers }}</div>
        </UCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const dashboard = ref({
  totalVehicles: 0,
  totalDrivers: 0,
  activeFleet: 0,
  maintenanceAlerts: 0,
  utilizationRate: 0,
  pendingCargo: 0
})

const loading = ref(true)

onMounted(async () => {
  try {
    dashboard.value = await $fetch('/api/analytics/dashboard')
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})
</script>

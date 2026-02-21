<template>
  <div class="p-6">
    <PageHeader title="Analytics" subtitle="Data-driven insights" />

    <!-- Summary Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card title="Total Active Fleet" :value="utilization?.totalActive || 0" />
      <Card title="Fleet Utilization" :value="`${utilization?.utilizationRate || 0}%`" />
      <Card title="Monthly Fuel Cost" :value="formatCurrency(costs?.fuel || 0)" />
      <Card title="Monthly Total Costs" :value="formatCurrency(costs?.total || 0)" />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- Fuel Efficiency Chart -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold mb-4">Fuel Efficiency (km/L)</h3>
        <div v-if="loading" class="py-8 text-center text-gray-500">Loading...</div>
        <div v-else class="space-y-3">
          <div v-for="item in fuelEfficiency" :key="item.vehicleId" class="flex items-center">
            <div class="w-48 text-sm truncate">{{ item.vehicleName }}</div>
            <div class="flex-1 mx-4">
              <div class="bg-gray-200 rounded-full h-6 relative overflow-hidden">
                <div
                  class="bg-green-500 h-full rounded-full transition-all"
                  :style="{ width: Math.min((item.efficiency / 20) * 100, 100) + '%' }"
                ></div>
              </div>
            </div>
            <div class="w-20 text-right text-sm font-medium">{{ item.efficiency.toFixed(1) }}</div>
          </div>
          <div v-if="!fuelEfficiency.length" class="text-gray-500 text-center py-8">
            No fuel efficiency data available
          </div>
        </div>
      </div>

      <!-- Cost Breakdown Chart -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold mb-4">Monthly Cost Breakdown</h3>
        <div v-if="loading" class="py-8 text-center text-gray-500">Loading...</div>
        <div v-else class="space-y-4">
          <div class="flex items-center">
            <div class="w-32 text-sm">Fuel</div>
            <div class="flex-1 mx-4">
              <div class="bg-gray-200 rounded-full h-6 relative overflow-hidden">
                <div class="bg-red-500 h-full rounded-full" :style="{ width: getPercentage(costs.fuel, costs.total) + '%' }"></div>
              </div>
            </div>
            <div class="w-24 text-right text-sm font-medium">{{ formatCurrency(costs.fuel) }}</div>
          </div>
          <div class="flex items-center">
            <div class="w-32 text-sm">Maintenance</div>
            <div class="flex-1 mx-4">
              <div class="bg-gray-200 rounded-full h-6 relative overflow-hidden">
                <div class="bg-yellow-500 h-full rounded-full" :style="{ width: getPercentage(costs.maintenance, costs.total) + '%' }"></div>
              </div>
            </div>
            <div class="w-24 text-right text-sm font-medium">{{ formatCurrency(costs.maintenance) }}</div>
          </div>
          <div class="flex items-center">
            <div class="w-32 text-sm">Other</div>
            <div class="flex-1 mx-4">
              <div class="bg-gray-200 rounded-full h-6 relative overflow-hidden">
                <div class="bg-blue-500 h-full rounded-full" :style="{ width: getPercentage(costs.other, costs.total) + '%' }"></div>
              </div>
            </div>
            <div class="w-24 text-right text-sm font-medium">{{ formatCurrency(costs.other) }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Utilization Chart -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <h3 class="text-lg font-semibold mb-4">Fleet Utilization Status</h3>
      <div v-if="loading" class="py-8 text-center text-gray-500">Loading...</div>
      <div v-else class="grid grid-cols-4 gap-4">
        <div v-for="(count, status) in utilization?.statusBreakdown || {}" :key="status" class="text-center p-4 border rounded">
          <div class="text-3xl font-bold mb-2" :class="getStatusColor(status as string)">{{ count }}</div>
          <div class="text-sm text-gray-500">{{ formatStatus(status as string) }}</div>
        </div>
      </div>
    </div>

    <!-- Export Section -->
    <div class="bg-white rounded-lg shadow p-6">
      <h3 class="text-lg font-semibold mb-4">Export Data</h3>
      <UButton color="primary" @click="exportCSV">Download CSV Report</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const fuelEfficiency = ref<any[]>([])
const costs = ref<{ fuel: number; maintenance: number; other: number; total: number }>({ fuel: 0, maintenance: 0, other: 0, total: 0 })
const utilization = ref<any>(null)
const loading = ref(true)

onMounted(async () => {
  await loadAnalytics()
})

async function loadAnalytics() {
  loading.value = true
  try {
    const [fuelEff, costData, utilData] = await Promise.all([
      $fetch('/api/analytics/fuel-efficiency'),
      $fetch('/api/analytics/costs'),
      $fetch('/api/analytics/utilization')
    ])
    fuelEfficiency.value = fuelEff
    costs.value = costData
    utilization.value = utilData
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

function getPercentage(part: number, total: number): number {
  return total > 0 ? Math.round((part / total) * 100) : 0
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    AVAILABLE: 'text-green-600',
    ON_TRIP: 'text-blue-600',
    IN_SHOP: 'text-orange-600',
    RETIRED: 'text-gray-600'
  }
  return colors[status] || 'text-gray-600'
}

function formatStatus(status: string): string {
  return status.replace('_', ' ')
}

async function exportCSV() {
  try {
    // In a real implementation, this would download a CSV file
    alert('CSV export feature would generate and download a report. Implement this endpoint at /api/analytics/export')
  } catch (e) {
    console.error(e)
    alert('Error exporting CSV')
  }
}
</script>

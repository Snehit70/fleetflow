<template>
  <div>
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Analytics</h1>
        <p class="page-subtitle">Data-driven insights for your fleet</p>
      </div>
      <button v-if="canExport" @click="exportCSV" class="btn-primary btn-md">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        Export CSV
      </button>
    </div>

    <!-- Summary Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div class="card p-5">
        <div class="flex items-center gap-3">
          <div class="p-3 rounded-lg bg-info/10 text-info">
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="1" y="3" width="15" height="13" rx="2" />
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
          </div>
          <div>
            <div class="text-sm text-muted-foreground">Total Active</div>
            <div class="text-2xl font-bold">{{ utilization?.totalActive || 0 }}</div>
          </div>
        </div>
      </div>

      <div class="card p-5">
        <div class="flex items-center gap-3">
          <div class="p-3 rounded-lg bg-success/10 text-success">
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
          </div>
          <div>
            <div class="text-sm text-muted-foreground">Utilization Rate</div>
            <div class="text-2xl font-bold">{{ utilization?.utilizationRate || 0 }}%</div>
          </div>
        </div>
      </div>

      <div class="card p-5">
        <div class="flex items-center gap-3">
          <div class="p-3 rounded-lg bg-warning/10 text-warning">
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 3v18h18" />
              <path d="M18 17V9" />
              <path d="M13 17V5" />
              <path d="M8 17v-3" />
            </svg>
          </div>
          <div>
            <div class="text-sm text-muted-foreground">Monthly Fuel</div>
            <div class="text-2xl font-bold">{{ formatCurrency(costs?.fuel || 0) }}</div>
          </div>
        </div>
      </div>

      <div class="card p-5">
        <div class="flex items-center gap-3">
          <div class="p-3 rounded-lg bg-primary/10 text-primary">
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div>
            <div class="text-sm text-muted-foreground">Total Costs</div>
            <div class="text-2xl font-bold">{{ formatCurrency(costs?.total || 0) }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="card p-6">
        <div class="skeleton skeleton-shimmer h-6 w-40 mb-4 rounded" />
        <div class="skeleton skeleton-shimmer h-64 rounded" />
      </div>
      <div class="card p-6">
        <div class="skeleton skeleton-shimmer h-6 w-40 mb-4 rounded" />
        <div class="skeleton skeleton-shimmer h-64 rounded" />
      </div>
    </div>

    <template v-else>
      <!-- Charts Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <!-- Fuel Efficiency Chart -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold mb-4">Fuel Efficiency (km/L)</h3>
          <div v-if="fuelEfficiency.length > 0" class="h-64">
            <Bar :data="fuelChartData" :options="barChartOptions" />
          </div>
          <div v-else class="h-64 flex items-center justify-center text-muted-foreground">
            No fuel efficiency data available
          </div>
        </div>

        <!-- Cost Breakdown Chart -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold mb-4">Cost Breakdown</h3>
          <div v-if="costs?.total > 0" class="h-64">
            <Doughnut :data="costChartData" :options="doughnutChartOptions" />
          </div>
          <div v-else class="h-64 flex items-center justify-center text-muted-foreground">
            No cost data available
          </div>
        </div>
      </div>

      <!-- Fleet Utilization -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold mb-4">Fleet Status Distribution</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div 
            v-for="(count, status) in utilization?.statusBreakdown || {}" 
            :key="status"
            class="text-center p-6 rounded-lg border border-border"
          >
            <div class="text-4xl font-bold mb-2" :class="getStatusTextColor(status as string)">
              {{ count }}
            </div>
            <div class="text-sm text-muted-foreground">{{ formatStatus(status as string) }}</div>
            <div class="mt-3">
              <div class="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  class="h-full rounded-full transition-all duration-500"
                  :class="getStatusBgColor(status as string)"
                  :style="{ width: getStatusPercentage(count) + '%' }"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { Bar, Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend)

definePageMeta({
  layout: 'default',
  middleware: ['auth', 'role'],
  roles: ['MANAGER', 'SAFETY_OFFICER', 'FINANCIAL_ANALYST']
})

const { user } = useAuth()
const { success, error } = useToast()

interface FuelEfficiencyData {
  vehicleId: string
  vehicleName: string
  efficiency: number
}

interface CostData {
  fuel: number
  maintenance: number
  other: number
  total: number
}

interface UtilizationData {
  totalActive: number
  utilizationRate: number
  statusBreakdown: Record<string, number>
}

const fuelEfficiency = ref<FuelEfficiencyData[]>([])
const costs = ref<CostData>({ fuel: 0, maintenance: 0, other: 0, total: 0 })
const utilization = ref<UtilizationData | null>(null)
const loading = ref(true)

const canExport = computed(() => ['MANAGER', 'FINANCIAL_ANALYST'].includes(user.value?.role || ''))

// Chart data
const fuelChartData = computed(() => ({
  labels: fuelEfficiency.value.map(d => d.vehicleName),
  datasets: [{
    label: 'km/L',
    data: fuelEfficiency.value.map(d => d.efficiency),
    backgroundColor: fuelEfficiency.value.map(d => {
      if (d.efficiency >= 15) return 'hsl(172, 66%, 42%)' // success
      if (d.efficiency >= 10) return 'hsl(38, 92%, 50%)' // warning
      return 'hsl(4, 71%, 58%)' // danger
    }),
    borderRadius: 6,
    barThickness: 30
  }]
}))

const costChartData = computed(() => ({
  labels: ['Fuel', 'Maintenance', 'Other'],
  datasets: [{
    data: [costs.value.fuel, costs.value.maintenance, costs.value.other],
    backgroundColor: [
      'hsl(4, 71%, 58%)',    // danger - fuel
      'hsl(38, 92%, 50%)',   // warning - maintenance
      'hsl(199, 89%, 48%)'   // info - other
    ],
    borderWidth: 0,
    hoverOffset: 10
  }]
}))

const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y' as const,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'hsl(222, 47%, 25%)',
      padding: 12,
      titleFont: { size: 14, weight: 'bold' as const },
      bodyFont: { size: 13 },
      cornerRadius: 8
    }
  },
  scales: {
    x: {
      grid: { color: 'hsl(220, 13%, 91%)' },
      ticks: { color: 'hsl(220, 9%, 46%)' },
      max: 25
    },
    y: {
      grid: { display: false },
      ticks: { color: 'hsl(222, 47%, 15%)' }
    }
  }
}

const doughnutChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '60%',
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        padding: 20,
        usePointStyle: true,
        pointStyle: 'circle',
        color: 'hsl(222, 47%, 15%)'
      }
    },
    tooltip: {
      backgroundColor: 'hsl(222, 47%, 25%)',
      padding: 12,
      titleFont: { size: 14, weight: 'bold' as const },
      bodyFont: { size: 13 },
      cornerRadius: 8,
      callbacks: {
        label: function(context: any) {
          const value = context.raw
          const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
          const percentage = ((value / total) * 100).toFixed(1)
          return `${context.label}: ${formatCurrencyStatic(value)} (${percentage}%)`
        }
      }
    }
  }
}

function formatCurrencyStatic(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}

const totalVehicles = computed(() => {
  if (!utilization.value?.statusBreakdown) return 1
  return Object.values(utilization.value.statusBreakdown).reduce((a, b) => a + b, 0) || 1
})

onMounted(async () => {
  await loadAnalytics()
})

async function loadAnalytics() {
  loading.value = true
  try {
    const [fuelEff, costData, utilData] = await Promise.all([
      $fetch<FuelEfficiencyData[]>('/api/analytics/fuel-efficiency'),
      $fetch<CostData>('/api/analytics/costs'),
      $fetch<UtilizationData>('/api/analytics/utilization')
    ])
    fuelEfficiency.value = fuelEff
    costs.value = costData
    utilization.value = utilData
  } catch (e) {
    console.error(e)
    error('Failed to load analytics')
  } finally {
    loading.value = false
  }
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}

function getStatusTextColor(status: string): string {
  const colors: Record<string, string> = {
    AVAILABLE: 'text-success',
    ON_TRIP: 'text-info',
    IN_SHOP: 'text-warning',
    RETIRED: 'text-muted-foreground'
  }
  return colors[status] || 'text-muted-foreground'
}

function getStatusBgColor(status: string): string {
  const colors: Record<string, string> = {
    AVAILABLE: 'bg-success',
    ON_TRIP: 'bg-info',
    IN_SHOP: 'bg-warning',
    RETIRED: 'bg-muted-foreground'
  }
  return colors[status] || 'bg-muted'
}

function getStatusPercentage(count: number): number {
  return (count / totalVehicles.value) * 100
}

function formatStatus(status: string): string {
  return status.replaceAll('_', ' ')
}

async function exportCSV() {
  try {
    const response = await $fetch('/api/analytics/export', {
      responseType: 'blob'
    })
    const blob = new Blob([response as any], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `fleetflow-analytics-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
    success('Export successful', 'CSV file has been downloaded.')
  } catch (e) {
    console.error(e)
    error('Export failed', 'Please try again.')
  }
}
</script>

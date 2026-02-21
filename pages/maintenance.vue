<template>
  <div>
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Maintenance</h1>
        <p class="page-subtitle">Track vehicle maintenance and service logs</p>
      </div>
      <button v-if="canEdit" @click="showAddModal = true" class="btn-primary btn-md">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Log Maintenance
      </button>
    </div>

    <!-- Vehicles In Shop Alert -->
    <div v-if="inShopVehicles.length > 0" class="alert alert-warning mb-6">
      <div class="flex items-start gap-3">
        <svg class="w-5 h-5 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
        <div class="flex-1">
          <h4 class="font-semibold">{{ inShopVehicles.length }} Vehicle{{ inShopVehicles.length > 1 ? 's' : '' }} Currently In Shop</h4>
          <div class="mt-3 space-y-2">
            <div 
              v-for="v in inShopVehicles" 
              :key="v.id" 
              class="flex items-center justify-between bg-white/50 rounded-lg p-3"
            >
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-warning/20 flex items-center justify-center">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="1" y="3" width="15" height="13" rx="2" />
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                </div>
                <div>
                  <span class="font-medium">{{ v.name }}</span>
                  <span class="text-muted-foreground ml-2">({{ v.licensePlate }})</span>
                </div>
              </div>
              <button 
                v-if="canEdit"
                @click="markBackInService(v.id, v.name)" 
                class="btn-primary btn-sm"
              >
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                Return to Service
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="card p-4">
        <div class="flex items-center gap-3">
          <div class="p-2 rounded-lg bg-primary/10 text-primary">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
          </div>
          <div>
            <div class="text-sm text-muted-foreground">Total Records</div>
            <div class="text-2xl font-bold">{{ maintenanceRecords.length }}</div>
          </div>
        </div>
      </div>
      <div class="card p-4">
        <div class="flex items-center gap-3">
          <div class="p-2 rounded-lg bg-warning/10 text-warning">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="1" y="3" width="15" height="13" rx="2" />
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
          </div>
          <div>
            <div class="text-sm text-muted-foreground">In Shop</div>
            <div class="text-2xl font-bold">{{ inShopVehicles.length }}</div>
          </div>
        </div>
      </div>
      <div class="card p-4">
        <div class="flex items-center gap-3">
          <div class="p-2 rounded-lg bg-danger/10 text-danger">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div>
            <div class="text-sm text-muted-foreground">Total Cost</div>
            <div class="text-2xl font-bold">{{ formatCurrency(totalCost) }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <TableSkeleton v-if="loading" :rows="5" :columns="5" />

    <!-- Empty State -->
    <div v-else-if="maintenanceRecords.length === 0" class="card">
      <EmptyState
        title="No maintenance records yet"
        description="Start tracking vehicle maintenance by logging your first service record."
      >
        <template #action v-if="canEdit">
          <button @click="showAddModal = true" class="btn-primary btn-md">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Log Maintenance
          </button>
        </template>
      </EmptyState>
    </div>

    <!-- Data Table -->
    <div v-else class="table-container">
      <table class="table">
        <thead class="table-header">
          <tr>
            <th class="table-header-cell">Date</th>
            <th class="table-header-cell">Vehicle</th>
            <th class="table-header-cell">Description</th>
            <th class="table-header-cell">Cost</th>
            <th class="table-header-cell">Notes</th>
          </tr>
        </thead>
        <tbody class="table-body">
          <tr v-for="record in maintenanceRecords" :key="record.id" class="table-row">
            <td class="table-cell">
              <span class="text-sm">{{ formatDate(record.date) }}</span>
            </td>
            <td class="table-cell">
              <div v-if="record.vehicle">
                <div class="font-medium">{{ record.vehicle.name }}</div>
                <div class="text-xs text-muted-foreground">{{ record.vehicle.licensePlate }}</div>
              </div>
            </td>
            <td class="table-cell">
              <span class="badge badge-primary">{{ record.description }}</span>
            </td>
            <td class="table-cell">
              <span class="font-medium">{{ formatCurrency(record.cost) }}</span>
            </td>
            <td class="table-cell">
              <span class="text-sm text-muted-foreground">{{ record.notes || '-' }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add Maintenance Slideover -->
    <USlideover v-model="showAddModal" title="Log Maintenance">
      <form @submit.prevent="handleSubmit">
        <div class="space-y-5 p-6">
          <div>
            <label class="block text-sm font-medium mb-2">Vehicle</label>
            <select v-model="form.vehicleId" required class="select">
              <option value="">Select a vehicle</option>
              <option v-for="v in vehicles" :key="v.id" :value="v.id">
                {{ v.name }} ({{ v.licensePlate }})
                <span v-if="v.status === 'IN_SHOP'"> - Already in shop</span>
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Service Type</label>
            <select v-model="form.description" class="select">
              <option value="">Select or type custom</option>
              <option value="Oil Change">Oil Change</option>
              <option value="Tire Rotation">Tire Rotation</option>
              <option value="Brake Service">Brake Service</option>
              <option value="Engine Tune-up">Engine Tune-up</option>
              <option value="Transmission Service">Transmission Service</option>
              <option value="General Inspection">General Inspection</option>
            </select>
            <input 
              v-if="!presetDescriptions.includes(form.description)"
              v-model="form.description" 
              type="text" 
              class="input mt-2" 
              placeholder="Or enter custom description"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-2">Cost ($)</label>
              <input v-model.number="form.cost" type="number" step="0.01" required class="input" min="0" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Date</label>
              <input v-model="form.date" type="date" class="input" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Notes (Optional)</label>
            <textarea v-model="form.notes" class="input min-h-[80px]" placeholder="Additional notes..." />
          </div>

          <div class="alert alert-info">
            <div class="flex items-center gap-2 text-sm">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              This will automatically mark the vehicle as "In Shop"
            </div>
          </div>
        </div>
        
        <div class="p-6 border-t border-border flex gap-3 justify-end">
          <button type="button" @click="showAddModal = false" class="btn-secondary btn-md">
            Cancel
          </button>
          <button type="submit" class="btn-primary btn-md" :disabled="saving">
            <svg v-if="saving" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" stroke-opacity="0.25" />
              <path d="M12 2a10 10 0 0 1 10 10" />
            </svg>
            Log Maintenance
          </button>
        </div>
      </form>
    </USlideover>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: ['auth', 'role'],
  roles: ['MANAGER', 'FINANCIAL_ANALYST']
})

const { user } = useAuth()
const { success, error } = useToast()

interface MaintenanceRecord {
  id: string
  description: string
  cost: number
  date: string
  notes?: string
  vehicle?: { id: string; name: string; licensePlate: string }
}

interface Vehicle {
  id: string
  name: string
  licensePlate: string
  status: string
}

const maintenanceRecords = ref<MaintenanceRecord[]>([])
const vehicles = ref<Vehicle[]>([])
const loading = ref(true)
const showAddModal = ref(false)
const saving = ref(false)

const presetDescriptions = ['Oil Change', 'Tire Rotation', 'Brake Service', 'Engine Tune-up', 'Transmission Service', 'General Inspection']

const form = ref({
  vehicleId: '',
  description: '',
  cost: 0,
  date: new Date().toISOString().split('T')[0],
  notes: ''
})

const canEdit = computed(() => user.value?.role === 'MANAGER')

const inShopVehicles = computed(() => vehicles.value.filter(v => v.status === 'IN_SHOP'))

const totalCost = computed(() => maintenanceRecords.value.reduce((sum, r) => sum + r.cost, 0))

onMounted(async () => {
  await Promise.all([loadMaintenance(), loadVehicles()])
})

async function loadMaintenance() {
  loading.value = true
  try {
    maintenanceRecords.value = await $fetch('/api/maintenance')
  } catch (e) {
    console.error(e)
    error('Failed to load maintenance records')
  } finally {
    loading.value = false
  }
}

async function loadVehicles() {
  try {
    vehicles.value = await $fetch('/api/vehicles')
  } catch (e) {
    console.error(e)
  }
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}

async function markBackInService(vehicleId: string, vehicleName: string) {
  if (!confirm(`Mark ${vehicleName} as back in service?`)) return
  
  try {
    await $fetch(`/api/vehicles/${vehicleId}`, {
      method: 'PUT',
      body: { status: 'AVAILABLE' }
    })
    success('Vehicle returned to service', `${vehicleName} is now available.`)
    await loadVehicles()
  } catch (e: any) {
    console.error(e)
    error('Error updating vehicle status', e.data?.message)
  }
}

async function handleSubmit() {
  saving.value = true
  try {
    await $fetch('/api/maintenance', {
      method: 'POST',
      body: form.value
    })
    success('Maintenance logged', 'The vehicle has been marked as In Shop.')
    showAddModal.value = false
    resetForm()
    await Promise.all([loadMaintenance(), loadVehicles()])
  } catch (e: any) {
    console.error(e)
    error('Error logging maintenance', e.data?.message)
  } finally {
    saving.value = false
  }
}

function resetForm() {
  form.value = {
    vehicleId: '',
    description: '',
    cost: 0,
    date: new Date().toISOString().split('T')[0],
    notes: ''
  }
}
</script>

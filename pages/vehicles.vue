<template>
  <div>
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Vehicles</h1>
        <p class="page-subtitle">Manage your fleet assets and track vehicle status</p>
      </div>
      <button v-if="canEdit" @click="openAddModal" class="btn-primary btn-md">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Add Vehicle
      </button>
    </div>

    <!-- Filters -->
    <div class="card p-4 mb-6">
      <div class="flex flex-wrap gap-4">
        <div class="flex-1 min-w-[200px]">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by name or license plate..."
            class="input"
          />
        </div>
        <select v-model="filterType" class="select w-40">
          <option value="">All Types</option>
          <option value="TRUCK">Truck</option>
          <option value="VAN">Van</option>
          <option value="BIKE">Bike</option>
        </select>
        <select v-model="filterStatus" class="select w-40">
          <option value="">All Statuses</option>
          <option value="AVAILABLE">Available</option>
          <option value="ON_TRIP">On Trip</option>
          <option value="IN_SHOP">In Shop</option>
          <option value="RETIRED">Retired</option>
        </select>
        <button 
          v-if="searchQuery || filterType || filterStatus" 
          @click="clearFilters" 
          class="btn-ghost btn-md text-muted-foreground"
        >
          Clear filters
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <TableSkeleton v-if="loading" :rows="5" :columns="7" />

    <!-- Empty State -->
    <div v-else-if="filteredVehicles.length === 0" class="card">
      <EmptyState
        :title="searchQuery || filterType || filterStatus ? 'No vehicles match your filters' : 'No vehicles yet'"
        :description="searchQuery || filterType || filterStatus ? 'Try adjusting your search or filter criteria.' : 'Add your first vehicle to get started with fleet management.'"
      >
        <template #action v-if="canEdit && !searchQuery && !filterType && !filterStatus">
          <button @click="openAddModal" class="btn-primary btn-md">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Vehicle
          </button>
        </template>
      </EmptyState>
    </div>

    <!-- Data Table -->
    <div v-else class="table-container">
      <table class="table">
        <thead class="table-header">
          <tr>
            <th class="table-header-cell">Vehicle</th>
            <th class="table-header-cell">License Plate</th>
            <th class="table-header-cell">Type</th>
            <th class="table-header-cell">Capacity</th>
            <th class="table-header-cell">Odometer</th>
            <th class="table-header-cell">Status</th>
            <th class="table-header-cell">Actions</th>
          </tr>
        </thead>
        <tbody class="table-body">
          <tr v-for="vehicle in filteredVehicles" :key="vehicle.id" class="table-row">
            <td class="table-cell">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <component :is="vehicleIcons[vehicle.type]" class="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div class="font-medium text-foreground">{{ vehicle.name }}</div>
                  <div class="text-xs text-muted-foreground">{{ vehicle.region || 'No region' }}</div>
                </div>
              </div>
            </td>
            <td class="table-cell">
              <code class="font-mono text-sm bg-muted px-2 py-1 rounded">{{ vehicle.licensePlate }}</code>
            </td>
            <td class="table-cell">
              <span class="badge badge-muted">{{ vehicle.type }}</span>
            </td>
            <td class="table-cell">
              <div class="capacity-bar">
                <div class="capacity-bar-track w-24">
                  <div 
                    class="capacity-bar-fill bg-primary"
                    :style="{ width: '100%' }"
                  />
                </div>
                <span class="capacity-bar-label">{{ vehicle.maxCapacity }} kg</span>
              </div>
            </td>
            <td class="table-cell">
              <span class="text-sm text-muted-foreground">{{ vehicle.odometer.toLocaleString() }} km</span>
            </td>
            <td class="table-cell">
              <StatusBadge :status="vehicle.status" />
            </td>
            <td class="table-cell">
              <div class="flex items-center gap-1">
                <template v-if="canEdit">
                  <button 
                    @click="editVehicle(vehicle)" 
                    class="btn-ghost btn-sm p-2"
                    title="Edit"
                  >
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                  <button 
                    @click="confirmDelete(vehicle)" 
                    class="btn-ghost btn-sm p-2 text-danger hover:bg-danger/10"
                    title="Delete"
                    :disabled="vehicle.status === 'ON_TRIP'"
                  >
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </template>
                <span v-else class="text-xs text-muted-foreground">Read only</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Modal -->
    <Modal v-model="showModal" :title="editingVehicle ? 'Edit Vehicle' : 'Add Vehicle'" size="lg">
      <form @submit.prevent="handleSubmit">
        <div class="space-y-5">
          <div>
            <label class="block text-sm font-medium mb-2">Vehicle Name</label>
            <input v-model="form.name" type="text" required class="input" placeholder="e.g., Van-05" />
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-2">License Plate</label>
            <input v-model="form.licensePlate" type="text" required class="input font-mono" placeholder="e.g., GJ-05-AB-1234" />
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-2">Type</label>
              <select v-model="form.type" class="select">
                <option value="VAN">Van</option>
                <option value="TRUCK">Truck</option>
                <option value="BIKE">Bike</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Max Capacity (kg)</label>
              <input v-model.number="form.maxCapacity" type="number" required class="input" min="1" />
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-2">Odometer (km)</label>
              <input v-model.number="form.odometer" type="number" class="input" min="0" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Region</label>
              <input v-model="form.region" type="text" class="input" placeholder="e.g., North Zone" />
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-2">Status</label>
            <select 
              v-model="form.status" 
              class="select"
              :disabled="editingVehicle?.status === 'ON_TRIP'"
            >
              <option value="AVAILABLE">Available</option>
              <option value="IN_SHOP">In Shop</option>
              <option value="RETIRED">Retired</option>
            </select>
            <p v-if="editingVehicle?.status === 'ON_TRIP'" class="text-xs text-warning mt-1">
              Vehicle is currently on a trip. Status cannot be changed.
            </p>
            <p v-else class="text-xs text-muted-foreground mt-1">
              Note: ON_TRIP status is managed automatically by trips.
            </p>
          </div>
        </div>
        
        <div class="flex gap-3 justify-end mt-6 pt-6 border-t border-border">
          <button type="button" @click="showModal = false" class="btn-secondary btn-md">
            Cancel
          </button>
          <button type="submit" class="btn-primary btn-md" :disabled="saving">
            <svg v-if="saving" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" stroke-opacity="0.25" />
              <path d="M12 2a10 10 0 0 1 10 10" />
            </svg>
            {{ editingVehicle ? 'Update' : 'Create' }}
          </button>
        </div>
      </form>
    </Modal>

    <!-- Delete Confirmation Dialog -->
    <ConfirmDialog
      :is-open="showDeleteDialog"
      title="Delete Vehicle"
      :message="`Are you sure you want to delete ${deletingVehicle?.name}? This action cannot be undone.`"
      type="danger"
      confirm-text="Delete"
      :loading="deleting"
      @confirm="handleDelete"
      @cancel="showDeleteDialog = false"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: ['auth', 'role'],
  roles: ['MANAGER', 'DISPATCHER']
})

const { user } = useAuth()
const { success, error } = useToast()

interface Vehicle {
  id: string
  name: string
  licensePlate: string
  type: 'TRUCK' | 'VAN' | 'BIKE'
  maxCapacity: number
  odometer: number
  status: 'AVAILABLE' | 'ON_TRIP' | 'IN_SHOP' | 'RETIRED'
  region?: string
}

const vehicles = ref<Vehicle[]>([])
const loading = ref(true)
const showModal = ref(false)
const editingVehicle = ref<Vehicle | null>(null)
const saving = ref(false)

// Delete dialog state
const showDeleteDialog = ref(false)
const deletingVehicle = ref<Vehicle | null>(null)
const deleting = ref(false)

// Filters
const searchQuery = ref('')
const filterType = ref('')
const filterStatus = ref('')

const form = ref({
  name: '',
  licensePlate: '',
  type: 'VAN' as 'TRUCK' | 'VAN' | 'BIKE',
  maxCapacity: 500,
  odometer: 0,
  region: '',
  status: 'AVAILABLE' as 'AVAILABLE' | 'ON_TRIP' | 'IN_SHOP' | 'RETIRED'
})

const canEdit = computed(() => user.value?.role === 'MANAGER')

const filteredVehicles = computed(() => {
  return vehicles.value.filter(v => {
    const matchesSearch = !searchQuery.value || 
      v.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      v.licensePlate.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesType = !filterType.value || v.type === filterType.value
    const matchesStatus = !filterStatus.value || v.status === filterStatus.value
    return matchesSearch && matchesType && matchesStatus
  })
})

// Vehicle type icons
const vehicleIcons = {
  TRUCK: {
    template: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13" rx="2"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`
  },
  VAN: {
    template: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 17h4V9H2v8h2m6 0H8m2 0v3m4-3v3m-4 0h4m4-3h2v-5l-3-4h-3v9"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>`
  },
  BIKE: {
    template: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5V14l-3-3 4-3 2 3h3"/></svg>`
  }
}

onMounted(async () => {
  await loadVehicles()
})

async function loadVehicles() {
  loading.value = true
  try {
    vehicles.value = await $fetch<Vehicle[]>('/api/vehicles')
  } catch (e) {
    console.error(e)
    error('Failed to load vehicles')
  } finally {
    loading.value = false
  }
}

function openAddModal() {
  editingVehicle.value = null
  form.value = {
    name: '',
    licensePlate: '',
    type: 'VAN',
    maxCapacity: 500,
    odometer: 0,
    region: '',
    status: 'AVAILABLE'
  }
  showModal.value = true
}

function editVehicle(vehicle: Vehicle) {
  editingVehicle.value = vehicle
  form.value = {
    name: vehicle.name,
    licensePlate: vehicle.licensePlate,
    type: vehicle.type,
    maxCapacity: vehicle.maxCapacity,
    odometer: vehicle.odometer,
    region: vehicle.region || '',
    status: vehicle.status,
  }
  showModal.value = true
}

function clearFilters() {
  searchQuery.value = ''
  filterType.value = ''
  filterStatus.value = ''
}

async function handleSubmit() {
  saving.value = true
  try {
    if (editingVehicle.value) {
      await $fetch(`/api/vehicles/${editingVehicle.value.id}`, {
        method: 'PUT',
        body: form.value
      })
      success('Vehicle updated', `${form.value.name} has been updated successfully.`)
    } else {
      await $fetch('/api/vehicles', {
        method: 'POST',
        body: form.value
      })
      success('Vehicle added', `${form.value.name} has been added to your fleet.`)
    }
    showModal.value = false
    await loadVehicles()
  } catch (e: any) {
    console.error(e)
    error('Error saving vehicle', e.data?.message || 'Please try again.')
  } finally {
    saving.value = false
  }
}

function confirmDelete(vehicle: Vehicle) {
  if (vehicle.status === 'ON_TRIP') {
    error('Cannot delete', 'This vehicle is currently on a trip.')
    return
  }
  deletingVehicle.value = vehicle
  showDeleteDialog.value = true
}

async function handleDelete() {
  if (!deletingVehicle.value) return
  
  deleting.value = true
  try {
    await $fetch(`/api/vehicles/${deletingVehicle.value.id}`, { method: 'DELETE' })
    success('Vehicle deleted', `${deletingVehicle.value.name} has been removed from your fleet.`)
    showDeleteDialog.value = false
    deletingVehicle.value = null
    await loadVehicles()
  } catch (e: any) {
    console.error(e)
    error('Error deleting vehicle', e.data?.message || 'Please try again.')
  } finally {
    deleting.value = false
  }
}
</script>

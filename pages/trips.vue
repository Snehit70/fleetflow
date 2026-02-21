<template>
  <div>
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Trips</h1>
        <p class="page-subtitle">Manage trip assignments and track deliveries</p>
      </div>
      <button v-if="canManageTrips" @click="showAddModal = true" class="btn-primary btn-md">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        New Trip
      </button>
    </div>

    <!-- Status Filter Tabs -->
    <div class="flex gap-2 mb-6 border-b border-border">
      <button
        v-for="tab in statusTabs"
        :key="tab.value"
        @click="activeTab = tab.value"
        :class="[
          'px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px',
          activeTab === tab.value 
            ? 'border-primary text-primary' 
            : 'border-transparent text-muted-foreground hover:text-foreground'
        ]"
      >
        {{ tab.label }}
        <span 
          v-if="tab.count > 0" 
          :class="[
            'ml-2 px-2 py-0.5 rounded-full text-xs',
            activeTab === tab.value ? 'bg-primary/10' : 'bg-muted'
          ]"
        >
          {{ tab.count }}
        </span>
      </button>
    </div>

    <!-- Loading State -->
    <TableSkeleton v-if="loading" :rows="5" :columns="7" />

    <!-- Empty State -->
    <div v-else-if="filteredTrips.length === 0" class="card">
      <EmptyState
        :title="activeTab !== 'all' ? `No ${activeTab.toLowerCase()} trips` : 'No trips yet'"
        :description="activeTab !== 'all' ? 'Trips with this status will appear here.' : 'Create your first trip to start managing deliveries.'"
      >
        <template #action v-if="canManageTrips && activeTab === 'all'">
          <button @click="showAddModal = true" class="btn-primary btn-md">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Trip
          </button>
        </template>
      </EmptyState>
    </div>

    <!-- Data Table -->
    <div v-else class="table-container">
      <table class="table">
        <thead class="table-header">
          <tr>
            <th class="table-header-cell">Trip ID</th>
            <th class="table-header-cell">Route</th>
            <th class="table-header-cell">Vehicle</th>
            <th class="table-header-cell">Driver</th>
            <th class="table-header-cell">Cargo</th>
            <th class="table-header-cell">Status</th>
            <th class="table-header-cell">Actions</th>
          </tr>
        </thead>
        <tbody class="table-body">
          <tr v-for="trip in filteredTrips" :key="trip.id" class="table-row">
            <td class="table-cell">
              <code class="font-mono text-sm bg-muted px-2 py-1 rounded">{{ trip.id.slice(0, 8) }}</code>
            </td>
            <td class="table-cell">
              <div class="flex items-center gap-2">
                <span class="font-medium">{{ trip.origin }}</span>
                <svg class="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
                <span class="font-medium">{{ trip.destination }}</span>
              </div>
            </td>
            <td class="table-cell">
              <div v-if="trip.vehicle">
                <div class="font-medium">{{ trip.vehicle.name }}</div>
                <div class="text-xs text-muted-foreground">{{ trip.vehicle.licensePlate }}</div>
              </div>
            </td>
            <td class="table-cell">
              <div v-if="trip.driver" class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span class="text-xs font-semibold text-primary">{{ getInitials(trip.driver.name) }}</span>
                </div>
                <span>{{ trip.driver.name }}</span>
              </div>
            </td>
             <td class="table-cell">
               <div v-if="trip.vehicle" class="capacity-bar">
                 <div class="capacity-bar-track w-20">
                   <div 
                     class="capacity-bar-fill"
                     :class="getCapacityColor(trip.cargoWeight, trip.vehicle.maxCapacity)"
                     :style="{ width: getCapacityPercentage(trip.cargoWeight, trip.vehicle.maxCapacity) + '%' }"
                   />
                 </div>
                 <span class="capacity-bar-label">{{ trip.cargoWeight }}kg</span>
               </div>
               <span v-else class="text-xs text-muted-foreground">No vehicle</span>
             </td>
            <td class="table-cell">
              <StatusBadge :status="trip.status" />
            </td>
            <td class="table-cell">
              <div class="flex items-center gap-1">
                <template v-if="canManageTrips">
                  <button 
                    v-if="trip.status === 'DRAFT'" 
                    @click="dispatchTrip(trip.id)"
                    class="btn-ghost btn-sm px-2 py-1 text-success hover:bg-success/10"
                    title="Dispatch"
                  >
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                    Dispatch
                  </button>
                  <button 
                    v-if="trip.status === 'DISPATCHED'" 
                    @click="openCompleteModal(trip)"
                    class="btn-ghost btn-sm px-2 py-1 text-info hover:bg-info/10"
                    title="Complete"
                  >
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    Complete
                  </button>
                  <button 
                    v-if="['DRAFT', 'DISPATCHED'].includes(trip.status)" 
                    @click="cancelTrip(trip.id)"
                    class="btn-ghost btn-sm px-2 py-1 text-danger hover:bg-danger/10"
                    title="Cancel"
                  >
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="15" y1="9" x2="9" y2="15" />
                      <line x1="9" y1="9" x2="15" y2="15" />
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

    <!-- Create Trip Modal -->
    <Modal size="lg" v-model="showAddModal" title="Create Trip">
      <form @submit.prevent="handleSubmit">
        <div class="space-y-5">
          <!-- Vehicle Selection -->
          <div>
            <label class="block text-sm font-medium mb-2">Vehicle</label>
            <select v-model="form.vehicleId" required class="select">
              <option value="">Select an available vehicle</option>
              <option v-for="v in availableVehicles" :key="v.id" :value="v.id">
                {{ v.name }} ({{ v.licensePlate }}) - {{ v.maxCapacity }}kg capacity
              </option>
            </select>
            <p v-if="!availableVehicles.length" class="text-xs text-danger mt-1">
              No vehicles available. Check if any are in shop or on trip.
            </p>
          </div>

          <!-- Driver Selection -->
          <div>
            <label class="block text-sm font-medium mb-2">Driver</label>
            <select v-model="form.driverId" required class="select">
              <option value="">Select an eligible driver</option>
              <option v-for="d in eligibleDrivers" :key="d.id" :value="d.id">
                {{ d.name }} - {{ d.licenseCategory }} license
              </option>
            </select>
            <p v-if="!eligibleDrivers.length" class="text-xs text-danger mt-1">
              No eligible drivers. Drivers must be ON_DUTY with valid license.
            </p>
          </div>

          <!-- Route -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-2">Origin</label>
              <input v-model="form.origin" type="text" required class="input" placeholder="e.g., Warehouse A" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Destination</label>
              <input v-model="form.destination" type="text" required class="input" placeholder="e.g., Store B" />
            </div>
          </div>

          <!-- Cargo -->
          <div>
            <label class="block text-sm font-medium mb-2">Cargo Weight (kg)</label>
            <input v-model.number="form.cargoWeight" type="number" required class="input" min="1" />
            
            <!-- Capacity Validation -->
            <div v-if="selectedVehicle" class="mt-3">
              <div class="flex items-center justify-between text-sm mb-1">
                <span class="text-muted-foreground">Capacity Check</span>
                <span :class="capacityValid ? 'text-success' : 'text-danger'">
                  {{ form.cargoWeight }}kg / {{ selectedVehicle.maxCapacity }}kg
                </span>
              </div>
              <div class="capacity-bar-track h-3">
                <div 
                  class="capacity-bar-fill h-full transition-all duration-300"
                  :class="capacityValid ? 'bg-success' : 'bg-danger'"
                  :style="{ width: Math.min(capacityPercentage, 100) + '%' }"
                />
              </div>
              <p v-if="!capacityValid" class="text-xs text-danger mt-2 flex items-center gap-1">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                Cargo weight exceeds vehicle capacity!
              </p>
            </div>
          </div>

          <!-- Cargo Description -->
          <div>
            <label class="block text-sm font-medium mb-2">Cargo Description (Optional)</label>
            <textarea v-model="form.cargoDescription" class="input min-h-[80px]" placeholder="Describe the cargo..." />
          </div>

          <!-- Validation Error -->
          <div v-if="validationError" class="alert alert-danger">
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              {{ validationError }}
            </div>
          </div>
        </div>
        
        <div class="flex mt-6 pt-6 border-t border-border gap-3 justify-end">
          <button type="button" @click="showAddModal = false" class="btn-secondary btn-md">
            Cancel
          </button>
          <button 
            type="submit" 
            class="btn-primary btn-md" 
            :disabled="saving || !capacityValid || !form.vehicleId || !form.driverId"
          >
            <svg v-if="saving" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" stroke-opacity="0.25" />
              <path d="M12 2a10 10 0 0 1 10 10" />
            </svg>
            Create Trip
          </button>
        </div>
      </form>
    </Modal>

    <!-- Complete Trip Modal -->
    <Modal size="lg" v-model="showCompleteModal" title="Complete Trip">
      <form @submit.prevent="handleComplete">
        <div class="space-y-5">
          <div class="card p-4 bg-muted/50">
            <h4 class="font-medium mb-2">Trip Details</h4>
            <p class="text-sm text-muted-foreground">
              {{ completingTrip?.origin }} → {{ completingTrip?.destination }}
            </p>
            <p class="text-sm text-muted-foreground mt-1">
              Start Odometer: <strong>{{ completingTrip?.startOdometer?.toLocaleString() }} km</strong>
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">End Odometer (km)</label>
            <input 
              v-model.number="completeForm.endOdometer" 
              type="number" 
              required 
              class="input"
              :min="completingTrip?.startOdometer || 0"
            />
            <p v-if="completingTrip?.startOdometer && completeForm.endOdometer > completingTrip.startOdometer" class="text-xs text-muted-foreground mt-1">
              Distance traveled: {{ (completeForm.endOdometer - completingTrip.startOdometer).toLocaleString() }} km
            </p>
          </div>
        </div>
        
        <div class="flex mt-6 pt-6 border-t border-border gap-3 justify-end">
          <button type="button" @click="showCompleteModal = false" class="btn-secondary btn-md">
            Cancel
          </button>
          <button type="submit" class="btn-primary btn-md" :disabled="completing">
            <svg v-if="completing" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" stroke-opacity="0.25" />
              <path d="M12 2a10 10 0 0 1 10 10" />
            </svg>
            Complete Trip
          </button>
        </div>
      </form>
    </Modal>

     <!-- Cancel Trip Confirmation Dialog -->
     <ConfirmDialog
       :is-open="showCancelDialog"
       title="Cancel Trip"
       message="Are you sure you want to cancel this trip? This action cannot be undone."
       type="warning"
       confirm-text="Cancel Trip"
       :loading="cancelling"
       @confirm="handleCancelTrip"
       @cancel="showCancelDialog = false"
     />

     <!-- Dispatch Trip Confirmation Dialog -->
     <ConfirmDialog
       :is-open="showDispatchDialog"
       title="Dispatch Trip"
       message="Assign driver and vehicle to this trip? This action cannot be undone."
       type="info"
       confirm-text="Dispatch"
       :loading="dispatching"
       @confirm="handleDispatch"
       @cancel="showDispatchDialog = false"
     />
   </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: ['auth', 'role'],
  roles: ['MANAGER', 'DISPATCHER', 'SAFETY_OFFICER']
})

const { user } = useAuth()
const { success, error } = useToast()

interface Trip {
  id: string
  origin: string
  destination: string
  cargoWeight: number
  cargoDescription?: string
  status: 'DRAFT' | 'DISPATCHED' | 'COMPLETED' | 'CANCELLED'
  startOdometer?: number
  endOdometer?: number
  vehicle?: { id: string; name: string; licensePlate: string; maxCapacity: number }
  driver?: { id: string; name: string; licenseCategory: string }
}

interface Vehicle {
  id: string
  name: string
  licensePlate: string
  type: string
  maxCapacity: number
  status: string
}

interface Driver {
  id: string
  name: string
  email: string
  licenseCategory: string
  licenseExpiry: string
  status: string
}

const trips = ref<Trip[]>([])
const vehicles = ref<Vehicle[]>([])
const drivers = ref<Driver[]>([])
const loading = ref(true)
const showAddModal = ref(false)
const showCompleteModal = ref(false)
const showCancelDialog = ref(false)
const showDispatchDialog = ref(false)
const dispatchingTripId = ref<string | null>(null)
const cancellingTripId = ref<string | null>(null)
const completingTrip = ref<Trip | null>(null)
const saving = ref(false)
const completing = ref(false)
const cancelling = ref(false)
const dispatching = ref(false)
const validationError = ref('')
const activeTab = ref('all')

const form = ref({
  vehicleId: '',
  driverId: '',
  origin: '',
  destination: '',
  cargoWeight: 0,
  cargoDescription: ''
})

const completeForm = ref({
  endOdometer: 0
})

const canManageTrips = computed(() => ['MANAGER', 'DISPATCHER'].includes(user.value?.role || ''))

const statusTabs = computed(() => [
  { value: 'all', label: 'All', count: trips.value.length },
  { value: 'DRAFT', label: 'Draft', count: trips.value.filter(t => t.status === 'DRAFT').length },
  { value: 'DISPATCHED', label: 'Dispatched', count: trips.value.filter(t => t.status === 'DISPATCHED').length },
  { value: 'COMPLETED', label: 'Completed', count: trips.value.filter(t => t.status === 'COMPLETED').length },
  { value: 'CANCELLED', label: 'Cancelled', count: trips.value.filter(t => t.status === 'CANCELLED').length },
])

const filteredTrips = computed(() => {
  if (activeTab.value === 'all') return trips.value
  return trips.value.filter(t => t.status === activeTab.value)
})

const availableVehicles = computed(() => vehicles.value.filter(v => v.status === 'AVAILABLE'))

const eligibleDrivers = computed(() => {
  const now = new Date()
  return drivers.value.filter(d => {
    if (d.status !== 'ON_DUTY') return false
    if (new Date(d.licenseExpiry) < now) return false
    return true
  })
})

const selectedVehicle = computed(() => vehicles.value.find(v => v.id === form.value.vehicleId))

const capacityPercentage = computed(() => {
  if (!selectedVehicle.value) return 0
  return (form.value.cargoWeight / selectedVehicle.value.maxCapacity) * 100
})

const capacityValid = computed(() => {
  if (!selectedVehicle.value) return true
  return form.value.cargoWeight <= selectedVehicle.value.maxCapacity
})

onMounted(async () => {
  await Promise.all([loadTrips(), loadVehicles(), loadDrivers()])
})

async function loadTrips() {
  loading.value = true
  try {
    trips.value = await $fetch('/api/trips')
  } catch (e) {
    console.error(e)
    error('Failed to load trips')
  } finally {
    loading.value = false
  }
}

async function loadVehicles() {
  try {
    vehicles.value = await $fetch('/api/vehicles')
  } catch (e) {
    console.error(e)
    error('Failed to load vehicles', 'Please refresh the page')
  }
}

async function loadDrivers() {
  try {
    drivers.value = await $fetch('/api/drivers')
  } catch (e) {
    console.error(e)
    error('Failed to load drivers', 'Please refresh the page')
  }
}

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

function getCapacityPercentage(cargo: number, max: number): number {
  return Math.min((cargo / max) * 100, 100)
}

function getCapacityColor(cargo: number, max: number): string {
  const percentage = (cargo / max) * 100
  if (percentage > 100) return 'bg-danger'
  if (percentage > 80) return 'bg-warning'
  return 'bg-success'
}

function openCompleteModal(trip: Trip) {
  completingTrip.value = trip
  completeForm.value = { endOdometer: trip.startOdometer || 0 }
  showCompleteModal.value = true
}

async function handleSubmit() {
  saving.value = true
  validationError.value = ''
  
  try {
    if (!capacityValid.value) {
      validationError.value = 'Cargo weight exceeds vehicle capacity'
      return
    }

    await $fetch('/api/trips', {
      method: 'POST',
      body: form.value
    })
    
    success('Trip created', 'The trip has been created as a draft.')
    showAddModal.value = false
    resetForm()
    await Promise.all([loadTrips(), loadVehicles()])
  } catch (e: any) {
    console.error(e)
    validationError.value = e.data?.message || 'Error creating trip'
  } finally {
    saving.value = false
  }
}

function dispatchTrip(id: string) {
  dispatchingTripId.value = id
  showDispatchDialog.value = true
}

async function handleDispatch() {
  if (!dispatchingTripId.value) return
  
  dispatching.value = true
  try {
    await $fetch(`/api/trips/${dispatchingTripId.value}/dispatch`, { method: 'POST' })
    success('Trip dispatched', 'The driver and vehicle are now on trip.')
    showDispatchDialog.value = false
    dispatchingTripId.value = null
    await Promise.all([loadTrips(), loadVehicles(), loadDrivers()])
  } catch (e: any) {
    console.error(e)
    error('Error dispatching trip', e.data?.message)
  } finally {
    dispatching.value = false
  }
}

async function handleComplete() {
  if (!completingTrip.value) {
    error('Error', 'No trip selected for completion.')
    return
  }
  
  const endOdometer = completeForm.value.endOdometer
  const startOdometer = completingTrip.value.startOdometer || 0
  
  if (endOdometer < startOdometer) {
    error('Invalid odometer', 'End odometer cannot be less than start odometer.')
    return
  }
  
  completing.value = true
  try {
    await $fetch(`/api/trips/${completingTrip.value.id}/complete`, {
      method: 'POST',
      body: completeForm.value
    })
    success('Trip completed', 'The vehicle and driver are now available.')
    showCompleteModal.value = false
    await Promise.all([loadTrips(), loadVehicles(), loadDrivers()])
  } catch (e: any) {
    console.error(e)
    error('Error completing trip', e.data?.message)
  } finally {
    completing.value = false
  }
}

function cancelTrip(id: string) {
  cancellingTripId.value = id
  showCancelDialog.value = true
}

function dispatchTrip(id: string) {
  dispatchingTripId.value = id
  showDispatchDialog.value = true
}

async function handleDispatch() {
  if (!dispatchingTripId.value) return
  
  dispatching.value = true
  try {
    await $fetch(`/api/trips/${dispatchingTripId.value}/dispatch`, { method: 'POST' })
    success('Trip dispatched', 'Driver and vehicle assigned successfully.')
    showDispatchDialog.value = false
    dispatchingTripId.value = null
    await Promise.all([loadTrips(), loadVehicles(), loadDrivers()])
  } catch (e: any) {
    console.error(e)
    error('Error dispatching trip', e.data?.message)
  } finally {
    dispatching.value = false
  }
}

async function handleCancelTrip() {
  if (!cancellingTripId.value) return
  
  cancelling.value = true
  try {
    await $fetch(`/api/trips/${cancellingTripId.value}/cancel`, { method: 'POST' })
    success('Trip cancelled', 'The trip has been cancelled successfully.')
    showCancelDialog.value = false
    cancellingTripId.value = null
    await Promise.all([loadTrips(), loadVehicles(), loadDrivers()])
  } catch (e: any) {
    console.error(e)
    error('Error cancelling trip', e.data?.message)
  } finally {
    cancelling.value = false
  }
}

function resetForm() {
  form.value = {
    vehicleId: '',
    driverId: '',
    origin: '',
    destination: '',
    cargoWeight: 0,
    cargoDescription: ''
  }
}
</script>

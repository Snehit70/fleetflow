<template>
  <div class="p-6">
    <PageHeader title="Trips" subtitle="Manage trip assignments and tracking">
      <template #actions>
        <UButton color="primary" @click="showAddModal = true">New Trip</UButton>
      </template>
    </PageHeader>

    <div v-if="loading" class="py-10">Loading...</div>
    <div v-else class="bg-white rounded-lg shadow overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left">ID</th>
            <th class="px-6 py-3 text-left">Origin</th>
            <th class="px-6 py-3 text-left">Destination</th>
            <th class="px-6 py-3 text-left">Vehicle</th>
            <th class="px-6 py-3 text-left">Driver</th>
            <th class="px-6 py-3 text-left">Cargo (kg)</th>
            <th class="px-6 py-3 text-left">Status</th>
            <th class="px-6 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="trip in trips" :key="trip.id" class="border-t">
            <td class="px-6 py-4 text-sm text-gray-500">{{ trip.id.slice(0, 8) }}</td>
            <td class="px-6 py-4">{{ trip.origin }}</td>
            <td class="px-6 py-4">{{ trip.destination }}</td>
            <td class="px-6 py-4">{{ trip.vehicle?.name }} ({{ trip.vehicle?.licensePlate }})</td>
            <td class="px-6 py-4">{{ trip.driver?.name }}</td>
            <td class="px-6 py-4">{{ trip.cargoWeight }}</td>
            <td class="px-6 py-4">
              <UBadge :color="getStatusColor(trip.status)">
                {{ trip.status }}
              </UBadge>
            </td>
            <td class="px-6 py-4">
              <UButton v-if="trip.status === 'DRAFT'" size="xs" variant="ghost" color="green" @click="dispatchTrip(trip.id)">Dispatch</UButton>
              <UButton v-if="trip.status === 'DISPATCHED'" size="xs" variant="ghost" color="blue" @click="showCompleteModal(trip)">Complete</UButton>
              <UButton v-if="['DRAFT', 'DISPATCHED'].includes(trip.status)" size="xs" variant="ghost" color="red" @click="cancelTrip(trip.id)">Cancel</UButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create Trip Modal -->
    <USlideover v-model="showAddModal" title="Create Trip">
      <form @submit.prevent="handleSubmit">
        <div class="space-y-4 p-6">
          <div>
            <label class="block text-sm font-medium mb-1">Vehicle (Available only)</label>
            <select v-model="form.vehicleId" required class="w-full px-3 py-2 border rounded">
              <option value="">Select vehicle</option>
              <option v-for="v in availableVehicles" :key="v.id" :value="v.id">
                {{ v.name }} ({{ v.licensePlate }}) - {{ v.maxCapacity }}kg
              </option>
            </select>
            <div v-if="!availableVehicles.length" class="text-red-500 text-sm mt-1">No available vehicles</div>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Driver (ON DUTY only)</label>
            <select v-model="form.driverId" required class="w-full px-3 py-2 border rounded">
              <option value="">Select driver</option>
              <option v-for="d in eligibleDrivers" :key="d.id" :value="d.id">
                {{ d.name }} - {{ d.licenseCategory }} ({{ d.licenseExpiry ? formatDate(d.licenseExpiry) : 'No expiry' }})
              </option>
            </select>
            <div v-if="!eligibleDrivers.length" class="text-red-500 text-sm mt-1">No eligible drivers</div>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Origin</label>
            <input v-model="form.origin" type="text" required class="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Destination</label>
            <input v-model="form.destination" type="text" required class="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Cargo Weight (kg)</label>
            <input v-model.number="form.cargoWeight" type="number" required class="w-full px-3 py-2 border rounded" />
            <div v-if="selectedVehicle" class="text-sm text-gray-500 mt-1">
              Max capacity: {{ selectedVehicle.maxCapacity }}kg
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Cargo Description</label>
            <textarea v-model="form.cargoDescription" class="w-full px-3 py-2 border rounded" rows="2"></textarea>
          </div>
          <div v-if="validationError" class="text-red-500 text-sm p-3 bg-red-50 rounded">
            {{ validationError }}
          </div>
        </div>
        <div class="p-6 border-t flex gap-2 justify-end">
          <UButton type="button" variant="soft" @click="showAddModal = false">Cancel</UButton>
          <UButton type="submit" color="primary" :loading="saving">Create Trip</UButton>
        </div>
      </form>
    </USlideover>

    <!-- Complete Trip Modal -->
    <USlideover v-model="showCompleteModalVisible" title="Complete Trip">
      <form @submit.prevent="handleComplete">
        <div class="space-y-4 p-6">
          <p class="text-gray-600">
            Trip: <strong>{{ completingTrip?.origin }} → {{ completingTrip?.destination }}</strong>
          </p>
          <p class="text-gray-600">
            Start odometer: <strong>{{ completingTrip?.startOdometer }} km</strong>
          </p>
          <div>
            <label class="block text-sm font-medium mb-1">End Odometer (km)</label>
            <input v-model.number="completeForm.endOdometer" type="number" required class="w-full px-3 py-2 border rounded" />
          </div>
        </div>
        <div class="p-6 border-t flex gap-2 justify-end">
          <UButton type="button" variant="soft" @click="showCompleteModalVisible = false">Cancel</UButton>
          <UButton type="submit" color="primary" :loading="completing">Complete Trip</UButton>
        </div>
      </form>
    </USlideover>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: ['auth', 'role'],
  roles: ['MANAGER', 'DISPATCHER', 'SAFETY_OFFICER']
})

interface Trip {
  id: string
  origin: string
  destination: string
  cargoWeight: number
  cargoDescription?: string
  status: string
  startOdometer?: number
  endOdometer?: number
  vehicle?: { id: string; name: string; licensePlate: string; maxCapacity: number; status: string }
  driver?: { id: string; name: string; licenseCategory: string; licenseExpiry: string; status: string }
}

const trips = ref<Trip[]>([])
const vehicles = ref<any[]>([])
const drivers = ref<any[]>([])
const loading = ref(true)
const showAddModal = ref(false)
const showCompleteModalVisible = ref(false)
const completingTrip = ref<Trip | null>(null)
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
const saving = ref(false)
const completing = ref(false)
const validationError = ref('')

onMounted(async () => {
  await Promise.all([loadTrips(), loadVehicles(), loadDrivers()])
})

async function loadTrips() {
  loading.value = true
  try {
    trips.value = await $fetch('/api/trips')
  } catch (e) {
    console.error(e)
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

async function loadDrivers() {
  try {
    drivers.value = await $fetch('/api/drivers')
  } catch (e) {
    console.error(e)
  }
}

const availableVehicles = computed(() => {
  return vehicles.value.filter(v => v.status === 'AVAILABLE')
})

const eligibleDrivers = computed(() => {
  const now = new Date()
  return drivers.value.filter(d => {
    if (d.status !== 'ON_DUTY') return false
    const expiry = new Date(d.licenseExpiry)
    if (expiry < now) return false
    return true
  })
})

const selectedVehicle = computed(() => {
  return vehicles.value.find(v => v.id === form.value.vehicleId)
})

function showCompleteModal(trip: Trip) {
  completingTrip.value = trip
  completeForm.value = { endOdometer: trip.startOdometer || 0 }
  showCompleteModalVisible.value = true
}

function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    DRAFT: 'gray',
    DISPATCHED: 'blue',
    COMPLETED: 'green',
    CANCELLED: 'red'
  }
  return colors[status] || 'gray'
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString()
}

async function handleSubmit() {
  saving.value = true
  validationError.value = ''
  try {
    // Client-side validation
    const vehicle = selectedVehicle.value
    if (!vehicle) {
      validationError.value = 'Please select a vehicle'
      return
    }
    if (form.value.cargoWeight > vehicle.maxCapacity) {
      validationError.value = `Cargo weight (${form.value.cargoWeight}kg) exceeds vehicle max capacity (${vehicle.maxCapacity}kg)`
      return
    }

    await $fetch('/api/trips', {
      method: 'POST',
      body: form.value
    })
    showAddModal.value = false
    resetForm()
    await Promise.all([loadTrips(), loadVehicles()])
  } catch (e: any) {
    console.error(e)
    const errorData = e.data || e
    validationError.value = errorData.message || 'Error creating trip'
  } finally {
    saving.value = false
  }
}

async function dispatchTrip(id: string) {
  try {
    await $fetch(`/api/trips/${id}/dispatch`, { method: 'POST' })
    await Promise.all([loadTrips(), loadVehicles(), loadDrivers()])
  } catch (e) {
    console.error(e)
    alert('Error dispatching trip')
  }
}

async function handleComplete() {
  completing.value = true
  try {
    await $fetch(`/api/trips/${completingTrip.value?.id}/complete`, {
      method: 'POST',
      body: completeForm.value
    })
    showCompleteModalVisible.value = false
    await Promise.all([loadTrips(), loadVehicles(), loadDrivers()])
  } catch (e) {
    console.error(e)
    alert('Error completing trip')
  } finally {
    completing.value = false
  }
}

async function cancelTrip(id: string) {
  if (!confirm('Cancel this trip?')) return
  try {
    await $fetch(`/api/trips/${id}/cancel`, { method: 'POST' })
    await Promise.all([loadTrips(), loadVehicles(), loadDrivers()])
  } catch (e) {
    console.error(e)
    alert('Error cancelling trip')
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

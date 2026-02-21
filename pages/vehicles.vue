<template>
  <div class="p-6">
    <PageHeader title="Vehicles" subtitle="Manage your fleet">
      <template #actions>
        <UButton v-if="canEdit" color="primary" @click="showAddModal = true">Add Vehicle</UButton>
      </template>
    </PageHeader>

    <div v-if="loading" class="py-10">Loading...</div>
    <div v-else class="bg-white rounded-lg shadow">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left">Name</th>
            <th class="px-6 py-3 text-left">License Plate</th>
            <th class="px-6 py-3 text-left">Type</th>
            <th class="px-6 py-3 text-left">Capacity (kg)</th>
            <th class="px-6 py-3 text-left">Odometer</th>
            <th class="px-6 py-3 text-left">Status</th>
            <th class="px-6 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="vehicle in vehicles" :key="vehicle.id" class="border-t">
            <td class="px-6 py-4">{{ vehicle.name }}</td>
            <td class="px-6 py-4">{{ vehicle.licensePlate }}</td>
            <td class="px-6 py-4">{{ vehicle.type }}</td>
            <td class="px-6 py-4">{{ vehicle.maxCapacity }}</td>
            <td class="px-6 py-4">{{ vehicle.odometer }} km</td>
            <td class="px-6 py-4">
              <UBadge :color="getStatusColor(vehicle.status)">
                {{ vehicle.status }}
              </UBadge>
            </td>
            <td class="px-6 py-4">
              <template v-if="canEdit">
                <UButton size="xs" variant="ghost" @click="editVehicle(vehicle)">Edit</UButton>
                <UButton size="xs" variant="ghost" color="red" @click="deleteVehicle(vehicle.id)">Delete</UButton>
              </template>
              <span v-else class="text-gray-400 text-sm">Read only</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Modal -->
    <USlideover v-model="showAddModal" :title="editingVehicle ? 'Edit Vehicle' : 'Add Vehicle'">
      <form @submit.prevent="handleSubmit">
        <div class="space-y-4 p-6">
          <div>
            <label class="block text-sm font-medium mb-1">Name</label>
            <input v-model="form.name" type="text" required class="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">License Plate</label>
            <input v-model="form.licensePlate" type="text" required class="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Type</label>
            <select v-model="form.type" class="w-full px-3 py-2 border rounded">
              <option value="VAN">Van</option>
              <option value="TRUCK">Truck</option>
              <option value="BIKE">Bike</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Max Capacity (kg)</label>
            <input v-model.number="form.maxCapacity" type="number" required class="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Odometer (km)</label>
            <input v-model.number="form.odometer" type="number" class="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Region</label>
            <input v-model="form.region" type="text" class="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Status</label>
            <select v-model="form.status" class="w-full px-3 py-2 border rounded">
              <option value="AVAILABLE">Available</option>
              <option value="IN_SHOP">In Shop</option>
              <option value="RETIRED">Retired</option>
            </select>
            <p class="text-xs text-gray-500 mt-1">Note: ON_TRIP status is managed automatically by trips</p>
          </div>
        </div>
        <div class="p-6 border-t flex gap-2 justify-end">
          <UButton type="button" variant="soft" @click="showAddModal = false">Cancel</UButton>
          <UButton type="submit" color="primary" :loading="saving">{{ editingVehicle ? 'Update' : 'Create' }}</UButton>
        </div>
      </form>
    </USlideover>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: ['auth', 'role'],
  roles: ['MANAGER', 'DISPATCHER']
})

const { user } = useAuth()

const vehicles = ref<any[]>([])
const loading = ref(true)
const showAddModal = ref(false)
const editingVehicle = ref<any>(null)
const form = ref({
  name: '',
  licensePlate: '',
  type: 'VAN',
  maxCapacity: 0,
  odometer: 0,
  region: '',
  status: 'AVAILABLE'
})
const saving = ref(false)

const canEdit = computed(() => user.value?.role === 'MANAGER')

onMounted(async () => {
  await loadVehicles()
})

async function loadVehicles() {
  loading.value = true
  try {
    vehicles.value = await $fetch('/api/vehicles')
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

function editVehicle(vehicle: any) {
  editingVehicle.value = vehicle
  form.value = { ...vehicle }
  showAddModal.value = true
}

function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    AVAILABLE: 'green',
    ON_TRIP: 'blue',
    IN_SHOP: 'orange',
    RETIRED: 'gray'
  }
  return colors[status] || 'gray'
}

async function handleSubmit() {
  saving.value = true
  try {
    if (editingVehicle.value) {
      await $fetch(`/api/vehicles/${editingVehicle.value.id}`, {
        method: 'PUT',
        body: form.value
      })
    } else {
      await $fetch('/api/vehicles', {
        method: 'POST',
        body: form.value
      })
    }
    showAddModal.value = false
    await loadVehicles()
  } catch (e) {
    console.error(e)
    alert('Error saving vehicle')
  } finally {
    saving.value = false
  }
}

async function deleteVehicle(id: string) {
  if (!confirm('Delete this vehicle?')) return
  try {
    await $fetch(`/api/vehicles/${id}`, { method: 'DELETE' })
    await loadVehicles()
  } catch (e) {
    console.error(e)
    alert('Error deleting vehicle')
  }
}
</script>

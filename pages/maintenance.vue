<template>
  <div class="p-6">
    <PageHeader title="Maintenance" subtitle="Track vehicle maintenance">
      <template #actions>
        <UButton color="primary" @click="showAddModal = true">Log Maintenance</UButton>
      </template>
    </PageHeader>

    <!-- Vehicles In Shop Alert -->
    <div v-if="inShopVehicles.length > 0" class="mb-6 bg-orange-50 border border-orange-200 rounded-lg p-4">
      <h3 class="font-semibold text-orange-900 mb-2">🚗 Vehicles Currently In Shop</h3>
      <div class="space-y-2">
        <div v-for="v in inShopVehicles" :key="v.id" class="flex items-center justify-between bg-white rounded p-3">
          <div>
            <span class="font-medium">{{ v.name }}</span>
            <span class="text-gray-500 ml-2">({{ v.licensePlate }})</span>
          </div>
          <UButton size="xs" color="green" @click="markBackInService(v.id)">Back in Service</UButton>
        </div>
      </div>
    </div>

    <div v-if="loading" class="py-10">Loading...</div>
    <div v-else class="bg-white rounded-lg shadow">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left">Date</th>
            <th class="px-6 py-3 text-left">Vehicle</th>
            <th class="px-6 py-3 text-left">Description</th>
            <th class="px-6 py-3 text-left">Cost</th>
            <th class="px-6 py-3 text-left">Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in maintenanceRecords" :key="record.id" class="border-t">
            <td class="px-6 py-4">{{ formatDate(record.date) }}</td>
            <td class="px-6 py-4">{{ record.vehicle?.name }} ({{ record.vehicle?.licensePlate }})</td>
            <td class="px-6 py-4">{{ record.description }}</td>
            <td class="px-6 py-4">${{ record.cost.toFixed(2) }}</td>
            <td class="px-6 py-4 text-gray-500">{{ record.notes || '-' }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add Maintenance Modal -->
    <USlideover v-model="showAddModal" title="Log Maintenance">
      <form @submit.prevent="handleSubmit">
        <div class="space-y-4 p-6">
          <div>
            <label class="block text-sm font-medium mb-1">Vehicle</label>
            <select v-model="form.vehicleId" required class="w-full px-3 py-2 border rounded">
              <option value="">Select vehicle</option>
              <option v-for="v in vehicles" :key="v.id" :value="v.id">
                {{ v.name }} ({{ v.licensePlate }})
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Description</label>
            <input v-model="form.description" type="text" required class="w-full px-3 py-2 border rounded" placeholder="e.g., Oil change, tire rotation" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Cost ($)</label>
            <input v-model.number="form.cost" type="number" step="0.01" required class="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Date</label>
            <input v-model="form.date" type="date" class="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Notes</label>
            <textarea v-model="form.notes" class="w-full px-3 py-2 border rounded" rows="3"></textarea>
          </div>
        </div>
        <div class="p-6 border-t flex gap-2 justify-end">
          <UButton type="button" variant="soft" @click="showAddModal = false">Cancel</UButton>
          <UButton type="submit" color="primary" :loading="saving">Log</UButton>
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

const maintenanceRecords = ref<any[]>([])
const vehicles = ref<any[]>([])
const loading = ref(true)
const showAddModal = ref(false)
const form = ref({
  vehicleId: '',
  description: '',
  cost: 0,
  date: new Date().toISOString().split('T')[0],
  notes: ''
})
const saving = ref(false)

onMounted(async () => {
  await Promise.all([loadMaintenance(), loadVehicles()])
})

async function loadMaintenance() {
  loading.value = true
  try {
    maintenanceRecords.value = await $fetch('/api/maintenance')
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

const inShopVehicles = computed(() => {
  return vehicles.value.filter(v => v.status === 'IN_SHOP')
})

async function markBackInService(vehicleId: string) {
  if (!confirm('Mark this vehicle as back in service?')) return
  try {
    await $fetch(`/api/vehicles/${vehicleId}`, {
      method: 'PUT',
      body: { status: 'AVAILABLE' }
    })
    await Promise.all([loadVehicles(), loadMaintenance()])
  } catch (e) {
    console.error(e)
    alert('Error updating vehicle status')
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString()
}

async function handleSubmit() {
  saving.value = true
  try {
    await $fetch('/api/maintenance', {
      method: 'POST',
      body: form.value
    })
    showAddModal.value = false
    resetForm()
    await Promise.all([loadMaintenance(), loadVehicles()])
  } catch (e) {
    console.error(e)
    alert('Error logging maintenance')
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

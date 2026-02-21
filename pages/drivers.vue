<template>
  <div class="p-6">
    <PageHeader title="Drivers" subtitle="Manage drivers and licenses">
      <template #actions>
        <UButton color="primary" @click="showAddModal = true">Add Driver</UButton>
      </template>
    </PageHeader>

    <div v-if="loading" class="py-10">Loading...</div>
    <div v-else class="bg-white rounded-lg shadow">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left">Name</th>
            <th class="px-6 py-3 text-left">Email</th>
            <th class="px-6 py-3 text-left">License #</th>
            <th class="px-6 py-3 text-left">Category</th>
            <th class="px-6 py-3 text-left">Expiry</th>
            <th class="px-6 py-3 text-left">Status</th>
            <th class="px-6 py-3 text-left">Safety Score</th>
            <th class="px-6 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="driver in drivers" :key="driver.id" class="border-t">
            <td class="px-6 py-4">{{ driver.name }}</td>
            <td class="px-6 py-4">{{ driver.email }}</td>
            <td class="px-6 py-4">{{ driver.licenseNumber }}</td>
            <td class="px-6 py-4">{{ driver.licenseCategory }}</td>
            <td class="px-6 py-4">
              <UBadge :color="getExpiryColor(driver.licenseExpiry)">
                {{ formatDate(driver.licenseExpiry) }}
                <span v-if="isExpiringSoon(driver.licenseExpiry)" class="ml-1 text-yellow-600">⚠️</span>
                <span v-if="isExpired(driver.licenseExpiry)" class="ml-1 text-red-600">⛔</span>
              </UBadge>
            </td>
            <td class="px-6 py-4">
              <UBadge :color="getStatusColor(driver.status)">
                {{ driver.status }}
              </UBadge>
            </td>
            <td class="px-6 py-4">
              <UBadge :color="getSafetyScoreColor(driver.safetyScore)">
                {{ driver.safetyScore }}
              </UBadge>
            </td>
            <td class="px-6 py-4">
              <UButton size="xs" variant="ghost" @click="editDriver(driver)">Edit</UButton>
              <UButton size="xs" variant="ghost" color="red" @click="deleteDriver(driver.id)">Delete</UButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Modal -->
    <USlideover v-model="showAddModal" :title="editingDriver ? 'Edit Driver' : 'Add Driver'">
      <form @submit.prevent="handleSubmit">
        <div class="space-y-4 p-6">
          <div>
            <label class="block text-sm font-medium mb-1">Name</label>
            <input v-model="form.name" type="text" required class="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Email</label>
            <input v-model="form.email" type="email" required class="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Phone</label>
            <input v-model="form.phone" type="tel" class="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">License Number</label>
            <input v-model="form.licenseNumber" type="text" required class="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">License Expiry</label>
            <input v-model="form.licenseExpiry" type="date" required class="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">License Category</label>
            <select v-model="form.licenseCategory" class="w-full px-3 py-2 border rounded">
              <option value="BIKE">Bike</option>
              <option value="VAN">Van</option>
              <option value="TRUCK">Truck</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Status</label>
            <select v-model="form.status" class="w-full px-3 py-2 border rounded">
              <option value="ON_DUTY">On Duty</option>
              <option value="OFF_DUTY">Off Duty</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Safety Score (0-100)</label>
            <input v-model.number="form.safetyScore" type="number" min="0" max="100" class="w-full px-3 py-2 border rounded" />
          </div>
        </div>
        <div class="p-6 border-t flex gap-2 justify-end">
          <UButton type="button" variant="soft" @click="showAddModal = false">Cancel</UButton>
          <UButton type="submit" color="primary" :loading="saving">{{ editingDriver ? 'Update' : 'Create' }}</UButton>
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

const drivers = ref<any[]>([])
const loading = ref(true)
const showAddModal = ref(false)
const editingDriver = ref<any>(null)
const form = ref({
  name: '',
  email: '',
  phone: '',
  licenseNumber: '',
  licenseExpiry: '',
  licenseCategory: 'VAN',
  status: 'ON_DUTY',
  safetyScore: 100
})
const saving = ref(false)

onMounted(async () => {
  await loadDrivers()
})

async function loadDrivers() {
  loading.value = true
  try {
    drivers.value = await $fetch('/api/drivers')
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

function editDriver(driver: any) {
  editingDriver.value = driver
  form.value = { ...driver }
  showAddModal.value = true
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString()
}

function isExpiringSoon(dateString: string) {
  const expiry = new Date(dateString)
  const now = new Date()
  const daysUntil = Math.floor((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  return daysUntil >= 0 && daysUntil <= 30
}

function isExpired(dateString: string) {
  const expiry = new Date(dateString)
  const now = new Date()
  return expiry < now
}

function getExpiryColor(dateString: string) {
  if (isExpired(dateString)) return 'red'
  if (isExpiringSoon(dateString)) return 'yellow'
  return 'green'
}

function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    ON_DUTY: 'green',
    OFF_DUTY: 'gray',
    SUSPENDED: 'red'
  }
  return colors[status] || 'gray'
}

function getSafetyScoreColor(score: number) {
  if (score >= 80) return 'green'
  if (score >= 60) return 'yellow'
  return 'red'
}

async function handleSubmit() {
  saving.value = true
  try {
    if (editingDriver.value) {
      await $fetch(`/api/drivers/${editingDriver.value.id}`, {
        method: 'PUT',
        body: form.value
      })
    } else {
      await $fetch('/api/drivers', {
        method: 'POST',
        body: form.value
      })
    }
    showAddModal.value = false
    await loadDrivers()
    resetForm()
  } catch (e) {
    console.error(e)
    alert('Error saving driver')
  } finally {
    saving.value = false
  }
}

function resetForm() {
  editingDriver.value = null
  form.value = {
    name: '',
    email: '',
    phone: '',
    licenseNumber: '',
    licenseExpiry: '',
    licenseCategory: 'VAN',
    status: 'ON_DUTY',
    safetyScore: 100
  }
}

async function deleteDriver(id: string) {
  if (!confirm('Delete this driver?')) return
  try {
    await $fetch(`/api/drivers/${id}`, { method: 'DELETE' })
    await loadDrivers()
  } catch (e) {
    console.error(e)
    alert('Error deleting driver')
  }
}
</script>

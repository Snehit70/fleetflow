<template>
  <div>
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Drivers</h1>
        <p class="page-subtitle">Manage drivers and track license compliance</p>
      </div>
      <button v-if="canEdit" @click="openAddModal" class="btn-primary btn-md">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Add Driver
      </button>
    </div>

    <!-- Compliance Alert -->
    <div v-if="expiringLicenses.length > 0" class="alert alert-warning mb-6">
      <div class="flex items-start gap-3">
        <svg class="w-5 h-5 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <div>
          <h4 class="font-semibold">License Compliance Alert</h4>
          <p class="text-sm mt-1">{{ expiringLicenses.length }} driver(s) have licenses expiring within 30 days or already expired.</p>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="card p-4 mb-6">
      <div class="flex flex-wrap gap-4">
        <div class="flex-1 min-w-[200px]">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by name or license number..."
            class="input"
          />
        </div>
        <select v-model="filterCategory" class="select w-40">
          <option value="">All Categories</option>
          <option value="TRUCK">Truck</option>
          <option value="VAN">Van</option>
          <option value="BIKE">Bike</option>
        </select>
        <select v-model="filterStatus" class="select w-40">
          <option value="">All Statuses</option>
          <option value="ON_DUTY">On Duty</option>
          <option value="ON_TRIP">On Trip</option>
          <option value="OFF_DUTY">Off Duty</option>
          <option value="SUSPENDED">Suspended</option>
        </select>
        <button 
          v-if="searchQuery || filterCategory || filterStatus" 
          @click="clearFilters" 
          class="btn-ghost btn-md text-muted-foreground"
        >
          Clear filters
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <TableSkeleton v-if="loading" :rows="5" :columns="8" />

    <!-- Empty State -->
    <div v-else-if="filteredDrivers.length === 0" class="card">
      <EmptyState
        :title="searchQuery || filterCategory || filterStatus ? 'No drivers match your filters' : 'No drivers yet'"
        :description="searchQuery || filterCategory || filterStatus ? 'Try adjusting your search or filter criteria.' : 'Add your first driver to start managing your team.'"
      >
        <template #action v-if="canEdit && !searchQuery && !filterCategory && !filterStatus">
          <button @click="openAddModal" class="btn-primary btn-md">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Driver
          </button>
        </template>
      </EmptyState>
    </div>

    <!-- Data Table -->
    <div v-else class="table-container">
      <table class="table">
        <thead class="table-header">
          <tr>
            <th class="table-header-cell">Driver</th>
            <th class="table-header-cell">License #</th>
            <th class="table-header-cell">Category</th>
            <th class="table-header-cell">License Expiry</th>
            <th class="table-header-cell">Status</th>
            <th class="table-header-cell">Safety Score</th>
            <th class="table-header-cell">Actions</th>
          </tr>
        </thead>
        <tbody class="table-body">
          <tr 
            v-for="driver in filteredDrivers" 
            :key="driver.id" 
            class="table-row"
            :class="{ 'bg-danger/5': isExpired(driver.licenseExpiry) }"
          >
            <td class="table-cell">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span class="text-sm font-semibold text-primary">{{ getInitials(driver.name) }}</span>
                </div>
                <div>
                  <div class="font-medium text-foreground">{{ driver.name }}</div>
                  <div class="text-xs text-muted-foreground">{{ driver.email }}</div>
                </div>
              </div>
            </td>
            <td class="table-cell">
              <code class="font-mono text-sm bg-muted px-2 py-1 rounded">{{ driver.licenseNumber }}</code>
            </td>
            <td class="table-cell">
              <span class="badge badge-muted">{{ driver.licenseCategory }}</span>
            </td>
            <td class="table-cell">
              <LicenseExpiryBadge :expiry="driver.licenseExpiry" />
            </td>
            <td class="table-cell">
              <StatusBadge :status="driver.status" />
            </td>
            <td class="table-cell">
              <SafetyScoreBadge :score="driver.safetyScore" />
            </td>
            <td class="table-cell">
              <div class="flex items-center gap-1">
                <template v-if="canEdit">
                  <button 
                    @click="editDriver(driver)" 
                    class="btn-ghost btn-sm p-2"
                    title="Edit"
                  >
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                  <button 
                    @click="confirmDelete(driver)" 
                    class="btn-ghost btn-sm p-2 text-danger hover:bg-danger/10"
                    title="Delete"
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
    <Modal size="lg" v-model="showModal" :title="editingDriver ? 'Edit Driver' : 'Add Driver'">
      <form @submit.prevent="handleSubmit">
        <div class="space-y-5">
          <div>
            <label class="block text-sm font-medium mb-2">Full Name</label>
            <input v-model="form.name" type="text" required class="input" placeholder="e.g., Alex Johnson" />
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-2">Email</label>
              <input v-model="form.email" type="email" required class="input" placeholder="alex@example.com" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Phone</label>
              <input v-model="form.phone" type="tel" class="input" placeholder="+91 98765 43210" />
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-2">License Number</label>
              <input v-model="form.licenseNumber" type="text" required class="input font-mono" placeholder="DL-1234567890" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">License Category</label>
              <select v-model="form.licenseCategory" class="select">
                <option value="BIKE">Bike</option>
                <option value="VAN">Van</option>
                <option value="TRUCK">Truck</option>
              </select>
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-2">License Expiry</label>
              <input v-model="form.licenseExpiry" type="date" required class="input" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Status</label>
              <select v-model="form.status" class="select">
                <option value="ON_DUTY">On Duty</option>
                <option value="ON_TRIP">On Trip</option>
                <option value="OFF_DUTY">Off Duty</option>
                <option value="SUSPENDED">Suspended</option>
              </select>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-2">Safety Score (0-100)</label>
            <div class="flex items-center gap-4">
              <input 
                v-model.number="form.safetyScore" 
                type="range" 
                min="0" 
                max="100" 
                class="flex-1 h-2 bg-muted rounded-full appearance-none cursor-pointer"
              />
              <span class="text-lg font-bold w-12 text-right" :class="getSafetyScoreColor(form.safetyScore)">
                {{ form.safetyScore }}
              </span>
            </div>
          </div>
        </div>
        
        <div class="flex mt-6 pt-6 border-t border-border gap-3 justify-end">
          <button type="button" @click="showModal = false" class="btn-secondary btn-md">
            Cancel
          </button>
          <button type="submit" class="btn-primary btn-md" :disabled="saving">
            <svg v-if="saving" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" stroke-opacity="0.25" />
              <path d="M12 2a10 10 0 0 1 10 10" />
            </svg>
            {{ editingDriver ? 'Update' : 'Create' }}
          </button>
        </div>
      </form>
    </Modal>

    <!-- Delete Confirmation Dialog -->
    <ConfirmDialog
      :is-open="showDeleteDialog"
      title="Delete Driver"
      :message="`Are you sure you want to delete ${deletingDriver?.name}? This action cannot be undone.`"
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
  roles: ['MANAGER', 'DISPATCHER', 'SAFETY_OFFICER']
})

const { user } = useAuth()
const { success, error } = useToast()

interface Driver {
  id: string
  name: string
  email: string
  phone?: string
  licenseNumber: string
  licenseExpiry: string
  licenseCategory: 'TRUCK' | 'VAN' | 'BIKE'
  status: 'ON_DUTY' | 'ON_TRIP' | 'OFF_DUTY' | 'SUSPENDED'
  safetyScore: number
}

const drivers = ref<Driver[]>([])
const loading = ref(true)
const showModal = ref(false)
const editingDriver = ref<Driver | null>(null)
const saving = ref(false)

// Delete dialog state
const showDeleteDialog = ref(false)
const deletingDriver = ref<Driver | null>(null)
const deleting = ref(false)

// Filters
const searchQuery = ref('')
const filterCategory = ref('')
const filterStatus = ref('')

const form = ref({
  name: '',
  email: '',
  phone: '',
  licenseNumber: '',
  licenseExpiry: '',
  licenseCategory: 'VAN' as 'TRUCK' | 'VAN' | 'BIKE',
  status: 'ON_DUTY' as 'ON_DUTY' | 'ON_TRIP' | 'OFF_DUTY' | 'SUSPENDED',
  safetyScore: 100
})

const canEdit = computed(() => ['MANAGER', 'SAFETY_OFFICER'].includes(user.value?.role || ''))

onMounted(() => {
  loadDrivers()
})

const filteredDrivers = computed(() => {
  return drivers.value.filter(d => {
    const matchesSearch = !searchQuery.value || 
      d.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      d.licenseNumber.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = !filterCategory.value || d.licenseCategory === filterCategory.value
    const matchesStatus = !filterStatus.value || d.status === filterStatus.value
    return matchesSearch && matchesCategory && matchesStatus
  })
})

const expiringLicenses = computed(() => {
  const now = new Date()
  // Create date at end of day to include licenses expiring today
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
  
  return drivers.value.filter(d => {
    const expiry = parseDateOnly(d.licenseExpiry)
    return expiry && expiry <= thirtyDaysFromNow
  })
})

function parseDateOnly(dateString: string): Date | null {
  // Parse YYYY-MM-DD as local date (no timezone shift)
  const parts = dateString.split('-')
  if (parts.length !== 3) return null
  const yearStr = parts[0]
  const monthStr = parts[1]
  const dayStr = parts[2]
  if (!yearStr || !monthStr || !dayStr) return null
  const year = parseInt(yearStr, 10)
  const month = parseInt(monthStr, 10) - 1 // 0-indexed
  const day = parseInt(dayStr, 10)
  const date = new Date(year, month, day)
  return isNaN(date.getTime()) ? null : date
}

function isExpired(dateString: string): boolean {
  const expiry = parseDateOnly(dateString)
  if (!expiry) return false
  return expiry < new Date()
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function getSafetyScoreColor(score: number): string {
  if (score >= 80) return 'text-success'
  if (score >= 60) return 'text-warning'
  return 'text-danger'
}

function openAddModal() {
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
  showModal.value = true
}

function editDriver(driver: Driver) {
  editingDriver.value = driver
  form.value = { 
    name: driver.name,
    email: driver.email,
    phone: driver.phone || '',
    licenseNumber: driver.licenseNumber,
    licenseExpiry: driver.licenseExpiry.split('T')[0] ?? '',
    licenseCategory: driver.licenseCategory,
    status: driver.status,
    safetyScore: driver.safetyScore
  }
  showModal.value = true
}

function clearFilters() {
  searchQuery.value = ''
  filterCategory.value = ''
  filterStatus.value = ''
}

async function handleSubmit() {
  saving.value = true
  try {
    if (editingDriver.value) {
      await $fetch(`/api/drivers/${editingDriver.value.id}`, {
        method: 'PUT',
        body: form.value
      })
      success('Driver updated', `${form.value.name} has been updated successfully.`)
    } else {
      await $fetch('/api/drivers', {
        method: 'POST',
        body: form.value
      })
      success('Driver added', `${form.value.name} has been added to your team.`)
    }
    showModal.value = false
    await loadDrivers()
  } catch (e: any) {
    console.error(e)
    error('Error saving driver', e.data?.message || 'Please try again.')
  } finally {
    saving.value = false
  }
}

function confirmDelete(driver: Driver) {
  deletingDriver.value = driver
  showDeleteDialog.value = true
}

async function loadDrivers() {
  loading.value = true
  try {
    const data = await $fetch<Driver[]>('/api/drivers')
    drivers.value = data
  } catch (e) {
    console.error('Failed to load drivers:', e)
    error('Failed to load drivers', 'Please refresh the page.')
  } finally {
    loading.value = false
  }
}

async function handleDelete() {
  if (!deletingDriver.value) return
  
  deleting.value = true
  try {
    await $fetch(`/api/drivers/${deletingDriver.value.id}`, { method: 'DELETE' })
    success('Driver deleted', `${deletingDriver.value.name} has been removed from your team.`)
    showDeleteDialog.value = false
    deletingDriver.value = null
    await loadDrivers()
  } catch (e: any) {
    console.error(e)
    error('Error deleting driver', e.data?.message || 'Please try again.')
  } finally {
    deleting.value = false
  }
}
</script>

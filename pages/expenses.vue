<template>
  <div>
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Expenses</h1>
        <p class="page-subtitle">Track fuel and operational costs</p>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="card p-5 border-l-4 border-l-danger">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm text-muted-foreground">Total Fuel Cost</div>
            <div class="text-2xl font-bold text-danger mt-1">{{ formatCurrency(totalFuelCost) }}</div>
          </div>
          <div class="p-3 rounded-full bg-danger/10 text-danger">
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 3v18h18" />
              <path d="M18 17V9" />
              <path d="M13 17V5" />
              <path d="M8 17v-3" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card p-5 border-l-4 border-l-info">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm text-muted-foreground">Other Expenses</div>
            <div class="text-2xl font-bold text-info mt-1">{{ formatCurrency(totalOtherExpenses) }}</div>
          </div>
          <div class="p-3 rounded-full bg-info/10 text-info">
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card p-5 border-l-4 border-l-primary">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm text-muted-foreground">Total Operational</div>
            <div class="text-2xl font-bold text-primary mt-1">{{ formatCurrency(totalOperationalCost) }}</div>
          </div>
          <div class="p-3 rounded-full bg-primary/10 text-primary">
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
              <line x1="1" y1="10" x2="23" y2="10" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex gap-2 mb-6 border-b border-border">
      <button
        @click="activeTab = 'fuel'"
        :class="[
          'px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px',
          activeTab === 'fuel' 
            ? 'border-primary text-primary' 
            : 'border-transparent text-muted-foreground hover:text-foreground'
        ]"
      >
        Fuel Logs
        <span class="ml-2 px-2 py-0.5 rounded-full text-xs bg-muted">{{ fuelLogs.length }}</span>
      </button>
      <button
        @click="activeTab = 'expenses'"
        :class="[
          'px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px',
          activeTab === 'expenses' 
            ? 'border-primary text-primary' 
            : 'border-transparent text-muted-foreground hover:text-foreground'
        ]"
      >
        Other Expenses
        <span class="ml-2 px-2 py-0.5 rounded-full text-xs bg-muted">{{ expenses.length }}</span>
      </button>
    </div>

    <!-- Loading State -->
    <TableSkeleton v-if="loading" :rows="5" :columns="5" />

    <!-- Fuel Logs Table -->
    <template v-else-if="activeTab === 'fuel'">
      <div v-if="fuelLogs.length === 0" class="card">
        <EmptyState
          title="No fuel logs yet"
          description="Start tracking fuel consumption by adding your first log."
        />
      </div>
      <div v-else class="table-container">
        <table class="table">
          <thead class="table-header">
            <tr>
              <th class="table-header-cell">Date</th>
              <th class="table-header-cell">Vehicle</th>
              <th class="table-header-cell">Liters</th>
              <th class="table-header-cell">Cost</th>
              <th class="table-header-cell">Odometer</th>
            </tr>
          </thead>
          <tbody class="table-body">
            <tr v-for="log in fuelLogs" :key="log.id" class="table-row">
              <td class="table-cell">{{ formatDate(log.date) }}</td>
              <td class="table-cell">
                <div v-if="log.vehicle">
                  <div class="font-medium">{{ log.vehicle.name }}</div>
                  <div class="text-xs text-muted-foreground">{{ log.vehicle.licensePlate }}</div>
                </div>
              </td>
              <td class="table-cell">
                <span class="badge badge-warning">{{ log.liters.toFixed(2) }} L</span>
              </td>
              <td class="table-cell font-medium">{{ formatCurrency(log.cost) }}</td>
              <td class="table-cell text-muted-foreground">{{ log.odometer.toLocaleString() }} km</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <!-- Other Expenses Table -->
    <template v-else>
      <div v-if="expenses.length === 0" class="card">
        <EmptyState
          title="No expenses yet"
          description="Track your operational expenses by adding records."
        />
      </div>
      <div v-else class="table-container">
        <table class="table">
          <thead class="table-header">
            <tr>
              <th class="table-header-cell">Date</th>
              <th class="table-header-cell">Vehicle</th>
              <th class="table-header-cell">Category</th>
              <th class="table-header-cell">Amount</th>
              <th class="table-header-cell">Description</th>
            </tr>
          </thead>
          <tbody class="table-body">
            <tr v-for="exp in expenses" :key="exp.id" class="table-row">
              <td class="table-cell">{{ formatDate(exp.date) }}</td>
              <td class="table-cell">
                <div v-if="exp.vehicle">
                  <div class="font-medium">{{ exp.vehicle.name }}</div>
                  <div class="text-xs text-muted-foreground">{{ exp.vehicle.licensePlate }}</div>
                </div>
              </td>
              <td class="table-cell">
                <span :class="['badge', categoryBadgeClass(exp.category)]">{{ exp.category }}</span>
              </td>
              <td class="table-cell font-medium">{{ formatCurrency(exp.amount) }}</td>
              <td class="table-cell text-muted-foreground">{{ exp.description || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <!-- Floating Action Button -->
    <div class="fixed bottom-6 right-6 flex flex-col gap-3">
      <button 
        @click="activeTab === 'fuel' ? showFuelModal = true : showExpenseModal = true"
        class="w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center"
      >
        <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
    </div>

    <!-- Add Fuel Log Slideover -->
    <Slideover v-model="showFuelModal" title="Add Fuel Log">
      <form @submit.prevent="handleFuelSubmit">
        <div class="space-y-5 p-6">
          <div>
            <label class="block text-sm font-medium mb-2">Vehicle</label>
            <select v-model="fuelForm.vehicleId" required class="select">
              <option value="">Select a vehicle</option>
              <option v-for="v in vehicles" :key="v.id" :value="v.id">
                {{ v.name }} ({{ v.licensePlate }})
              </option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-2">Liters</label>
              <input v-model.number="fuelForm.liters" type="number" step="0.01" required class="input" min="0" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Cost ($)</label>
              <input v-model.number="fuelForm.cost" type="number" step="0.01" required class="input" min="0" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-2">Odometer (km)</label>
              <input v-model.number="fuelForm.odometer" type="number" required class="input" min="0" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Date</label>
              <input v-model="fuelForm.date" type="date" class="input" />
            </div>
          </div>
        </div>
        
        <div class="p-6 border-t border-border flex gap-3 justify-end">
          <button type="button" @click="showFuelModal = false" class="btn-secondary btn-md">Cancel</button>
          <button type="submit" class="btn-primary btn-md" :disabled="savingFuel">
            <svg v-if="savingFuel" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" stroke-opacity="0.25" />
              <path d="M12 2a10 10 0 0 1 10 10" />
            </svg>
            Add Log
          </button>
        </div>
      </form>
    </Slideover>

    <!-- Add Expense Slideover -->
    <Slideover v-model="showExpenseModal" title="Add Expense">
      <form @submit.prevent="handleExpenseSubmit">
        <div class="space-y-5 p-6">
          <div>
            <label class="block text-sm font-medium mb-2">Vehicle</label>
            <select v-model="expenseForm.vehicleId" required class="select">
              <option value="">Select a vehicle</option>
              <option v-for="v in vehicles" :key="v.id" :value="v.id">
                {{ v.name }} ({{ v.licensePlate }})
              </option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-2">Category</label>
              <select v-model="expenseForm.category" required class="select">
                <option value="REPAIRS">Repairs</option>
                <option value="PARTS">Parts</option>
                <option value="SERVICE">Service</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Amount ($)</label>
              <input v-model.number="expenseForm.amount" type="number" step="0.01" required class="input" min="0" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Date</label>
            <input v-model="expenseForm.date" type="date" class="input" />
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Description</label>
            <textarea v-model="expenseForm.description" class="input min-h-[80px]" placeholder="Describe the expense..." />
          </div>
        </div>
        
        <div class="p-6 border-t border-border flex gap-3 justify-end">
          <button type="button" @click="showExpenseModal = false" class="btn-secondary btn-md">Cancel</button>
          <button type="submit" class="btn-primary btn-md" :disabled="savingExpense">
            <svg v-if="savingExpense" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" stroke-opacity="0.25" />
              <path d="M12 2a10 10 0 0 1 10 10" />
            </svg>
            Add Expense
          </button>
        </div>
      </form>
    </Slideover>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: ['auth', 'role'],
  roles: ['MANAGER', 'FINANCIAL_ANALYST']
})

const { success, error } = useToast()

const fuelLogs = ref<any[]>([])
const expenses = ref<any[]>([])
const vehicles = ref<any[]>([])
const loading = ref(true)
const activeTab = ref<'fuel' | 'expenses'>('fuel')
const showFuelModal = ref(false)
const showExpenseModal = ref(false)
const savingFuel = ref(false)
const savingExpense = ref(false)

const fuelForm = ref({
  vehicleId: '',
  liters: 0,
  cost: 0,
  odometer: 0,
  date: new Date().toISOString().split('T')[0]
})

const expenseForm = ref({
  vehicleId: '',
  category: 'OTHER',
  amount: 0,
  description: '',
  date: new Date().toISOString().split('T')[0]
})

const totalFuelCost = computed(() => fuelLogs.value.reduce((sum, log) => sum + log.cost, 0))
const totalOtherExpenses = computed(() => expenses.value.reduce((sum, exp) => sum + exp.amount, 0))
const totalOperationalCost = computed(() => totalFuelCost.value + totalOtherExpenses.value)

onMounted(async () => {
  await Promise.all([loadFuelLogs(), loadExpenses(), loadVehicles()])
})

async function loadFuelLogs() {
  loading.value = true
  try {
    fuelLogs.value = await $fetch('/api/fuel-logs')
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

async function loadExpenses() {
  try {
    expenses.value = await $fetch('/api/expenses')
  } catch (e) {
    console.error(e)
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

function categoryBadgeClass(category: string): string {
  const classes: Record<string, string> = {
    REPAIRS: 'badge-danger',
    PARTS: 'badge-warning',
    SERVICE: 'badge-info',
    OTHER: 'badge-muted'
  }
  return classes[category] || 'badge-muted'
}

async function handleFuelSubmit() {
  savingFuel.value = true
  try {
    await $fetch('/api/fuel-logs', {
      method: 'POST',
      body: fuelForm.value
    })
    success('Fuel log added')
    showFuelModal.value = false
    resetFuelForm()
    await loadFuelLogs()
  } catch (e: any) {
    console.error(e)
    error('Error adding fuel log', e.data?.message)
  } finally {
    savingFuel.value = false
  }
}

async function handleExpenseSubmit() {
  savingExpense.value = true
  try {
    await $fetch('/api/expenses', {
      method: 'POST',
      body: expenseForm.value
    })
    success('Expense added')
    showExpenseModal.value = false
    resetExpenseForm()
    await loadExpenses()
  } catch (e: any) {
    console.error(e)
    error('Error adding expense', e.data?.message)
  } finally {
    savingExpense.value = false
  }
}

function resetFuelForm() {
  fuelForm.value = {
    vehicleId: '',
    liters: 0,
    cost: 0,
    odometer: 0,
    date: new Date().toISOString().split('T')[0]
  }
}

function resetExpenseForm() {
  expenseForm.value = {
    vehicleId: '',
    category: 'OTHER',
    amount: 0,
    description: '',
    date: new Date().toISOString().split('T')[0]
  }
}
</script>

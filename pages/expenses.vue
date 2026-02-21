<template>
  <div class="p-6">
    <PageHeader title="Expenses" subtitle="Track fuel and operational costs" />

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card title="Total Fuel Cost" :value="formatCurrency(totalFuelCost)" />
      <Card title="Total Other Expenses" :value="formatCurrency(totalOtherExpenses)" />
      <Card title="Total Operational Cost" :value="formatCurrency(totalOperationalCost)" />
    </div>

    <!-- Tabs -->
    <div class="mb-4 border-b">
      <button
        @click="activeTab = 'fuel'"
        :class="['px-4 py-2 font-medium', activeTab === 'fuel' ? 'border-b-2 border-primary text-primary' : 'text-gray-500']"
      >
        Fuel Logs
      </button>
      <button
        @click="activeTab = 'expenses'"
        :class="['px-4 py-2 font-medium', activeTab === 'expenses' ? 'border-b-2 border-primary text-primary' : 'text-gray-500']"
      >
        Other Expenses
      </button>
    </div>

    <div v-if="loading" class="py-10">Loading...</div>
    <div v-else class="bg-white rounded-lg shadow">
      <!-- Fuel Logs Table -->
      <table v-if="activeTab === 'fuel'" class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left">Date</th>
            <th class="px-6 py-3 text-left">Vehicle</th>
            <th class="px-6 py-3 text-left">Liters</th>
            <th class="px-6 py-3 text-left">Cost</th>
            <th class="px-6 py-3 text-left">Odometer</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="log in fuelLogs" :key="log.id" class="border-t">
            <td class="px-6 py-4">{{ formatDate(log.date) }}</td>
            <td class="px-6 py-4">{{ log.vehicle?.name }} ({{ log.vehicle?.licensePlate }})</td>
            <td class="px-6 py-4">{{ log.liters.toFixed(2) }} L</td>
            <td class="px-6 py-4">${{ log.cost.toFixed(2) }}</td>
            <td class="px-6 py-4">{{ log.odometer }} km</td>
          </tr>
        </tbody>
      </table>

      <!-- Expenses Table -->
      <table v-if="activeTab === 'expenses'" class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left">Date</th>
            <th class="px-6 py-3 text-left">Vehicle</th>
            <th class="px-6 py-3 text-left">Category</th>
            <th class="px-6 py-3 text-left">Amount</th>
            <th class="px-6 py-3 text-left">Description</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="exp in expenses" :key="exp.id" class="border-t">
            <td class="px-6 py-4">{{ formatDate(exp.date) }}</td>
            <td class="px-6 py-4">{{ exp.vehicle?.name }} ({{ exp.vehicle?.licensePlate }})</td>
            <td class="px-6 py-4">
              <UBadge color="blue">{{ exp.category }}</UBadge>
            </td>
            <td class="px-6 py-4">${{ exp.amount.toFixed(2) }}</td>
            <td class="px-6 py-4 text-gray-500">{{ exp.description || '-' }}</td>
          </tr>
        </tbody>
      </table>

      <div v-if="(activeTab === 'fuel' && !fuelLogs.length) || (activeTab === 'expenses' && !expenses.length)" class="p-8 text-center text-gray-500">
        No records found
      </div>
    </div>

    <!-- Add Fuel Log Button (floating) -->
    <div class="fixed bottom-6 right-6">
      <UButton v-if="activeTab === 'fuel'" color="primary" size="lg" icon="i-heroicons-plus" circle @click="showFuelModal = true" />
      <UButton v-if="activeTab === 'expenses'" color="primary" size="lg" icon="i-heroicons-plus" circle @click="showExpenseModal = true" />
    </div>

    <!-- Add Fuel Log Modal -->
    <USlideover v-model="showFuelModal" title="Add Fuel Log">
      <form @submit.prevent="handleFuelSubmit">
        <div class="space-y-4 p-6">
          <div>
            <label class="block text-sm font-medium mb-1">Vehicle</label>
            <select v-model="fuelForm.vehicleId" required class="w-full px-3 py-2 border rounded">
              <option value="">Select vehicle</option>
              <option v-for="v in vehicles" :key="v.id" :value="v.id">
                {{ v.name }} ({{ v.licensePlate }})
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Liters</label>
            <input v-model.number="fuelForm.liters" type="number" step="0.01" required class="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Cost ($)</label>
            <input v-model.number="fuelForm.cost" type="number" step="0.01" required class="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Odometer (km)</label>
            <input v-model.number="fuelForm.odometer" type="number" required class="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Date</label>
            <input v-model="fuelForm.date" type="date" class="w-full px-3 py-2 border rounded" />
          </div>
        </div>
        <div class="p-6 border-t flex gap-2 justify-end">
          <UButton type="button" variant="soft" @click="showFuelModal = false">Cancel</UButton>
          <UButton type="submit" color="primary" :loading="savingFuel">Add</UButton>
        </div>
      </form>
    </USlideover>

    <!-- Add Expense Modal -->
    <USlideover v-model="showExpenseModal" title="Add Expense">
      <form @submit.prevent="handleExpenseSubmit">
        <div class="space-y-4 p-6">
          <div>
            <label class="block text-sm font-medium mb-1">Vehicle</label>
            <select v-model="expenseForm.vehicleId" required class="w-full px-3 py-2 border rounded">
              <option value="">Select vehicle</option>
              <option v-for="v in vehicles" :key="v.id" :value="v.id">
                {{ v.name }} ({{ v.licensePlate }})
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Category</label>
            <select v-model="expenseForm.category" required class="w-full px-3 py-2 border rounded">
              <option value="REPAIRS">Repairs</option>
              <option value="PARTS">Parts</option>
              <option value="SERVICE">Service</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Amount ($)</label>
            <input v-model.number="expenseForm.amount" type="number" step="0.01" required class="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Date</label>
            <input v-model="expenseForm.date" type="date" class="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Description</label>
            <textarea v-model="expenseForm.description" class="w-full px-3 py-2 border rounded" rows="2"></textarea>
          </div>
        </div>
        <div class="p-6 border-t flex gap-2 justify-end">
          <UButton type="button" variant="soft" @click="showExpenseModal = false">Cancel</UButton>
          <UButton type="submit" color="primary" :loading="savingExpense">Add</UButton>
        </div>
      </form>
    </USlideover>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

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
  loading.value = true
  try {
    expenses.value = await $fetch('/api/expenses')
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

const totalFuelCost = computed(() => {
  return fuelLogs.value.reduce((sum, log) => sum + log.cost, 0)
})

const totalOtherExpenses = computed(() => {
  return expenses.value.reduce((sum, exp) => sum + exp.amount, 0)
})

const totalOperationalCost = computed(() => {
  return totalFuelCost.value + totalOtherExpenses.value
})

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString()
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}

async function handleFuelSubmit() {
  savingFuel.value = true
  try {
    await $fetch('/api/fuel-logs', {
      method: 'POST',
      body: fuelForm.value
    })
    showFuelModal.value = false
    resetFuelForm()
    await loadFuelLogs()
  } catch (e) {
    console.error(e)
    alert('Error adding fuel log')
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
    showExpenseModal.value = false
    resetExpenseForm()
    await loadExpenses()
  } catch (e) {
    console.error(e)
    alert('Error adding expense')
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

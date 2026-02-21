<template>
  <div class="min-h-screen flex bg-gray-100">
    <!-- Sidebar -->
    <aside class="w-64 bg-white shadow-md">
      <div class="p-4 border-b">
        <h1 class="text-xl font-bold text-primary">FleetFlow</h1>
        <p class="text-xs text-gray-500">Logistics Management</p>
      </div>

      <nav class="p-4 space-y-2">
        <NuxtLink to="/" class="block px-3 py-2 rounded hover:bg-gray-100" active-class="bg-primary text-white">
          Dashboard
        </NuxtLink>
        <NuxtLink v-if="user && ['MANAGER', 'DISPATCHER'].includes(user.role)" to="/vehicles" class="block px-3 py-2 rounded hover:bg-gray-100" active-class="bg-primary text-white">
          Vehicles
        </NuxtLink>
        <NuxtLink v-if="user && ['MANAGER', 'DISPATCHER', 'SAFETY_OFFICER'].includes(user.role)" to="/drivers" class="block px-3 py-2 rounded hover:bg-gray-100" active-class="bg-primary text-white">
          Drivers
        </NuxtLink>
        <NuxtLink v-if="user && ['MANAGER', 'DISPATCHER', 'SAFETY_OFFICER'].includes(user.role)" to="/trips" class="block px-3 py-2 rounded hover:bg-gray-100" active-class="bg-primary text-white">
          Trips
        </NuxtLink>
        <NuxtLink v-if="user && ['MANAGER', 'FINANCIAL_ANALYST'].includes(user.role)" to="/maintenance" class="block px-3 py-2 rounded hover:bg-gray-100" active-class="bg-primary text-white">
          Maintenance
        </NuxtLink>
        <NuxtLink v-if="user && ['MANAGER', 'FINANCIAL_ANALYST'].includes(user.role)" to="/expenses" class="block px-3 py-2 rounded hover:bg-gray-100" active-class="bg-primary text-white">
          Expenses
        </NuxtLink>
        <NuxtLink v-if="user && ['MANAGER', 'SAFETY_OFFICER', 'FINANCIAL_ANALYST'].includes(user.role)" to="/analytics" class="block px-3 py-2 rounded hover:bg-gray-100" active-class="bg-primary text-white">
          Analytics
        </NuxtLink>
      </nav>

      <div class="absolute bottom-4 w-64 px-4">
        <UButton color="red" variant="soft" block @click="logout">Logout</UButton>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const { logout, user } = useAuth()
</script>

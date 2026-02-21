<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <UCard class="w-96">
      <template #header>
        <h1 class="text-2xl font-bold text-center">FleetFlow Login</h1>
      </template>

      <form @submit.prevent="handleLogin">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Email</label>
            <input
              v-model="email"
              type="email"
              required
              class="w-full px-3 py-2 border rounded-md"
              placeholder="admin@fleetflow.com"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Password</label>
            <input
              v-model="password"
              type="password"
              required
              class="w-full px-3 py-2 border rounded-md"
              placeholder="password123"
            />
          </div>

          <div v-if="error" class="text-red-500 text-sm">
            {{ error }}
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/90 disabled:opacity-50"
          >
            {{ loading ? 'Signing in...' : 'Sign in' }}
          </button>
        </div>
      </form>

      <template #footer>
        <div class="text-center text-sm text-gray-500">
          Demo credentials: admin@fleetflow.com / password123
        </div>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const router = useRouter()

async function handleLogin() {
  error.value = ''
  loading.value = true

  try {
    const response = await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value
      }
    })

    // Set cookie for auth
    const authCookie = useCookie('auth')
    authCookie.value = response.token

    // Redirect to dashboard
    await router.push('/')
  } catch (e: any) {
    error.value = e.data?.message || 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>

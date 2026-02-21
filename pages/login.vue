<template>
  <div class="min-h-screen flex">
    <!-- Left Panel - Branding -->
    <div class="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-10">
        <svg class="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" stroke-width="0.5"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>

      <!-- Decorative Elements -->
      <div class="absolute top-20 left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
      <div class="absolute bottom-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />

      <!-- Content -->
      <div class="relative z-10 flex flex-col justify-center px-12 lg:px-20">
        <div class="mb-8">
          <div class="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center mb-6">
            <svg class="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="1" y="3" width="15" height="13" rx="2" />
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
          </div>
          <h1 class="text-4xl lg:text-5xl font-bold text-white font-heading mb-4">
            FleetFlow
          </h1>
          <p class="text-xl text-white/80 max-w-md">
            Modular Fleet & Logistics Management System
          </p>
        </div>

        <div class="space-y-6 max-w-md">
          <div class="flex items-start gap-4">
            <div class="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-white">Real-time Tracking</h3>
              <p class="text-sm text-white/60">Monitor your fleet status and driver assignments in real-time</p>
            </div>
          </div>

          <div class="flex items-start gap-4">
            <div class="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-white">Analytics & Insights</h3>
              <p class="text-sm text-white/60">Data-driven decisions with comprehensive reporting</p>
            </div>
          </div>

          <div class="flex items-start gap-4">
            <div class="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-white">Compliance Management</h3>
              <p class="text-sm text-white/60">Track licenses, safety scores, and maintenance schedules</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Panel - Login Form -->
    <div class="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
      <div class="w-full max-w-md">
        <!-- Mobile Logo -->
        <div class="lg:hidden mb-8 text-center">
          <div class="w-14 h-14 rounded-xl bg-primary flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-primary-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="1" y="3" width="15" height="13" rx="2" />
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
          </div>
          <h1 class="text-2xl font-bold font-heading">FleetFlow</h1>
        </div>

        <!-- Form Card -->
        <div class="card p-8">
          <div class="mb-8">
            <h2 class="text-2xl font-bold font-heading">Welcome back</h2>
            <p class="text-muted-foreground mt-1">Sign in to your account to continue</p>
          </div>

          <form @submit.prevent="handleLogin" class="space-y-5">
            <div>
              <label class="block text-sm font-medium mb-2">Email Address</label>
              <div class="relative">
                <input
                  v-model="email"
                  type="email"
                  required
                  class="input pl-10"
                  :class="{ 'input-error': error }"
                  placeholder="you@example.com"
                />
                <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">Password</label>
              <div class="relative">
                <input
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  class="input pl-10 pr-10"
                  :class="{ 'input-error': error }"
                  placeholder="Enter your password"
                />
                <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <button 
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <svg v-if="showPassword" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                  <svg v-else class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="error" class="alert alert-danger text-sm">
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                {{ error }}
              </div>
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="btn-primary btn-lg w-full"
            >
              <svg v-if="loading" class="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" stroke-opacity="0.25" />
                <path d="M12 2a10 10 0 0 1 10 10" />
              </svg>
              <span v-else>Sign in</span>
            </button>
          </form>
        </div>

        <!-- Demo Credentials -->
        <div class="mt-6 p-4 bg-muted rounded-lg">
          <h4 class="text-sm font-medium mb-3">Demo Accounts</h4>
          <div class="grid grid-cols-2 gap-2 text-xs">
            <button 
              @click="fillCredentials('admin@fleetflow.com')"
              class="px-3 py-2 bg-background rounded border border-border hover:border-primary transition-colors text-left"
            >
              <div class="font-medium">Manager</div>
              <div class="text-muted-foreground">admin@fleetflow.com</div>
            </button>
            <button 
              @click="fillCredentials('dispatch@fleetflow.com')"
              class="px-3 py-2 bg-background rounded border border-border hover:border-primary transition-colors text-left"
            >
              <div class="font-medium">Dispatcher</div>
              <div class="text-muted-foreground">dispatch@fleetflow.com</div>
            </button>
            <button 
              @click="fillCredentials('safety@fleetflow.com')"
              class="px-3 py-2 bg-background rounded border border-border hover:border-primary transition-colors text-left"
            >
              <div class="font-medium">Safety Officer</div>
              <div class="text-muted-foreground">safety@fleetflow.com</div>
            </button>
            <button 
              @click="fillCredentials('finance@fleetflow.com')"
              class="px-3 py-2 bg-background rounded border border-border hover:border-primary transition-colors text-left"
            >
              <div class="font-medium">Finance</div>
              <div class="text-muted-foreground">finance@fleetflow.com</div>
            </button>
          </div>
          <p class="text-xs text-muted-foreground mt-3">Password: password123</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth'
})

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const showPassword = ref(false)
const router = useRouter()

function fillCredentials(emailValue: string) {
  email.value = emailValue
  password.value = 'password123'
}

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
    error.value = e.data?.message || 'Invalid credentials. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

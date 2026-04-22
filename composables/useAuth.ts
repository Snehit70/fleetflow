export const useAuth = () => {
  const user = useState<User | null>('user', () => null)
  const initialized = useState<boolean>('auth_initialized', () => false)
  const loading = useState<boolean>('auth_loading', () => false)
  const router = useRouter()

  const isAuthenticated = computed(() => !!user.value)

  async function fetchUser(force = false) {
    if (loading.value) {
      return
    }

    if (!force && initialized.value) {
      return
    }

    loading.value = true
    try {
      const userData = await $fetch('/api/auth/me')
      user.value = userData
    } catch {
      user.value = null
    } finally {
      initialized.value = true
      loading.value = false
    }
  }

  async function login(email: string, password: string) {
    const data = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email, password }
    })
    user.value = data.user
    initialized.value = true
    await router.push('/')
  }

  async function logout() {
    await $fetch('/api/auth/logout', { method: 'POST' })
    user.value = null
    initialized.value = true
    await router.push('/login')
  }

  return {
    user: readonly(user),
    isAuthenticated,
    loading: readonly(loading),
    fetchUser,
    login,
    logout
  }
}

interface User {
  id: string
  email: string
  name: string
  role: string
}

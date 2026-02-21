export const useAuth = () => {
  const user = useState<User | null>('user', () => null)
  const tokenCookie = useCookie<string | undefined>('auth')
  const router = useRouter()

  const isAuthenticated = computed(() => !!tokenCookie.value && !!user.value)

  async function fetchUser() {
    if (!tokenCookie.value) {
      user.value = null
      return
    }

    try {
      const userData = await $fetch('/api/auth/me', {
        headers: {
          authorization: `Bearer ${tokenCookie.value}`
        }
      })
      user.value = userData
    } catch {
      tokenCookie.value = undefined
      user.value = null
    }
  }

  async function login(email: string, password: string) {
    const data = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email, password }
    })
    tokenCookie.value = data.token
    user.value = data.user
    await router.push('/')
  }

  function logout() {
    tokenCookie.value = undefined
    user.value = null
    router.push('/login')
  }

  return {
    user: readonly(user),
    isAuthenticated,
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

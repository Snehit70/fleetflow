export default defineNuxtRouteMiddleware(async (to) => {
  const { fetchUser, isAuthenticated } = useAuth()

  await fetchUser()

  if (!isAuthenticated.value) {
    return navigateTo('/login')
  }
})

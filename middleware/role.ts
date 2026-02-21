export default defineNuxtRouteMiddleware(async (to) => {
  const { user, isAuthenticated, fetchUser } = useAuth()

  if (!isAuthenticated.value) {
    await fetchUser()
  }

  if (!isAuthenticated.value) {
    return navigateTo('/login')
  }

  const requiredRoles = to.meta.roles as string[] | undefined

  if (requiredRoles && user.value && !requiredRoles.includes(user.value.role)) {
    return navigateTo('/')
  }
})
export default defineNuxtRouteMiddleware(async (to) => {
  const tokenCookie = useCookie('auth')
  
  if (!tokenCookie.value) {
    return navigateTo('/login')
  }
})
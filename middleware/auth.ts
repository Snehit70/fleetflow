export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth') || getHeader(event, 'authorization')?.replace('Bearer ', '')

  if (!token) {
    return navigateTo(event, '/login')
  }

  const decoded = verifyToken(token)

  if (!decoded) {
    return navigateTo(event, '/login')
  }

  // Set user in context for useAuth
  event.context.user = { userId: decoded.userId, role: decoded.role }
})

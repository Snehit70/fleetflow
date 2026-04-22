import { clearAuthCookie } from '#server/utils/auth-cookie'

export default defineEventHandler(async (event) => {
  clearAuthCookie(event)

  return {
    message: 'Logged out',
  }
})

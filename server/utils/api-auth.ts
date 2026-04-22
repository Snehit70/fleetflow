import { getCookie, getHeader } from 'h3'
import { verifyToken } from './jwt'
import { AUTH_COOKIE_NAME } from './auth-cookie'

export function getCurrentUser(event: any) {
  const token = getCookie(event, AUTH_COOKIE_NAME) || getHeader(event, 'authorization')?.replace('Bearer ', '')

  if (!token) {
    return null
  }

  const decoded = verifyToken(token)
  return decoded // { userId, role, exp, iat }
}

export function requireAuth(event: any) {
  const user = getCurrentUser(event)
  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }
  return user
}

export function requireRole(event: any, allowedRoles: string[]) {
  const user = requireAuth(event)
  if (!allowedRoles.includes(user.role)) {
    throw createError({ statusCode: 403, message: 'Insufficient permissions' })
  }
  return user
}

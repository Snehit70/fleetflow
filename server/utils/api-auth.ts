import { getCookie, getHeader } from 'h3'
import { verifyToken } from './jwt'
import { hasPermission } from './rbac'

export function getCurrentUser(event: any) {
  const token = getCookie(event, 'auth') || getHeader(event, 'authorization')?.replace('Bearer ', '')

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

export function requirePermission(event: any, resource: string, action: string) {
  const user = requireAuth(event)
  if (!hasPermission(user.role, resource, action)) {
    throw createError({ statusCode: 403, message: 'Insufficient permissions' })
  }
  return user
}

// Role-Based Access Control definitions

export const ROLE_PERMISSIONS = {
  MANAGER: {
    vehicles: ['read', 'create', 'update', 'delete'],
    drivers: ['read', 'create', 'update', 'delete'],
    trips: ['read', 'create', 'update', 'delete'],
    maintenance: ['read', 'create', 'update', 'delete'],
    expenses: ['read', 'create', 'update', 'delete'],
    analytics: ['read', 'export']
  },
  DISPATCHER: {
    vehicles: ['read'],
    drivers: ['read'],
    trips: ['read', 'create', 'update', 'delete'],
    maintenance: [],
    expenses: [],
    analytics: []
  },
  SAFETY_OFFICER: {
    vehicles: [],
    drivers: ['read', 'create', 'update', 'delete'],
    trips: ['read'],
    maintenance: [],
    expenses: [],
    analytics: ['read']
  },
  FINANCIAL_ANALYST: {
    vehicles: [],
    drivers: [],
    trips: [],
    maintenance: ['read'],
    expenses: ['read', 'create', 'update', 'delete'],
    analytics: ['read', 'export']
  }
}

export function hasPermission(userRole: string, resource: string, action: string): boolean {
  const permissions = ROLE_PERMISSIONS[userRole as keyof typeof ROLE_PERMISSIONS]
  if (!permissions) return false
  const resourcePerms = permissions[resource as keyof typeof permissions]
  if (!resourcePerms) return false
  return resourcePerms.includes(action as any)
}

export function requirePermission(resource: string, action: string) {
  return defineEventHandler(async (event) => {
    const user = event.context.user as { userId: string; role: string } | undefined

    if (!user) {
      throw createError({ statusCode: 401, message: 'Unauthorized' })
    }

    if (!hasPermission(user.role, resource, action)) {
      throw createError({ statusCode: 403, message: 'Insufficient permissions' })
    }
  })
}

import { prisma } from '#server/utils/prisma'
import { verifyToken } from '#server/utils/jwt'
import { AUTH_COOKIE_NAME } from '#server/utils/auth-cookie'

const PUBLIC_PATHS = ['/api/auth/login', '/api/auth/logout', '/api/auth/register']

export default defineEventHandler(async (event) => {
  const path = event.path

  // Only protect /api/ routes, not frontend pages
  if (!path.startsWith('/api/')) {
    return
  }

  // Allow public auth endpoints
  if (PUBLIC_PATHS.some(p => path.startsWith(p))) {
    return
  }

  const token = getCookie(event, AUTH_COOKIE_NAME) || getHeader(event, 'authorization')?.replace('Bearer ', '')

  if (!token) {
    throw createError({ statusCode: 401, message: 'No token provided' })
  }

  const decoded = verifyToken(token)

  if (!decoded) {
    throw createError({ statusCode: 401, message: 'Invalid token' })
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: { id: true, email: true, name: true, role: true }
  })

  if (!user) {
    throw createError({ statusCode: 401, message: 'User not found' })
  }

  event.context.user = user
})

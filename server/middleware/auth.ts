import { prisma } from '#server/utils/prisma'
import { verifyToken } from '#server/utils/jwt'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth') || getHeader(event, 'authorization')?.replace('Bearer ', '')

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

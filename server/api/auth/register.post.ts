import { prisma } from '#server/utils/prisma'
import bcrypt from 'bcryptjs'
import { requireRole } from '#server/utils/api-auth'
import { registerSchema } from '#server/utils/schemas'
import { parseRequestBody } from '#server/utils/validation'
export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig(event)

  if (!runtimeConfig.allowSelfRegistration) {
    requireRole(event, ['MANAGER'])
  }

  const { email, password, name } = await parseRequestBody(event, registerSchema)

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    throw createError({ statusCode: 400, message: 'Email already registered' })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name: name ?? email.split('@')[0] ?? email,
      role: 'DISPATCHER' // Default role
    },
    select: { id: true, email: true, name: true, role: true }
  })

  return user
})

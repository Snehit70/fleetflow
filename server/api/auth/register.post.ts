import { prisma } from '#server/utils/prisma'
import bcrypt from 'bcryptjs'
export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig(event)

  if (!runtimeConfig.allowSelfRegistration) {
    throw createError({ statusCode: 404, message: 'Not found' })
  }

  const { email, password, name } = await readBody(event)

  if (!email || !password) {
    throw createError({ statusCode: 400, message: 'Email and password required' })
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    throw createError({ statusCode: 400, message: 'Email already registered' })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name: name || email.split('@')[0],
      role: 'DISPATCHER' // Default role
    },
    select: { id: true, email: true, name: true, role: true }
  })

  return user
})

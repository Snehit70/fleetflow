import { prisma } from '#server/utils/prisma'
import bcrypt from 'bcryptjs'
import { signToken } from '#server/utils/jwt'

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event)

  if (!email || !password) {
    throw createError({ statusCode: 400, message: 'Email and password required' })
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, name: true, role: true, password: true }
  })

  if (!user) {
    throw createError({ statusCode: 401, message: 'Invalid credentials' })
  }

  const isValid = await bcrypt.compare(password, user.password)

  if (!isValid) {
    throw createError({ statusCode: 401, message: 'Invalid credentials' })
  }

  const token = signToken({ userId: user.id, role: user.role })

  const { password: _, ...userWithoutPassword } = user

  return {
    token,
    user: userWithoutPassword
  }
})

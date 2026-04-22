import { prisma } from '#server/utils/prisma'
import bcrypt from 'bcryptjs'
import { signToken } from '#server/utils/jwt'
import { setAuthCookie } from '#server/utils/auth-cookie'
import { loginSchema } from '#server/utils/schemas'
import { parseRequestBody } from '#server/utils/validation'

export default defineEventHandler(async (event) => {
  const { email, password } = await parseRequestBody(event, loginSchema)

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
  setAuthCookie(event, token)

  const { password: _, ...userWithoutPassword } = user

  return {
    user: userWithoutPassword
  }
})

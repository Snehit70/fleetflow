import { PrismaClient } from '~/lib/generated/prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import type { NuxtRequestHandler } from 'h3'

const prisma = new PrismaClient()

export default defineEventHandler<NuxtRequestHandler>(async (event) => {
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

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET || 'fleetflow-secret-key-change-in-production',
    { expiresIn: '7d' }
  )

  const { password: _, ...userWithoutPassword } = user

  return {
    token,
    user: userWithoutPassword
  }
})

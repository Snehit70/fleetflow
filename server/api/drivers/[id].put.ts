import { PrismaClient } from '~/lib/generated/prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  if (!id) throw createError({ statusCode: 400, message: 'Driver ID required' })

  const body = await readBody(event)

  const driver = await prisma.driver.update({
    where: { id },
    data: {
      name: body.name,
      email: body.email,
      phone: body.phone || null,
      licenseNumber: body.licenseNumber,
      licenseExpiry: body.licenseExpiry ? new Date(body.licenseExpiry) : undefined,
      licenseCategory: body.licenseCategory,
      status: body.status,
      safetyScore: body.safetyScore
    }
  })

  return driver
})

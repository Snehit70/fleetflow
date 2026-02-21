import { prisma } from '#server/utils/prisma'
import { requireRole } from '#server/utils/api-auth'
export default defineEventHandler(async (event) => {
  requireRole(event, ['MANAGER', 'SAFETY_OFFICER'])
  const id = event.context.params?.id
  if (!id) throw createError({ statusCode: 400, message: 'Driver ID required' })

  const body = await readBody(event)

  const { name, email, phone, licenseNumber, licenseExpiry, licenseCategory, status, safetyScore } = body

  const driver = await prisma.driver.update({
    where: { id },
    data: {
      name,
      email,
      phone: phone || null,
      licenseNumber,
      licenseExpiry: licenseExpiry ? new Date(licenseExpiry) : undefined,
      licenseCategory,
      status,
      safetyScore
    }
  })

  return driver
})

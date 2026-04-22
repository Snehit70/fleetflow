import { prisma } from '#server/utils/prisma'
import { requireRole } from '#server/utils/api-auth'
import { driverCreateSchema } from '#server/utils/schemas'
import { parseRequestBody } from '#server/utils/validation'
export default defineEventHandler(async (event) => {
  requireRole(event, ['MANAGER', 'SAFETY_OFFICER'])
  const body = await parseRequestBody(event, driverCreateSchema)
  const { name, email, licenseNumber, licenseExpiry, licenseCategory } = body

  const driver = await prisma.driver.create({
    data: {
      name,
      email,
      phone: body.phone || null,
      licenseNumber,
      licenseExpiry,
      licenseCategory,
      status: body.status,
      safetyScore: body.safetyScore
    }
  })

  return driver
})

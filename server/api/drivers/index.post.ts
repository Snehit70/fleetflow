import { prisma } from '#server/utils/prisma'
import { requireRole } from '#server/utils/api-auth'
export default defineEventHandler(async (event) => {
  requireRole(event, ['MANAGER', 'SAFETY_OFFICER'])
  const body = await readBody(event)

  const driver = await prisma.driver.create({
    data: {
      name: body.name,
      email: body.email,
      phone: body.phone || null,
      licenseNumber: body.licenseNumber,
      licenseExpiry: new Date(body.licenseExpiry),
      licenseCategory: body.licenseCategory,
      status: body.status || 'ON_DUTY',
      safetyScore: body.safetyScore || 100
    }
  })

  return driver
})

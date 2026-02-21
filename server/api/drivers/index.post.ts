import { prisma } from '#server/utils/prisma'
import { requireRole } from '#server/utils/api-auth'
export default defineEventHandler(async (event) => {
  requireRole(event, ['MANAGER', 'SAFETY_OFFICER'])
  const body = await readBody(event)

  const { name, email, licenseNumber, licenseExpiry, licenseCategory } = body

  if (!name || !email || !licenseNumber || !licenseExpiry || !licenseCategory) {
    throw createError({ statusCode: 400, message: 'Missing required fields: name, email, licenseNumber, licenseExpiry, licenseCategory' })
  }

  const parsedExpiry = new Date(licenseExpiry)
  if (isNaN(parsedExpiry.getTime())) {
    throw createError({ statusCode: 400, message: 'Invalid licenseExpiry date format' })
  }

  const driver = await prisma.driver.create({
    data: {
      name,
      email,
      phone: body.phone || null,
      licenseNumber,
      licenseExpiry: parsedExpiry,
      licenseCategory,
      status: body.status || 'ON_DUTY',
      safetyScore: body.safetyScore ?? 100
    }
  })

  return driver
})

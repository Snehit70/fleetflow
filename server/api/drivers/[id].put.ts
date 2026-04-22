import { prisma } from '#server/utils/prisma'
import { requireRole } from '#server/utils/api-auth'
import { driverUpdateSchema } from '#server/utils/schemas'
import { parseRequestBody } from '#server/utils/validation'
export default defineEventHandler(async (event) => {
  requireRole(event, ['MANAGER', 'SAFETY_OFFICER'])
  const id = event.context.params?.id
  if (!id) throw createError({ statusCode: 400, message: 'Driver ID required' })

  const body = await parseRequestBody(event, driverUpdateSchema)

  const driver = await prisma.driver.update({
    where: { id },
    data: {
      ...body,
      ...(body.phone !== undefined ? { phone: body.phone || null } : {})
    }
  })

  return driver
})

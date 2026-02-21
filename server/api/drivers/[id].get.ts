import { prisma } from '#server/utils/prisma'
import { requireRole } from '#server/utils/api-auth'
export default defineEventHandler(async (event) => {
  requireRole(event, ['MANAGER', 'DISPATCHER', 'SAFETY_OFFICER'])
  const id = event.context.params?.id
  if (!id) throw createError({ statusCode: 400, message: 'Driver ID required' })

  const driver = await prisma.driver.findUnique({
    where: { id }
  })

  if (!driver) throw createError({ statusCode: 404, message: 'Driver not found' })

  return driver
})

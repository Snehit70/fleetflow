import { prisma } from '#server/utils/prisma'
import { requireRole } from '#server/utils/api-auth'

export default defineEventHandler(async (event) => {
  requireRole(event, ['MANAGER', 'DISPATCHER', 'FINANCIAL_ANALYST'])
  const id = event.context.params?.id
  if (!id) throw createError({ statusCode: 400, message: 'Vehicle ID required' })

  const vehicle = await prisma.vehicle.findUnique({
    where: { id }
  })

  if (!vehicle) throw createError({ statusCode: 404, message: 'Vehicle not found' })

  return vehicle
})

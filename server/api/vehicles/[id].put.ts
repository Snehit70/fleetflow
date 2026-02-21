import { prisma } from '#server/utils/prisma'
import { requireRole } from '#server/utils/api-auth'
export default defineEventHandler(async (event) => {
  requireRole(event, ['MANAGER'])
  const id = event.context.params?.id
  if (!id) throw createError({ statusCode: 400, message: 'Vehicle ID required' })

  const body = await readBody(event)

  const vehicle = await prisma.vehicle.update({
    where: { id },
    data: body
  })

  return vehicle
})

import { prisma } from '#server/utils/prisma'
import { requireRole } from '#server/utils/api-auth'

export default defineEventHandler(async (event) => {
  requireRole(event, ['MANAGER', 'SAFETY_OFFICER'])
  const id = event.context.params?.id
  if (!id) throw createError({ statusCode: 400, message: 'Driver ID required' })

  // Check if driver has any trips
  const tripCount = await prisma.trip.count({
    where: { driverId: id }
  })

  if (tripCount > 0) {
    throw createError({ 
      statusCode: 400, 
      message: `Cannot delete driver with ${tripCount} trip(s). Consider suspending them instead.` 
    })
  }

  const driver = await prisma.driver.findUnique({
    where: { id },
    select: { name: true }
  })

  if (!driver) {
    throw createError({ statusCode: 404, message: 'Driver not found' })
  }

  await prisma.driver.delete({
    where: { id }
  })

  return { message: 'Driver deleted' }
})

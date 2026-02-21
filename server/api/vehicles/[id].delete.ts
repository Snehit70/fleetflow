import { prisma } from '#server/utils/prisma'
import { requireRole } from '#server/utils/api-auth'

export default defineEventHandler(async (event) => {
  requireRole(event, ['MANAGER'])
  const id = event.context.params?.id
  if (!id) throw createError({ statusCode: 400, message: 'Vehicle ID required' })

  // Check if vehicle has any trips
  const tripCount = await prisma.trip.count({
    where: { vehicleId: id }
  })

  if (tripCount > 0) {
    throw createError({ 
      statusCode: 400, 
      message: `Cannot delete vehicle with ${tripCount} trip(s). Consider retiring it instead.` 
    })
  }

  // Check for active status
  const vehicle = await prisma.vehicle.findUnique({
    where: { id },
    select: { status: true }
  })

  if (!vehicle) {
    throw createError({ statusCode: 404, message: 'Vehicle not found' })
  }

  if (vehicle.status === 'ON_TRIP') {
    throw createError({ statusCode: 400, message: 'Cannot delete vehicle that is currently on a trip' })
  }

  // Delete associated records first (maintenance, fuel logs, expenses)
  await prisma.$transaction([
    prisma.maintenance.deleteMany({ where: { vehicleId: id } }),
    prisma.fuelLog.deleteMany({ where: { vehicleId: id } }),
    prisma.expense.deleteMany({ where: { vehicleId: id } }),
    prisma.vehicle.delete({ where: { id } })
  ])

  return { message: 'Vehicle deleted' }
})

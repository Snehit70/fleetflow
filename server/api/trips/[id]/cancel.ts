import { prisma } from '#server/utils/prisma'
import { requireRole } from '#server/utils/api-auth'
export default defineEventHandler(async (event) => {
  requireRole(event, ['MANAGER', 'DISPATCHER'])
  const id = event.context.params?.id
  if (!id) throw createError({ statusCode: 400, message: 'Trip ID required' })

  const trip = await prisma.trip.findUnique({
    where: { id }
  })

  if (!trip) throw createError({ statusCode: 404, message: 'Trip not found' })

  if (trip.status === 'CANCELLED') {
    throw createError({ statusCode: 400, message: 'Trip is already cancelled' })
  }

  // Can cancel DRAFT or DISPATCHED
  if (!['DRAFT', 'DISPATCHED'].includes(trip.status)) {
    throw createError({ statusCode: 400, message: `Cannot cancel trip in ${trip.status} status` })
  }

  now = new Date()

  // If it was dispatched, we need to revert vehicle and driver status
  if (trip.status === 'DISPATCHED') {
    const fullTrip = await prisma.trip.findUnique({
      where: { id },
      include: { vehicle: true, driver: true }
    })

    if (fullTrip) {
      await prisma.$transaction(async (tx) => {
        // Set vehicle back to AVAILABLE
        await tx.vehicle.update({
          where: { id: fullTrip.vehicleId },
          data: { status: 'AVAILABLE' }
        })
        // Set driver back to ON_DUTY
        await tx.driver.update({
          where: { id: fullTrip.driverId },
          data: { status: 'ON_DUTY' }
        })
      })
    }
  }

  // Update trip to CANCELLED
  await prisma.trip.update({
    where: { id },
    data: { status: 'CANCELLED' }
  })

  return { message: 'Trip cancelled' }
})

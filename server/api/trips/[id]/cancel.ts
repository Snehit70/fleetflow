import { prisma } from '#server/utils/prisma'
import { requireRole } from '#server/utils/api-auth'

export default defineEventHandler(async (event) => {
  requireRole(event, ['MANAGER', 'DISPATCHER'])
  const id = event.context.params?.id
  if (!id) throw createError({ statusCode: 400, message: 'Trip ID required' })

  const trip = await prisma.trip.findUnique({
    where: { id },
    include: { vehicle: true, driver: true }
  })

  if (!trip) throw createError({ statusCode: 404, message: 'Trip not found' })

  if (trip.status === 'CANCELLED') {
    throw createError({ statusCode: 400, message: 'Trip is already cancelled' })
  }

  // Can cancel DRAFT or DISPATCHED
  if (!['DRAFT', 'DISPATCHED'].includes(trip.status)) {
    throw createError({ statusCode: 400, message: `Cannot cancel trip in ${trip.status} status` })
  }

  // If DISPATCHED, we need to revert vehicle and driver status in a transaction
  if (trip.status === 'DISPATCHED') {
    await prisma.$transaction(async (tx) => {
      // Update trip to CANCELLED
      await tx.trip.update({
        where: { id },
        data: { status: 'CANCELLED' }
      })
      // Set vehicle back to AVAILABLE
      await tx.vehicle.update({
        where: { id: trip.vehicleId },
        data: { status: 'AVAILABLE' }
      })
      // Set driver back to ON_DUTY
      await tx.driver.update({
        where: { id: trip.driverId },
        data: { status: 'ON_DUTY' }
      })
    })
  } else {
    // DRAFT - just cancel the trip
    await prisma.trip.update({
      where: { id },
      data: { status: 'CANCELLED' }
    })
  }

  return { message: 'Trip cancelled' }
})

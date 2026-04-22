import { prisma } from '#server/utils/prisma'
import { requireRole } from '#server/utils/api-auth'

export default defineEventHandler(async (event) => {
  requireRole(event, ['MANAGER', 'DISPATCHER'])
  const id = event.context.params?.id
  if (!id) throw createError({ statusCode: 400, message: 'Trip ID required' })

  await prisma.$transaction(async (tx) => {
    const trip = await tx.trip.findUnique({
      where: { id },
      include: { vehicle: true, driver: true },
    })

    if (!trip) {
      throw createError({ statusCode: 404, message: 'Trip not found' })
    }

    if (trip.status === 'CANCELLED') {
      throw createError({ statusCode: 400, message: 'Trip is already cancelled' })
    }

    if (!['DRAFT', 'DISPATCHED'].includes(trip.status)) {
      throw createError({ statusCode: 400, message: `Cannot cancel trip in ${trip.status} status` })
    }

    const cancelTrip = await tx.trip.updateMany({
      where: { id, status: trip.status },
      data: { status: 'CANCELLED' },
    })

    if (!cancelTrip.count) {
      throw createError({ statusCode: 409, message: 'Trip state changed. Refresh and try again.' })
    }

    if (trip.status === 'DISPATCHED') {
      const [vehicleUpdate, driverUpdate] = await Promise.all([
        tx.vehicle.updateMany({
          where: { id: trip.vehicleId, status: 'ON_TRIP' },
          data: { status: 'AVAILABLE' },
        }),
        tx.driver.updateMany({
          where: { id: trip.driverId, status: 'ON_TRIP' },
          data: { status: 'ON_DUTY' },
        }),
      ])

      if (!vehicleUpdate.count) {
        throw createError({ statusCode: 409, message: 'Vehicle state changed. Refresh and try again.' })
      }

      if (!driverUpdate.count) {
        throw createError({ statusCode: 409, message: 'Driver state changed. Refresh and try again.' })
      }
    }
  })

  return { message: 'Trip cancelled' }
})

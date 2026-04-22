import { prisma } from '#server/utils/prisma'
import { requireRole } from '#server/utils/api-auth'
import { tripCompleteSchema } from '#server/utils/schemas'
import { parseRequestBody } from '#server/utils/validation'
export default defineEventHandler(async (event) => {
  requireRole(event, ['MANAGER', 'DISPATCHER'])
  const id = event.context.params?.id
  if (!id) throw createError({ statusCode: 400, message: 'Trip ID required' })

  const { endOdometer } = await parseRequestBody(event, tripCompleteSchema)

  const now = new Date()
  await prisma.$transaction(async (tx) => {
    const trip = await tx.trip.findUnique({
      where: { id },
      include: { vehicle: true, driver: true },
    })

    if (!trip) {
      throw createError({ statusCode: 404, message: 'Trip not found' })
    }

    if (trip.status !== 'DISPATCHED') {
      throw createError({ statusCode: 400, message: `Cannot complete trip in ${trip.status} status` })
    }

    if (trip.startOdometer === null) {
      throw createError({ statusCode: 400, message: 'Trip has no startOdometer recorded' })
    }

    if (endOdometer <= trip.startOdometer) {
      throw createError({ statusCode: 400, message: 'endOdometer must be greater than startOdometer' })
    }

    const [tripUpdate, vehicleUpdate, driverUpdate] = await Promise.all([
      tx.trip.updateMany({
        where: { id, status: 'DISPATCHED' },
        data: {
          status: 'COMPLETED',
          endOdometer,
          completedAt: now,
        },
      }),
      tx.vehicle.updateMany({
        where: {
          id: trip.vehicleId,
          status: 'ON_TRIP',
          odometer: { lte: endOdometer },
        },
        data: { status: 'AVAILABLE', odometer: endOdometer },
      }),
      tx.driver.updateMany({
        where: { id: trip.driverId, status: 'ON_TRIP' },
        data: { status: 'ON_DUTY' },
      }),
    ])

    if (!tripUpdate.count) {
      throw createError({ statusCode: 409, message: 'Trip state changed. Refresh and try again.' })
    }

    if (!vehicleUpdate.count) {
      throw createError({ statusCode: 409, message: 'Vehicle state changed. Refresh and try again.' })
    }

    if (!driverUpdate.count) {
      throw createError({ statusCode: 409, message: 'Driver state changed. Refresh and try again.' })
    }
  })

  return { message: 'Trip completed' }
})

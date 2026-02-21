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

  // Can only complete DISPATCHED trips
  if (trip.status !== 'DISPATCHED') {
    throw createError({ statusCode: 400, message: `Cannot complete trip in ${trip.status} status` })
  }

  const body = await readBody(event)
  const { endOdometer } = body

  if (endOdometer === undefined) {
    throw createError({ statusCode: 400, message: 'endOdometer is required' })
  }

  if (endOdometer <= trip.startOdometer) {
    throw createError({ statusCode: 400, message: 'endOdometer must be greater than startOdometer' })
  }

  const now = new Date()
  await prisma.$transaction(async (tx) => {
    // Update trip to COMPLETED
    await tx.trip.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        endOdometer,
        completedAt: now
      }
    })

    // Update vehicle to AVAILABLE
    await tx.vehicle.update({
      where: { id: trip.vehicleId },
      data: { status: 'AVAILABLE', odometer: endOdometer }
    })

    // Update driver to OFF_DUTY? Actually spec says ON_DUTY after complete
    await tx.driver.update({
      where: { id: trip.driverId },
      data: { status: 'ON_DUTY' }
    })
  })

  return { message: 'Trip completed' }
})

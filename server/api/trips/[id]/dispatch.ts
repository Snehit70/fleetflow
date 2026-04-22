import { prisma } from '#server/utils/prisma'
import { requireRole } from '#server/utils/api-auth'
export default defineEventHandler(async (event) => {
  requireRole(event, ['MANAGER', 'DISPATCHER'])
  const id = event.context.params?.id
  if (!id) throw createError({ statusCode: 400, message: 'Trip ID required' })

  const now = new Date()

  await prisma.$transaction(async (tx) => {
    const trip = await tx.trip.findUnique({
      where: { id },
      include: { vehicle: true, driver: true },
    })

    if (!trip) {
      throw createError({ statusCode: 404, message: 'Trip not found' })
    }

    if (trip.status !== 'DRAFT') {
      throw createError({ statusCode: 400, message: `Cannot dispatch trip in ${trip.status} status` })
    }

    const expiryDate = new Date(trip.driver.licenseExpiry)
    if (expiryDate < now) {
      throw createError({ statusCode: 400, message: 'Driver license has expired' })
    }

    const driverCategories = trip.driver.licenseCategory.split(',').map(c => c.trim())
    const categoryMap: Record<string, string[]> = {
      BIKE: ['BIKE'],
      VAN: ['BIKE', 'VAN'],
      TRUCK: ['BIKE', 'VAN', 'TRUCK'],
    }
    const canDrive = driverCategories.some(cat => categoryMap[cat]?.includes(trip.vehicle.type))
    if (!canDrive) {
      throw createError({ statusCode: 400, message: `Driver's license (${trip.driver.licenseCategory}) cannot operate ${trip.vehicle.type}` })
    }

    const [tripUpdate, vehicleUpdate, driverUpdate] = await Promise.all([
      tx.trip.updateMany({
        where: { id, status: 'DRAFT' },
        data: {
          status: 'DISPATCHED',
          startedAt: now,
        },
      }),
      tx.vehicle.updateMany({
        where: { id: trip.vehicleId, status: 'AVAILABLE' },
        data: { status: 'ON_TRIP' },
      }),
      tx.driver.updateMany({
        where: { id: trip.driverId, status: 'ON_DUTY' },
        data: { status: 'ON_TRIP' },
      }),
    ])

    if (!tripUpdate.count) {
      throw createError({ statusCode: 409, message: 'Trip state changed. Refresh and try again.' })
    }

    if (!vehicleUpdate.count) {
      throw createError({ statusCode: 409, message: 'Vehicle is no longer available for dispatch' })
    }

    if (!driverUpdate.count) {
      throw createError({ statusCode: 409, message: 'Driver is no longer available for dispatch' })
    }
  })

  return { message: 'Trip dispatched' }
})

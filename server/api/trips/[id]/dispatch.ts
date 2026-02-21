import { PrismaClient } from '~/lib/generated/prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  if (!id) throw createError({ statusCode: 400, message: 'Trip ID required' })

  const trip = await prisma.trip.findUnique({
    where: { id },
    include: { vehicle: true, driver: true }
  })

  if (!trip) throw createError({ statusCode: 404, message: 'Trip not found' })

  // Can only dispatch DRAFT trips
  if (trip.status !== 'DRAFT') {
    throw createError({ statusCode: 400, message: `Cannot dispatch trip in ${trip.status} status` })
  }

  // Validate current vehicle and driver status before dispatch
  if (trip.vehicle.status !== 'AVAILABLE') {
    throw createError({ statusCode: 400, message: `Vehicle is not available (status: ${trip.vehicle.status})` })
  }

  if (trip.driver.status !== 'ON_DUTY') {
    throw createError({ statusCode: 400, message: `Driver is not ON_DUTY (status: ${trip.driver.status})` })
  }

  // Check driver license expiry
  const expiryDate = new Date(trip.driver.licenseExpiry)
  const now = new Date()
  if (expiryDate < now) {
    throw createError({ statusCode: 400, message: 'Driver license has expired' })
  }

  // Check license category
  const categoryMap: Record<string, string[]> = {
    BIKE: ['BIKE'],
    VAN: ['BIKE', 'VAN'],
    TRUCK: ['BIKE', 'VAN', 'TRUCK']
  }
  if (!categoryMap[trip.driver.licenseCategory]?.includes(trip.vehicle.type)) {
    throw createError({ statusCode: 400, message: `Driver's license (${trip.driver.licenseCategory}) cannot operate ${trip.vehicle.type}` })
  }

  // Begin transaction
  await prisma.$transaction(async (tx) => {
    // Update trip status to DISPATCHED
    await tx.trip.update({
      where: { id },
      data: {
        status: 'DISPATCHED',
        startedAt: now
      }
    })

    // Update vehicle to ON_TRIP
    await tx.vehicle.update({
      where: { id: trip.vehicleId },
      data: { status: 'ON_TRIP' }
    })

    // Update driver to ON_DUTY? Actually maybe ON_TRIP? Let's keep ON_DUTY or create ON_TRIP?
    // Based on spec: "Dispatch: Vehicle → ON_TRIP, Driver → ON_TRIP"
    await tx.driver.update({
      where: { id: trip.driverId },
      data: { status: 'ON_DUTY' } // No ON_TRIP status in enum, spec said ON_TRIP but enum is ON_DUTY/OFF_DUTY/SUSPENDED
    })
  })

  return { message: 'Trip dispatched' }
})

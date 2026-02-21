import { PrismaClient } from '~/lib/generated/prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { vehicleId, driverId, origin, destination, cargoWeight, cargoDescription } = body

  if (!vehicleId || !driverId || !origin || !destination || !cargoWeight) {
    throw createError({ statusCode: 400, message: 'Missing required fields' })
  }

  // Fetch vehicle and driver
  const [vehicle, driver] = await Promise.all([
    prisma.vehicle.findUnique({ where: { id: vehicleId } }),
    prisma.driver.findUnique({ where: { id: driverId } })
  ])

  if (!vehicle) throw createError({ statusCode: 404, message: 'Vehicle not found' })
  if (!driver) throw createError({ statusCode: 404, message: 'Driver not found' })

  // Validation rules
  if (cargoWeight > vehicle.maxCapacity) {
    throw createError({ statusCode: 400, message: `Cargo weight (${cargoWeight}kg) exceeds vehicle max capacity (${vehicle.maxCapacity}kg)` })
  }

  if (driver.status !== 'ON_DUTY') {
    throw createError({ statusCode: 400, message: 'Driver must be ON_DUTY to be assigned to a trip' })
  }

  const expiryDate = new Date(driver.licenseExpiry)
  const now = new Date()
  if (expiryDate < now) {
    throw createError({ statusCode: 400, message: 'Driver license has expired' })
  }

  // Check license category matches vehicle type
  const categoryMap: Record<string, string[]> = {
    BIKE: ['BIKE'],
    VAN: ['BIKE', 'VAN'],
    TRUCK: ['BIKE', 'VAN', 'TRUCK']
  }
  if (!categoryMap[driver.licenseCategory]?.includes(vehicle.type)) {
    throw createError({ statusCode: 400, message: `Driver's license category (${driver.licenseCategory}) does not allow operating ${vehicle.type}` })
  }

  if (vehicle.status !== 'AVAILABLE') {
    throw createError({ statusCode: 400, message: `Vehicle is not available (current status: ${vehicle.status})` })
  }

  // Create trip in DRAFT status
  const trip = await prisma.trip.create({
    data: {
      vehicleId,
      driverId,
      origin,
      destination,
      cargoWeight,
      cargoDescription,
      status: 'DRAFT',
      startOdometer: vehicle.odometer
    },
    include: {
      vehicle: true,
      driver: true
    }
  })

  return trip
})

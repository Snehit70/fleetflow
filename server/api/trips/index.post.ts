import { prisma } from '#server/utils/prisma'
import { requireRole } from '#server/utils/api-auth'
export default defineEventHandler(async (event) => {
  requireRole(event, ['MANAGER', 'DISPATCHER'])
  const body = await readBody(event)

  const { vehicleId, driverId, origin, destination, cargoWeight, cargoDescription } = body

  if (!vehicleId || !driverId || !origin || !destination || cargoWeight == null) {
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

  // Check license category (supports comma-separated values like "VAN, TRUCK")
  const driverCategories = driver.licenseCategory.split(',').map(c => c.trim())
  const categoryMap: Record<string, string[]> = {
    BIKE: ['BIKE'],
    VAN: ['BIKE', 'VAN'],
    TRUCK: ['BIKE', 'VAN', 'TRUCK']
  }
  const canDrive = driverCategories.some(cat => categoryMap[cat]?.includes(vehicle.type))
  if (!canDrive) {
    throw createError({ statusCode: 400, message: `Driver's license (${driver.licenseCategory}) cannot operate ${vehicle.type}` })
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

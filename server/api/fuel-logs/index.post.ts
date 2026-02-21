import { prisma } from '#server/utils/prisma'
import { requireRole } from '#server/utils/api-auth'

export default defineEventHandler(async (event) => {
  requireRole(event, ['MANAGER', 'FINANCIAL_ANALYST'])
  const body = await readBody(event)

  const { vehicleId, liters, cost, odometer, date } = body

  if (!vehicleId || liters == null || cost == null || odometer == null) {
    throw createError({ statusCode: 400, message: 'Missing required fields: vehicleId, liters, cost, odometer' })
  }

  const parsedLiters = parseFloat(liters)
  const parsedCost = parseFloat(cost)
  const parsedOdometer = parseInt(odometer)

  if (isNaN(parsedLiters) || isNaN(parsedCost) || isNaN(parsedOdometer)) {
    throw createError({ statusCode: 400, message: 'liters, cost, and odometer must be valid numbers' })
  }

  // Check if vehicle exists
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: vehicleId }
  })

  if (!vehicle) throw createError({ statusCode: 404, message: 'Vehicle not found' })

  const parsedDate = date ? new Date(date) : new Date()
  if (date && isNaN(parsedDate.getTime())) {
    throw createError({ statusCode: 400, message: 'Invalid date format' })
  }

  await prisma.fuelLog.create({
    data: {
      vehicleId,
      liters: parsedLiters,
      cost: parsedCost,
      odometer: parsedOdometer,
      date: parsedDate
    }
  })

  return { message: 'Fuel log created' }
})

import { PrismaClient } from '~/lib/generated/prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { vehicleId, liters, cost, odometer, date } = body

  if (!vehicleId || !liters || !cost || !odometer) {
    throw createError({ statusCode: 400, message: 'Missing required fields: vehicleId, liters, cost, odometer' })
  }

  // Check if vehicle exists
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: vehicleId }
  })

  if (!vehicle) throw createError({ statusCode: 404, message: 'Vehicle not found' })

  await prisma.fuelLog.create({
    data: {
      vehicleId,
      liters: parseFloat(liters),
      cost: parseFloat(cost),
      odometer: parseInt(odometer),
      date: date ? new Date(date) : new Date()
    }
  })

  return { message: 'Fuel log created' }
})

import { prisma } from '#server/utils/prisma'
import { requireRole } from '#server/utils/api-auth'
import { fuelLogCreateSchema } from '#server/utils/schemas'
import { parseRequestBody } from '#server/utils/validation'

export default defineEventHandler(async (event) => {
  requireRole(event, ['MANAGER', 'FINANCIAL_ANALYST'])
  const { vehicleId, liters, cost, odometer, date } = await parseRequestBody(event, fuelLogCreateSchema)

  // Check if vehicle exists
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: vehicleId }
  })

  if (!vehicle) throw createError({ statusCode: 404, message: 'Vehicle not found' })

  if (odometer < vehicle.odometer) {
    throw createError({ statusCode: 400, message: `Odometer (${odometer}) cannot be less than vehicle's current odometer (${vehicle.odometer})` })
  }

  await prisma.$transaction(async (tx) => {
    await tx.fuelLog.create({
      data: {
        vehicleId,
        liters,
        cost,
        odometer,
        date: date || new Date(),
      },
    })

    await tx.vehicle.update({
      where: { id: vehicleId },
      data: { odometer },
    })
  })

  return { message: 'Fuel log created' }
})

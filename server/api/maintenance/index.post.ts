import { prisma } from '#server/utils/prisma'
import { requireRole } from '#server/utils/api-auth'
import { maintenanceCreateSchema } from '#server/utils/schemas'
import { parseRequestBody } from '#server/utils/validation'

export default defineEventHandler(async (event) => {
  requireRole(event, ['MANAGER'])
  const { vehicleId, description, cost, date, notes } = await parseRequestBody(event, maintenanceCreateSchema)

  // Create maintenance record and update vehicle status in transaction
  await prisma.$transaction(async (tx) => {
    const vehicleStatusUpdate = await tx.vehicle.updateMany({
      where: {
        id: vehicleId,
        status: { not: 'ON_TRIP' },
      },
      data: { status: 'IN_SHOP' },
    })

    if (!vehicleStatusUpdate.count) {
      const vehicle = await tx.vehicle.findUnique({ where: { id: vehicleId }, select: { status: true } })
      if (!vehicle) {
        throw createError({ statusCode: 404, message: 'Vehicle not found' })
      }

      throw createError({
        statusCode: 409,
        message: 'Cannot log maintenance for vehicle currently on a trip. Complete the trip first.',
      })
    }

    await tx.maintenance.create({
      data: {
        vehicleId,
        description,
        cost,
        date: date || new Date(),
        notes: notes || null
      }
    })
  })

  return { message: 'Maintenance logged' }
})

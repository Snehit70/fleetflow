import { prisma } from '#server/utils/prisma'
import { requireRole } from '#server/utils/api-auth'
import { maintenanceCreateSchema } from '#server/utils/schemas'
import { parseRequestBody } from '#server/utils/validation'

export default defineEventHandler(async (event) => {
  requireRole(event, ['MANAGER'])
  const { vehicleId, description, cost, date, notes } = await parseRequestBody(event, maintenanceCreateSchema)

  // Check if vehicle exists
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: vehicleId }
  })

  if (!vehicle) throw createError({ statusCode: 404, message: 'Vehicle not found' })

  if (vehicle.status === 'ON_TRIP') {
    throw createError({ statusCode: 400, message: 'Cannot log maintenance for vehicle currently on a trip. Complete the trip first.' })
  }

  // Create maintenance record and update vehicle status in transaction
  await prisma.$transaction(async (tx) => {
    await tx.maintenance.create({
      data: {
        vehicleId,
        description,
        cost,
        date: date || new Date(),
        notes: notes || null
      }
    })

    // Auto-update vehicle status to IN_SHOP
    await tx.vehicle.update({
      where: { id: vehicleId },
      data: { status: 'IN_SHOP' }
    })
  })

  return { message: 'Maintenance logged' }
})

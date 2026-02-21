import { prisma } from '#server/utils/prisma'
import { requireRole } from '#server/utils/api-auth'

export default defineEventHandler(async (event) => {
  requireRole(event, ['MANAGER'])
  const body = await readBody(event)

  const { vehicleId, description, cost, date, notes } = body

  if (!vehicleId || !description || cost == null) {
    throw createError({ statusCode: 400, message: 'Missing required fields: vehicleId, description, cost' })
  }

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
        cost: parseFloat(cost),
        date: date ? new Date(date) : new Date(),
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

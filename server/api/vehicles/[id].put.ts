import { prisma } from '#server/utils/prisma'
import { requireRole } from '#server/utils/api-auth'
import { vehicleUpdateSchema } from '#server/utils/schemas'
import { parseRequestBody } from '#server/utils/validation'

export default defineEventHandler(async (event) => {
  requireRole(event, ['MANAGER'])
  const id = event.context.params?.id
  if (!id) throw createError({ statusCode: 400, message: 'Vehicle ID required' })

  const body = await parseRequestBody(event, vehicleUpdateSchema)
  const data = { ...body }

  // Validate odometer doesn't go backwards if being updated
  if (data.odometer !== undefined) {
    const currentVehicle = await prisma.vehicle.findUnique({
      where: { id },
      select: { odometer: true }
    })
    if (currentVehicle && data.odometer < currentVehicle.odometer) {
      throw createError({ 
        statusCode: 400, 
        message: `Odometer cannot be decreased from ${currentVehicle.odometer} to ${data.odometer}` 
      })
    }
  }

  // Validate status transitions
  if (data.status) {
    const currentVehicle = await prisma.vehicle.findUnique({
      where: { id },
      select: { status: true }
    })
    if (!currentVehicle) {
      throw createError({ statusCode: 404, message: 'Vehicle not found' })
    }
    
    // Only allow RETIRED if not ON_TRIP
    if (data.status === 'RETIRED' && currentVehicle.status === 'ON_TRIP') {
      throw createError({ statusCode: 400, message: 'Cannot retire vehicle that is on a trip' })
    }
  }

  const vehicle = await prisma.vehicle.update({
    where: { id },
    data: {
      ...data,
      ...(data.region !== undefined ? { region: data.region || null } : {}),
    }
  })

  return vehicle
})

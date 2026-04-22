import { prisma } from '#server/utils/prisma'
import { requireRole } from '#server/utils/api-auth'
import { vehicleCreateSchema } from '#server/utils/schemas'
import { parseRequestBody } from '#server/utils/validation'
export default defineEventHandler(async (event) => {
  requireRole(event, ['MANAGER'])
  const body = await parseRequestBody(event, vehicleCreateSchema)

  const vehicle = await prisma.vehicle.create({
    data: {
      name: body.name,
      licensePlate: body.licensePlate,
      type: body.type,
      maxCapacity: body.maxCapacity,
      odometer: body.odometer || 0,
      region: body.region || null
    }
  })

  return vehicle
})

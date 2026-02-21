import { prisma } from '#server/utils/prisma'
import { requireRole } from '#server/utils/api-auth'
export default defineEventHandler(async (event) => {
  requireRole(event, ['MANAGER'])
  const body = await readBody(event)

  const vehicle = await prisma.vehicle.create({
    data: {
      name: body.name,
      licensePlate: body.licensePlate,
      type: body.type,
      maxCapacity: body.maxCapacity,
      odometer: body.odometer || 0,
      region: body.region
    }
  })

  return vehicle
})

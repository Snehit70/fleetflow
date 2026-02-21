import { PrismaClient } from '~/lib/generated/prisma/client'
import { requireRole } from '~/server/utils/api-auth'

const prisma = new PrismaClient()

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

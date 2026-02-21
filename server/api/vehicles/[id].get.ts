import { PrismaClient } from '~/lib/generated/prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  if (!id) throw createError({ statusCode: 400, message: 'Vehicle ID required' })

  const vehicle = await prisma.vehicle.findUnique({
    where: { id }
  })

  if (!vehicle) throw createError({ statusCode: 404, message: 'Vehicle not found' })

  return vehicle
})

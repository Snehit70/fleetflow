import { PrismaClient } from '~/lib/generated/prisma/client'
import { requireRole } from '~/server/utils/api-auth'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  requireRole(event, ['MANAGER', 'DISPATCHER', 'SAFETY_OFFICER'])
  const id = event.context.params?.id
  if (!id) throw createError({ statusCode: 400, message: 'Trip ID required' })

  const trip = await prisma.trip.findUnique({
    where: { id },
    include: { vehicle: true, driver: true }
  })

  if (!trip) throw createError({ statusCode: 404, message: 'Trip not found' })

  return trip
})

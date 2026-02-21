import { PrismaClient } from '~/lib/generated/prisma/client'
import { requireRole } from '~/server/utils/api-auth'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  requireRole(event, ['MANAGER'])
  const id = event.context.params?.id
  if (!id) throw createError({ statusCode: 400, message: 'Vehicle ID required' })

  const body = await readBody(event)

  const vehicle = await prisma.vehicle.update({
    where: { id },
    data: body
  })

  return vehicle
})

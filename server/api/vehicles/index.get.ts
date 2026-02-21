import { prisma } from '#server/utils/prisma'
import { requireRole } from '#server/utils/api-auth'
export default defineEventHandler(async (event) => {
  requireRole(event, ['MANAGER', 'DISPATCHER'])
  return prisma.vehicle.findMany({
    orderBy: { createdAt: 'desc' }
  })
})

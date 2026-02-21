import { prisma } from '#server/utils/prisma'
import { requireRole } from '#server/utils/api-auth'
export default defineEventHandler(async (event) => {
  requireRole(event, ['MANAGER', 'FINANCIAL_ANALYST'])
  return prisma.fuelLog.findMany({
    include: { vehicle: true },
    orderBy: { date: 'desc' }
  })
})

import { prisma } from '#server/utils/prisma'
import { requireRole } from '#server/utils/api-auth'
export default defineEventHandler(async (event) => {
  requireRole(event, ['MANAGER', 'SAFETY_OFFICER', 'FINANCIAL_ANALYST'])
  // Fleet utilization: vehicles by status
  const statusCounts = await prisma.vehicle.groupBy({
    by: ['status'],
    _count: { id: true }
  })

  const utilization = {
    AVAILABLE: 0,
    ON_TRIP: 0,
    IN_SHOP: 0,
    RETIRED: 0
  }

  statusCounts.forEach(item => {
    utilization[item.status] = item._count.id
  })

  // Total active vehicles (AVAILABLE + ON_TRIP)
  const totalActive = utilization.AVAILABLE + utilization.ON_TRIP
  const totalFleet = Object.values(utilization).reduce((a, b) => a + b, 0)

  return {
    statusBreakdown: utilization,
    totalActive,
    totalFleet,
    utilizationRate: totalFleet > 0 ? Math.round((totalActive / totalFleet) * 100) : 0
  }
})

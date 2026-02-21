import { prisma } from '#server/utils/prisma'
import { requireRole } from '#server/utils/api-auth'
export default defineEventHandler(async (event) => {
  requireRole(event, ['MANAGER', 'SAFETY_OFFICER', 'FINANCIAL_ANALYST'])
  const totalVehicles = await prisma.vehicle.count()
  const totalDrivers = await prisma.driver.count()
  const activeFleet = await prisma.vehicle.count({ where: { status: 'ON_TRIP' } })
  const maintenanceAlerts = await prisma.vehicle.count({ where: { status: 'IN_SHOP' } })
  const utilizationRate = totalVehicles > 0 ? Math.round((activeFleet / totalVehicles) * 100) : 0
  const pendingCargo = await prisma.trip.count({ where: { status: 'DRAFT' } })

  return {
    totalVehicles,
    totalDrivers,
    activeFleet,
    maintenanceAlerts,
    utilizationRate,
    pendingCargo
  }
})

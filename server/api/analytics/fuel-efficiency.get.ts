import { prisma } from '#server/utils/prisma'
import { requireRole } from '#server/utils/api-auth'

export default defineEventHandler(async (event) => {
  requireRole(event, ['MANAGER', 'SAFETY_OFFICER', 'FINANCIAL_ANALYST'])
  // Get fuel logs grouped by vehicle with odometer tracking
  const fuelLogs = await prisma.fuelLog.groupBy({
    by: ['vehicleId'],
    _sum: {
      liters: true,
      cost: true
    },
    _min: {
      odometer: true
    },
    _max: {
      odometer: true
    },
    where: {
      liters: { gt: 0 }
    }
  })

  // Get vehicle details
  const vehicles = await prisma.vehicle.findMany({
    select: {
      id: true,
      name: true,
      licensePlate: true,
      type: true
    }
  })

  // Build fuel efficiency data
  const efficiencyData = fuelLogs.map(log => {
    const vehicle = vehicles.find(v => v.id === log.vehicleId)
    const minOdo = log._min.odometer ?? 0
    const maxOdo = log._max.odometer ?? 0
    const distance = maxOdo - minOdo
    const liters = log._sum.liters || 0
    const efficiency = distance > 0 && liters > 0 ? distance / liters : 0

    return {
      vehicleId: log.vehicleId,
      vehicleName: vehicle?.name || 'Unknown',
      vehicleType: vehicle?.type || 'Unknown',
      liters: liters,
      distance: distance,
      efficiency: Math.round(efficiency * 100) / 100
    }
  }).filter(e => e.distance > 0)

  return efficiencyData
})

import { PrismaClient } from '~/lib/generated/prisma/client'
import { requireRole } from '~/server/utils/api-auth'

const prisma = new PrismaClient()

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

  // Get trips grouped by vehicle for distance calculation
  const trips = await prisma.trip.groupBy({
    by: ['vehicleId'],
    _sum: {
      cargoWeight: true
    },
    where: {
      status: 'COMPLETED'
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
    const distance = log._max.odometer - log._min.odometer
    const efficiency = distance > 0 && log._sum.liters > 0 ? distance / log._sum.liters : 0

    return {
      vehicleId: log.vehicleId,
      vehicleName: vehicle?.name || 'Unknown',
      vehicleType: vehicle?.type || 'Unknown',
      liters: log._sum.liters || 0,
      distance: distance || 0,
      efficiency: Math.round(efficiency * 100) / 100
    }
  }).filter(e => e.distance > 0)

  return efficiencyData
})

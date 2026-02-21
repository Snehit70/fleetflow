import { prisma } from '#server/utils/prisma'
import { requireRole } from '#server/utils/api-auth'

export default defineEventHandler(async (event) => {
  requireRole(event, ['MANAGER', 'FINANCIAL_ANALYST'])
  // Get fuel efficiency data
  const fuelLogs = await prisma.fuelLog.groupBy({
    by: ['vehicleId'],
    _sum: { liters: true, cost: true },
    _min: { odometer: true },
    _max: { odometer: true },
    where: {
      liters: { gt: 0 }
    }
  })

  const vehicles = await prisma.vehicle.findMany({
    select: { id: true, name: true, licensePlate: true, type: true }
  })

  const efficiencyData = fuelLogs.map(log => {
    const vehicle = vehicles.find(v => v.id === log.vehicleId)
    const minOdo = log._min.odometer ?? 0
    const maxOdo = log._max.odometer ?? 0
    const distance = maxOdo - minOdo
    const liters = log._sum.liters || 0
    const cost = log._sum.cost || 0
    return {
      vehicleName: vehicle?.name || 'Unknown',
      licensePlate: vehicle?.licensePlate || '',
      vehicleType: vehicle?.type || '',
      distanceKm: distance,
      litersUsed: liters,
      fuelCost: cost,
      avgEfficiencyKmPerL: distance > 0 && liters > 0 ? (distance / liters).toFixed(2) : '0'
    }
  }).filter(e => e.distanceKm > 0)

  // Build CSV
  const headers = ['Vehicle Name', 'License Plate', 'Type', 'Distance (km)', 'Liters Used', 'Fuel Cost ($)', 'Efficiency (km/L)']
  const escapeCsvField = (value: string | number): string => {
    const str = String(value)
    if (/^[=+\-@\t\r]/.test(str)) {
      return "'" + str.replace(/"/g, '""')
    }
    return str.includes(',') || str.includes('"') ? `"${str.replace(/"/g, '""')}"` : str
  }

  const rows = efficiencyData.map(row => [
    escapeCsvField(row.vehicleName),
    escapeCsvField(row.licensePlate),
    escapeCsvField(row.vehicleType),
    escapeCsvField(row.distanceKm),
    escapeCsvField(row.litersUsed),
    escapeCsvField(row.fuelCost.toFixed(2)),
    escapeCsvField(row.avgEfficiencyKmPerL)
  ])

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n')

  setResponseHeader(event, 'Content-Type', 'text/csv')
  setResponseHeader(event, 'Content-Disposition', 'attachment; filename="fleet-analytics-export.csv"')

  return csvContent
})

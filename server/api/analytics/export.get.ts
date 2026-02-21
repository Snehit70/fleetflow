import { prisma } from '#server/utils/prisma'
import { requireRole } from '#server/utils/api-auth'
export default defineEventHandler(async (event) => {
  requireRole(event, ['MANAGER', 'FINANCIAL_ANALYST'])
  // Get fuel efficiency data
  const fuelLogs = await prisma.fuelLog.groupBy({
    by: ['vehicleId'],
    _sum: { liters: true, cost: true },
    _min: { odometer: true },
    _max: { odometer: true }
  })

  const vehicles = await prisma.vehicle.findMany({
    select: { id: true, name: true, licensePlate: true, type: true }
  })

  const efficiencyData = fuelLogs.map(log => {
    const vehicle = vehicles.find(v => v.id === log.vehicleId)
    const distance = log._max.odometer - log._min.odometer
    return {
      vehicleName: vehicle?.name || 'Unknown',
      licensePlate: vehicle?.licensePlate || '',
      vehicleType: vehicle?.type || '',
      distanceKm: distance,
      litersUsed: log._sum.liters || 0,
      fuelCost: log._sum.cost || 0,
      avgEfficiencyKmPerL: distance > 0 && log._sum.liters > 0 ? (distance / log._sum.liters).toFixed(2) : 0
    }
  }).filter(e => e.distanceKm > 0)

  // Build CSV
  const headers = ['Vehicle Name', 'License Plate', 'Type', 'Distance (km)', 'Liters Used', 'Fuel Cost ($)', 'Efficiency (km/L)']
  const rows = efficiencyData.map(row => [
    row.vehicleName,
    row.licensePlate,
    row.vehicleType,
    row.distanceKm,
    row.litersUsed,
    row.fuelCost.toFixed(2),
    row.avgEfficiencyKmPerL
  ])

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n')

  setResponseHeader(event, 'Content-Type', 'text/csv')
  setResponseHeader(event, 'Content-Disposition', 'attachment; filename="fleet-analytics-export.csv"')

  return csvContent
})

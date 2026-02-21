import { prisma } from '#server/utils/prisma'
import { requireRole } from '#server/utils/api-auth'

export default defineEventHandler(async (event) => {
  requireRole(event, ['MANAGER', 'SAFETY_OFFICER', 'FINANCIAL_ANALYST'])
  const currentMonth = new Date()
  currentMonth.setDate(1)
  currentMonth.setHours(0, 0, 0, 0)

  // Fuel costs
  const fuelCost = await prisma.fuelLog.aggregate({
    where: { date: { gte: currentMonth } },
    _sum: { cost: true }
  })

  // Maintenance costs
  const maintenanceCost = await prisma.maintenance.aggregate({
    where: { date: { gte: currentMonth } },
    _sum: { cost: true }
  })

  // Other expenses (excluding fuel and maintenance)
  const otherExpenses = await prisma.expense.aggregate({
    where: { date: { gte: currentMonth } },
    _sum: { amount: true }
  })

  const fuelTotal = fuelCost._sum.cost || 0
  const maintenanceTotal = maintenanceCost._sum.cost || 0
  const otherTotal = otherExpenses._sum.amount || 0
  const total = fuelTotal + maintenanceTotal + otherTotal

  return {
    fuel: fuelTotal,
    maintenance: maintenanceTotal,
    other: otherTotal,
    total
  }
})

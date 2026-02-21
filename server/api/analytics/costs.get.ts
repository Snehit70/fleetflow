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

  const total = (fuelCost._sum.cost || 0) + (maintenanceCost._sum.cost || 0) + (otherExpenses._sum.amount || 0)

  return {
    fuel: fuelCost._sum.cost || 0,
    maintenance: maintenanceCost._sum.cost || 0,
    other: otherExpenses._sum.amount || 0,
    total
  }
})

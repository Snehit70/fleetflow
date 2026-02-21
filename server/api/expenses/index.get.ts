import { PrismaClient } from '~/lib/generated/prisma/client'
import { requireRole } from '~/server/utils/api-auth'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  requireRole(event, ['MANAGER', 'FINANCIAL_ANALYST'])
  return prisma.expense.findMany({
    include: { vehicle: true },
    orderBy: { date: 'desc' }
  })
})

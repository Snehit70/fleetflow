import { PrismaClient } from '~/lib/generated/prisma/client'
import { requireRole } from '~/server/utils/api-auth'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  requireRole(event, ['MANAGER', 'DISPATCHER', 'SAFETY_OFFICER'])
  return prisma.driver.findMany({
    orderBy: { createdAt: 'desc' }
  })
})

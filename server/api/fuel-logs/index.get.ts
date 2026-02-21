import { PrismaClient } from '~/lib/generated/prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async () => {
  return prisma.fuelLog.findMany({
    include: { vehicle: true },
    orderBy: { date: 'desc' }
  })
})

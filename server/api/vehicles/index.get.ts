import { PrismaClient } from '~/lib/generated/prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async () => {
  return prisma.vehicle.findMany({
    orderBy: { createdAt: 'desc' }
  })
})

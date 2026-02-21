import { PrismaClient } from '~/lib/generated/prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async () => {
  return prisma.trip.findMany({
    include: {
      vehicle: true,
      driver: true
    },
    orderBy: { createdAt: 'desc' }
  })
})

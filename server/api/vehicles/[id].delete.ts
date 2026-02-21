import { PrismaClient } from '~/lib/generated/prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  if (!id) throw createError({ statusCode: 400, message: 'Vehicle ID required' })

  await prisma.vehicle.delete({
    where: { id }
  })

  return { message: 'Vehicle deleted' }
})

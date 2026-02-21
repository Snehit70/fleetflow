import { PrismaClient } from '~/lib/generated/prisma/client'
import { requireRole } from '~/server/utils/api-auth'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  requireRole(event, ['MANAGER', 'SAFETY_OFFICER'])
  const id = event.context.params?.id
  if (!id) throw createError({ statusCode: 400, message: 'Driver ID required' })

  await prisma.driver.delete({
    where: { id }
  })

  return { message: 'Driver deleted' }
})

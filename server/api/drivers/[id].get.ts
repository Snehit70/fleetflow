import { PrismaClient } from '~/lib/generated/prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  if (!id) throw createError({ statusCode: 400, message: 'Driver ID required' })

  const driver = await prisma.driver.findUnique({
    where: { id }
  })

  if (!driver) throw createError({ statusCode: 404, message: 'Driver not found' })

  return driver
})

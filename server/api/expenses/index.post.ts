import { PrismaClient } from '~/lib/generated/prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { vehicleId, category, amount, description, date } = body

  if (!vehicleId || !category || !amount) {
    throw createError({ statusCode: 400, message: 'Missing required fields: vehicleId, category, amount' })
  }

  // Check if vehicle exists
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: vehicleId }
  })

  if (!vehicle) throw createError({ statusCode: 404, message: 'Vehicle not found' })

  await prisma.expense.create({
    data: {
      vehicleId,
      category,
      amount: parseFloat(amount),
      description: description || null,
      date: date ? new Date(date) : new Date()
    }
  })

  return { message: 'Expense created' }
})

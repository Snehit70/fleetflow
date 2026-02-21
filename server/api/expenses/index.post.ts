import { prisma } from '#server/utils/prisma'
import { requireRole } from '#server/utils/api-auth'

export default defineEventHandler(async (event) => {
  requireRole(event, ['MANAGER', 'FINANCIAL_ANALYST'])
  const body = await readBody(event)

  const { vehicleId, category, amount, description, date } = body

  if (!vehicleId || !category || amount == null) {
    throw createError({ statusCode: 400, message: 'Missing required fields: vehicleId, category, amount' })
  }

  const parsedAmount = parseFloat(amount)
  if (isNaN(parsedAmount)) {
    throw createError({ statusCode: 400, message: 'Amount must be a valid number' })
  }

  // Check if vehicle exists
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: vehicleId }
  })

  if (!vehicle) throw createError({ statusCode: 404, message: 'Vehicle not found' })

  const parsedDate = date ? new Date(date) : new Date()
  if (isNaN(parsedDate.getTime())) {
    throw createError({ statusCode: 400, message: 'Invalid date format' })
  }

  await prisma.expense.create({
    data: {
      vehicleId,
      category,
      amount: parsedAmount,
      description: description || null,
      date: parsedDate
    }
  })

  return { message: 'Expense created' }
})

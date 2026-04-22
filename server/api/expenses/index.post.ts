import { prisma } from '#server/utils/prisma'
import { requireRole } from '#server/utils/api-auth'
import { expenseCreateSchema } from '#server/utils/schemas'
import { parseRequestBody } from '#server/utils/validation'

export default defineEventHandler(async (event) => {
  requireRole(event, ['MANAGER', 'FINANCIAL_ANALYST'])
  const { vehicleId, category, amount, description, date } = await parseRequestBody(event, expenseCreateSchema)

  // Check if vehicle exists
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: vehicleId }
  })

  if (!vehicle) throw createError({ statusCode: 404, message: 'Vehicle not found' })

  await prisma.expense.create({
    data: {
      vehicleId,
      category,
      amount,
      description: description || null,
      date: date || new Date()
    }
  })

  return { message: 'Expense created' }
})

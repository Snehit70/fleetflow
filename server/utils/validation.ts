import { createError, readBody, type H3Event } from 'h3'
import { ZodError, type ZodType } from 'zod'

export async function parseRequestBody<T>(event: H3Event, schema: ZodType<T>): Promise<T> {
  try {
    return await schema.parseAsync(await readBody(event))
  } catch (error) {
    if (error instanceof ZodError) {
      throw createError({
        statusCode: 400,
        message: error.issues[0]?.message ?? 'Invalid request body',
        data: {
          issues: error.issues,
        },
      })
    }

    throw error
  }
}

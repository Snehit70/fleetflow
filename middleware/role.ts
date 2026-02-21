export default defineEventHandler(async (event) => {
  const user = event.context.user as { role: string } | undefined

  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const requiredRoles = event.context.pageMeta?.roles as string[] | undefined

  if (requiredRoles && !requiredRoles.includes(user.role)) {
    throw createError({ statusCode: 403, message: 'Forbidden' })
  }
})

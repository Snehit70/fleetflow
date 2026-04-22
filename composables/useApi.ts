/**
 * Authenticated $fetch wrapper
 * Relies on same-origin HttpOnly auth cookie.
 */
export const useApi = () => {
  const api = $fetch.create({
    credentials: 'include'
  })

  return api
}

/**
 * Global authenticated fetch - can be used directly
 */
export const $api = <T>(url: string, options?: Parameters<typeof $fetch>[1]) => {
  return $fetch<T>(url, {
    credentials: 'include',
    ...options,
  })
}

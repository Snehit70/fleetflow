/**
 * Authenticated $fetch wrapper
 * Automatically adds Authorization header from auth cookie
 */
export const useApi = () => {
  const tokenCookie = useCookie('auth')

  const api = $fetch.create({
    onRequest({ options }) {
      if (tokenCookie.value) {
        options.headers = {
          ...options.headers,
          authorization: `Bearer ${tokenCookie.value}`
        }
      }
    }
  })

  return api
}

/**
 * Global authenticated fetch - can be used directly
 */
export const $api = <T>(url: string, options?: Parameters<typeof $fetch>[1]) => {
  const tokenCookie = useCookie('auth')
  
  return $fetch<T>(url, {
    ...options,
    headers: {
      ...options?.headers,
      ...(tokenCookie.value ? { authorization: `Bearer ${tokenCookie.value}` } : {})
    }
  })
}

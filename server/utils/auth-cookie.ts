import { deleteCookie, setCookie } from 'h3'

export const AUTH_COOKIE_NAME = 'auth'
const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7

function getCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: AUTH_COOKIE_MAX_AGE,
  }
}

export function setAuthCookie(event: Parameters<typeof setCookie>[0], token: string) {
  setCookie(event, AUTH_COOKIE_NAME, token, getCookieOptions())
}

export function clearAuthCookie(event: Parameters<typeof deleteCookie>[0]) {
  deleteCookie(event, AUTH_COOKIE_NAME, { path: '/' })
}

import jwt from 'jsonwebtoken'

export function signToken(payload: { userId: string; role: string }) {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET || 'fleetflow-secret-key-change-in-production',
    { expiresIn: '7d' }
  )
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(
      token,
      process.env.JWT_SECRET || 'fleetflow-secret-key-change-in-production'
    ) as { userId: string; role: string }
  } catch {
    return null
  }
}

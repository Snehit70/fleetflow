import jwt from 'jsonwebtoken'

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET environment variable is required')
  return secret
}

export function signToken(payload: { userId: string; role: string }) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: '7d' })
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, getJwtSecret()) as { userId: string; role: string }
  } catch {
    return null
  }
}

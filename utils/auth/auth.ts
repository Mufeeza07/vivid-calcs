import jwt from 'jsonwebtoken'

export const getUserFromToken = (token: string) => {
  if (!token) throw new Error('Authorization token missing')

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string
      name: string
      email: string
    }

    if (decoded && decoded.userId) {
      return decoded
    } else {
      throw new Error('Invalid token structure: userId is missing')
    }
  } catch (error) {
    throw new Error('Token verification failed: ' + error)
  }
}

import { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import prisma from '../../../prisma/client'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    try {
      const user = await prisma.user.findUnique({
        where: { email }
      })

      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' })
      }

      const isPasswordValid = await bcrypt.compare(password, user.password)
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid email or password' })
      }

      const token = jwt.sign(
        {
          userId: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        process.env.JWT_SECRET!
      )

      res.status(200).json({
        message: 'Login successful',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token
      })
    } catch (error) {
      console.error('Login error:', error)
      res.status(500).json({ error: 'Something went wrong. Please try again.' })
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' })
  }
}

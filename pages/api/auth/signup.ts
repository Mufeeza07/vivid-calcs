import { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcrypt'
import prisma from '../../../prisma/client'
import jwt from 'jsonwebtoken'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' })
    }

    try {
      const existingUser = await prisma.user.findUnique({
        where: { email }
      })

      if (existingUser) {
        return res.status(400).json({ error: 'Email already exists' })
      }

      const hashedPassword = await bcrypt.hash(password, 12)


      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: 'USER',
        }
      })


      const token = jwt.sign(
        { userId: newUser.id, name: newUser.name, email: newUser.email },
        process.env.JWT_SECRET!
      )

      res.status(201).json({
        message: 'User created successfully',
        user: {
          userId: newUser.id,
          name: newUser.name,
          email: newUser.email,
        },
        token
      })
    } catch (error) {
      console.error('Signup error:', error)
      res.status(500).json({ error: 'Something went wrong. Please try again.' })
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' })
  }
}

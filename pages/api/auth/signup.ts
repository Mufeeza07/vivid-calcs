import { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcrypt'
import prisma from '../../../prisma/client'
import jwt from 'jsonwebtoken'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { name, email, password, role } = req.body

    // Validate inputs
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'All fields are required' })
    }

    try {
      // Check if the email already exists
      const existingUser = await prisma.user.findUnique({
        where: { email }
      })

      if (existingUser) {
        return res.status(400).json({ error: 'Email already exists' })
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 12)

      // Create the new user
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role
        }
      })

      // Generate a JWT token (optional)
      const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET!, {
        expiresIn: '1h'
      })

      // Send a success response
      res.status(201).json({ message: 'User created successfully', token })
    } catch (error) {
      console.error('Signup error:', error)
      res.status(500).json({ error: 'Something went wrong. Please try again.' })
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' })
  }
}

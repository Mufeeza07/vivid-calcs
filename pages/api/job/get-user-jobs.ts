import { getUserFromToken } from '@/utils/auth'
import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../prisma/client'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.status(401).json({ message: 'Authorization token is missing' })
    }

    const user = getUserFromToken(token)

    if (!user || !user.userId) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const jobs = await prisma.job.findMany({
      where: {
        userId: user.userId
      }
    })

    res.status(200).json({ message: 'Jobs retrieved successfully', jobs })
  } catch (error) {
    console.error('Error retrieving jobs:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

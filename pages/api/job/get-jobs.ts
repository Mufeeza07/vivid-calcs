import prisma from '@/prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  try {
    const token = req.headers.authorization?.split('')[1]

    if (!token) {
      return res.status(401).json({ message: 'Authorization token is missing' })
    }

    const jobs = await prisma.job.findMany()

    res.status(200).json({ message: 'All jobs retrieved successfully', jobs })
  } catch (error) {
    console.error('Error fetching jobs', error)
    res.status(500).json({ error: 'Something went wrong. Please try again.' })
  }
}

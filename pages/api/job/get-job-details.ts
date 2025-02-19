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
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      return res.status(401).json({ message: 'Authorization token is missing' })
    }

    const { jobId } = req.query

    if (!jobId || typeof jobId !== 'string') {
      return res.status(400).json({ message: 'Job ID is required ' })
    }

    const job = await prisma.job.findUnique({
      where: { jobId },
      include: {
        nails: true,
        boltStrength: true,
        weld: true,
        soilAnalysis: true,
        beamAnalysis: true,
        slabAnalysis: true,
        screwStrength: true
      }
    })

    if (!job) {
      return res.status(404).json({ message: 'Job not found' })
    }

    res.status(200).json({ message: 'Job details retrieved successfully', job })
  } catch (error) {
    console.error('Error fetching job details:', error)
    res.status(500).json({ error: 'Something went wrong. Please try again.' })
  }
}

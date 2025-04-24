import prisma from '@/prisma/client'
import { getUserFromToken } from '@/utils/auth'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  try {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const user = getUserFromToken(token)

    if (!user || !user.userId) {
      return res.status(401).json({ message: 'Invalid or expired token' })
    }

    const { jobId } = req.query

    if (!jobId || typeof jobId !== 'string') {
      return res.status(400).json({ message: 'Job ID is required' })
    }

    const updateData = {
      ...req.body,
      lastEditedBy: user.name
    }

    const updatedJob = await prisma.job.update({
      where: { jobId },
      data: updateData
    })

    res
      .status(200)
      .json({ message: 'Job details updated successfully', job: updatedJob })
  } catch (error) {
    console.error('Error updating job details:', error)
    res.status(500).json({ error: 'Something went wrong. Please try again.' })
  }
}

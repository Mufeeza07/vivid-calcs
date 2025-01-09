import prisma from '@/prisma/client'
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
      return res.status(401).json({ message: 'Authorization token is missing' })
    }

    const { jobId } = req.query

    if (!jobId || typeof jobId !== 'string') {
      return res.status(400).json({ message: 'Job ID is required' })
    }

    const job = await prisma.job.findUnique({
      where: { jobId }
    })

    if (!job) {
      return res.status(404).json({ message: 'Job not found' })
    }

    const { address, windSpeed, locationFromCoastline, councilName } = req.body

    const updateData: any = {}
    if (address) updateData.address = address
    if (windSpeed) updateData.windSpeed = windSpeed
    if (locationFromCoastline)
      updateData.locationFromCoastline = locationFromCoastline
    if (councilName) updateData.councilName = councilName

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'No update fields provided' })
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

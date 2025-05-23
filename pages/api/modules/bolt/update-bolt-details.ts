import prisma from '@/prisma/client'
import { getUserFromToken } from '@/utils/auth/auth'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({
      message: 'Method Not Allowed',
      status: 405
    })
  }

  try {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      return res.status(401).json({
        message: 'Unauthorized',
        status: 401
      })
    }

    const user = getUserFromToken(token)

    if (!user || !user.userId) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const { id } = req.query

    if (!id || typeof id !== 'string') {
      return res.status(400).json({
        message: 'Bolt Details ID is required',
        status: 400
      })
    }

    const updateData = req.body
    const updatedBoltDetails = await prisma.boltStrength.update({
      where: { id },
      data: updateData
    })

    await prisma.job.update({
      where: { jobId: updatedBoltDetails.jobId },
      data: {
        lastEditedBy: user.name
      }
    })

    res.status(200).json({
      message: 'Bolt details updated successfully',
      status: 200,
      data: updatedBoltDetails
    })
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server Error',
      status: 500,
      error: error
    })
  }
}

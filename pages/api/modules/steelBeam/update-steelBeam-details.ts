import prisma from '@/prisma/client'
import { getUserFromToken } from '@/utils/auth'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({
      message: 'Method Not Allowed'
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
      return res.status(401).json({
        message: 'Unauthorized'
      })
    }

    const { id } = req.query
    if (!id || typeof id !== 'string') {
      return res.status(400).json({
        message: 'Steel beam ID is required'
      })
    }

    const updateData = req.body
    const updatedSteelBeam = await prisma.steelBeam.update({
      where: { id },
      data: updateData
    })

    await prisma.job.update({
      where: { jobId: updatedSteelBeam.jobId },
      data: {
        lastEditedBy: user.name
      }
    })

    res.status(200).json({
      message: 'Steel Beam updated successfully',
      data: updatedSteelBeam
    })
  } catch (error: any) {
    return res.status(500).json({
      message: error.message || 'Internal Server Error',
      error: error
    })
  }
}

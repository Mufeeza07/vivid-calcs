import prisma from '@/prisma/client'
import { getUserFromToken } from '@/utils/auth'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({
      message: 'Method Not Allowed'
    })
  }

  try {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      return res.status(401).json({
        message: 'Unauthorized'
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
        message: 'ID is required',
        status: 400
      })
    }

    const existingDetails = await prisma.steelBeam.findUnique({
      where: { id }
    })

    if (!existingDetails) {
      return res.status(404).json({
        message: 'Steel beam details not found'
      })
    }

    await prisma.steelBeam.delete({
      where: { id }
    })

    await prisma.job.update({
      where: { jobId: existingDetails.jobId },
      data: {
        lastEditedBy: user.name
      }
    })

    res.status(200).json({
      message: 'Steel beam deleted successfully',
      status: 200
    })
  } catch (error: any) {
    res.status(500).json({
      message: 'Internal Server Error',
      error: error.message
    })
  }
}

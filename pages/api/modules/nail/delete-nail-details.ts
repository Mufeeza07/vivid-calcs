import { NextApiRequest, NextApiResponse } from 'next'

import prisma from '@/prisma/client'
import { getUserFromToken } from '@/utils/auth'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({
      message: 'Method Not Allowed.',
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
      return res.status(401).json({
        message: 'Unauthorized'
      })
    }

    const { id } = req.query
    if (!id || typeof id !== 'string') {
      return res.status(400).json({
        message: 'Bad Request. ID is required',
        status: 400
      })
    }

    const existingDetails = await prisma.nails.findUnique({
      where: {
        id
      }
    })
    if (!existingDetails) {
      return res.status(404).json({
        message: 'Nail details not found',
        status: 404
      })
    }

    await prisma.nails.delete({
      where: { id }
    })

    await prisma.job.update({
      where: { jobId: existingDetails.jobId },
      data: {
        lastEditedBy: user.name
      }
    })

    res.status(200).json({
      message: 'Nail deleted successfully',
      status: 200
    })
  } catch (error: any) {
    res.status(500).json({
      message: 'Internal Server Error',
      status: 500,
      error: error.message
    })
  }
}

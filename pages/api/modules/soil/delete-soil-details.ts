import prisma from '@/prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'DELETE') {
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

    const { id } = req.query

    if (!id || typeof id !== 'string') {
      return res.status(400).json({
        message: 'Soil ID is required',
        status: 400
      })
    }

    const existingDetails = await prisma.soilAnalysis.findUnique({
      where: { id }
    })

    if (!existingDetails) {
      return res.status(404).json({
        message: 'Soil details not found',
        status: 404
      })
    }

    await prisma.soilAnalysis.delete({
      where: { id }
    })

    res.status(200).json({
      message: 'Soil deleted successfully',
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

import prisma from '@/prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'

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
        message: 'Unauthorized.',
        status: 401
      })
    }

    const { id } = req.query

    if (!id || typeof id !== 'string') {
      return res.status(400).json({
        message: 'Bad Request. Weld ID is required.',
        status: 400
      })
    }

    const existingDetails = await prisma.weld.findUnique({
      where: { id }
    })

    if (!existingDetails) {
      return res.status(404).json({
        message: `Weld details not found for ID ${id}.`,
        status: 404
      })
    }

    await prisma.weld.delete({
      where: { id }
    })

    res.status(200).json({
      message: 'Weld deleted successfully.',
      status: 200
    })
  } catch (error: any) {
    return res.status(500).json({
      message: 'Internal Server Error',
      error: error.message
    })
  }
}

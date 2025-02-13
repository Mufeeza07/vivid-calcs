import prisma from '@/prisma/client'
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

    const { screwId } = req.query

    if (!screwId || typeof screwId !== 'string') {
      return res.status(400).json({
        message: 'Screw Details ID is required',
        status: 400
      })
    }
    const parsedId = parseInt(screwId, 10)

    const updateData = req.body
    const updatedScrewDetails = await prisma.screwStrength.update({
      where: { id: parsedId },
      data: updateData
    })

    res.status(200).json({
      message: 'Screw details updated successfully',
      status: 200,
      data: updatedScrewDetails
    })
  } catch (error: any) {
    res.status(500).json({
      message: 'Internal Server Error',
      status: 500,
      error: error.message
    })
  }
}

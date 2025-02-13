import prisma from '@/prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
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

    const { jobId } = req.query

    if (!jobId || typeof jobId !== 'string') {
      return res.status(400).json({
        message: 'Job Id is required ',
        statu: 400
      })
    }

    const screwDetails = await prisma.screwStrength.findMany({
      where: { jobId }
    })

    res.status(200).json({
      message: 'Screw details retrieved successfulyy',
      status: 200,
      data: screwDetails
    })
  } catch (error: any) {
    res.status(500).json({
      message: 'Internal Server Error',
      status: 500,
      error: error.message
    })
  }
}

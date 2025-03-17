import prisma from '@/prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
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
        message: 'Job ID is required',
        status: 400
      })
    }
    const { type, phi, k1, k16, k17, qsk, designStrength, note } = req.body

    if (!type || !phi || !k1 || !k16 || !k17 || !qsk || !designStrength) {
      return res.status(400).json({
        message: 'All fields are required',
        status: 400
      })
    }

    const boltStrength = await prisma.boltStrength.create({
      data: {
        jobId,
        type,
        phi,
        k1,
        k16,
        k17,
        qsk,
        designStrength,
        ...(note && { note })
      }
    })

    res.status(201).json({
      message: 'Bolt Strength saved successfully',
      status: 201,
      data: boltStrength
    })
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error })
  }
}

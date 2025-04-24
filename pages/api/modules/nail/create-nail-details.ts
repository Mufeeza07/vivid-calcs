import prisma from '@/prisma/client'
import { getUserFromToken } from '@/utils/auth'
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
    const user = getUserFromToken(token)

    if (!user || !user.userId) {
      return res.status(401).json({
        message: 'Unauthorized'
      })
    }
    const { jobId } = req.query

    console.log('coming jobId', jobId)

    if (!jobId || typeof jobId !== 'string') {
      return res.status(400).json({
        message: 'Job ID is required',
        status: 400
      })
    }

    const {
      type,
      title,
      category,
      jdType,
      load,
      loadType,
      k13,
      nailDiameter,
      screwJD,
      phi,
      k1,
      k14,
      k16,
      k17,
      designLoad,
      screwPenetration,
      firstTimberThickness,
      note
    } = req.body

    if (
      !type ||
      !k13 ||
      !category ||
      !jdType ||
      !load ||
      !loadType ||
      !nailDiameter ||
      !screwJD ||
      !phi ||
      !k1 ||
      !k14 ||
      !k16 ||
      !k17 ||
      !designLoad ||
      !screwPenetration ||
      !firstTimberThickness
    ) {
      return res.status(400).json({
        message: 'All fields are required',
        status: 400
      })
    }

    const nail = await prisma.nails.create({
      data: {
        jobId,
        title,
        type,
        category,
        jdType,
        load,
        loadType,
        k13,
        nailDiameter,
        screwJD,
        phi,
        k1,
        k14,
        k16,
        k17,
        designLoad,
        screwPenetration,
        firstTimberThickness,
        ...(note && { note })
      }
    })

    await prisma.job.update({
      where: { jobId },
      data: {
        lastEditedBy: user.name
      }
    })

    res.status(201).json({
      message: 'Nail calculations saved successfully',
      status: 201,
      data: nail
    })
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server Error',
      status: 500,
      error: error
    })
  }
}

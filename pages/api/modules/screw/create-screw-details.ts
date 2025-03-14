import prisma from '@/prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      message: 'Methot Not Allowed',
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

    const {
      type,
      screwType,
      category,
      screwSize,
      jdType,
      load,
      loadType,
      phi,
      k1,
      k13,
      k14,
      k16,
      k17,
      screwJD,
      shankDiameter,
      lp,
      qk,
      designLoad,
      screwPenetration,
      firstTimberThickness,
      note
    } = req.body

    if (!type || !screwType || !category) {
      return res.status(400).json({
        message: 'All required fields must be provided',
        status: 400
      })
    }

    const screwStrength = await prisma.screwStrength.create({
      data: {
        jobId,
        type,
        screwType,
        category,
        screwSize,
        jdType,
        load,
        loadType,
        phi,
        k1,
        k13,
        k14,
        k16,
        k17,
        screwJD,
        shankDiameter,
        designLoad,
        screwPenetration,
        firstTimberThickness,
        ...(note && { note }),
        ...(lp && { lp }),
        ...(qk && { qk })
      }
    })

    res.status(201).json({
      message: 'Screw strength calculation saved successfully',
      status: 201,
      data: screwStrength
    })
  } catch (error: any) {
    console.log('error', error.message)
    return res.status(500).json({
      message: 'Internal Server Error',
      status: 500,
      error: error.message
    })
  }
}

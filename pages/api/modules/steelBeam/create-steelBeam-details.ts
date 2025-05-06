import prisma from '@/prisma/client'
import { getUserFromToken } from '@/utils/auth/auth'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
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

    const { jobId } = req.query

    if (!jobId || typeof jobId !== 'string') {
      return res.status(400).json({
        message: 'Job ID is required'
      })
    }

    const {
      title,
      beamSpan,
      floorLoadWidth,
      roofLoadWidth,
      wallHeight,
      pointFloorLoadArea,
      pointRoofLoadArea,
      floorDeadLoad,
      roofDeadLoad,
      floorLiveLoad,
      wallLoad,
      steelUdlWeight,
      steelPointWeight,
      udlDeadLoad,
      udlLiveLoad,
      udlServiceLoad,
      pointDeadLoad,
      pointLiveLoad,
      pointServiceLoad,
      deflectionLimit,
      momentOfInertia,
      moment,
      note
    } = req.body

    const requiredFields = {
      title,
      beamSpan,
      floorLoadWidth,
      roofLoadWidth,
      wallHeight,
      pointFloorLoadArea,
      pointRoofLoadArea,
      floorDeadLoad,
      roofDeadLoad,
      floorLiveLoad,
      wallLoad,
      steelUdlWeight,
      steelPointWeight,
      udlDeadLoad,
      udlLiveLoad,
      udlServiceLoad,
      pointDeadLoad,
      pointLiveLoad,
      pointServiceLoad,
      deflectionLimit,
      momentOfInertia,
      moment
    }

    const missingFields = Object.entries(requiredFields)
      .filter(
        ([_, value]) => value === undefined || value === null || value === ''
      )
      .map(([key]) => key)

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: 'Missing required fields',
        missingFields
      })
    }

    const steelBeam = await prisma.steelBeam.create({
      data: {
        jobId,
        title,
        beamSpan,
        floorLoadWidth,
        roofLoadWidth,
        wallHeight,
        pointFloorLoadArea,
        pointRoofLoadArea,
        floorDeadLoad,
        roofDeadLoad,
        floorLiveLoad,
        wallLoad,
        steelUdlWeight,
        steelPointWeight,
        udlDeadLoad,
        udlLiveLoad,
        udlServiceLoad,
        pointDeadLoad,
        pointLiveLoad,
        pointServiceLoad,
        deflectionLimit,
        momentOfInertia,
        moment,
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
      message: 'Steel beam saved successfully',
      data: steelBeam
    })
  } catch (error: any) {
    return res.status(500).json({
      message: error.message || 'Internal Server Error'
    })
  }
}

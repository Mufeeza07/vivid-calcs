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

    const {
      type,
      frictionAngle,
      safetyFactor,
      ks,
      soilDensity,
      pileHeight,
      factor,
      pileDiameter,
      frictionResistanceAS,
      frictionResistanceMH,
      weight,
      cohension,
      nq,
      nc,
      reductionStrength,
      endBearing,
      totalUpliftResistance,
      totalPileCapacityAS,
      totalPileCapacityMH
    } = req.body

    if (
      !type ||
      frictionAngle === undefined ||
      safetyFactor === undefined ||
      ks === undefined ||
      soilDensity === undefined ||
      pileHeight === undefined ||
      factor === undefined ||
      pileDiameter === undefined ||
      frictionResistanceAS === undefined ||
      frictionResistanceMH === undefined ||
      weight === undefined ||
      cohension === undefined ||
      nq === undefined ||
      nc === undefined ||
      reductionStrength === undefined ||
      endBearing === undefined
    ) {
      return res.status(400).json({
        message: 'All required fields must be provided',
        status: 400
      })
    }

    const pileDesign = await prisma.pileAnalysis.create({
      data: {
        jobId,
        type,
        frictionAngle: parseFloat(frictionAngle),
        safetyFactor,
        ks,
        soilDensity,
        pileHeight,
        factor,
        pileDiameter,
        frictionResistanceAS,
        frictionResistanceMH,
        weight,
        cohension,
        nq,
        nc,
        reductionStrength,
        endBearing,
        totalUpliftResistance,
        totalPileCapacityAS,
        totalPileCapacityMH
      }
    })

    res.status(201).json({
      message: 'Pile design analysis saved successfully',
      status: 201,
      data: pileDesign
    })
  } catch (error: any) {
    return res.status(500).json({
      message: 'Internal Server Error',
      status: 500,
      error: error.message
    })
  }
}

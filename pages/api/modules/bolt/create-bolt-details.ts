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
      return res.status(401).json({ message: 'Unauthorized' })
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
      title,
      phi,
      k1,
      k16,
      k17,
      qsk,
      designStrength,
      note,
      category,
      load,
      loadType,
      jdType,
      boltSize,
      timberThickness
    } = req.body

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
        title,
        phi,
        k1,
        k16,
        k17,
        qsk,
        designStrength,
        ...(category && { category }),
        ...(load && { load }),
        ...(loadType && { loadType }),
        ...(jdType && { jdType }),
        ...(boltSize && { boltSize }),
        ...(timberThickness && { timberThickness }),
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
      message: 'Bolt Strength saved successfully',
      status: 201,
      data: boltStrength
    })
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error })
  }
}

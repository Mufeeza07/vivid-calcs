import { getUserFromToken } from '@/utils/auth/auth'
import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../prisma/client'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  try {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const user = getUserFromToken(token)

    if (!user || !user.userId) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const {
      address,
      windCategory,
      windSpeed,
      locationFromCoastline,
      councilName,
      area
    } = req.body

    if (
      !address ||
      !windCategory ||
      !windSpeed ||
      !locationFromCoastline ||
      !councilName
    ) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    const job = await prisma.job.create({
      data: {
        address,
        windCategory,
        windSpeed,
        locationFromCoastline,
        councilName,
        area,
        createdBy: user.name,
        lastEditedBy: null,
        userId: user.userId
      }
    })

    res.status(201).json({ message: 'Job created successfully', job })
  } catch (error) {
    console.error('Error creating job:', error)
    res.status(500).json({ message: 'Internal Server Error', error: error })
  }
}

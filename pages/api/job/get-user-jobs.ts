/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from '@/prisma/client'
import { getUserFromToken } from '@/utils/auth'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
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

    const { page, limit, status } = req.query

    const pageNumber = parseInt(page as string) || 1
    const limitNumber = parseInt(limit as string) || 10

    const skip = (pageNumber - 1) * limitNumber

    const filter: any = {
      OR: [
        { userId: user.userId },
        { jobCollaborators: { some: { userId: user.userId } } }
      ]
    }

    if (status) {
      filter.status = status
    }

    const [jobs, totalJobs] = await Promise.all([
      prisma.job.findMany({
        where: filter,
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limitNumber
      }),
      prisma.job.count({
        where: filter
      })
    ])

    const totalPages = Math.ceil(totalJobs / limitNumber)

    res.status(200).json({
      message: 'Jobs retrieved successfully',
      jobs,
      pagination: {
        currentPage: pageNumber,
        totalPages,
        totalJobs
      }
    })
  } catch (error) {
    console.error('Error retrieving jobs:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

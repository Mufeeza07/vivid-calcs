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

    const { page, limit, status, sortBy, noPagination } = req.query

    const pageNumber = parseInt(page as string) || 1
    const limitNumber = parseInt(limit as string) || 10

    const shouldPaginate = noPagination !== 'true'

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

    const sort = (sortBy as string) || 'createdAt'

    const jobs = await prisma.job.findMany({
      where: filter,
      orderBy: {
        [sort]: 'desc'
      },
      ...(shouldPaginate && {
        skip,
        take: limitNumber
      })
    })

    const totalJobs = await prisma.job.count({ where: filter })
    const totalPages = Math.ceil(totalJobs / limitNumber)

    if (shouldPaginate) {
      res.status(200).json({
        message: 'Jobs retrieved successfully',
        jobs,
        pagination: {
          currentPage: pageNumber,
          totalPages: Math.ceil(totalJobs / limitNumber),
          totalJobs
        }
      })
    } else {
      res.status(200).json({
        message: 'Jobs retrieved successfully',
        jobs
      })
    }
  } catch (error) {
    console.error('Error retrieving jobs:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

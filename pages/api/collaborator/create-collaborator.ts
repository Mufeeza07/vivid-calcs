import prisma from '@/prisma/client'
import { Permission } from '@prisma/client'
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

    const { jobId, collaborators } = req.body

    if (!jobId || !Array.isArray(collaborators) || collaborators.length === 0) {
      return res
        .status(400)
        .json({ message: 'jobId and collaborators are required' })
    }
    const data = collaborators.map((userId: string) => ({
      jobId,
      userId,
      permission: Permission.VIEWER
    }))

    await prisma.jobCollaborator.createMany({
      data,
      skipDuplicates: true
    })

    return res.status(200).json({ message: 'Collaborators added successfully' })
  } catch (error) {
    console.error('Error adding collaborators:', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

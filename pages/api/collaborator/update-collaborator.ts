import prisma from '@/prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({
      message: 'Method Not Allowed'
    })
  }

  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.status(401).json({
        message: 'Unauthorized'
      })
    }

    const { jobId, updatingCollaborators } = req.body

    if (!jobId || !Array.isArray(updatingCollaborators)) {
      return res.status(400).json({
        message: 'JobId and collaborators are required'
      })
    }

    const updatedCollaborators = await prisma.$transaction(
      updatingCollaborators.map(({ collaboratorId, permission }) =>
        prisma.jobCollaborator.update({
          where: { id: collaboratorId },
          data: { permission }
          //   include: {
          //     user: {
          //       select: {
          //         name: true,
          //         email: true,
          //         role: true
          //       }
          //     }
          //   }
        })
      )
    )

    return res.status(200).json({
      message: 'Permissions updated successfully',
      updatedData: updatedCollaborators
    })
  } catch (error: any) {
    console.error('Error updating collaborator permissions:', error)
    return res.status(500).json({
      message: 'Internal Server Error',
      error: error.message
    })
  }
}

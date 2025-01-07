import prisma from '@/prisma/client'
import { getUserFromToken } from '@/utils/auth'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  try {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      return res.status(401).json({ message: 'Authorization token is missing' })
    }

    const user = getUserFromToken(token)

    const { jobIds } = req.body

    const jobIdsToDelete = Array.isArray(jobIds) ? jobIds : [jobIds]

    if (jobIdsToDelete.length === 0) {
      return res.status(400).json({ message: 'No job IDs provided' })
    }

    const deletedJobs = await prisma.job.deleteMany({
      where: {
        jobId: { in: jobIdsToDelete },
        userId: user.userId
      }
    })

    if (deletedJobs.count === 0) {
      return res.status(404).json({ message: 'No jobs found for deletion' })
    }

    res.status(200).json({ message: 'Deleted successfully' })
  } catch (error) {
    console.error('Error deleting job(s):', error)
    res.status(500).json({ message: 'Internal Server Error', error: error })
  }
}

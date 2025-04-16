import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/prisma/client'
import { Role } from '@prisma/client' // Make sure to import the Role enum

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  try {
    const roleParam = req.query.role
    const roles = Array.isArray(roleParam)
      ? roleParam
      : roleParam
        ? [roleParam]
        : undefined

    const roleFilters = roles?.filter((r): r is Role =>
      Object.values(Role).includes(r as Role)
    )

    const users = await prisma.user.findMany({
      where: roleFilters?.length ? { role: { in: roleFilters } } : undefined,
      orderBy: { createdAt: 'desc' }
    })

    res.status(200).json({
      message: 'Users fetched successfully',
      users
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

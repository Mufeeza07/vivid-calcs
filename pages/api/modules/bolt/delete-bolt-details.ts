import prisma from '@/prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'DELETE') {
        return res.status(405).json({
            message: "Method Not Allowed",
            status: 405
        })
    }

    try {
        const token = req.headers.authorization?.split(' ')[1]

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized",
                status: 401
            })
        }

        const { boltId } = req.query
        if (!boltId) {
            return res.status(400).json({
                message: "Bolt Details ID is required",
                status: 400
            })
        }
        const parsedId = parseInt(boltId as string, 10);

        const existingDetails = await prisma.boltStrength.findUnique({
            where: { id: parsedId }
        })

        if (!existingDetails) {
            return res.status(404).json({
                message: "Bolt details not found",
                status: 404
            })
        }

        await prisma.boltStrength.delete({
            where: { id: parsedId }
        })

        res.status(200).json({
            message: "Bolt deleted successfully",
            status: 200
        })

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            status: 500,
            error: error
        })
    }
}
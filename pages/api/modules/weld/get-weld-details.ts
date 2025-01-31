import prisma from "@/prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: "Method Not Allowed", status: 405, })
    }

    try {
        const token = req.headers.authorization?.split(' ')[1]
        if (!token) {
            return res.status(401).json({ message: "Unauthorized.", status: 401, });
        }

        const { jobId } = req.query

        if (!jobId || typeof jobId !== 'string') {
            return res.status(400).json({
                status: 400,
                message: " Job ID is required.",
            });
        }

        const weldDetails = await prisma.weld.findMany({
            where: { jobId }
        })

        res.status(200).json({
            status: 200,
            message: "Weld details retrieved successfully.",
            data: weldDetails,
        });

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error })
    }
}
import prisma from "@/prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
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

        const { jobId } = req.query

        if (!jobId || typeof jobId !== 'string') {
            return res.status(400).json({
                status: 400,
                message: " Job ID is required.",
            });
        }

        const boltStrengthDetails = await prisma.boltStrength.findMany({
            where: { jobId }
        })

        if (!boltStrengthDetails || boltStrengthDetails.length === 0) {
            return res.status(404).json({
                status: 404,
                message: `No Bolt details found for Job ID ${jobId}.`,
            });
        }

        res.status(200).json({
            status: 200,
            message: "Bolt details retrieved successfully.",
            data: boltStrengthDetails,
        });

    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            status: 500,
            error: error
        })
    }
}
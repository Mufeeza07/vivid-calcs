import prisma from "@/prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' })
    }
    try {
        const token = req.headers.authorization?.split('')[1];

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        const { jobId } = req.query

        if (!jobId || typeof jobId !== 'string') {
            return res.status(400).json({ message: 'Job ID is required' })
        }
        const {
            type,
            phi,
            k1,
            k16,
            k17,
            qsk,
            designStrength
        } = req.body;

        if (!type || !phi || !k1 || !k16 || !k17 || !qsk || !designStrength) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const boltStrength = await prisma.boltStrength.create({
            data: {
                jobId,
                type,
                phi,
                k1,
                k16,
                k17,
                qsk,
                designStrength

            }
        })

        res.status(201).json({ message: 'Bolt Strength saved successfully', boltStrength })

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error })
    }

}
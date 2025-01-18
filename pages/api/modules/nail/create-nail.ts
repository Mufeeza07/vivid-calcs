import prisma from "@/prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: "Method Not Allowed" })
    }

    try {
        const token = req.headers.authorization?.split('')[1];

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        const { jobId } = req.query;


        console.log('coming jobId', jobId)

        if (!jobId || typeof jobId !== 'string') {
            return res.status(400).json({ message: 'Job ID is required' })
        }

        const {
            type,
            k13,
            diameter,
            screwJD,
            phi,
            k1,
            k14,
            k16,
            k17,
            designLoad,
            screwPenetration,
            firstTimberThickness
        } = req.body

        if (!type || !k13 || !diameter || !screwJD || !phi || !k1 || !k14 || !k16 || !k17 || !designLoad || !screwPenetration || !firstTimberThickness) {
            return res.status(400).json({ message: 'All fields are required' })
        }


        const nail = await prisma.nails.create({
            data: {
                jobId,
                type,
                k13,
                diameter,
                screwJD,
                phi,
                k1,
                k14,
                k16,
                k17,
                designLoad,
                screwPenetration,
                firstTimberThickness
            }
        })

        res.status(201).json({ message: 'Nail calculations saved successfully', nail })

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error })
    }



}
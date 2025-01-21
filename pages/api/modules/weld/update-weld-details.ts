import prisma from "@/prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PATCH') {
        return res.status(405).json({ message: 'Method Not Allowed', status: 401 })
    }

    try {

        const token = req.headers.authorization?.split('')[1]

        if (!token) {
            return res.status(401).json({
                message: 'Unauthorized', status: 401
            })
        }

        const { weldId } = req.query


        console.log('checking format of coming id', weldId)
        if (!weldId || typeof weldId !== 'string') {
            return res.status(400).json({
                message: 'Weld Details ID is required', status: 400
            })
        }

        const parsedWeldId = parseInt(weldId, 10);

        const updateData = req.body

        const updatedWeldDetails = await prisma.weld.update({
            where: { id: parsedWeldId },
            data: updateData,
        });

        res.status(200).json({
            status: 200,
            message: "Weld updated successfully.",
            data: updatedWeldDetails,
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', status: 500, error: error })
    }
}
import prisma from "@/prisma/client";
import { NextApiRequest, NextApiResponse } from "next";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({
            message: "Method Not Allowed",
            status: 405
        })
    }

    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                message: 'Unauthorized',
                status: 401
            })


        }

        const { jobId } = req.query

        if (!jobId || typeof jobId !== 'string') {
            return res.status(400).json({
                message: 'Job ID is required',
                status: 404
            })
        }
        const {
            type,
            phi,
            vw,
            fuw,
            tt,
            kr,
            strength
        } = req.body;

        if (!type || !phi || !vw || !tt || !fuw || !kr || !strength) {
            return res.status(400).json({
                message: 'All fields are required',
                status: 400
            });
        }

        const weld = await prisma.weld.create({
            data: {
                jobId,
                type,
                phi,
                vw,
                tt,
                fuw,
                kr,
                strength
            }
        })

        res.status(201).json({
            message: 'Weld saved successfully',
            status: 201,
            data: weld
        })

    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            status: 500,
            error: error
        })
    }
}
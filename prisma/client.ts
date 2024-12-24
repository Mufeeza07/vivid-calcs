import { PrismaClient } from '@prisma/client'

// Create a new instance of PrismaClient
const prisma = new PrismaClient()

// Export the instance so it can be used in other files
export default prisma

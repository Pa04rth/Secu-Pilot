

import { PrismaClient } from '@prisma/client'

// Export a single instance of the client for use in other parts of the app.
export const prisma = new PrismaClient()
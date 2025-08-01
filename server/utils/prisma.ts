import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Usa uma instância já existente em desenvolvimento
export const prisma = globalForPrisma.prisma ?? new PrismaClient()

// Evita recriar em modo dev
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma

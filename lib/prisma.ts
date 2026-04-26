// Prisma client — works with or without DB during build
// Run `npm run db:generate` after adding DATABASE_URL

let prisma: any

try {
  const { PrismaClient } = require('@prisma/client')
  const globalForPrisma = globalThis as any
  prisma = globalForPrisma.prisma ?? new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })
  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
} catch {
  // Prisma client not generated yet — run: npm run db:generate
  console.warn('Prisma client not found. Run: npm run db:generate')
  prisma = null
}

export { prisma }
export default prisma

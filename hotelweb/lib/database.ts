import { PrismaClient } from "../generated/prisma"
import { config } from "./config"


const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: config.isDevelopment ? ["query", "error", "warn"] : ["error"],
    datasources: {
      db: {
        url: config.databaseUrl,
      },
    },
  })

if (config.isDevelopment) globalForPrisma.prisma = prisma

// Database connection helper
export async function connectDatabase() {
  try {
    await prisma.$connect()
    console.log("✅ Database connected successfully")
  } catch (error) {
    console.error("❌ Database connection failed:", error)
    throw error
  }
}

// Database disconnect helper
export async function disconnectDatabase() {
  try {
    await prisma.$disconnect()
    console.log("✅ Database disconnected successfully")
  } catch (error) {
    console.error("❌ Database disconnect failed:", error)
  }
}

import { createApiResponse } from "@/lib/utils/api-helpers"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Check database connection with existing data
    const [hotelCount, roomCount] = await Promise.all([prisma.hotel.count(), prisma.room.count()])

    return createApiResponse({
      status: "healthy",
      timestamp: new Date().toISOString(),
      database: "connected",
      environment: process.env.NODE_ENV,
      stats: {
        hotels: hotelCount,
        rooms: roomCount,
      },
    })
  } catch (error) {
    return createApiResponse(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        database: "disconnected",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      503,
    )
  }
}

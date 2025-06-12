import { prisma } from "./prisma"

export async function testDatabaseConnection() {
  try {
    console.log("🔍 Testing database connection...")

    // Test basic connection
    await prisma.$connect()
    console.log("✅ Database connected successfully")

    // Test if tables exist and get counts
    const [hotelCount, roomCount, customerCount] = await Promise.all([
      prisma.hotel.count().catch(() => 0),
      prisma.room.count().catch(() => 0),
      prisma.customer.count().catch(() => 0),
    ])

    console.log("📊 Database Statistics:")
    console.log(`   Hotels: ${hotelCount}`)
    console.log(`   Rooms: ${roomCount}`)
    console.log(`   Customers: ${customerCount}`)

    // Test a simple query
    const sampleHotel = await prisma.hotel.findFirst({
      include: {
        rooms: true,
        amenities: true,
      },
    })

    if (sampleHotel) {
      console.log(`📍 Sample Hotel: ${sampleHotel.name}`)
      console.log(`   Rooms: ${sampleHotel.rooms.length}`)
      console.log(`   Amenities: ${sampleHotel.amenities.length}`)
    }

    return {
      success: true,
      stats: { hotelCount, roomCount, customerCount },
      sampleHotel,
    }
  } catch (error) {
    console.error("❌ Database connection failed:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  } finally {
    await prisma.$disconnect()
  }
}

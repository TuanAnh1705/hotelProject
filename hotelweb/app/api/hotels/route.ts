import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@/generated/prisma"

const prisma = new PrismaClient()

// GET - Fetch all hotels
export async function GET() {
  try {
    const hotels = await prisma.hotel.findMany({
      orderBy: {
        id: "desc",
      },
    })

    return NextResponse.json(hotels)
  } catch (error) {
    console.error("Error fetching hotels:", error)
    return NextResponse.json({ error: "Failed to fetch hotels" }, { status: 500 })
  }
}

// POST - Create new hotel
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, address, city, rating, imageUrl } = body

    // Validate required fields
    if (!name || !address || !city || !rating) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const hotel = await prisma.hotel.create({
      data: {
        name,
        address,
        city,
        rating: Number.parseFloat(rating),
        imageUrl: imageUrl || null,
      },
    })

    return NextResponse.json(hotel, { status: 201 })
  } catch (error) {
    console.error("Error creating hotel:", error)
    return NextResponse.json({ error: "Failed to create hotel" }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@/generated/prisma"

const prisma = new PrismaClient()

// GET - Fetch single hotel
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const {id}= await params
    const hotelId = Number(id)

    if (isNaN(hotelId)) {
      return NextResponse.json({ error: "Invalid hotel ID" }, { status: 400 })
    }

    const hotel = await prisma.hotel.findUnique({
      where: {
        id: hotelId,
      },
    })

    if (!hotel) {
      return NextResponse.json({ error: "Hotel not found" }, { status: 404 })
    }

    return NextResponse.json(hotel)
  } catch (error) {
    console.error("Error fetching hotel:", error)
    return NextResponse.json({ error: "Failed to fetch hotel" }, { status: 500 })
  }
}

// PUT - Update hotel
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const {id}= await params
    const hotelId = Number(id)

    if (isNaN(hotelId)) {
      return NextResponse.json({ error: "Invalid hotel ID" }, { status: 400 })
    }

    const body = await request.json()
    const { name, address, city, rating, imageUrl } = body

    // Check if hotel exists
    const existingHotel = await prisma.hotel.findUnique({
      where: { id: hotelId },
    })

    if (!existingHotel) {
      return NextResponse.json({ error: "Hotel not found" }, { status: 404 })
    }

    const hotel = await prisma.hotel.update({
      where: {
        id: hotelId,
      },
      data: {
        name: name || existingHotel.name,
        address: address || existingHotel.address,
        city: city || existingHotel.city,
        rating: rating ? Number.parseFloat(rating) : existingHotel.rating,
        imageUrl: imageUrl !== undefined ? imageUrl : existingHotel.imageUrl,
      },
    })

    return NextResponse.json(hotel)
  } catch (error) {
    console.error("Error updating hotel:", error)
    return NextResponse.json({ error: "Failed to update hotel" }, { status: 500 })
  }
}

// DELETE - Delete hotel
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const hotelId = Number.parseInt(params.id)

    if (isNaN(hotelId)) {
      return NextResponse.json({ error: "Invalid hotel ID" }, { status: 400 })
    }

    // Check if hotel exists
    const existingHotel = await prisma.hotel.findUnique({
      where: { id: hotelId },
    })

    if (!existingHotel) {
      return NextResponse.json({ error: "Hotel not found" }, { status: 404 })
    }

    // Check for related records (rooms, reviews, etc.)
    const relatedRooms = await prisma.room.count({
      where: { hotelId: hotelId },
    })

    if (relatedRooms > 0) {
      return NextResponse.json(
        { error: "Cannot delete hotel with existing rooms. Please delete all rooms first." },
        { status: 400 },
      )
    }

    await prisma.hotel.delete({
      where: {
        id: hotelId,
      },
    })

    return NextResponse.json({ message: "Hotel deleted successfully" })
  } catch (error) {
    console.error("Error deleting hotel:", error)
    return NextResponse.json({ error: "Failed to delete hotel" }, { status: 500 })
  }
}

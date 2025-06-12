/* eslint-disable @typescript-eslint/no-unused-vars */
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const hotel = await prisma.hotel.findUnique({
      where: { id: Number.parseInt(params.id) },
      include: {
        rooms: {
          include: {
            roomType: true,
            amenities: {
              include: {
                amenity: true,
              },
            },
          },
        },
        amenities: {
          include: {
            amenity: true,
          },
        },
        reviews: true,
      },
    })

    if (!hotel) {
      return NextResponse.json({ error: "Hotel not found" }, { status: 404 })
    }

    return NextResponse.json(hotel)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch hotel" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { name, address, city, rating, amenityIds } = body

    // Delete existing amenity links
    await prisma.hotelAmenitiesLink.deleteMany({
      where: { hotelId: Number.parseInt(params.id) },
    })

    const hotel = await prisma.hotel.update({
      where: { id: Number.parseInt(params.id) },
      data: {
        name,
        address,
        city,
        rating: Number.parseFloat(rating),
        amenities: {
          create:
            amenityIds?.map((amenityId: number) => ({
              amenityId,
            })) || [],
        },
      },
      include: {
        amenities: {
          include: {
            amenity: true,
          },
        },
      },
    })

    return NextResponse.json(hotel)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update hotel" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.hotel.delete({
      where: { id: Number.parseInt(params.id) },
    })
    return NextResponse.json({ message: "Hotel deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete hotel" }, { status: 500 })
  }
}

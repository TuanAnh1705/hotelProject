/* eslint-disable @typescript-eslint/no-unused-vars */
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const rooms = await prisma.room.findMany({
      include: {
        hotel: true,
        roomType: true,
        amenities: {
          include: {
            amenity: true,
          },
        },
      },
    })
    return NextResponse.json(rooms)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch rooms" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { hotelId, roomTypeId, price, availability, amenityIds } = body

    const room = await prisma.room.create({
      data: {
        hotelId: hotelId ? Number.parseInt(hotelId) : null,
        roomTypeId: Number.parseInt(roomTypeId),
        price: Number.parseFloat(price),
        availability: availability === "true",
        amenities: {
          create:
            amenityIds?.map((amenityId: number) => ({
              amenityId,
            })) || [],
        },
      },
      include: {
        hotel: true,
        roomType: true,
        amenities: {
          include: {
            amenity: true,
          },
        },
      },
    })

    return NextResponse.json(room)
  } catch (error) {
    return NextResponse.json({ error: "Failed to create room" }, { status: 500 })
  }
}

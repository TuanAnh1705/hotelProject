/* eslint-disable @typescript-eslint/no-unused-vars */
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const roomId = Number.parseInt(params.id)

    if (isNaN(roomId)) {
      return NextResponse.json({ error: "Invalid room ID" }, { status: 400 })
    }

    const room = await prisma.room.findUnique({
      where: {
        id: roomId,
      },
      include: {
        hotel: true,
        amenities: {
          include: {
            amenity: true,
          },
        },
      },
    })

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 })
    }

    return NextResponse.json(room)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch room" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const roomId = Number.parseInt(params.id)

    if (isNaN(roomId)) {
      return NextResponse.json({ error: "Invalid room ID" }, { status: 400 })
    }

    const body = await req.json()
    const { hotelId, roomType, price, imageUrl, availability } = body

    // Check if room exists
    const existingRoom = await prisma.room.findUnique({
      where: { id: roomId },
    })

    if (!existingRoom) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 })
    }

    const updatedRoom = await prisma.room.update({
      where: {
        id: roomId,
      },
      data: {
        ...(hotelId !== undefined && { hotelId: Number.parseInt(hotelId) }),
        ...(roomType !== undefined && { roomType }),
        ...(price !== undefined && { price: Number.parseFloat(price) }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(availability !== undefined && { availability }),
      },
      include: {
        hotel: true,
        amenities: {
          include: {
            amenity: true,
          },
        },
      },
    })

    return NextResponse.json(updatedRoom)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update room" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const roomId = Number.parseInt(params.id)

    if (isNaN(roomId)) {
      return NextResponse.json({ error: "Invalid room ID" }, { status: 400 })
    }

    // Check if room exists
    const existingRoom = await prisma.room.findUnique({
      where: { id: roomId },
    })

    if (!existingRoom) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 })
    }

    // Delete related amenities first (if needed)
    // await prisma.roomAmenity.deleteMany({
    //   where: {
    //     roomId: roomId,
    //   },
    // })

    // Delete the room
    await prisma.room.delete({
      where: {
        id: roomId,
      },
    })

    return NextResponse.json({ message: "Room deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete room" }, { status: 500 })
  }
}

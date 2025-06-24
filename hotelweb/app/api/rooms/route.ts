/* eslint-disable @typescript-eslint/no-unused-vars */
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req:NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const roomType =searchParams.get("roomtype")||"" 
  try {
    const rooms = await prisma.room.findMany({
      include: {
        hotel: true,
        amenities: {
          include: {
            amenity: true,
          },
        },
      },
    })
    
    const countRooms = await prisma.room.count({
      where:{
        roomType:roomType
      }
    })
    return NextResponse.json({
      rooms,countRooms
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch rooms" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { hotelId, roomType, price, imageUrl} = body

    const room = await prisma.room.create({
      data: {
        hotelId: hotelId ? Number.parseInt(hotelId) : null,
        roomType,
        price: Number.parseFloat(price),
        availability:true,
        imageUrl,
        // amenities: {
        //   create:
        //     amenityIds?.map((amenityId: number) => ({
        //       amenityId,
        //     })) || [],
        // },
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

    return NextResponse.json(room)
  } catch (error) {
    return NextResponse.json({ error: "Failed to create room" }, { status: 500 })
  }
}

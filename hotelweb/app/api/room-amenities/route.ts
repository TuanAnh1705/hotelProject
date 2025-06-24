import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET - Lấy tất cả room amenities
export async function GET() {
  try {
    const amenities = await prisma.roomAmenity.findMany({
      include: {
        rooms: {
          include: {
            room: {
              select: {
                id: true,
                roomType: true,
                hotel: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: amenities,
    })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch room amenities" }, { status: 500 })
  }
}

// POST - Tạo room amenity mới
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amenityName, description } = body

    if (!amenityName) {
      return NextResponse.json({ success: false, error: "Amenity name is required" }, { status: 400 })
    }

    const amenity = await prisma.roomAmenity.create({
      data: {
        amenityName,
        description,
      },
    })

    return NextResponse.json(
      {
        success: true,
        data: amenity,
      },
      { status: 201 },
    )
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create room amenity" }, { status: 500 })
  }
}

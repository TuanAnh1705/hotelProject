import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET - Lấy tất cả hotel amenities
export async function GET() {
  try {
    const amenities = await prisma.hotelAmenity.findMany({
      select: {
        id: true,
        amenityName: true,
        description: true,
        icon: true,
        hotels: {
          include: {
            hotel: {
              select: {
                id: true,
                name: true,
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
    return NextResponse.json({ success: false, error: "Failed to fetch hotel amenities" }, { status: 500 })
  }
}

// POST - Tạo hotel amenity mới
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amenityName, description, icon } = body

    if (!amenityName || !icon) {
      return NextResponse.json({ success: false, error: "Amenity name is required" }, { status: 400 })
    }

    const amenity = await prisma.hotelAmenity.create({
      data: {
        amenityName,
        description,
        icon,
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
    return NextResponse.json({ success: false, error: "Failed to create hotel amenity" }, { status: 500 })
  }
}
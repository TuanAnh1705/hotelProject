/* eslint-disable @typescript-eslint/no-unused-vars */
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET - Lấy room amenity theo ID
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const amenityId = Number.parseInt(id)

    if (isNaN(amenityId)) {
      return NextResponse.json({ success: false, error: "Invalid amenity ID" }, { status: 400 })
    }

    const amenity = await prisma.roomAmenity.findUnique({
      where: { id: amenityId },
      include: {
        rooms: {
          include: {
            room: {
              select: {
                id: true,
                roomType: true,
                price: true,
                hotel: {
                  select: {
                    id: true,
                    name: true,
                    city: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!amenity) {
      return NextResponse.json({ success: false, error: "Room amenity not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: amenity,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch room amenity" }, { status: 500 })
  }
}

// PUT - Cập nhật room amenity
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const amenityId = Number.parseInt(id)
    const body = await request.json()
    const { amenityName, description } = body

    if (isNaN(amenityId)) {
      return NextResponse.json({ success: false, error: "Invalid amenity ID" }, { status: 400 })
    }

    const amenity = await prisma.roomAmenity.update({
      where: { id: amenityId },
      data: {
        amenityName,
        description,
      },
    })

    return NextResponse.json({
      success: true,
      data: amenity,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update room amenity" }, { status: 500 })
  }
}

// DELETE - Xóa room amenity
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const amenityId = Number.parseInt(id)

    if (isNaN(amenityId)) {
      return NextResponse.json({ success: false, error: "Invalid amenity ID" }, { status: 400 })
    }

    // Xóa các liên kết trước
    await prisma.roomAmenitiesLink.deleteMany({
      where: { amenityId },
    })

    // Xóa amenity
    await prisma.roomAmenity.delete({
      where: { id: amenityId },
    })

    return NextResponse.json({
      success: true,
      message: "Room amenity deleted successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete room amenity" }, { status: 500 })
  }
}

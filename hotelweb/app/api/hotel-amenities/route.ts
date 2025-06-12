/* eslint-disable @typescript-eslint/no-unused-vars */
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const amenities = await prisma.hotelAmenity.findMany()
    return NextResponse.json(amenities)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch hotel amenities" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amenityName, description } = body

    const amenity = await prisma.hotelAmenity.create({
      data: {
        amenityName,
        description,
      },
    })

    return NextResponse.json(amenity)
  } catch (error) {
    return NextResponse.json({ error: "Failed to create hotel amenity" }, { status: 500 })
  }
}

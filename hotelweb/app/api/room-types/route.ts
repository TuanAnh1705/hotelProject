/* eslint-disable @typescript-eslint/no-unused-vars */
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const roomTypes = await prisma.roomType.findMany()
    return NextResponse.json(roomTypes)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch room types" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { typeName, description } = body

    const roomType = await prisma.roomType.create({
      data: {
        typeName,
        description,
      },
    })

    return NextResponse.json(roomType)
  } catch (error) {
    return NextResponse.json({ error: "Failed to create room type" }, { status: 500 })
  }
}

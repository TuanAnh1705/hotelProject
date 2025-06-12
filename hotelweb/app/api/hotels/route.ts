import type { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { createApiResponse, createApiError, asyncHandler, validateMethod } from "@/lib/utils/api-helpers"

export const GET = asyncHandler(async (request: NextRequest) => {
  validateMethod(request, ["GET"])

  try {
    const hotels = await prisma.hotel.findMany({
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

    return createApiResponse(hotels)
  } catch (error) {
    console.error("Failed to fetch hotels:", error)
    return createApiError("Failed to fetch hotels")
  }
})

export const POST = asyncHandler(async (request: NextRequest) => {
  validateMethod(request, ["POST"])

  try {
    const body = await request.json()
    const { name, address, city, rating } = body

    // Validate required fields
    if (!name || !address || !city || !rating) {
      return createApiError("Missing required fields", 400)
    }

    const hotel = await prisma.hotel.create({
      data: {
        name,
        address,
        city,
        rating: Number.parseFloat(rating),
        
      },
     
    })

    // Update rooms to belong to this hotel if roomIds provided
  

    return createApiResponse(hotel, 201)
  } catch (error) {
    console.error("Failed to create hotel:", error)
    return createApiError("Failed to create hotel")
  }
})

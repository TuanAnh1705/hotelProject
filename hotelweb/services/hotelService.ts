/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/lib/api"

export interface Hotel {
  id: number
  name: string
  address: string
  city: string
  rating: number
  rooms: any[]
  amenities: any[]
  reviews: any[]
}

export interface CreateHotelData {
  name: string
  address: string
  city: string
  rating: string
  amenityIds: number[]
  roomIds: number[]
  imageUrl?: string
}

export const hotelService = {
  // Get all hotels
  async getAll(): Promise<Hotel[]> {
    const response = await api.get("/hotels")
    return response.data
  },

  // Get hotel by ID
  async getById(id: number): Promise<Hotel> {
    const response = await api.get(`/hotels/${id}`)
    return response.data
  },

  // Create new hotel
  async create(data: CreateHotelData): Promise<Hotel> {
    const response = await api.post("/hotels", data)
    return response.data
  },

  // Update hotel
  async update(id: number, data: Partial<CreateHotelData>): Promise<Hotel> {
    const response = await api.put(`/hotels/${id}`, data)
    return response.data
  },

  // Delete hotel
  async delete(id: number): Promise<void> {
    await api.delete(`/hotels/${id}`)
  },
}

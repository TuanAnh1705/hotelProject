/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/lib/api"

export interface Room {
  id: number
  price: number
  availability: boolean
  hotel: any
  roomType: any
  amenities: any[]
}

export interface CreateRoomData {
  hotelId?: string
  roomTypeId: string
  price: string
  availability: string
  amenityIds: number[]
}

export const roomService = {
  // Get all rooms
  async getAll(): Promise<Room[]> {
    const response = await api.get("/rooms")
    return response.data
  },

  // Get room by ID
  async getById(id: number): Promise<Room> {
    const response = await api.get(`/rooms/${id}`)
    return response.data
  },

  // Create new room
  async create(data: CreateRoomData): Promise<Room> {
    const response = await api.post("/rooms", data)
    return response.data
  },

  // Update room
  async update(id: number, data: Partial<CreateRoomData>): Promise<Room> {
    const response = await api.put(`/rooms/${id}`, data)
    return response.data
  },

  // Delete room
  async delete(id: number): Promise<void> {
    await api.delete(`/rooms/${id}`)
  },
}

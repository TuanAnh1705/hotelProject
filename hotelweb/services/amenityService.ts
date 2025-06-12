import api from "@/lib/api"

export interface HotelAmenity {
  id: number
  amenityName: string
  description: string
}

export interface RoomAmenity {
  id: number
  amenityName: string
  description: string
}

export interface RoomType {
  id: number
  typeName: string
  description: string
}

export interface CreateAmenityData {
  amenityName: string
  description: string
}

export const amenityService = {
  // Hotel Amenities
  hotelAmenities: {
    async getAll(): Promise<HotelAmenity[]> {
      const response = await api.get("/hotel-amenities")
      return response.data
    },

    async create(data: CreateAmenityData): Promise<HotelAmenity> {
      const response = await api.post("/hotel-amenities", data)
      return response.data
    },

    async update(id: number, data: CreateAmenityData): Promise<HotelAmenity> {
      const response = await api.put(`/hotel-amenities/${id}`, data)
      return response.data
    },

    async delete(id: number): Promise<void> {
      await api.delete(`/hotel-amenities/${id}`)
    },
  },

  // Room Amenities
  roomAmenities: {
    async getAll(): Promise<RoomAmenity[]> {
      const response = await api.get("/room-amenities")
      return response.data
    },

    async create(data: CreateAmenityData): Promise<RoomAmenity> {
      const response = await api.post("/room-amenities", data)
      return response.data
    },

    async update(id: number, data: CreateAmenityData): Promise<RoomAmenity> {
      const response = await api.put(`/room-amenities/${id}`, data)
      return response.data
    },

    async delete(id: number): Promise<void> {
      await api.delete(`/room-amenities/${id}`)
    },
  },

  // Room Types
  roomTypes: {
    async getAll(): Promise<RoomType[]> {
      const response = await api.get("/room-types")
      return response.data
    },

    async create(data: { typeName: string; description: string }): Promise<RoomType> {
      const response = await api.post("/room-types", data)
      return response.data
    },

    async update(id: number, data: { typeName: string; description: string }): Promise<RoomType> {
      const response = await api.put(`/room-types/${id}`, data)
      return response.data
    },

    async delete(id: number): Promise<void> {
      await api.delete(`/room-types/${id}`)
    },
  },
}

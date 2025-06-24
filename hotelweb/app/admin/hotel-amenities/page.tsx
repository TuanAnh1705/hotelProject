"use client"

import api from "@/lib/api"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

interface HotelAmenities {
  id: number,
  name: string,
  description: string
  hotels: Array<{
    id: number
    hotel: {
      id: number,
      name: string,
      address: string
    }
  }>
}

interface Hotel{
  id: number,
  name: string,
  city : string,
  address: string,
  rating: number
}

const AmenitiesPage = () => {
  const [amenities, setAmenities] = useState<HotelAmenities[] | null>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAmenity, setSelectedAmenity] = useState<HotelAmenities | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  const fetchAmenities = async () => {
    try {
      setLoading(true)
      const res = await api.get(`api/hotel-amenities`)
      setAmenities(res.data.amenities)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Failed to fetch amenities", error)
      const errorMessage = error.response?.data?.error || "Failed to load amenities"
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAmenities()
  }, [])
}
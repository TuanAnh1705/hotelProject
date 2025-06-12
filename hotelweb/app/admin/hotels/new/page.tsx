/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { roomService } from "@/services/roomService"
import { showToast } from "@/lib/toast"
import api from "@/lib/api"
import toast from "react-hot-toast"


interface Room {
  id: number
  price: number
  availability: boolean
  hotel: any
  roomType: any
}

export default function NewHotelPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [amenities, setAmenities] = useState()
  const [rooms, setRooms] = useState<Room[]>([])
  const [selectedRooms, setSelectedRooms] = useState<number[]>([])

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    rating: "",
  })

  useEffect(() => {
    fetchAmenities()
    fetchRooms()
  }, [])

  const fetchAmenities = async () => {
    try {
      const res = await api.get("/api/hotels")
      setAmenities(res?.data)
    } catch (error) {
      console.error("Failed to fetch amenities:", error)
      showToast.error("Failed to fetch amenities")
    }
  }

  

  const fetchRooms = async () => {
    try {
      const data = await roomService.getAll()
      // Only show rooms that don't belong to any hotel
      setRooms(data.filter((room: any) => !room.hotel))
    } catch (error) {
      console.error("Failed to fetch rooms:", error)
      showToast.error("Failed to fetch rooms")
    }
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
     const res = await api.post("/api/hotels",formData)
     if(res.data){
      toast.success("thành công")
         router.push("/admin/hotels")
     }

   
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Error already handled by toast.promise
    } finally {
      setLoading(false)
    }
  }

  const handleRoomChange = (roomId: number, checked: boolean) => {
    if (checked) {
      setSelectedRooms([...selectedRooms, roomId])
    } else {
      setSelectedRooms(selectedRooms.filter((id) => id !== roomId))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/admin/hotels">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Hotel</h1>
          <p className="text-muted-foreground">Create a new hotel property</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Enter the basic details of the hotel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Hotel Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="rating">Rating (1-5)</Label>
                <Input
                  id="rating"
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hotel Image</CardTitle>
              <CardDescription>Upload a main image for the hotel</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="image"
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                  >
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Hotel Amenities</CardTitle>
            <CardDescription>Select the amenities available at this hotel</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
    
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Available Rooms</CardTitle>
            <CardDescription>Select existing rooms to assign to this hotel</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              {rooms.map((room) => (
                <div key={room.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                  <Checkbox
                    id={`room-${room.id}`}
                    checked={selectedRooms.includes(room.id)}
                    onCheckedChange={(checked) => handleRoomChange(room.id, checked as boolean)}
                  />
                  <div className="flex-1">
                    <Label htmlFor={`room-${room.id}`} className="text-sm font-medium">
                      {room.roomType?.typeName || "Unknown Type"}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      ${room.price} • {room.availability ? "Available" : "Unavailable"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Link href="/admin/hotels">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Hotel"}
          </Button>
        </div>
      </form>
    </div>
  )
}


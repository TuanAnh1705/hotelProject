"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { roomService } from "@/services/roomService"
import { hotelService } from "@/services/hotelService"
import { amenityService, type RoomType, type RoomAmenity } from "@/services/amenityService"
import type { AxiosError } from "axios"

interface Hotel {
  id: number
  name: string
  city: string
}

export default function NewRoomPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([])
  const [amenities, setAmenities] = useState<RoomAmenity[]>([])
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [selectedAmenities, setSelectedAmenities] = useState<number[]>([])

  const [formData, setFormData] = useState({
    hotelId: "",
    roomTypeId: "",
    price: "",
    availability: "true",
  })

  useEffect(() => {
    fetchRoomTypes()
    fetchAmenities()
    fetchHotels()
  }, [])

  const fetchRoomTypes = async () => {
    try {
      const data = await amenityService.roomTypes.getAll()
      setRoomTypes(data)
    } catch (error) {
      console.error("Failed to fetch room types:", error)
    }
  }

  const fetchAmenities = async () => {
    try {
      const data = await amenityService.roomAmenities.getAll()
      setAmenities(data)
    } catch (error) {
      console.error("Failed to fetch amenities:", error)
    }
  }

  const fetchHotels = async () => {
    try {
      const data = await hotelService.getAll()
      setHotels(data)
    } catch (error) {
      console.error("Failed to fetch hotels:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await roomService.create({
        ...formData,
        amenityIds: selectedAmenities,
      })

      to
      router.push("/admin/rooms")
    } catch (err) {
      const axiosError = err as AxiosError<{ error: string }>;

      toast({
        title: "Error",
        description: axiosError.response?.data?.error || "Failed to create room",
        variant: "destructive",
      });
    } finally {
      setLoading(false)
    }
  }

  const handleAmenityChange = (amenityId: number, checked: boolean) => {
    if (checked) {
      setSelectedAmenities([...selectedAmenities, amenityId])
    } else {
      setSelectedAmenities(selectedAmenities.filter((id) => id !== amenityId))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/admin/rooms">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Room</h1>
          <p className="text-muted-foreground">Create a new room with amenities</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Room Details</CardTitle>
              <CardDescription>Enter the basic details of the room</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="hotel">Hotel (Optional)</Label>
                <Select
                  value={formData.hotelId}
                  onValueChange={(value) => setFormData({ ...formData, hotelId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a hotel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No Hotel</SelectItem>
                    {hotels.map((hotel) => (
                      <SelectItem key={hotel.id} value={hotel.id.toString()}>
                        {hotel.name} - {hotel.city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="roomType">Room Type</Label>
                <Select
                  value={formData.roomTypeId}
                  onValueChange={(value) => setFormData({ ...formData, roomTypeId: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select room type" />
                  </SelectTrigger>
                  <SelectContent>
                    {roomTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id.toString()}>
                        {type.typeName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="price">Price per Night ($)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="availability">Availability</Label>
                <Select
                  value={formData.availability}
                  onValueChange={(value) => setFormData({ ...formData, availability: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Available</SelectItem>
                    <SelectItem value="false">Unavailable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Room Amenities</CardTitle>
              <CardDescription>Select the amenities available in this room</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {amenities.map((amenity) => (
                  <div key={amenity.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`amenity-${amenity.id}`}
                      checked={selectedAmenities.includes(amenity.id)}
                      onCheckedChange={(checked) => handleAmenityChange(amenity.id, checked as boolean)}
                    />
                    <div className="flex-1">
                      <Label htmlFor={`amenity-${amenity.id}`} className="text-sm font-medium">
                        {amenity.amenityName}
                      </Label>
                      {amenity.description && <p className="text-xs text-muted-foreground">{amenity.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end space-x-4">
          <Link href="/admin/rooms">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Room"}
          </Button>
        </div>
      </form>
    </div>
  )
}

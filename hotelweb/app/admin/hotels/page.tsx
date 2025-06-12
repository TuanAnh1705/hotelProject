/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, MapPin, Star } from "lucide-react"
import { hotelService, type Hotel } from "@/services/hotelService"
import type { AxiosError } from "axios"
import { showToast } from "@/lib/toast"


export default function HotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHotels()
  }, [])

  const fetchHotels = async () => {
    try {
      const data = await hotelService.getAll()
      setHotels(data)
    } catch (err) {
     const axiosError = err as AxiosError<{ error: string }>;
  showToast.error(axiosError.response?.data?.error || "Failed to fetch hotels");
    } finally {
      setLoading(false)
    }
  }

  const deleteHotel = async (id: number) => {
    if (!confirm("Are you sure you want to delete this hotel?")) return

    try {
      await showToast.promise(hotelService.delete(id), {
        loading: "Deleting hotel...",
        success: "Hotel deleted successfully",
        error: "Failed to delete hotel",
      })
      fetchHotels()
    } catch (error) {
      // Error already handled by toast.promise
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hotels</h1>
          <p className="text-muted-foreground">Manage your hotel properties</p>
        </div>
        <Link href="/admin/hotels/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Hotel
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {hotels.map((hotel) => (
          <Card key={hotel.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{hotel.name}</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <MapPin className="mr-1 h-3 w-3" />
                    {hotel.city}
                  </CardDescription>
                </div>
                <div className="flex items-center">
                  <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{hotel.rating}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">{hotel.address}</p>

                <div className="flex justify-between text-sm">
                  <span>Rooms: {hotel.rooms?.length || 0}</span>
                  <span>Reviews: {hotel.reviews?.length || 0}</span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {hotel.amenities?.slice(0, 3).map((link: any) => (
                    <Badge key={link.id} variant="secondary" className="text-xs">
                      {link.amenity?.amenityName}
                    </Badge>
                  ))}
                  {hotel.amenities?.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{hotel.amenities.length - 3} more
                    </Badge>
                  )}
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <Link href={`/admin/hotels/${hotel.id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit className="h-3 w-3" />
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={() => deleteHotel(hotel.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

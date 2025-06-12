/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Building2, DollarSign } from "lucide-react"
import { roomService, type Room } from "@/services/roomService"
import type { AxiosError } from "axios"
import { showToast } from "@/lib/toast"

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRooms()
  }, [])

  const fetchRooms = async () => {
    try {
      const data = await roomService.getAll()
      setRooms(data)
    } catch (err) {
        const axiosError = err as AxiosError<{ error: string }>;
        showToast.error(axiosError.response?.data?.error || "Failed to fetch rooms");
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rooms</h1>
          <p className="text-muted-foreground">Manage hotel rooms and their amenities</p>
        </div>
        <Link href="/admin/rooms/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Room
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room) => (
          <Card key={room.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{room.roomType?.typeName || "Unknown Type"}</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <Building2 className="mr-1 h-3 w-3" />
                    {room.hotel?.name || "No Hotel Assigned"}
                  </CardDescription>
                </div>
                <Badge variant={room.availability ? "default" : "secondary"}>
                  {room.availability ? "Available" : "Unavailable"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center">
                  <DollarSign className="mr-1 h-4 w-4 text-green-600" />
                  <span className="text-lg font-semibold">${room.price}</span>
                  <span className="text-sm text-muted-foreground ml-1">per night</span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {room.amenities?.slice(0, 3).map((link: any) => (
                    <Badge key={link.id} variant="outline" className="text-xs">
                      {link.amenity?.amenityName}
                    </Badge>
                  ))}
                  {room.amenities?.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{room.amenities.length - 3} more
                    </Badge>
                  )}
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <Link href={`/admin/rooms/${room.id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit className="h-3 w-3" />
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm">
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

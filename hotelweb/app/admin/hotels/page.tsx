"use client"

import api from "@/lib/api"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Building2, MapPin, Star, Search, Plus, Trash2, Loader2, ImageIcon, BedSingle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import RoomFormDialog from "../rooms/components/roomDialog"
import HotelFormDialog from "./components/addNewHotel"
import HotelEditDialog from "./components/editHotel"
import ViewHotelDialog from "./components/viewHotel"

interface Hotel {
  id: number
  name: string
  address: string
  city: string
  rating: number
  imageUrl?: string
  _count: { rooms: number }
  amenities: { amenity: { id: number; amenityName: string, icon: string } }[]
}

interface HotelAmenities {
  id: number
  amenityName: string
  description: string
  icon: string
}

const HotelsPage = () => {
  const [hotels, setHotels] = useState<Hotel[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null)
  const [amenitiesHotel, setAmenitiesHotel] = useState<HotelAmenities[] | null>(null)

  const fetchHotels = async () => {
    try {
      setLoading(true)
      const res = await api.get(`/api/hotels`)
      setHotels(res.data.hotels)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Failed to fetch hotels", error)
      const errorMessage = error.response?.data?.error || "Failed to load hotels"
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const fetchAmenitiesHotel = async () => {
    try {
      setLoading(true)
      const res = await api.get(`/api/hotel-amenities`)
      setAmenitiesHotel(res.data?.data)
      console.log(res)

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Failed to fetch hotels", error)
      const errorMessage = error.response?.data?.error || "Failed to load hotels"
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAmenitiesHotel()
    fetchHotels()
  }, [])

  const filteredHotels = hotels?.filter(
    (hotel) =>
      hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.address.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDelete = async (id: number) => {
    try {
      setDeleteLoading(id)
      await api.delete(`/api/hotels/${id}`)
      toast.success("Hotel deleted successfully")
      fetchHotels()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Failed to delete hotel", error)
      const errorMessage = error.response?.data?.error || "Failed to delete hotel"
      toast.error(errorMessage)
    } finally {
      setDeleteLoading(null)
    }
  }


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-slate-600">Loading hotels...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      {/* Search + Add Section */}
      <Card className="shadow-sm bg-white/80 backdrop-blur-sm">
        <CardHeader className="p-6 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            {/* Cột trái: Tiêu đề */}
            <div className="flex items-center space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Quản Lý Khách Sạn</h1>
                <p className="text-sm font-bold text-muted-foreground">Tổng số: {hotels?.length || 0} khách sạn</p>
              </div>
            </div>

            {/* Cột giữa: Search input */}
            <div className="w-full">
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Tìm theo tên, thành phố hoặc địa chỉ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-11 border-slate-200 focus:border-primary focus:ring-primary w-full"
                />
              </div>
            </div>

            {/* Cột phải: Nút thêm */}
            <div className="flex justify-end">
              <HotelFormDialog
                amenities={amenitiesHotel || []}
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="mx-auto max-w-7xl space-y-8">
        {/* Hotels Grid */}
        {filteredHotels && filteredHotels.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {filteredHotels.map((hotel) => (
              <Card
                key={hotel.id}
                className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-200 group overflow-hidden flex flex-col h-full"
              >
                {/* Hotel Image */}
                <div className="relative h-40 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
                  {hotel.imageUrl ? (
                    <Image
                      width={300}
                      height={160}
                      src={hotel.imageUrl || "/placeholder.svg"}
                      alt={hotel.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="flex flex-col items-center space-y-2 text-slate-400">
                        <ImageIcon className="h-10 w-10" />
                        <span className="text-xs font-medium">No Image</span>
                      </div>
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-xs">
                      #{hotel.id}
                    </Badge>
                  </div>
                  {/* Rating overlay */}
                  <div className="absolute bottom-2 left-2">
                    <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-semibold text-slate-700">{hotel.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-3 flex flex-col flex-grow space-y-3">
                  {/* Hotel Info */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-slate-900 leading-tight group-hover:text-primary transition-colors line-clamp-2">
                      {hotel.name}
                    </h3>

                    <div className="space-y-1">
                      <div className="flex items-center space-x-1 text-slate-600">
                        <MapPin className="h-3 w-3 flex-shrink-0" />
                        <span className="text-xs font-medium truncate">{hotel.city}</span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{hotel.address}</p>
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div className="flex items-center justify-between py-1">
                    <div className="flex items-center text-xs text-slate-600">
                      <BedSingle className="mr-1 h-3 w-3 text-primary" />
                      <span className="font-medium">{hotel._count.rooms} phòng</span>
                    </div>
                    <div className="text-xs text-slate-500">ID: {hotel.id}</div>
                  </div>

                  {/* Amenities */}
                  {hotel.amenities && hotel.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {hotel.amenities.slice(0, 2).map((item, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs bg-blue-50 text-blue-700 border-blue-200 px-1 py-0"
                        >
                          {item.amenity.amenityName}
                        </Badge>
                      ))}
                      {hotel.amenities.length > 2 && (
                        <Badge variant="outline" className="text-xs bg-slate-50 text-slate-600 px-1 py-0">
                          +{hotel.amenities.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Action Buttons - Always at bottom */}
                  <div className="mt-auto pt-2 space-y-2">
                    {/* Primary Actions Row */}
                    <div className="grid grid-cols-2 gap-2">
                      <ViewHotelDialog
                        hotel={hotel}
                      />

                      <RoomFormDialog
                        hotelId={hotel.id}
                      />
                    </div>

                    {/* Secondary Actions Row */}
                    <div className="grid grid-cols-2 gap-2">
                      <HotelEditDialog
                        amenities={amenitiesHotel || []}
                        hotelId={hotel.id}
                      />

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 text-xs h-8"
                            disabled={deleteLoading === hotel.id}
                          >
                            {deleteLoading === hotel.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Trash2 className="mr-1 h-3 w-3" />
                            )}
                            Xóa
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Xoá Khách Sạn</AlertDialogTitle>
                            <AlertDialogDescription>
                              Bạn có chắc chắn muốn xoá khách sạn {hotel.name}? Hành động này có thể không được quay lại
                              và khách sạn có thể sẽ được xoá khỏi dữ liệu của bạn.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Huỷ</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(hotel.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Xoá Khách Sạn
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="shadow-sm border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-12">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
                    <Building2 className="h-10 w-10 text-slate-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {searchTerm ? "No hotels found" : "No hotels yet"}
                  </h3>
                  <p className="text-slate-600 mt-1">
                    {searchTerm
                      ? `No hotels match your search "${searchTerm}"`
                      : "Get started by adding your first hotel property"}
                  </p>
                </div>
                {!searchTerm && (
                  <Link href="/admin/hotels/new">
                    <Button size="lg" className="mt-4">
                      <Plus className="mr-2 h-4 w-4" />
                      Hãy thêm khách sạn đầu tiên
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default HotelsPage

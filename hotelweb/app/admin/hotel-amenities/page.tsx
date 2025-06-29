"use client"

import api from "@/lib/api"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import * as LucideIcons from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Building2, Loader2, Search, Trash2 } from "lucide-react"
import { Card, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { AddAmenityDialog } from "./components/addAmenity"

interface HotelAmenities {
  id: number
  amenityName: string
  description: string
  icon: string
  hotels?: {
    hotelId: number
    hotel?: {
      name: string
      address: string
    }
  } | null
}

const HotelAmenitiesPage = () => {
  const [amenitiesHotel, setAmenitiesHotel] = useState<HotelAmenities[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  const fetchAmenitiesHotel = async () => {
    try {
      setLoading(true)
      const res = await api.get(`/api/hotel-amenities`)
      const data = res.data.data ?? []

      // Debug: Log the actual data structure
      console.log("API Response Data:", data)
      if (data.length > 0) {
        console.log("First item structure:", data[0])
      }

      setAmenitiesHotel(data)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("API Error:", error)
      toast.error(error.response?.data?.error || "Không thể tải dữ liệu tiện ích")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAmenitiesHotel()
  }, [])

  const filteredAmenitiesHotel =
    amenitiesHotel?.filter((item) => {
      try {
        const amenityNameMatch = item?.amenityName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false
        const iconMatch = item?.icon?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false

        // More defensive checks for hotel properties
        let hotelNameMatch = false
        let hotelAddressMatch = false

        if (item?.hotels?.hotel?.name) {
          hotelNameMatch = item.hotels.hotel.name.toLowerCase().includes(searchTerm.toLowerCase())
        }

        if (item?.hotels?.hotel?.address) {
          hotelAddressMatch = item.hotels.hotel.address.toLowerCase().includes(searchTerm.toLowerCase())
        }

        return amenityNameMatch || iconMatch || hotelNameMatch || hotelAddressMatch
      } catch (error) {
        console.error("Error filtering item:", item, error)
        return false
      }
    }) ?? []

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/api/hotel-amenities/${id}`)
      toast.success("Xoá Tiện Ích Khách Sạn Thành Công")
      fetchAmenitiesHotel()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Xoá tiện ích thất bại")
    }
  }

  // Helper function to safely get hotel name

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-3">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p>Đang tải tiện ích...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <Card className="bg-white/80 backdrop-blur-sm shadow-sm mb-6">
        <CardHeader className="p-6 pb-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Bên trái: Tiêu đề */}
            <div className="flex items-center gap-4 basis-1/3">
              <div className="h-12 w-12 flex items-center justify-center bg-primary/10 rounded-lg">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Quản Lý Tiện Ích</h1>
                <p className="text-sm text-muted-foreground">
                  Tổng: {amenitiesHotel?.length || 0} tiện ích
                </p>
              </div>
            </div>

            {/* Ở giữa: Thanh tìm kiếm */}
            <div className="basis-1/3 flex justify-center">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Tìm theo tên, icon, khách sạn..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-11 rounded-xl border-slate-300 focus:border-primary focus:ring-primary/20 shadow-sm"
                />
              </div>
            </div>

            {/* Bên phải: Nút thêm tiện ích */}
            <div className="basis-1/3 flex justify-end">
              <AddAmenityDialog onAmenityAdded={fetchAmenitiesHotel} />
            </div>
          </div>
        </CardHeader>

      </Card>

      {filteredAmenitiesHotel.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-slate-600">Không có tiện ích nào phù hợp</p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {filteredAmenitiesHotel.map((item) => {
            try {
              const IconComponent = (LucideIcons[item?.icon as keyof typeof LucideIcons] ||
                LucideIcons.HelpCircle) as LucideIcon

              return (
                <Card key={item?.id} className="p-4 flex flex-col justify-between bg-white/90">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-md bg-primary/10">
                      <IconComponent className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-slate-900">
                        {item?.amenityName || "Tên không xác định"}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-2">{item?.description || "Không có mô tả"}</p>
                      <p className="text-xs mt-1 text-slate-500 italic">KS: {item.hotels?.hotel?.name || "Chưa có dữ liệu khách sạn để thêm"} </p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-600 hover:bg-red-50"
                      onClick={() => item?.id && handleDelete(item.id)}
                      disabled={!item?.id}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Xoá
                    </Button>
                  </div>
                </Card>
              )
            } catch (error) {
              console.error("Error rendering item:", item, error)
              return (
                <Card key={Math.random()} className="p-4 bg-red-50">
                  <p className="text-red-600 text-sm">Lỗi hiển thị dữ liệu</p>
                </Card>
              )
            }
          })}
        </div>
      )}
    </div>
  )
}

export default HotelAmenitiesPage

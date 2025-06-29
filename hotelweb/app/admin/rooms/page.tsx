"use client"

import api from "@/lib/api"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Building2, Search, Plus, Edit, Trash2, Eye, Loader2, ImageIcon, DollarSign } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import ViewRoomDialog from "./components/viewRoomDialog"
import EditRoomDialog from "./components/editRoomDialog"

interface Room {
  id: number
  roomType: string
  price: number
  availability: boolean
  imageUrl: string
  hotel: {
    id: number
    name: string
    address: string
  }
}

const RoomsPage = () => {
  const [rooms, setRooms] = useState<Room[] | null>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  const fetchRooms = async () => {
    try {
      setLoading(true)
      const res = await api.get(`/api/rooms`)
      setRooms(res.data.rooms)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Failed to fetch rooms", error)
      const errorMessage = error.response?.data?.error || "Failed to load rooms"
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRooms()
  }, [])

  const filteredRooms = rooms?.filter(
    (room) =>
      room.hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.roomType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.hotel.address.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleView = (room: Room) => {
    setSelectedRoom(room)
    setViewDialogOpen(true)
  }

  const handleEdit = (room: Room) => {
    setSelectedRoom(room)
    setEditDialogOpen(true)
  }

  const handleDelete = async (room: Room) => {
    try {
      await api.delete(`/api/rooms/${room.id}`)
      toast.success("Xoá Phòng Thành Công")
      fetchRooms()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Failed to delete room", error)
      const errorMessage = error.response?.data?.error || "Xoá Phòng Thất Bại"
      toast.error(errorMessage)
    }
  }

  const handleRoomUpdated = () => {
    fetchRooms()
    setEditDialogOpen(false)
    setSelectedRoom(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-slate-600">Loading rooms...</p>
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
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Quản Lý Phòng</h1>
                <p className="text-sm font-bold text-muted-foreground">Tổng số: {rooms?.length || 0} phòng</p>
              </div>
            </div>

            {/* Cột giữa: Search input */}
            <div className="w-full">
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Tìm theo loại phòng, khách sạn..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-11 border-slate-200 focus:border-primary focus:ring-primary w-full"
                />
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="mx-auto max-w-7xl space-y-8">
        {/* Rooms Grid */}
        {filteredRooms && filteredRooms.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {filteredRooms.map((room) => (
              <Card
                key={room.id}
                className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-200 group overflow-hidden flex flex-col h-full"
              >
                {/* Room Image */}
                <div className="relative h-40 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
                  {room.imageUrl ? (
                    <Image
                      width={300}
                      height={160}
                      src={room.imageUrl || "/placeholder.svg"}
                      alt={room.roomType}
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

                  {/* Status Badge */}
                  <div className="absolute top-2 left-2">
                    <Badge
                      variant={room.availability ? "default" : "secondary"}
                      className={`text-xs ${room.availability ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}
                    >
                      {room.availability ? "Có sẵn" : "Hết phòng"}
                    </Badge>
                  </div>

                  {/* ID Badge */}
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-xs">
                      #{room.id}
                    </Badge>
                  </div>

                  {/* Price Overlay */}
                  <div className="absolute bottom-2 right-2">
                    <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                      <DollarSign className="h-3 w-3 text-green-600" />
                      <span className="text-xs font-bold text-slate-700">${room.price}</span>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-3 flex flex-col flex-grow space-y-3">
                  {/* Room Info */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-slate-900 leading-tight group-hover:text-primary transition-colors line-clamp-1">
                      {room.roomType}
                    </h3>

                    <div className="space-y-1">
                      <div className="flex items-center space-x-1 text-slate-600">
                        <Building2 className="h-3 w-3 flex-shrink-0" />
                        <span className="text-xs font-medium truncate">{room.hotel.name}</span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{room.hotel.address}</p>
                    </div>
                  </div>

                  {/* Price Info */}
                  <div className="flex items-center justify-between py-1">
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">${room.price}</p>
                      <p className="text-xs text-slate-500">mỗi đêm</p>
                    </div>
                    <div className="text-xs text-slate-500">Hotel ID: {room.hotel.id}</div>
                  </div>

                  {/* Action Buttons - Always at bottom */}
                  <div className="mt-auto pt-2 space-y-2">
                    {/* Primary Actions Row */}
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleView(room)}
                        className="w-full text-xs h-8"
                      >
                        <Eye className="mr-1 h-3 w-3" />
                        Xem
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleEdit(room)}
                        className="w-full text-xs h-8"
                      >
                        <Edit className="mr-1 h-3 w-3" />
                        Sửa
                      </Button>
                    </div>

                    {/* Secondary Action */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(room)}
                      className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 text-xs h-8"
                    >
                      <Trash2 className="mr-1 h-3 w-3" />
                      Xóa Phòng
                    </Button>
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
                    {searchTerm ? "Không tìm thấy phòng" : "Chưa có phòng nào"}
                  </h3>
                  <p className="text-slate-600 mt-1">
                    {searchTerm
                      ? `Không có phòng nào phù hợp với tìm kiếm "${searchTerm}"`
                      : "Bắt đầu bằng cách thêm phòng đầu tiên"}
                  </p>
                </div>
                {!searchTerm && (
                  <Link href="/admin/hotels">
                    <Button size="lg" className="mt-4">
                      <Plus className="mr-2 h-4 w-4" />
                      Quản lý khách sạn
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Dialogs */}
        {selectedRoom && (
          <>
            <ViewRoomDialog room={selectedRoom} open={viewDialogOpen} onOpenChange={setViewDialogOpen} />
            <EditRoomDialog
              room={selectedRoom}
              open={editDialogOpen}
              onOpenChange={setEditDialogOpen}
              onRoomUpdated={handleRoomUpdated}
            />
          </>
        )}
      </div>
    </div>
  )
}

export default RoomsPage

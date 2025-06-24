"use client"

import type React from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useEffect, useState } from "react"
import api from "@/lib/api"
import toast from "react-hot-toast"
import { Building2, DollarSign } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import ImageUpload from "@/components/fileUpload"

interface Room {
  id: number
  roomType: string
  price: number
  availability: boolean
  imageUrl: string
//   amenities: Array<{
//     amenity: {
//       id: number
//       name: string
//     }
//   }>
}

interface Props {
  room: Room
  open: boolean
  onOpenChange: (open: boolean) => void
  onRoomUpdated: () => void
}

interface FormData {
  roomType: string
  price: number
  availability: boolean
  imageUrl: string
}

export default function EditRoomDialog({ room, open, onOpenChange, onRoomUpdated }: Props) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    roomType: room.roomType,
    price: room.price,
    availability: room.availability,
    imageUrl: room.imageUrl,
  })

  useEffect(() => {
    if (room) {
      setFormData(formData)
    }
  }, [formData,room])

  const handleInputChange = (field: keyof FormData, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await api.put(`/api/rooms/${room.id}`, formData)
      if (response.data) {
        toast.success("Cập nhật phòng thành công")
        onRoomUpdated()
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Lỗi cập nhật phòng:", error)
      const errorMessage = error.response?.data?.error || "Lỗi không xác định"
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh] rounded-xl border bg-white p-6 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-primary">Chỉnh sửa phòng - {room.roomType}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="shadow-none border-0 bg-transparent">
            <CardHeader className="px-0">
              <CardTitle className="text-lg font-medium text-slate-800 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Thông tin phòng
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">Cập nhật thông tin của phòng</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-0">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="roomType">Loại phòng *</Label>
                  <Input
                    id="roomType"
                    placeholder="Deluxe, Standard..."
                    value={formData.roomType}
                    onChange={(e) => handleInputChange("roomType", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="price" className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    Giá mỗi đêm *
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    min="1"
                    max="9999"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", Number(e.target.value))}
                    placeholder="100"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="availability"
                  checked={formData.availability}
                  onCheckedChange={(checked) => handleInputChange("availability", checked)}
                />
                <Label htmlFor="availability">Phòng có sẵn</Label>
              </div>

              <div className="pt-4">
                <ImageUpload
                  value={formData.imageUrl}
                  onChange={(url) => handleInputChange("imageUrl", url)}
                  onRemove={() => handleInputChange("imageUrl", "")}
                  label="Ảnh phòng"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Đang cập nhật..." : "Cập nhật phòng"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

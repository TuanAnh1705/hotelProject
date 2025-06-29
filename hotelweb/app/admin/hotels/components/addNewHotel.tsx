"use client"

import type React from "react"
import * as LucideIcons from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import ImageUpload from "@/components/fileUpload"
import { MapPin, Star, Plus, Building2, ImageIcon, CheckCircle2 } from "lucide-react"
import api from "@/lib/api"
import toast from "react-hot-toast"

interface HotelAmenities {
  id: number
  amenityName: string
  description: string
  icon: string
}

interface Props {
  amenities: HotelAmenities[]
}

interface FormData {
  name: string
  address: string
  city: string
  rating: string
  imageUrl: string
}

export default function HotelFormDialog({ amenities }: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedIds, setSelectedIds] = useState<number[]>([])




  const handleChange = (id: number) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const [formData, setFormData] = useState<FormData>({
    name: "",
    address: "",
    city: "",
    rating: "",
    imageUrl: "",
  })

  const handleInputChange = (field: keyof Omit<FormData, "imageUrl">, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)


    try {
      const res = await api.post("/api/hotels", {
        ...formData,
        imageUrl: formData.imageUrl || null,
      })

      const hotel = res.data

      await Promise.all(
        selectedIds.map((amenityId) =>
          api.patch(`/api/hotel-amenities/${amenityId}`, {
            hotelId: hotel.id,
            action: "link",
          }),
        ),
      )

      if (res.data) {
        toast.success("Hotel created successfully!")
        setOpen(false)
        setFormData({
          name: "",
          address: "",
          city: "",
          rating: "",
          imageUrl: "",
        })
        setSelectedIds([])
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Failed to create hotel. Please try again."
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="space-x-2" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" />
          <span>Thêm khách sạn</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        className="w-[90vw] !max-w-none h-[95vh] overflow-y-auto rounded-2xl p-0 shadow-2xl bg-gradient-to-br from-white to-slate-50"
      >


        {/* Header Section */}
        <DialogHeader className="px-8 pt-8 pb-6 bg-gradient-to-r from-primary/5 to-primary/10 rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-3xl font-bold text-slate-900">Thêm Khách Sạn Mới</DialogTitle>
              <p className="text-slate-600 mt-1">Điền thông tin chi tiết để tạo khách sạn mới</p>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-8">
          {/* Basic Information Section */}
          <Card className="border-0 shadow-sm bg-white/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-slate-800 flex items-center space-x-2">
                <Building2 className="h-5 w-5 text-primary" />
                <span>Thông Tin Cơ Bản</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-sm font-medium text-slate-700">
                    Tên khách sạn *
                  </Label>
                  <Input
                    id="name"
                    placeholder="VD: Khách sạn Hoàng Gia"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                    className="h-12 border-slate-200 focus:border-primary focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="city" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    Thành phố *
                  </Label>
                  <Input
                    id="city"
                    placeholder="VD: Đà Nẵng"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    required
                    className="h-12 border-slate-200 focus:border-primary focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="address" className="text-sm font-medium text-slate-700">
                  Địa chỉ đầy đủ *
                </Label>
                <Textarea
                  id="address"
                  placeholder="Số 123, đường ABC, phường XYZ, quận 1..."
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  required
                  className="min-h-[100px] resize-none border-slate-200 focus:border-primary focus:ring-primary/20"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="rating" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  Đánh giá *
                </Label>
                <div className="flex items-center space-x-4">
                  <div className="relative max-w-xs">
                    <Input
                      id="rating"
                      type="number"
                      min="1"
                      max="5"
                      step="0.1"
                      placeholder="4.5"
                      value={formData.rating}
                      onChange={(e) => handleInputChange("rating", e.target.value)}
                      required
                      className="h-12 pr-12 border-slate-200 focus:border-primary focus:ring-primary/20"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-500 font-medium">
                      / 5.0
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 ${star <= Number.parseFloat(formData.rating || "0")
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-slate-300"
                          }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-500">Nhập số từ 1.0 đến 5.0</p>
              </div>
            </CardContent>
          </Card>

          {/* Amenities Section */}
          <Card className="border-0 shadow-sm bg-white/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span>Tiện Ích Khách Sạn</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {selectedIds.length} đã chọn
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {amenities.map((amenity: HotelAmenities) => {
                  const IconComponent = (LucideIcons[amenity.icon as keyof typeof LucideIcons] || LucideIcons.HelpCircle) as LucideIcon;
                  return (
                    <div
                      key={amenity.id}
                      className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${selectedIds.includes(amenity.id)
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      onClick={() => handleChange(amenity.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div
                          className={`mt-0.5 h-5 w-5 rounded border-2 flex items-center justify-center ${selectedIds.includes(amenity.id) ? "border-primary bg-primary" : "border-slate-300"
                            }`}
                        >
                          {selectedIds.includes(amenity.id) && <CheckCircle2 className="h-3 w-3 text-white" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-slate-900 truncate flex items-center gap-2">
                            <IconComponent className="w-4 h-4 text-primary shrink-0" />
                            <span>{amenity.amenityName}</span>
                          </h4>

                          {amenity.description && (
                            <p className="text-xs text-slate-500 mt-1 line-clamp-2">{amenity.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Image Upload Section */}
          <Card className="border-0 shadow-sm bg-white/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-slate-800 flex items-center space-x-2">
                <ImageIcon className="h-5 w-5 text-primary" />
                <span>Hình Ảnh Khách Sạn</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload
                value={formData.imageUrl}
                onChange={(url) => setFormData((prev) => ({ ...prev, imageUrl: url }))}
                onRemove={() => setFormData((prev) => ({ ...prev, imageUrl: "" }))}
                label="Tải lên ảnh khách sạn"
              />
            </CardContent>
          </Card>

          <Separator className="my-8" />

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => setOpen(false)}
              className="px-8 h-12 text-slate-600 border-slate-300 hover:bg-slate-50"
            >
              Hủy Bỏ
            </Button>
            <Button type="submit" disabled={loading} className="px-8 h-12 bg-primary hover:bg-primary/90 shadow-lg">
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Đang tạo...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Tạo Khách Sạn</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import ImageUpload from '@/components/fileUpload'
import { MapPin, Star, Pencil, CheckCircle2 } from 'lucide-react'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import { Badge } from '@/components/ui/badge'
import * as LucideIcons from "lucide-react"
import type { LucideIcon } from "lucide-react"


interface HotelAmenities {
  id: number,
  amenityName: string,
  description: string
  icon: string
}


interface Props {
  hotelId: number
  amenities: HotelAmenities[]
}

interface FormData {
  name: string
  address: string
  city: string
  rating: string
  imageUrl: string
}

export default function HotelEditDialog({ hotelId, amenities }: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    address: '',
    city: '',
    rating: '',
    imageUrl: '',
  })
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [originalSelectedIds, setOriginalSelectedIds] = useState<number[]>([])

  const handleChange = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  useEffect(() => {
    if (!open) return
    const fetchHotel = async () => {
      try {
        const res = await api.get(`/api/hotels/${hotelId}`)
        const hotel = res.data
        setFormData(res.data)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const amenityIds = hotel.amenities?.map((item: any) => item.amenityId) || []
        setSelectedIds(amenityIds)
        setOriginalSelectedIds(amenityIds)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error('Không thể tải thông tin khách sạn')
      }
    }
    fetchHotel()
  }, [open, hotelId])

  const handleInputChange = (field: keyof Omit<FormData, 'imageUrl'>, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await api.put(`/api/hotels/${hotelId}`, formData)
      const newlyAdded = selectedIds.filter(id => !originalSelectedIds.includes(id))
      const removed = originalSelectedIds.filter(id => !selectedIds.includes(id))

      await Promise.all([
        ...newlyAdded.map((amenityId) =>
          api.patch(`/api/hotel-amenities/${amenityId}`, {
            hotelId,
            action: 'link'
          })
        ),

        ...removed.map((amenityId) =>
          api.patch(`/api/hotel-amenities/${amenityId}`, {
            hotelId,
            action: 'unlink'
          })
        )
      ])

      if (res.data) {
        toast.success('Cập nhật khách sạn thành công!')
        setOpen(false)
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Cập nhật thất bại.'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="space-x-1" onClick={() => setOpen(true)}>
          <Pencil className="h-4 w-4" />
          <span>Sửa</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[90vw] !max-w-none h-[95vh] overflow-y-auto rounded-2xl p-0 shadow-2xl bg-gradient-to-br from-white to-slate-50">
        <DialogHeader className="px-8 pt-8 pb-6 bg-gradient-to-r from-primary/5 to-primary/10 rounded-t-2xl">
          <DialogTitle className="text-2xl font-semibold text-primary">Chỉnh sửa khách sạn</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Tên khách sạn *</Label>
              <Input
                id="name"
                placeholder="VD: Khách sạn Mặt Trời"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city" className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                Thành phố *
              </Label>
              <Input
                id="city"
                placeholder="VD: Đà Lạt"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Địa chỉ đầy đủ *</Label>
            <Textarea
              id="address"
              placeholder="123 đường ABC, phường XYZ..."
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              required
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rating" className="flex items-center gap-1">
              <Star className="h-4 w-4" />
              Đánh giá *
            </Label>
            <div className="relative max-w-xs">
              <Input
                id="rating"
                type="number"
                min="1"
                max="5"
                step="0.1"
                placeholder="4.5"
                value={formData.rating}
                onChange={(e) => handleInputChange('rating', e.target.value)}
                required
              />
              <span className="absolute right-3 top-2.5 text-sm text-slate-500">/ 5.0</span>
            </div>
            <p className="text-xs text-muted-foreground">Nhập số từ 1.0 đến 5.0</p>
          </div>

          {/* amenity */}
          <div className="space-y-4">
            <div>
              <Label className="text-base font-semibold text-slate-800 flex items-center space-x-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span>Tiện Ích Khách Sạn</span>
              </Label>
              <p className="text-sm text-slate-600 mt-1">Chọn các tiện ích có sẵn tại khách sạn</p>
              <Badge variant="secondary" className="mt-2 text-xs px-2 py-1">
                {selectedIds.length} tiện ích đã chọn
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto pr-2">
              {amenities?.map((amenity: HotelAmenities) => {
                const IconComponent = (LucideIcons[amenity.icon as keyof typeof LucideIcons] ??
                  LucideIcons.HelpCircle) as LucideIcon;

                return (
                  <div
                    key={amenity.id}
                    className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md group ${selectedIds.includes(amenity.id)
                      ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/20"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    onClick={() => handleChange(amenity.id)}
                  >
                    <div className="flex items-start space-x-3">
                      {/* Custom Checkbox */}
                      <div
                        className={`mt-0.5 h-5 w-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${selectedIds.includes(amenity.id)
                          ? "border-primary bg-primary shadow-sm"
                          : "border-slate-300 group-hover:border-slate-400"
                          }`}
                      >
                        {selectedIds.includes(amenity.id) && (
                          <svg
                            className="h-3 w-3 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-slate-900 truncate flex items-center gap-2">
                          <IconComponent className="w-4 h-4 text-primary shrink-0" />
                          <span>{amenity.amenityName}</span>
                        </h4>
                        {amenity.description && (
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                            {amenity.description}
                          </p>
                        )}
                      </div>

                      {/* Selection Indicator */}
                      {selectedIds.includes(amenity.id) && (
                        <div className="absolute top-2 right-2">
                          <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
                        </div>
                      )}
                    </div>

                    {/* Hover Effect */}
                    <div className={`absolute inset-0 rounded-xl transition-opacity duration-200 ${selectedIds.includes(amenity.id)
                      ? "bg-primary/5 opacity-100"
                      : "bg-slate-100/50 opacity-0 group-hover:opacity-100"
                      }`}></div>
                  </div>
                )
              })}
            </div>
          </div>


          <ImageUpload
            value={formData.imageUrl}
            onChange={(url) => setFormData((prev) => ({ ...prev, imageUrl: url }))}
            onRemove={() => setFormData((prev) => ({ ...prev, imageUrl: '' }))}
            label="Ảnh khách sạn"
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Đang lưu...' : 'Cập nhật'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

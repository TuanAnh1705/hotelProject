'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import ImageUpload from '@/components/fileUpload'
import { MapPin, Star, Plus } from 'lucide-react'
import api from '@/lib/api'
import toast from 'react-hot-toast'

interface HotelAmenities {
  id: number,
  amenityName: string,
  description: string
}


interface Props {
  trigger?: React.ReactNode
  amenities: HotelAmenities[]
}

interface FormData {
  name: string
  address: string
  city: string
  rating: string
  imageUrl: string
}

export default function HotelFormDialog({ trigger, amenities }: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const [selectedIds, setSelectedIds] = useState<number[]>([])

  const handleChange = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  const [formData, setFormData] = useState<FormData>({
    name: '',
    address: '',
    city: '',
    rating: '',
    imageUrl: '',
  })
  console.log("selectedIds", selectedIds);


  const handleInputChange = (field: keyof Omit<FormData, 'imageUrl'>, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await api.post('/api/hotels', {
        ...formData,
        imageUrl: formData.imageUrl || null,
      })

      if (res.data) {
        toast.success('Hotel created successfully!')
        setOpen(false)
        setFormData({
          name: '',
          address: '',
          city: '',
          rating: '',
          imageUrl: '',
        })
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to create hotel. Please try again.'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="default" className="space-x-2">
            <Plus className="h-4 w-4" />
            <span>Thêm khách sạn</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl p-6 shadow-xl bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-primary">Thêm khách sạn mới</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Tên khách sạn *</Label>
              <Input
                id="name"
                placeholder="VD: Khách sạn Hoàng Gia"
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
                placeholder="VD: Đà Nẵng"
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
              placeholder="Số 123, đường ABC, phường XYZ, quận 1..."
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
          <div className="space-y-2">
            {amenities.map((amenity: HotelAmenities, index) => (
              <label key={index} className="flex items-center space-x-2 text-black">
                <input
                  type="checkbox"
                  value={amenity.id}
                  checked={selectedIds.includes(amenity.id)}
                  onChange={() => handleChange(amenity.id)}
                />
                <span>{amenity.amenityName}</span>
              </label>
            ))}
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
              {loading ? 'Đang tạo...' : 'Tạo khách sạn'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

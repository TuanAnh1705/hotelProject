'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useEffect, useState } from 'react'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import { Building2, DollarSign, Plus } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import ImageUpload from '@/components/fileUpload'

interface Props {
  hotelId: number
  trigger?: React.ReactNode
}

interface FormData {
  hotelId: number
  roomType: string
  price: number
  imageUrl: string
}

export default function RoomFormDialog({ hotelId, trigger }: Props) {
  const [open, setOpen] = useState(false)
  const [countRoomType, setCountRoomType] = useState(0)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    hotelId,
    roomType: '',
    price: 0,
    imageUrl: '',
  })

  const handleInputChange = (field: keyof Omit<FormData, 'imageUrl'>, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const getApiRoom = async () => {
    const res = await api.get(`/api/rooms?roomtype=${formData.roomType}`)
    const data = await res.data
    setCountRoomType(data.countRooms)
  }

  useEffect(() => {
    if (formData.roomType) {
      getApiRoom()
    }
  }, [formData.roomType])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (countRoomType > 10) {
      toast.error('Tối đa chỉ được 10 phòng cùng loại')
      setLoading(false)
      return
    }

    try {
      const res = await api.post(`/api/rooms`, formData)
      if (res.data) {
        toast.success('Tạo phòng thành công')
        setOpen(false)
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Lỗi tạo phòng:', error)
      const errorMessage = error.response?.data?.error || 'Lỗi không xác định'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button size="sm" variant="default" className="space-x-2">
            <Plus className="h-4 w-4" />
            <span>Thêm phòng</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh] rounded-xl border bg-white p-6 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-primary">Thêm phòng mới</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="shadow-none border-0 bg-transparent">
            <CardHeader className="px-0">
              <CardTitle className="text-lg font-medium text-slate-800 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Thông tin phòng
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Nhập thông tin cơ bản của phòng
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-0">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="roomType">Loại phòng *</Label>
                  <Input
                    id="roomType"
                    placeholder="Deluxe, Standard..."
                    value={formData.roomType}
                    onChange={(e) => handleInputChange('roomType', e.target.value)}
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
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="100"
                    required
                  />
                </div>
              </div>

              <div className="pt-4">
                <ImageUpload
                  value={formData.imageUrl}
                  onChange={(url) => setFormData((prev) => ({ ...prev, imageUrl: url }))}
                  onRemove={() => setFormData((prev) => ({ ...prev, imageUrl: '' }))}
                  label="Ảnh phòng"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Đang tạo...' : 'Tạo phòng'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

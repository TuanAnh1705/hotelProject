"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Building2, MapPin, Star, BedSingle, Eye } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import * as LucideIcons from "lucide-react"
import type { LucideIcon } from "lucide-react"


interface Hotel {
  id: number
  name: string
  address: string
  city: string
  rating: number
  imageUrl?: string
  _count: { rooms: number }
  amenities: { amenity: { id: number; amenityName: string; icon: string } }[]
}

interface ViewHotelDialogProps {
  hotel: Hotel
}



const renderStars = (rating: number) => {
  return (
    <div className="flex items-center space-x-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : i < rating
              ? "fill-yellow-200 text-yellow-400"
              : "text-gray-300"
            }`}
        />
      ))}
      <span className="ml-1 text-sm font-medium text-gray-600">{rating}</span>
    </div>
  )
}


export default function ViewHotelDialog({ hotel }: ViewHotelDialogProps) {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="space-x-1" onClick={() => setOpen(true)}>
          <Eye className="h-4 w-4" />
          <span> Xem</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[90vw] !max-w-5xl h-[90vh] overflow-y-auto rounded-2xl p-0 shadow-2xl bg-gradient-to-br from-white to-slate-50">
        <DialogHeader className="px-8 pt-8 pb-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-t-2xl">
          <DialogTitle className="flex items-center text-2xl font-bold text-slate-900 space-x-2">
            <Building2 className="h-6 w-6 text-primary" />
            <span>{hotel.name}</span>
          </DialogTitle>
          <DialogDescription className="text-slate-600 mt-1">Chi tiết Khách sạn</DialogDescription>
        </DialogHeader>

        <div className="px-8 pb-10 space-y-8">
          {hotel.imageUrl && (
            <div className="relative h-64 rounded-lg overflow-hidden bg-slate-100 shadow-md">
              <Image
                width={800}
                height={400}
                src={hotel.imageUrl || "/placeholder.svg"}
                alt={hotel.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-semibold text-slate-700">ID Khách Sạn</p>
              <p className="text-base text-slate-800">{hotel.id}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">Đánh Giá</p>
              <div className="flex items-center space-x-2">
                {renderStars(hotel.rating)}
                <span className="text-sm text-slate-600">({hotel.rating}/5)</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">Tiện ích</p>
              <div className="flex items-center space-x-2">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {hotel.amenities.map((item) => {
                    const IconComponent = (LucideIcons[item.amenity.icon as keyof typeof LucideIcons] ??
                      LucideIcons.HelpCircle) as LucideIcon
                    return (
                      <div
                        key={item.amenity.id}
                        className="flex items-start space-x-2 bg-slate-100 rounded-md p-2 shadow-sm"
                      >
                        <IconComponent className="h-4 w-4 text-primary mt-0.5" />
                        <span className="text-sm text-slate-700">{item.amenity.amenityName}</span>
                      </div>
                    )
                  })}
                </div>

              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">Thành Phố</p>
              <p className="text-base text-slate-800 flex items-center space-x-1">
                <MapPin className="h-4 w-4 text-primary" />
                <span>{hotel.city}</span>
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">Tổng Số Phòng</p>
              <p className="text-base text-slate-800 flex items-center space-x-1">
                <BedSingle className="h-4 w-4 text-primary" />
                <span>{hotel._count?.rooms ?? 0}</span>
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-700">Địa Chỉ Đầy Đủ</p>
            <p className="text-base text-slate-800 leading-relaxed">{hotel.address}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

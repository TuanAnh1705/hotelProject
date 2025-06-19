/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import React, { useEffect } from 'react';
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import api from '@/lib/api';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Building2, DollarSign} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import ImageUpload from '@/components/fileUpload';

interface FormData {
  hotelId: number
  roomType: string,
  price: number,
  imageUrl: string
}

export default function NewRoomPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [countRoomType,setCountRoomType] = useState(0)
  const [formData, setFormData] = useState<FormData>({
    hotelId: Number(id),
    roomType: "",
    price: Number(),
    imageUrl: "",
  })

  const handleInputChange = (field: keyof Omit<FormData, "imageUrl">, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }
 const getApiRoom= async()=>{
      const res = await api.get(`/api/rooms?roomtype=${formData.roomType}`)
      const data = await res.data
    setCountRoomType(data.countRooms)
  }

  useEffect(()=>{
    if(formData.roomType){
      getApiRoom()
    }
  },[formData.roomType])
  console.log("countRoomType",countRoomType);
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

 if (countRoomType > 10) {
  toast.error("Tối đa chỉ được 10 phòng cùng loại")
  return;
}

  
    try {
    
      const res = await api.post(`/api/rooms`, formData)
      if (res.data) {
        toast.success("Room Create successfully")
        router.push("/admin/rooms")
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log("Failed to create room: ", error);
      const errorMessage = error.response?.data?.error || "Failed to create room. Please try again"
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin/rooms">
              <Button variant="outline" size="sm" className="shadow-sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Rooms
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Create Room</h1>
                <p className="text-slate-600">Create your room property in your system</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center space-x-2 text-xl">
                <Building2 className="h-5 w-5 text-primary" />
                <span>Room Information</span>
              </CardTitle>
              <CardDescription className="text-base">
                Enter the basic details and information about Room property
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Room Type */}
                <div className="space-y-2">
                  <Label htmlFor="roomType" className="text-sm font-medium text-slate-700">
                    Room Type *
                  </Label>
                  <Input
                    id="roomType"
                    placeholder="Enter Room Type"
                    value={formData.roomType}
                    onChange={(e) => handleInputChange("roomType", e.target.value)}
                    className="h-11 border-slate-200 focus:border-primary focus:ring-primary"
                    required
                  />
                </div>
              </div>
              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="price" className="text-sm font-medium text-slate-700 flex items-center space-x-1">
                  <DollarSign className="h-4 w-4" />
                  <span>Price of Room in the Hotel *</span>
                </Label>
                <div className="relative max-w-xs">
                  <Input
                    id="price"
                    type="number"
                    min="1"
                    max="1000"
                    step="1"
                    placeholder="100"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    className="h-11 border-slate-200 focus:border-primary focus:ring-primary pr-16"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-slate-500 text-sm">$/ 1 Night</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500">Enter Price Of this Hotel</p>
              </div>

              {/* Image Upload */}
              <ImageUpload
                value={formData.imageUrl}
                onChange={(url) => setFormData((prev) => ({ ...prev, imageUrl: url }))}
                onRemove={() => setFormData((prev) => ({ ...prev, imageUrl: "" }))}
                label="Hotel Image"
              />
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-6">
            <Link href="/admin/hotels">
              <Button variant="outline" size="lg" className="min-w-[120px] shadow-sm">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={loading} size="lg" className="min-w-[140px] shadow-sm">
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Updating...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Building2 className="h-4 w-4" />
                  <span>Update Hotel</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )

}
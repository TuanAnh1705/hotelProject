"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Building2, MapPin, Star } from "lucide-react"
import Link from "next/link"
import api from "@/lib/api"
import toast from "react-hot-toast"
import ImageUpload from "@/components/fileUpload"


interface FormData {
  name: string
  address: string
  city: string
  rating: string
  imageUrl: string
}

export default function NewHotelPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

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
        name: formData.name,
        address: formData.address,
        city: formData.city,
        rating: formData.rating,
        imageUrl: formData.imageUrl || null,
      })

      if (res.data) {
        toast.success("Hotel created successfully!")
        router.push("/admin/hotels")
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Failed to create hotel:", error)
      const errorMessage = error.response?.data?.error || "Failed to create hotel. Please try again."
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
            <Link href="/admin/hotels">
              <Button variant="outline" size="sm" className="shadow-sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Hotels
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Add New Hotel</h1>
                <p className="text-slate-600">Create a new hotel property in your system</p>
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
                <span>Hotel Information</span>
              </CardTitle>
              <CardDescription className="text-base">
                Enter the basic details and information about the hotel property
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Hotel Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-slate-700">
                    Hotel Name *
                  </Label>
                  <Input
                    id="name"
                    placeholder="Enter hotel name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="h-11 border-slate-200 focus:border-primary focus:ring-primary"
                    required
                  />
                </div>

                {/* City */}
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-sm font-medium text-slate-700 flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>City *</span>
                  </Label>
                  <Input
                    id="city"
                    placeholder="Enter city name"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    className="h-11 border-slate-200 focus:border-primary focus:ring-primary"
                    required
                  />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-medium text-slate-700">
                  Full Address *
                </Label>
                <Textarea
                  id="address"
                  placeholder="Enter complete hotel address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className="min-h-[100px] border-slate-200 focus:border-primary focus:ring-primary resize-none"
                  required
                />
              </div>

              {/* Rating */}
              <div className="space-y-2">
                <Label htmlFor="rating" className="text-sm font-medium text-slate-700 flex items-center space-x-1">
                  <Star className="h-4 w-4" />
                  <span>Hotel Rating *</span>
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
                    onChange={(e) => handleInputChange("rating", e.target.value)}
                    className="h-11 border-slate-200 focus:border-primary focus:ring-primary pr-16"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-slate-500 text-sm">/ 5.0</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500">Enter a rating between 1.0 and 5.0</p>
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
                  <span>Creating...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Building2 className="h-4 w-4" />
                  <span>Create Hotel</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Edit, Trash2 } from "lucide-react"
import { amenityService, type HotelAmenity } from "@/services/amenityService"
import type { AxiosError } from "axios"
import { showToast } from "@/lib/toast"

export default function HotelAmenitiesPage() {
  const [amenities, setAmenities] = useState<HotelAmenity[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  const [formData, setFormData] = useState({
    amenityName: "",
    description: "",
  })

  useEffect(() => {
    fetchAmenities()
  }, [])

  const fetchAmenities = async () => {
    try {
      const data = await amenityService.hotelAmenities.getAll()
      setAmenities(data)
    } catch (err) {
        const axiosError = err as AxiosError<{ error: string }>;
        showToast.error(axiosError.response?.data?.error || "Failed to fetch hotels");
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await showToast.promise(amenityService.hotelAmenities.create(formData), {
        loading: "Creating amenity...",
        success: "Amenity created successfully",
        error: "Failed to create amenity",
      })

      setFormData({ amenityName: "", description: "" })
      setShowForm(false)
      fetchAmenities()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Error already handled by toast.promise
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hotel Amenities</h1>
          <p className="text-muted-foreground">Manage amenities available at hotels</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Amenity
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Hotel Amenity</CardTitle>
            <CardDescription>Create a new amenity that can be assigned to hotels</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="amenityName">Amenity Name</Label>
                <Input
                  id="amenityName"
                  value={formData.amenityName}
                  onChange={(e) => setFormData({ ...formData, amenityName: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Amenity</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {amenities.map((amenity) => (
          <Card key={amenity.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{amenity.amenityName}</CardTitle>
                <div className="flex space-x-1">
                  <Button variant="outline" size="sm">
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{amenity.description || "No description provided"}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

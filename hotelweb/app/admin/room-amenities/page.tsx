/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Edit, Trash2 } from "lucide-react"
import { amenityService, type RoomAmenity } from "@/services/amenityService"
import toast from "react-hot-toast"

export default function RoomAmenitiesPage() {
  const [amenities, setAmenities] = useState<RoomAmenity[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  const [formData, setFormData] = useState({
    amenityName: "",
    description: "",
  })

  useEffect(() => {
    fetchAmenities()
  }, [])

  const fetchAmenities = async () => {
    try {
      const data = await amenityService.roomAmenities.getAll()
      setAmenities(data)
    } catch (error:any) {
      toast.error(error.response.data.message)
      
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await amenityService.roomAmenities.create(formData)

      toast.success("success")
      setFormData({ amenityName: "", description: "" })
      setShowForm(false)
      fetchAmenities()
    } catch (error: any) {
      toast.error(error.response.data.message)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Room Amenities</h1>
          <p className="text-muted-foreground">Manage amenities available in rooms</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Amenity
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Room Amenity</CardTitle>
            <CardDescription>Create a new amenity that can be assigned to rooms</CardDescription>
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

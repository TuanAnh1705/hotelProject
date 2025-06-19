"use client"

import api from "@/lib/api"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Building2, MapPin, Star, Search, Plus, Edit, Trash2, Eye, Loader2, ImageIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface Hotel {
  id: number
  name: string
  address: string
  city: string
  rating: number
  imageUrl?: string
}

const HotelsPage = () => {
  const router = useRouter()
  const [hotels, setHotels] = useState<Hotel[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null)
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null)

  const fetchHotels = async () => {
    try {
      setLoading(true)
      const res = await api.get("/api/hotels")
      setHotels(res.data)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Failed to fetch hotels", error)
      const errorMessage = error.response?.data?.error || "Failed to load hotels"
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHotels()
  }, [])

  const filteredHotels = hotels?.filter(
    (hotel) =>
      hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.address.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleView = (hotel: Hotel) => {
    setSelectedHotel(hotel)
  }

  const handleDelete = async (id: number) => {
    try {
      setDeleteLoading(id)
      await api.delete(`/api/hotels/${id}`)
      toast.success("Hotel deleted successfully")
      fetchHotels()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Failed to delete hotel", error)
      const errorMessage = error.response?.data?.error || "Failed to delete hotel"
      toast.error(errorMessage)
    } finally {
      setDeleteLoading(null)
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-slate-600">Loading hotels...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      {/* Search + Add Section */}
      <Card className="shadow-sm bg-white/80 backdrop-blur-sm flex flex-col gap-2">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search hotels by name, city, or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11 border-slate-200 focus:border-primary focus:ring-primary w-full"
              />
            </div>
            <Link href="/admin/hotels/new">
              <Button size="lg" className="w-full md:w-auto shadow-sm">
                <Plus className="mr-2 h-4 w-4" />
                Add New Hotel
              </Button>
            </Link>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Hotels Management</h1>
              <p className="text-slate-600">Manage your hotel properties ({hotels?.length || 0} hotels)</p>
            </div>
          </div>
        </div>
        </CardFooter>
      </Card>

      <div className="mx-auto max-w-7xl space-y-8">

        {/* Hotels Grid */}
        {filteredHotels && filteredHotels.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredHotels.map((hotel) => (
              <Card
                key={hotel.id}
                className="h-[310px] w-[420px] shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-200 group overflow-hidden flex flex-col gap-1"
              >
                {/* Hotel Image */}
                <div className="relative h-24 bg-gradient-to-br from-slate-100 to-slate-200">
                  {hotel.imageUrl ? (
                    <Image
                      width={500}
                      height={500}
                      src={hotel.imageUrl || "/placeholder.svg"}
                      alt={hotel.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="flex flex-col items-center space-y-2 text-slate-400">
                        <ImageIcon className="h-12 w-12" />
                        <span className="text-sm font-medium">No Image</span>
                      </div>
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
                      ID: {hotel.id}
                    </Badge>
                  </div>
                </div>

                <CardHeader className="py-1 px-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl font-semibold text-slate-900 group-hover:text-primary transition-colors">
                        {hotel.name}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        <div className="flex items-center space-x-1 text-slate-600">
                          <MapPin className="h-4 w-4" />
                          <span>{hotel.city}</span>
                        </div>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-2 px-3 pb-3 pt-1">
                  <div>
                    <p className="text-xs text-slate-500 truncate">{hotel.address}</p>
                  </div>

                  <div className="flex items-center justify-between">{renderStars(hotel.rating)}</div>

                  <div className="flex items-center space-x-2 pt-4 border-t border-slate-100">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => handleView(hotel)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-lg">
                        <DialogHeader>
                          <DialogTitle className="flex items-center space-x-2">
                            <Building2 className="h-5 w-5 text-primary" />
                            <span>{selectedHotel?.name}</span>
                          </DialogTitle>
                          <DialogDescription>Hotel Details</DialogDescription>
                        </DialogHeader>
                        {selectedHotel && (
                          <div className="space-y-4">
                            {/* Hotel Image in Modal */}
                            {selectedHotel.imageUrl && (
                              <div className="relative h-48 rounded-lg overflow-hidden bg-slate-100">
                                <Image
                                  width={500}
                                  height={500}
                                  src={selectedHotel.imageUrl || "/placeholder.svg"}
                                  alt={selectedHotel.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm font-medium text-slate-700">Hotel ID</p>
                                <p className="text-sm text-slate-600">{selectedHotel.id}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-slate-700">Rating</p>
                                <div className="flex items-center space-x-1">{renderStars(selectedHotel.rating)}</div>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-700">City</p>
                              <p className="text-sm text-slate-600 flex items-center space-x-1">
                                <MapPin className="h-4 w-4" />
                                <span>{selectedHotel.city}</span>
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-700">Full Address</p>
                              <p className="text-sm text-slate-600 leading-relaxed">{selectedHotel.address}</p>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>

                    <Button variant="outline" size="sm" className="flex-1" onClick={() => router.push(`/admin/hotels/edit?id=${hotel.id}`)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button onClick={() => router.push(`/admin/rooms/new?id=${hotel.id}`)}>Tạo room</Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          disabled={deleteLoading === hotel.id}
                        >
                          {deleteLoading === hotel.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Hotel</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete {hotel.name}? This action cannot be undone and will
                            permanently remove the hotel from your system.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(hotel.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete Hotel
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="shadow-sm border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-12">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
                    <Building2 className="h-10 w-10 text-slate-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {searchTerm ? "No hotels found" : "No hotels yet"}
                  </h3>
                  <p className="text-slate-600 mt-1">
                    {searchTerm
                      ? `No hotels match your search "${searchTerm}"`
                      : "Get started by adding your first hotel property"}
                  </p>
                </div>
                {!searchTerm && (
                  <Link href="/admin/hotels/new">
                    <Button size="lg" className="mt-4">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Your First Hotel
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default HotelsPage

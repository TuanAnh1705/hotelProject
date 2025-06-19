'use client'
import api from '@/lib/api'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

interface Hotel {
  id: number;
  name: string;
  address: string;
  city: string;
  rating: number
}
const Page = () => {
  const [hotel, setHotel] = useState<Hotel[] | null>(null)



  const fetchAmenities = async () => {
    try {
      const res = await api.get("/api/hotels")
      setHotel(res.data)
    } catch (error) {
      console.error("Failed to fetch amenities:", error)
      toast.error("Failed to fetch amenities")
    }
  }

  useEffect(() => {
    fetchAmenities()
  }, [])
  console.log(hotel);
  return (
    <div>
      <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="px-4 py-2 border-b">ID</th>
            <th className="px-4 py-2 border-b">Name</th>
            <th className="px-4 py-2 border-b">Address</th>
            <th className="px-4 py-2 border-b">City</th>
            <th className="px-4 py-2 border-b">Rating</th>
          </tr>
        </thead>
        <tbody>
          {hotel?.map((hotel) => (
            <tr key={hotel.id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border-b">{hotel.id}</td>
              <td className="px-4 py-2 border-b">{hotel.name}</td>
              <td className="px-4 py-2 border-b">{hotel.address}</td>
              <td className="px-4 py-2 border-b">{hotel.city}</td>
              <td className="px-4 py-2 border-b">{hotel.rating}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Page

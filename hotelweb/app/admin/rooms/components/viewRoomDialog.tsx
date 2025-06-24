"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, DollarSign, MapPin } from "lucide-react"

interface Room {
    id: number
    roomType: string
    price: number
    availability: boolean
    imageUrl: string
    hotel: {
        id: number
        name: string
        address: string
    }
    // amenities: Array<{
    //     amenity: {
    //         id: number
    //         name: string
    //     }
    // }>
}

interface Props {
    room: Room
    open: boolean
    onOpenChange: (open: boolean) => void
}

export default function ViewRoomDialog({ room, open, onOpenChange }: Props) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold">Chi tiết phòng - {room.roomType}</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Room Image */}
                    <div className="aspect-video relative bg-gray-100 rounded-lg overflow-hidden">
                        {room.imageUrl ? (
                            <img
                                src={room.imageUrl || "/placeholder.svg"}
                                alt={room.roomType}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <Building2 className="h-16 w-16 text-muted-foreground" />
                            </div>
                        )}
                        <div className="absolute top-4 right-4">
                            <Badge variant={room.availability ? "default" : "secondary"} className="text-sm">
                                {room.availability ? "Có sẵn" : "Không có sẵn"}
                            </Badge>
                        </div>
                    </div>

                    {/* Room Info */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Building2 className="h-5 w-5" />
                                    Thông tin phòng
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Loại phòng</p>
                                    <p className="text-lg font-semibold">{room.roomType}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Giá mỗi đêm</p>
                                    <p className="text-2xl font-bold text-primary flex items-center gap-1">
                                        <DollarSign className="h-5 w-5" />
                                        {room.price}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Trạng thái</p>
                                    <Badge variant={room.availability ? "default" : "secondary"}>
                                        {room.availability ? "Có sẵn" : "Không có sẵn"}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5" />
                                    Thông tin khách sạn
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Tên khách sạn</p>
                                    <p className="text-lg font-semibold">{room.hotel.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Địa điểm</p>
                                    <p className="text-base">{room.hotel.address}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Amenities */}
                    {/* {room.amenities.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Wifi className="h-5 w-5" />
                                    Tiện nghi phòng
                                </CardTitle>
                                <CardDescription>Các tiện nghi có sẵn trong phòng này</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {room.amenities.map((amenity) => (
                                        <Badge key={amenity.amenity.id} variant="outline">
                                            {amenity.amenity.name}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )} */}
                </div>
            </DialogContent>
        </Dialog>
    )
}

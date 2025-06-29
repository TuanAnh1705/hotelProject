"use client"

import api from "@/lib/api"
import React, { useState } from "react"
import toast from "react-hot-toast"
import * as LucideIcons from "lucide-react"
import { CheckCircle2, Loader2, Palette, Plus, Sparkles, type LucideIcon } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface EditAmenityDialogProps {
    amenity:{
        id: number
        amenityName: string
        description: string
        icon: string
    }
    onAmenityUpdated: () => void
}

interface FormData {
    amenityName: string,
    description: string,
    icon: string
}

const iconCategories = {
    "Công nghệ": ["Wifi", "Tv", "Phone", "Zap", "Radio", "Smartphone", "Laptop"],
    "Giải trí": ["Waves", "Dumbbell", "Music", "GameController2", "Camera", "Headphones"],
    "Ăn uống": ["Coffee", "Utensils", "Wine", "ChefHat", "IceCream", "Pizza"],
    "Tiện nghi": ["Bed", "Bath", "AirVent", "Thermometer", "Shirt", "Scissors"],
    "Dịch vụ": ["Car", "Shield", "Users", "Clock", "Bell", "Key", "Briefcase"],
    Khác: ["Star", "Heart", "Home", "Building", "Trees", "Sun", "Moon", "Gift", "MapPin"],
}

export function EditAmenityDialog({ onAmenityUpdated }: EditAmenityDialogProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState<string>("Công nghệ")
    const [formData, setFormData] = useState<FormData>({
        amenityName: "",
        description: "",
        icon: ""
    })
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.amenityName.trim() || !formData.icon) {
            toast.error("Vui lòng nhập tên tiện ích và chọn icon")
            return
        }

        try {
            setLoading(true)

            const res = await api.post("/api/hotel-amenities",
                {
                    amenityName: formData.amenityName.trim(),
                    description: formData.description.trim(),
                    icon: formData.icon
                })

            if (res.data.success) {
                toast.success("Thêm tiện ích thành công")
                setFormData({ amenityName: "", description: "", icon: "" })
                setOpen(false)
                onAmenityUpdated()
            } else {
                toast.error("Có lỗi xảy ra khi thêm tiện ích")
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error("Error adding amenity:", error)
            toast.error(error.response?.data?.error || "Không thể thêm tiện ích")
        } finally {
            setLoading(false)
        }
    }

    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const getIconComponent = (iconName: string) => {
        const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons] as LucideIcon
        return IconComponent || LucideIcons.HelpCircle
    }


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default" className="space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>Thêm Tiện ích</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="w-[90vw] !max-w-4xl h-[95vh] overflow-y-auto rounded-2xl p-0 shadow-2xl bg-gradient-to-br from-white to-slate-50">
                <DialogHeader className="px-8 pt-8 pb-6 bg-gradient-to-r from-primary/5 to-primary/10 rounded-t-2xl">
                    <div className="flex items-center space-x-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                            <Sparkles className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <DialogTitle className="text-3xl font-bold text-slate-900">
                                Thêm Tiện Ích mới
                            </DialogTitle>
                            <p className="text-slate-600 mt-1">Tạo tiện ích mới cho hệ thống khách sạn</p>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-8">
                    <Card className="border-0 shadow-sm bg-white/50">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg font-semibold text-slate-800 flex items-center space-x-2">
                                <Sparkles className="h-5 w-5 text-primary" />
                                <span>Thông Tin Tiện Ích</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-3">
                                <Label htmlFor="amenityName" className="text-sm font-medium text-slate-700">
                                    Tên tiện ích *
                                </Label>
                                <Input
                                    id="amenityName"
                                    placeholder="VD: WiFi miễn phí, Hồ bơi ngoài trời..."
                                    value={formData.amenityName}
                                    onChange={(e) => handleInputChange("amenityName", e.target.value)}
                                    required
                                    className="h-12 border-slate-200 focus:border-primary focus:ring-primary/20"
                                />
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="description" className="text-sm font-medium text-slate-700">
                                    Mô tả chi tiết
                                </Label>
                                <Textarea
                                    id="description"
                                    placeholder="Mô tả chi tiết về tiện ích này..."
                                    value={formData.description}
                                    onChange={(e) => handleInputChange("description", e.target.value)}
                                    className="min-h-[100px] resize-none border-slate-200 focus:border-primary focus:ring-primary/20"
                                />
                                <p className="text-xs text-slate-500">Mô tả sẽ giúp khách hàng hiểu rõ hơn về tiện ích</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm bg-white/50">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg font-semibold text-slate-800 flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Palette className="h-5 w-5 text-primary" />
                                    <span>Chọn Icon</span>
                                </div>
                                {formData.icon && (
                                    <Badge variant="secondary" className="text-xs flex items-center gap-1">
                                        {(() => {
                                            const IconComponent = getIconComponent(formData.icon)
                                            return <IconComponent className=" h-3 w-3" />
                                        })()}
                                        {formData.icon}
                                    </Badge>
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex flex-wrap gap-2">
                                {Object.keys(iconCategories).map((category) => (
                                    <Button
                                        key={category}
                                        type="button"
                                        variant={selectedCategory === category ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setSelectedCategory(category)}
                                        className="text-xs"
                                    >
                                        {category}
                                    </Button>
                                ))}
                            </div>

                            <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
                                {iconCategories[selectedCategory as keyof typeof iconCategories].map((iconName) => {
                                    const IconComponent = getIconComponent(iconName)
                                    const isSelected = formData.icon == iconName

                                    return (
                                        <div
                                            key={iconName}
                                            className={`relative p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md flex flex-col items-center gap-2 ${isSelected
                                                ? "border-primary bg-primary/5 shadow-sm"
                                                : "border-slate-200 bg-white hover:border-slate-300"
                                                }`}
                                            onClick={() => handleInputChange("icon", formData.icon === iconName ? "" : iconName)}
                                        >
                                            <IconComponent className={`h-5 w-5 ${isSelected ? "text-primary" : "text-slate-600"}`} />
                                            <span className={`text-xs font-medium truncate w-full text-center ${isSelected ? "text-primary" : "text-slate-500"
                                                }`}>
                                                {iconName}
                                            </span>
                                            {isSelected && (
                                                <div className="absolute -top-1 -right-1">
                                                    <CheckCircle2 className="h-4 w-4 text-primary bg-white rounded-full" />
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>

                           

                        </CardContent>
                    </Card>

                    <Separator className="my-8" />

                    {/* action button */}
                    <div className="flex justify-end gap-4 pt-4">
                        <Button
                            variant="outline"
                            type="button"
                            onClick={() => setOpen(false)}
                            className="px-8 h-12 text-slate-600 border-slate-300 hover:bg-slate-50"
                        >
                            Hủy Bỏ
                        </Button>
                        <Button type="submit" disabled={loading} className="px-8 h-12 bg-primary hover:bg-primary/90 shadow-lg">
                            {loading ? (
                                <div className="flex items-center space-x-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>Đang tạo...</span>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <Plus className="h-4 w-4" />
                                    <span>Tạo Tiện Ích</span>
                                </div>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
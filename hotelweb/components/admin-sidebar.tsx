"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Building2,
  Bed,
  Settings,
  Users,
  Calendar,
  CreditCard,
  Star,
  Gift,
  UserCheck,
  Bell,
  Activity,
  MessageSquare,
} from "lucide-react"

const navigation = [
  { name: "Hotels", href: "/admin/hotels", icon: Building2 },
  { name: "Rooms", href: "/admin/rooms", icon: Bed },
  { name: "Room Types", href: "/admin/room-types", icon: Settings },
  { name: "Hotel Amenities", href: "/admin/hotel-amenities", icon: Settings },
  { name: "Room Amenities", href: "/admin/room-amenities", icon: Settings },
  { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Bookings", href: "/admin/bookings", icon: Calendar },
  { name: "Payments", href: "/admin/payments", icon: CreditCard },
  { name: "Reviews", href: "/admin/reviews", icon: Star },
  { name: "Promotions", href: "/admin/promotions", icon: Gift },
  { name: "Employees", href: "/admin/employees", icon: UserCheck },
  { name: "Services", href: "/admin/services", icon: Settings },
  { name: "Notifications", href: "/admin/notifications", icon: Bell },
  { name: "Activity Logs", href: "/admin/activity-logs", icon: Activity },
  { name: "Toast Demo", href: "/admin/toast-demo", icon: MessageSquare },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col bg-gray-900">
      <div className="flex h-16 items-center justify-center bg-gray-800">
        <h1 className="text-xl font-bold text-white">Hotel Admin</h1>
      </div>
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navigation.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                pathname === item.href ? "bg-gray-800 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white",
              )}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

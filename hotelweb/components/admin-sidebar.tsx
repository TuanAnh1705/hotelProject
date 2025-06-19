"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Building2,
  Bed,
  Calendar,
  Users,
  UserCheck,
  Briefcase,
  CreditCard,
  Star,
  Tag,
  Wifi,
  Shield,
  CalendarDays,
  Bell,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight,
  Home,
  Menu,
  X,
} from "lucide-react"

interface MenuItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
}

interface MenuSection {
  title: string
  items: MenuItem[]
}

const menuSections: MenuSection[] = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Overview",
        href: "/admin",
        icon: Home,
      },
      {
        title: "Analytics",
        href: "/admin/analytics",
        icon: BarChart3,
      },
    ],
  },
  {
    title: "Hotel Management",
    items: [
      {
        title: "Hotels",
        href: "/admin/hotels",
        icon: Building2,
      },
      {
        title: "Rooms",
        href: "/admin/rooms",
        icon: Bed,
      },
      {
        title: "Room Types",
        href: "/admin/room-types",
        icon: Bed,
      },
    ],
  },
  {
    title: "Booking Management",
    items: [
      {
        title: "Bookings",
        href: "/admin/bookings",
        icon: Calendar,
        badge: 12,
      },
      {
        title: "Booking Status",
        href: "/admin/booking-status",
        icon: Calendar,
      },
      {
        title: "Services",
        href: "/admin/services",
        icon: Briefcase,
      },
    ],
  },
  {
    title: "Customer Management",
    items: [
      {
        title: "Customers",
        href: "/admin/customers",
        icon: Users,
      },
      {
        title: "Reviews",
        href: "/admin/reviews",
        icon: Star,
      },
    ],
  },
  {
    title: "Staff Management",
    items: [
      {
        title: "Employees",
        href: "/admin/employees",
        icon: UserCheck,
      },
      {
        title: "Departments",
        href: "/admin/departments",
        icon: Briefcase,
      },
      {
        title: "Employee Roles",
        href: "/admin/employee-roles",
        icon: UserCheck,
      },
    ],
  },
  {
    title: "Financial",
    items: [
      {
        title: "Payments",
        href: "/admin/payments",
        icon: CreditCard,
      },
      {
        title: "Promotions",
        href: "/admin/promotions",
        icon: Tag,
      },
    ],
  },
  {
    title: "Amenities & Policies",
    items: [
      {
        title: "Hotel Amenities",
        href: "/admin/hotel-amenities",
        icon: Wifi,
      },
      {
        title: "Room Amenities",
        href: "/admin/room-amenities",
        icon: Wifi,
      },
      {
        title: "Hotel Policies",
        href: "/admin/hotel-policies",
        icon: Shield,
      },
    ],
  },
  {
    title: "Events & Notifications",
    items: [
      {
        title: "Hotel Events",
        href: "/admin/hotel-events",
        icon: CalendarDays,
      },
      {
        title: "Notifications",
        href: "/admin/notifications",
        icon: Bell,
        badge: 5,
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        title: "Activity Logs",
        href: "/admin/activity-logs",
        icon: BarChart3,
      },
      {
        title: "Settings",
        href: "/admin/settings",
        icon: Settings,
      },
    ],
  },
]

interface AdminSidebarProps {
  className?: string
}

export default function AdminSidebar({ className }: AdminSidebarProps) {
  const pathname = usePathname()
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set())
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const toggleSection = (sectionTitle: string) => {
    const newCollapsed = new Set(collapsedSections)
    if (newCollapsed.has(sectionTitle)) {
      newCollapsed.delete(sectionTitle)
    } else {
      newCollapsed.add(sectionTitle)
    }
    setCollapsedSections(newCollapsed)
  }

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin"
    }
    return pathname.startsWith(href)
  }

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex h-16 items-center border-b px-6">
        <div className="flex items-center space-x-2">
          <Building2 className="h-8 w-8 text-primary" />
          <div>
            <h2 className="text-lg font-semibold">Hotel Admin</h2>
            <p className="text-xs text-muted-foreground">Management System</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-2">
          {menuSections.map((section) => (
            <div key={section.title} className="space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-between px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                onClick={() => toggleSection(section.title)}
              >
                <span>{section.title}</span>
                {collapsedSections.has(section.title) ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>

              {!collapsedSections.has(section.title) && (
                <div className="space-y-1 pl-3">
                  {section.items.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link key={item.href} href={item.href}>
                        <Button
                          variant={isActive(item.href) ? "secondary" : "ghost"}
                          className={cn(
                            "w-full justify-start px-3 py-2 text-sm font-normal",
                            isActive(item.href) && "bg-secondary font-medium",
                          )}
                          onClick={() => setIsMobileOpen(false)}
                        >
                          <Icon className="mr-3 h-4 w-4" />
                          <span className="flex-1 text-left">{item.title}</span>
                          {item.badge && (
                            <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                              {item.badge}
                            </span>
                          )}
                        </Button>
                      </Link>
                    )
                  })}
                </div>
              )}
              <Separator className="my-2" />
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t p-4">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <UserCheck className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Admin User</p>
            <p className="text-xs text-muted-foreground truncate">admin@hotel.com</p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="outline"
        size="sm"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsMobileOpen(true)}
      >
        <Menu className="h-4 w-4" />
      </Button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setIsMobileOpen(false)} />
      )}

      {/* Desktop Sidebar */}
      <div className={cn("hidden md:flex h-screen w-64 flex-col border-r bg-background", className)}>
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform bg-background transition-transform duration-200 ease-in-out md:hidden",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between border-b px-6">
            <div className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-primary" />
              <div>
                <h2 className="text-lg font-semibold">Hotel Admin</h2>
                <p className="text-xs text-muted-foreground">Management System</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setIsMobileOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1">
            <SidebarContent />
          </div>
        </div>
      </div>
    </>
  )
}

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { 
  GraduationCap, 
  Users, 
  UserCheck, 
  BookOpen, 
  LayoutDashboard,
  LogOut
} from "lucide-react"
import { signOut, useSession } from "next-auth/react"

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Students",
    href: "/dashboard/students",
    icon: GraduationCap,
  },
  {
    name: "Teachers",
    href: "/dashboard/teachers",
    icon: Users,
  },
  {
    name: "Attendance",
    href: "/dashboard/attendance",
    icon: UserCheck,
  },
  {
    name: "Classes",
    href: "/dashboard/classes",
    icon: BookOpen,
  },
]


export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  const handleSignOut = () => {
    signOut({ callbackUrl: "/login" })
  }

  return (
    <div className="flex h-full w-64 flex-col bg-gray-900">
      <div className="flex h-16 items-center justify-center bg-gray-800">
        <GraduationCap className="h-8 w-8 text-white" />
        <span className="ml-2 text-lg font-semibold text-white">
          School SMS
        </span>
      </div>
      
      <div className="flex flex-1 flex-col justify-between">
        <nav className="flex-1 space-y-1 px-2 py-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                  isActive
                    ? "bg-gray-800 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                )}
              >
                <item.icon
                  className={cn(
                    "mr-3 h-5 w-5",
                    isActive ? "text-white" : "text-gray-400"
                  )}
                />
                {item.name}
              </Link>
            )
          })}
        </nav>
        
        <div className="p-4">
          <div className="flex items-center mb-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-white">
                {session?.user?.name}
              </p>
              <p className="text-xs text-gray-400">
                {session?.user?.role}
              </p>
            </div>
          </div>
          <Button
            onClick={handleSignOut}
            variant="outline"
            size="sm"
            className="w-full"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  )
}
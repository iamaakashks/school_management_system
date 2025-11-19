"use client"

import { useSession } from "next-auth/react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getInitials } from "@/lib/utils"

export function Header() {
  const { data: session } = useSession()

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="flex h-16 items-center justify-between px-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Dashboard
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">
              {session?.user?.name}
            </p>
            <p className="text-xs text-gray-500">
              {session?.user?.role}
            </p>
          </div>
          <Avatar>
            <AvatarFallback>
              {session?.user?.name ? getInitials(session.user.name) : "U"}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
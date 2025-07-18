"use client"

import Sidebar from "@/components/ui/side-nav"
import TopHeader from "@/components/ui/top-header"
import { useState } from "react"

interface DashboardLayoutProps {
  children: React.ReactNode
  activeNav?: string
}

export default function DashboardLayout({
  children,
  activeNav = "Dashboard",
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeNav={activeNav}
      />

      <div className="flex-1 flex flex-col lg:ml-0">
        <TopHeader onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  )
}

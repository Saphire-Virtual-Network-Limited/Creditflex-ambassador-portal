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
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeNav={activeNav}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopHeader onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  )
}

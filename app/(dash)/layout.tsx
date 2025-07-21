"use client"

import Sidebar from "@/components/ui/side-nav"
import TopHeader from "@/components/ui/top-header"
import { useEffect, useState } from "react"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Lock scroll on the scrollable container
  useEffect(() => {
    const container = document.getElementById("layout-container")
    if (container) {
      container.style.overflow = sidebarOpen ? "hidden" : "auto"
    }
  }, [sidebarOpen])

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col" id="layout-container">
        <TopHeader onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 lg:p-8 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  )
}

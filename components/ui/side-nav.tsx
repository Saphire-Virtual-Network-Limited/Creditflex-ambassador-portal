// components/Sidebar.tsx
"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { X, Users, Crown } from "lucide-react"
import brandLogo from "@/public/assets/svgs/brand-logo.svg"

const navigationItems = [
  { name: "Dashboard", href: "/dashboard", icon: "grid" },
  { name: "Leads", href: "/leads", icon: "users" },
  { name: "Commissions", href: "/commissions", icon: "crown" },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  activeNav: string
}

const Sidebar = ({ isOpen, onClose, activeNav }: SidebarProps) => {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-blue-600 to-blue-800 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-blue-500">
          <Image src={brandLogo} alt="logo" height={32} />
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden text-white hover:bg-blue-700"
            onClick={onClose}
          >
            <X size={20} />
          </Button>
        </div>

        <nav className="mt-8 px-4">
          {navigationItems.map((item) => {
            const isActive = item.name === activeNav
            return (
              <a
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 mb-2 rounded-lg text-white transition-colors ${
                  isActive
                    ? "bg-blue-700 bg-opacity-50"
                    : "hover:bg-blue-700 hover:bg-opacity-30"
                }`}
              >
                {item.icon === "grid" && (
                  <div className="w-5 h-5 grid grid-cols-2 gap-0.5">
                    <div className="bg-white rounded-sm"></div>
                    <div className="bg-white rounded-sm"></div>
                    <div className="bg-white rounded-sm"></div>
                    <div className="bg-white rounded-sm"></div>
                  </div>
                )}
                {item.icon === "users" && <Users size={20} />}
                {item.icon === "crown" && <Crown size={20} />}
                <span className="font-medium">{item.name}</span>
              </a>
            )
          })}
        </nav>
      </div>
    </>
  )
}

export default Sidebar

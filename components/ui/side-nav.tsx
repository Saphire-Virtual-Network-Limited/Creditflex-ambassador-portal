// components/Sidebar.tsx
"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { X, Users, Crown } from "lucide-react"
import brandLogo from "@/public/assets/svgs/brand-logo.svg"
import cornerBox from "@/public/assets/svgs/corner-box.svg"
import dashboardIcon from "@/public/assets/svgs/dashboard-icon.svg"
import leadsIcon from "@/public/assets/svgs/multiple-user-outlined.svg"
import commissionsIcon from "@/public/assets/svgs/commisson.svg"
import Link from "next/link"

const navigationItems = [
  { name: "Dashboard", href: "/admin-dashboard", icon: dashboardIcon },
  { name: "Leads", href: "/admin-leads", icon: leadsIcon },
  { name: "Commissions", href: "/admin-commissions", icon: commissionsIcon },
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
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 w-72 bg-primaryBlue transform ${isOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-blue-500">
          <Link className="cursor-pointer" href="/admin-dashboard">
            <Image src={brandLogo} alt="logo" width={150} />
          </Link>
          <Image src={cornerBox} alt="logo" width={32} />
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
                className={`flex items-center gap-3 px-4 py-3 mb-2 rounded-lg text-white transition-colors ${isActive
                  ? "bg-blue-700 text-green-500 bg-opacity-50"
                  : "hover:bg-blue-700 hover:bg-opacity-30"
                  }`}
              >
                {item.name === "Dashboard" && (
                  <span>
                    <Image src={dashboardIcon} alt="dashboard" width={20} />
                  </span>
                )}
                {item.name === "Leads" && (
                  <span>
                    <Image src={leadsIcon} alt="leads" width={20} />
                  </span>
                )}
                {item.name === "Commissions" && (
                  <span>
                    <Image src={commissionsIcon} alt="commissions" width={20} />
                  </span>
                )}
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

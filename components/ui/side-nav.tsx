"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import brandLogo from "@/public/assets/svgs/brand-logo.svg"
import cornerBox from "@/public/assets/svgs/corner-box.svg"
import dashboardIcon from "@/public/assets/svgs/dashboard-icon.svg"
import leadsIcon from "@/public/assets/svgs/multiple-user-outlined.svg"
import commissionsIcon from "@/public/assets/svgs/commisson.svg";
import cancelIcon from "@/public/assets/svgs/cancelIcon.svg";
import { useEffect } from "react"

const navigationItems = [
  { name: "Dashboard", href: "/admin-dashboard", icon: dashboardIcon },
  { name: "Leads", href: "/admin-leads", icon: leadsIcon },
  { name: "Commissions", href: "/admin-commissions", icon: commissionsIcon },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const router = useRouter()
  const pathname = usePathname()

  const handleNavigation = (href: string) => {
    router.push(href)
    onClose()
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  return (
    <>
      {/* {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )} */}

      <div
        className={`fixed inset-y-0 left-0 md:w-72 bg-primaryBlue z-10 transform ${isOpen ? "translate-x-0 z-20" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 `}
      >
        <div className="flex gap-4 items-center justify-between mt-14 md:mt-0 h-16 px-6">

          <Image src={brandLogo} alt="logo" width={150} className="cursor-pointer" onClick={() => router.push("/admin-dashboard")} />
          <Image src={cornerBox} className="hidden md:block" alt="corner-box" width={32} />
          <span>
            <Image src={cancelIcon} onClick={onClose} className="lg:hidden w-6 h-6 " alt="corner-box" width={32} />
          </span>
        </div>

        <nav className="mt-8 px-4">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href

            return (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.href)}
                className={`w-full flex items-center gap-3 px-4 py-3 mb-2 rounded-lg text-left text-white transition-colors ${isActive
                  ? "bg-blue-700 text-[#98DFEA] bg-opacity-50"
                  : "hover:bg-blue-700 hover:bg-opacity-30"
                  }`}
              >
                <Image src={item.icon} alt={`${item.name} icon`} width={20} />
                <span className="font-medium">{item.name}</span>
              </button>
            )
          })}
        </nav>
      </div>
    </>
  )
}

export default Sidebar

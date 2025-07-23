"use client"

import Image from "next/image"
import { useRouter, usePathname } from "next/navigation"
import { Icon } from "@iconify/react"
import brandLogo from "@/public/assets/svgs/brand-logo.svg"
import cornerBox from "@/public/assets/svgs/corner-box.svg"
import cancelIcon from "@/public/assets/svgs/cancelIcon.svg";
import { useEffect } from "react"

const navigationItems = [
  { name: "Dashboard", href: "/admin-dashboard", icon: "material-symbols:dashboard" },
  { name: "Leads", href: "/admin-leads", icon: "mdi:account-group" },
  { name: "Commissions", href: "/admin-commission", icon: "fluent:receipt-money-24-filled" },
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
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-10"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-72 bg-primaryBlue z-20 transform ${isOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:z-auto`}
      >
        <div className="flex gap-4 items-center justify-between mt-14 md:mt-0 h-16 px-6">
          <span>
            <Image src={cancelIcon} onClick={onClose} className="lg:hidden w-6 h-6 " alt="corner-box" width={32} />
          </span>
          <Image src={brandLogo} alt="logo"  className="cursor-pointer" onClick={() => router.push("/admin-dashboard")} />
          <Image src={cornerBox} className="hidden md:block" alt="corner-box" width={32} />

        </div>

        <nav className="mt-8 px-4">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href

            return (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.href)}
                className={`w-full flex items-center gap-3 px-4 py-3 mb-2 rounded-lg text-left transition-colors ${isActive
                  ? "bg-blue-800 bg-opacity-50"
                  : "hover:bg-blue-800/25 hover:bg-opacity-30"
                  }`}
              >
                <Icon
                  icon={item.icon}
                  width={20}
                  className={isActive ? "text-[#98DFEA]" : "text-white"}
                />
                <span className={`font-medium ${isActive ? "text-[#98DFEA]" : "text-white"}`}>
                  {item.name}
                </span>
              </button>
            )
          })}
        </nav>
      </div>
    </>
  )
}

export default Sidebar

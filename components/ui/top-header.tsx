"use client"

import { Menu, Bell, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"
import avatarImage from "@/public/assets/images/avatar.jpg";
import { useRouter } from "next/navigation";







interface HeaderProps {
  onMenuClick: () => void
}

const TopHeader = ({ onMenuClick }: HeaderProps) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={onMenuClick}
          >
            <Menu size={20} />
          </Button>
        </div>
       

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="relative">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>

          <Avatar src={avatarImage.src} name="Jane Doe" size="sm" />

          <DropdownMenu onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 focus:outline-none focus:ring-0 focus-visible:ring-0">
                <span className="hidden sm:inline">Geraldine</span>
                {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Button onClick={() => router.push("/profile")} variant="ghost" className="w-full justify-start">Profile</Button>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => console.log("Logging out...")}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

export default TopHeader

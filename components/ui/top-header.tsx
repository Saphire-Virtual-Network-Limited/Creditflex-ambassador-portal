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
import { logout } from "@/lib/api";
import { toast } from "sonner";
import { TokenManager } from "@/lib/tokenManager";







interface HeaderProps {
  onMenuClick: () => void
}

const TopHeader = ({ onMenuClick }: HeaderProps) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // Get user data from TokenManager
  const userData = TokenManager.getUserData();
  const userName = userData?.name || userData?.email || "Geraldine";

  const handleLogout = () => {
    try {
      // Clear all authentication data
      logout();
      
      // Show success message
      toast.success("Logged out successfully");
      
      // Redirect to sign-in page
      router.push("/sign-in");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout. Please try again.");
    }
  };

  return (
    <header className="sticky top-0 z-10 bg-white md:border-b border-gray-200 px-4 lg:px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center border rounded-md gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={onMenuClick}
          >
            <Menu size={20} />
          </Button>
        </div>


        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="relative">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>

          <Avatar src={avatarImage.src} name="Jane Doe" size="sm" />

          <DropdownMenu onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 focus:outline-none outline-none focus:ring-0 focus-visible:ring-0 focus:border-none">
                <span className="hidden sm:inline">{userName}</span>
                {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <p onClick={() => router.push("/profile")} className="cursor-pointer justify-end md:justify-center">Profile</p>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer justify-end md:justify-center" onSelect={handleLogout}>
                Logout
              </DropdownMenuItem>
              <DropdownMenuItem className="md:hidden" >
                <div className="md:hidden text-right md:text-center">
                  <p className="text-xs font-medium text-lightBrown">Telesales Agent Assigned To:</p>
                  <p className="font-semibold text-primaryBlue">Abimbola Jinadus</p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

export default TopHeader

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
import { useState, useEffect } from "react"
import avatarImage from "@/public/assets/images/avatar.jpg";
import { useRouter } from "next/navigation";
import { logout, getAmbassadorProfile } from "@/lib/api";
import { toast } from "sonner";
import { TokenManager } from "@/lib/tokenManager";

// Interface for ambassador profile data
interface AmbassadorProfile {
    id: string;
    bvn: string;
    phoneNumber: string | null;
    emailAddress: string;
    institution: string | null;
    fullName: string;
    address: string;
    ippisNumber: string | null;
    password: string;
    accountNumber: string;
    accountName: string;
    bankName: string;
    bankCode: string;
    referralCode: string;
    referredBy: string | null;
    ambassadorProfile: string;
    teleSalesId: string | null;
    createdAt: string;
    updatedBy: string;
}

interface HeaderProps {
  onMenuClick: () => void
}

const TopHeader = ({ onMenuClick }: HeaderProps) => {
  const [open, setOpen] = useState(false);
  const [profileData, setProfileData] = useState<AmbassadorProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const router = useRouter();

  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchProfileData = async () => {
      // Don't fetch if user is not authenticated
      if (!TokenManager.isAuthenticated()) {
        setLoadingProfile(false);
        return;
      }

      try {
        setLoadingProfile(true);
        const response = await getAmbassadorProfile();
        if (response?.statusCode === 200 && response?.data) {
          setProfileData(response.data);
        } else {
          console.error("Failed to fetch profile:", response);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoadingProfile(false);
      }
    };

    // Only fetch if user is authenticated
    if (TokenManager.isAuthenticated()) {
      fetchProfileData();
    } else {
      setLoadingProfile(false);
    }
  }, []);

  // Get user name from profile data or fallback to email
  const userName = loadingProfile ? "Loading..." : (profileData?.fullName || profileData?.emailAddress || "User");

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

          <Avatar src={avatarImage.src} name={userName} size="sm" />

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
                  <p className="font-semibold text-primaryBlue">{profileData?.teleSalesId || 'Not assigned'}</p>
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

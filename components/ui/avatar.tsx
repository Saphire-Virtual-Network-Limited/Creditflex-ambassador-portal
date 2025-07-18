// components/ui/avatar.tsx

import Image from "next/image";
import { cn } from "@/lib/utils"; // optional utility for className merging

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "w-8 h-8 text-sm",
  md: "w-10 h-10 text-base",
  lg: "w-14 h-14 text-lg",
};

export const Avatar = ({ src, alt, name, size = "md", className }: AvatarProps) => {
  const initials = name ? name.split(" ").map(n => n[0]).join("").toUpperCase() : "U";

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-gray-200 text-gray-600 font-semibold overflow-hidden",
        sizeClasses[size],
        className
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={alt || name || "Avatar"}
          width={40}
          height={40}
          className="object-cover w-full h-full"
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
};

import Image from "next/image";
import { User } from "lucide-react";
import { getInitials } from "@/lib/image-utils";

interface UserAvatarProps {
  src?: string;
  name?: string;
  size?: number;
  className?: string;
  alt?: string;
  userAddress?: string;
}

export function UserAvatar({ src, name, size = 40, className = "", userAddress }: UserAvatarProps) {
  const initials = name ? getInitials(name) : "";

  if (src) {
    return (
      <div className={`overflow-hidden rounded-full ${className}`} style={{ width: size, height: size }}>
        <Image
          src={src || "/placeholder.svg"}
          alt={name || "User avatar"}
          width={size}
          height={size}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`bg-orange-500 rounded-full flex items-center justify-center text-white ${className}`}
      style={{ width: size, height: size }}
    >
      {initials || <User size={size * 0.5} />}
    </div>
  );
}

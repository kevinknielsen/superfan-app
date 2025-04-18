"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { getInitials } from "@/lib/image-utils"

export interface UserAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  name?: string
  src?: string
  size?: number
}

const UserAvatar = React.forwardRef<HTMLDivElement, UserAvatarProps>(
  ({ className, name, src, size = 40, ...props }, ref) => {
    const initials = name ? getInitials(name) : ""

    return (
      <div
        className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted", className)}
        style={{ width: size, height: size }}
        ref={ref}
        {...props}
      >
        {src ? (
          <img src={src || "/placeholder.svg"} alt={name} className="aspect-square h-full w-full" />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-base font-medium text-muted-foreground">
            {initials}
          </span>
        )}
      </div>
    )
  },
)
UserAvatar.displayName = "UserAvatar"

export { UserAvatar }

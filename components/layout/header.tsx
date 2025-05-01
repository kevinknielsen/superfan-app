"use client"

import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Menu, X, LogOut, ExternalLink } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { UserAvatar } from "@/components/ui/user-avatar"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ThemeToggle"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const pathname = usePathname()
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Don't show header on login and signup pages
  if (pathname === "/login" || pathname === "/signup" || pathname === "/forgot-password") {
    return null
  }

  // Only show header for authenticated users
  if (!isAuthenticated) {
    return null
  }

  return (
    <header className="border-b border-gray-200 dark:border-gray-800 py-4 bg-background text-foreground sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <Link href="/browse" className="flex items-center">
            <Image
              src="/superfan-logo-white.png"
              alt="Superfan Logo"
              width={220}
              height={40}
              className="h-10 w-auto object-contain object-left"
            />
            <span className="text-xs text-gray-400 bg-gray-700 px-1 rounded ml-2">BETA</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/launch"
              className="text-muted-foreground hover:text-foreground"
            >
              Launch
            </Link>
            <Link href="/deals" className="text-muted-foreground hover:text-foreground">
              Projects
            </Link>
            <Link href="/groups" className="text-muted-foreground hover:text-foreground">
              Curators
            </Link>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center">
            <Link href="/settings/wallet" className="mr-4 text-sm text-muted-foreground hover:text-foreground">
              Wallet • ${user?.walletBalance || 0} USDC
            </Link>
            <ThemeToggle />
            {/* Replace the avatar code with the UserAvatar component */}
            <div className="relative" ref={dropdownRef}>
              <button className="flex items-center" onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}>
                <UserAvatar src={user?.avatar} name={user?.name} size={32} />
              </button>
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-md shadow-lg py-1 z-10">
                  <Link href="/dashboard" className="block px-4 py-2 text-sm text-foreground hover:bg-muted">
                    Portfolio
                  </Link>
                  <Link href="/unlocks" className="block px-4 py-2 text-sm text-foreground hover:bg-muted">
                    Unlocks
                  </Link>
                  <Link href="/settings/wallet" className="block px-4 py-2 text-sm text-foreground hover:bg-muted">
                    Wallet
                  </Link>
                  <Link href="/settings/profile" className="block px-4 py-2 text-sm text-foreground hover:bg-muted">
                    Profile
                  </Link>
                  <Link
                    href="/settings/notifications"
                    className="block px-4 py-2 text-sm text-foreground hover:bg-muted"
                  >
                    Notifications
                  </Link>
                  <Link href="/settings/documents" className="block px-4 py-2 text-sm text-foreground hover:bg-muted">
                    Documents
                  </Link>
                  <div className="border-t border-border my-1"></div>
                  <a
                    href="https://twitter.com/superfanone"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-muted"
                  >
                    Follow on X
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          <Link href="/settings/wallet" className="mr-4 text-sm text-muted-foreground">
            ${user?.walletBalance || 0} USDC
          </Link>
          <ThemeToggle />
          <button
            type="button"
            className="text-foreground p-2 rounded-md hover:bg-muted"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden py-4 px-4 bg-background border-t border-border animate-in slide-in-from-top duration-300">
          <nav className="flex flex-col space-y-4">
            <Link
              href="/launch"
              className="text-muted-foreground hover:text-foreground py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Launch
            </Link>
            <Link
              href="/deals"
              className="text-muted-foreground hover:text-foreground py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Projects
            </Link>
            <Link
              href="/groups"
              className="text-muted-foreground hover:text-foreground py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Curators
            </Link>
            <Link
              href="/settings/profile"
              className="text-muted-foreground hover:text-foreground py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Profile
            </Link>
            <Link
              href="/settings/wallet"
              className="text-muted-foreground hover:text-foreground py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Wallet
            </Link>
            <Link
              href="/settings/notifications"
              className="text-muted-foreground hover:text-foreground py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Notifications
            </Link>
            <Link
              href="/settings/documents"
              className="text-muted-foreground hover:text-foreground py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Documents
            </Link>
            <button
              onClick={() => {
                logout()
                setMobileMenuOpen(false)
              }}
              className="text-left text-muted-foreground hover:text-foreground py-2 flex items-center"
            >
              <LogOut className="h-4 w-4 mr-2" /> Sign out
            </button>
          </nav>
        </div>
      )}
    </header>
  )
}

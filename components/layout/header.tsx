"use client"

import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Menu, X, LogOut, ExternalLink } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
// Import the UserAvatar component
import { UserAvatar } from "@/components/ui/user-avatar"

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
    <header className="border-b border-gray-200 py-4 bg-[#0f172a] text-white sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <Link href="/browse" className="font-bold text-xl flex items-center">
            <span className="mr-2">SUPERFAN ONE</span>
            <span className="text-xs text-gray-400 bg-gray-700 px-1 rounded">BETA</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link href="/deals" className="text-gray-300 hover:text-white">
              Deals
            </Link>
            <Link href="/groups" className="text-gray-300 hover:text-white">
              Groups
            </Link>
            <Link href="/dashboard" className="text-gray-300 hover:text-white">
              Portfolio
            </Link>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center">
            <Link href="/settings/wallet" className="mr-4 text-sm hover:text-gray-300">
              Wallet • ${user?.walletBalance || 0} USDC
            </Link>
            {/* Replace the avatar code with the UserAvatar component */}
            <div className="relative" ref={dropdownRef}>
              <button className="flex items-center" onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}>
                <UserAvatar src={user?.avatar} name={user?.name} size={32} />
              </button>
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <Link href="/settings/wallet" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Wallet
                  </Link>
                  <Link href="/settings/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Profile
                  </Link>
                  <Link
                    href="/settings/notifications"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Notifications
                  </Link>
                  <Link href="/settings/documents" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Documents
                  </Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  <a
                    href="https://twitter.com/superfanone"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Follow on X
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
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
          <Link href="/settings/wallet" className="mr-4 text-sm">
            ${user?.walletBalance || 0} USDC
          </Link>
          <button
            type="button"
            className="text-white p-2 rounded-md hover:bg-gray-800"
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
        <div className="md:hidden py-4 px-4 bg-[#0f172a] border-t border-gray-800 animate-in slide-in-from-top duration-300">
          <nav className="flex flex-col space-y-4">
            <Link
              href="/deals"
              className="text-gray-300 hover:text-white py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Deals
            </Link>
            <Link
              href="/groups"
              className="text-gray-300 hover:text-white py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Groups
            </Link>
            <Link
              href="/dashboard"
              className="text-gray-300 hover:text-white py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Portfolio
            </Link>
            <Link
              href="/settings/profile"
              className="text-gray-300 hover:text-white py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Profile
            </Link>
            <Link
              href="/settings/wallet"
              className="text-gray-300 hover:text-white py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Wallet
            </Link>
            <Link
              href="/settings/notifications"
              className="text-gray-300 hover:text-white py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Notifications
            </Link>
            <Link
              href="/settings/documents"
              className="text-gray-300 hover:text-white py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Documents
            </Link>
            <button
              onClick={() => {
                logout()
                setMobileMenuOpen(false)
              }}
              className="text-left text-gray-300 hover:text-white py-2 flex items-center"
            >
              <LogOut className="h-4 w-4 mr-2" /> Sign out
            </button>
          </nav>
        </div>
      )}
    </header>
  )
}

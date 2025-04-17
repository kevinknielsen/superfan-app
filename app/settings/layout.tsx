"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import ProtectedRoute from "@/components/protected-route"

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="w-full md:w-64 shrink-0 mb-6 md:mb-0">
            <nav className="flex md:flex-col overflow-x-auto md:overflow-visible pb-2 md:pb-0">
              <div className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-1">
                <SettingsNavLink href="/settings/wallet">Wallet</SettingsNavLink>
                <SettingsNavLink href="/settings/profile">Profile</SettingsNavLink>
                <SettingsNavLink href="/settings/notifications">Notifications</SettingsNavLink>
                <SettingsNavLink href="/settings/documents">Documents</SettingsNavLink>
              </div>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  )
}

function SettingsNavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      className={`px-4 py-2 whitespace-nowrap md:whitespace-normal ${
        isActive
          ? "border-b-2 md:border-b-0 md:border-l-2 border-blue-600 text-blue-600 font-medium"
          : "border-b-2 md:border-b-0 md:border-l-2 border-transparent text-gray-600 hover:text-gray-900"
      }`}
    >
      {children}
    </Link>
  )
}

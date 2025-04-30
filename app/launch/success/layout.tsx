"use client"

import type React from "react"

import { LaunchProjectProvider } from "@/contexts/launch-project-context"
import ProtectedRoute from "@/components/protected-route"

export default function SuccessLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <LaunchProjectProvider>{children}</LaunchProjectProvider>
    </ProtectedRoute>
  )
}

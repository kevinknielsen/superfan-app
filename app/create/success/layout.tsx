"use client"

import type React from "react"

import { CreateProjectProvider } from "@/contexts/create-project-context"
import ProtectedRoute from "@/components/protected-route"

export default function SuccessLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <CreateProjectProvider>{children}</CreateProjectProvider>
    </ProtectedRoute>
  )
}

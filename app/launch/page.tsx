"use client"

import { LaunchProjectProvider } from "@/contexts/launch-project-context"
import LaunchProjectWizard from "@/components/launch/launch-project-wizard"
import ProtectedRoute from "@/components/protected-route"

export default function LaunchPage() {
  return (
    <ProtectedRoute>
      <LaunchProjectProvider>
        <LaunchProjectWizard />
      </LaunchProjectProvider>
    </ProtectedRoute>
  )
}

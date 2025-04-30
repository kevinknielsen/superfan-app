"use client"

import { CreateProjectProvider } from "@/contexts/create-project-context"
import CreateProjectWizard from "@/components/create/create-project-wizard"
import ProtectedRoute from "@/components/protected-route"

export default function CreatePage() {
  return (
    <ProtectedRoute>
      <CreateProjectProvider>
        <CreateProjectWizard />
      </CreateProjectProvider>
    </ProtectedRoute>
  )
}

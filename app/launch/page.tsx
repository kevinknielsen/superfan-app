"use client"

import { LaunchProjectProvider } from "@/contexts/launch-project-context"
import LaunchProjectWizard from "@/components/launch/launch-project-wizard"

export default function LaunchPage() {
  return (
    <LaunchProjectProvider>
      <LaunchProjectWizard />
    </LaunchProjectProvider>
  )
}

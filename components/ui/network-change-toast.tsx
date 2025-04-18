"use client"

import { useEffect } from "react"

interface NetworkChangeToastProps {
  network: string
  show: boolean
  onClose: () => void
  isTestnet: boolean
}

export function NetworkChangeToast({ network, show, onClose, isTestnet }: NetworkChangeToastProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose()
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  if (!show) return null

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 flex items-center gap-3 z-50 animate-in slide-in-from-bottom duration-300">
      {/* Component JSX... */}
    </div>
  )
}

"use client"

import { useEffect } from "react"
import Image from "next/image"
import { CheckCircle2 } from "lucide-react"

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
      <div className="relative">
        <div className="w-8 h-8 flex items-center justify-center">
          <Image src="/base-logo.png" alt="Base Logo" width={32} height={32} className="w-8 h-8" />
        </div>
        <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
          <CheckCircle2 className="h-3 w-3 text-white" />
        </div>
      </div>
      <div>
        <p className="font-medium">Network Changed</p>
        <p className="text-sm text-gray-600">You are now connected to {network}</p>
      </div>
    </div>
  )
}

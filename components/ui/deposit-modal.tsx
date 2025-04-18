"use client"

import { useState } from "react"
import { Dialog } from "@/components/ui/dialog"

interface DepositModalProps {
  isOpen: boolean
  onClose: () => void
}

export function DepositModal({ isOpen, onClose }: DepositModalProps) {
  const [copied, setCopied] = useState(false)
  const walletAddress = "0x998a01c7e0d3ba5b53f4c4"

  const handleCopy = () => {
    navigator.clipboard.writeText(`base:${walletAddress}`).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      {/* Component JSX... */}
    </Dialog>
  )
}

"use client"

import { useState } from "react"

interface WalletAddressProps {
  address: string
  label?: string
}

export function WalletAddress({ address, label = "Embedded Wallet" }: WalletAddressProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(address).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return <div className="space-y-2">{/* Component JSX... */}</div>
}

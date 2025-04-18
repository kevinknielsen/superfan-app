"use client"

import { useState } from "react"
import { Copy, CheckCircle } from "lucide-react"

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

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold">{label}</h2>
      <div className="relative">
        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
          <div className="flex-1 p-4 font-mono text-sm overflow-x-auto whitespace-nowrap">{address}</div>
          <button
            onClick={handleCopy}
            className="p-4 bg-white hover:bg-gray-50 border-l border-gray-200 transition-colors"
            aria-label="Copy wallet address"
          >
            {copied ? <CheckCircle className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5 text-gray-500" />}
          </button>
        </div>
      </div>
    </div>
  )
}

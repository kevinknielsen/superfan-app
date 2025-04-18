"use client"

import { useState } from "react"
import Image from "next/image"
import { X, Copy, CheckCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Deposit</DialogTitle>
          <p className="text-gray-500 mt-1">to your Superfan embedded wallet</p>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </DialogHeader>

        <div className="bg-blue-600 text-white p-4 rounded-md flex items-center gap-3 mb-4">
          <div className="bg-white rounded-full p-2">
            <Image src="/base-logo.png" alt="Base Logo" width={24} height={24} />
          </div>
          <div>
            <h3 className="font-semibold">Fund USDC on Base</h3>
            <p className="text-sm opacity-90">You need to bridge to Base to use Superfan</p>
          </div>
        </div>

        <div className="bg-gray-100 p-6 rounded-md flex justify-center">
          <div className="bg-white p-3 rounded-md">
            <Image src="/abstract-qr-code.png" alt="QR Code" width={200} height={200} className="w-48 h-48" />
          </div>
        </div>

        <div className="flex items-center justify-between bg-gray-100 p-3 rounded-md">
          <div className="text-gray-600 font-mono text-sm">base:{walletAddress}</div>
          <button
            onClick={handleCopy}
            className="bg-white hover:bg-gray-50 text-gray-800 px-4 py-2 rounded-md text-sm font-medium flex items-center gap-1 transition-colors"
          >
            {copied ? (
              <>
                <CheckCircle className="h-4 w-4 text-green-500" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy
              </>
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

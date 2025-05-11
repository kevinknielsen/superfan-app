"use client"

import { useState } from "react"
import Image from "next/image"
import { X, Copy, CheckCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import QRCode from "react-qr-code"

interface DepositModalProps {
  isOpen: boolean
  onClose: () => void
  walletAddress: string
}

export function DepositContent({ walletAddress }: { walletAddress: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="px-6 pb-4 flex flex-col gap-6 w-full">
      <div className="mt-2 mb-4">
        <div className="bg-blue-600 text-white p-4 rounded-lg flex items-center gap-4 shadow w-full">
          <div className="bg-white rounded-full p-2 flex items-center justify-center">
            <Image src="/base-logo.png" alt="Base Logo" width={28} height={28} />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Fund USDC on Base</h3>
            <p className="text-sm opacity-90">You need to bridge to Base to use Superfan</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center gap-6">
        <div className="bg-gray-100 p-6 rounded-xl flex justify-center shadow-inner w-full">
          <div className="bg-white p-3 rounded-lg flex items-center justify-center">
            <QRCode value={walletAddress} size={180} />
          </div>
        </div>
        <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg w-full max-w-full mt-2">
          <div className="text-gray-600 font-mono text-xs sm:text-sm break-all">{walletAddress}</div>
          <button
            onClick={handleCopy}
            className="bg-white hover:bg-gray-50 text-gray-800 px-3 py-2 rounded-md text-xs sm:text-sm font-medium flex items-center gap-1 transition-colors border border-gray-200 shadow-sm"
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
      </div>
    </div>
  )
}

export function DepositModal({ isOpen, onClose, walletAddress }: DepositModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-full max-w-md mx-auto rounded-2xl p-0 overflow-auto max-h-[90vh] flex flex-col justify-center items-center">
        <DialogHeader className="relative px-6 pt-4 pb-0 w-full">
          <DialogTitle className="text-2xl font-bold">Deposit</DialogTitle>
          <p className="text-gray-500 mt-1 mb-2">to your Superfan embedded wallet</p>
          <button
            onClick={onClose}
            className="absolute right-6 top-6 rounded-full opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-white p-1 shadow"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </button>
        </DialogHeader>
        <DepositContent walletAddress={walletAddress} />
      </DialogContent>
    </Dialog>
  )
}

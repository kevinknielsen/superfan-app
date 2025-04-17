"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MoreVertical, LinkIcon } from "lucide-react"

export default function WalletPage() {
  const [moreMenuOpen, setMoreMenuOpen] = useState(false)

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Wallet</h1>

      {/* Wallet Balance */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="mb-6">
          <h2 className="text-4xl font-bold mb-2">$0.00</h2>
          <p className="text-gray-600">Ready to invest • USDC on Base</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Button className="bg-[#0f172a] hover:bg-[#1e293b]">Deposit</Button>
          <Button variant="outline">Withdraw</Button>
          <div className="relative ml-auto">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setMoreMenuOpen(!moreMenuOpen)}
              aria-label="More options"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
            {moreMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10">
                <button
                  className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  onClick={() => {
                    setMoreMenuOpen(false)
                  }}
                >
                  Export your private key
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Claims from investment */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Claims from investment</h2>
          <span className="bg-gray-100 text-gray-600 text-sm px-2 py-1 rounded-full">0</span>
        </div>

        <div className="bg-white rounded-lg shadow p-8 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <LinkIcon className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No claims available</h3>
          <p className="text-gray-600 max-w-md">
            If you made investments in tokens, locked and claimable assets will appear here after the token has been
            dispersed.
          </p>
        </div>
      </div>
    </div>
  )
}

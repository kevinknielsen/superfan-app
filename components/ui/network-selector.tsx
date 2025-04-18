"use client"

import { useState } from "react"
import Image from "next/image"
import { Check, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NetworkChangeToast } from "@/components/ui/network-change-toast"

type Network = {
  id: string
  name: string
  isTestnet: boolean
}

const networks: Network[] = [
  {
    id: "base",
    name: "Base",
    isTestnet: false,
  },
  {
    id: "base-sepolia",
    name: "Base Sepolia",
    isTestnet: true,
  },
]

export function NetworkSelector() {
  const [selectedNetwork, setSelectedNetwork] = useState<Network>(networks[0])
  const [showToast, setShowToast] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const selectNetwork = (network: Network) => {
    setSelectedNetwork(network)
    setIsOpen(false)
    setShowToast(true)
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 transition-colors rounded-full px-4 py-2 text-sm font-medium h-auto"
      >
        <span className="text-gray-600">Connected to</span>
        <Image src="/base-logo.png" alt="Base Logo" width={20} height={20} className="w-5 h-5" />
        <span className="font-semibold">{selectedNetwork.name}</span>
        <ChevronDown className="h-4 w-4 text-gray-500" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-[200px] bg-white rounded-md shadow-lg z-50 py-1 border border-gray-200">
          {networks.map((network) => (
            <button
              key={network.id}
              onClick={() => selectNetwork(network)}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Image src="/base-logo.png" alt="Base Logo" width={16} height={16} className="w-4 h-4" />
                <span>{network.name}</span>
              </div>
              {selectedNetwork.id === network.id && <Check className="h-4 w-4 text-green-600" />}
            </button>
          ))}
        </div>
      )}

      <NetworkChangeToast
        network={selectedNetwork.name}
        show={showToast}
        onClose={() => setShowToast(false)}
        isTestnet={selectedNetwork.isTestnet}
      />
    </div>
  )
}

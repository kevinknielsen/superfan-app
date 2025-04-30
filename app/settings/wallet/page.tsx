"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { MoreVertical, LinkIcon } from "lucide-react"
import { NetworkSelector } from "@/components/ui/network-selector"
import { DepositModal } from "@/components/ui/deposit-modal"
import { SignMessage } from "@/components/ui/sign-message"
import { WalletAddress } from "@/components/ui/wallet-address"
import { useWallets, useFundWallet } from "@privy-io/react-auth"
import { formatEther } from "viem"
import { useToast } from "@/components/ui/use-toast"
import { ethers } from "ethers"
import { base } from 'viem/chains'

export default function WalletPage() {
  const [moreMenuOpen, setMoreMenuOpen] = useState(false)
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false)
  const [balance, setBalance] = useState<string>("0")
  const { wallets } = useWallets()
  const { toast } = useToast()
  const embeddedWallet = wallets.find((wallet) => wallet.walletClientType === "privy")
  const { fundWallet } = useFundWallet()

  useEffect(() => {
    const fetchBalance = async () => {
      if (embeddedWallet) {
        try {
          console.log('embeddedWallet:', embeddedWallet)
          console.log('embeddedWallet.address:', embeddedWallet.address)
          // Use Infura Base Mainnet RPC
          const BASE_RPC_URL = `https://base-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_PROJECT_ID}`
          const provider = new ethers.JsonRpcProvider(BASE_RPC_URL)
          const balance = await provider.getBalance(embeddedWallet.address)
          console.log('Fetched balance (wei):', balance.toString())
          setBalance(formatEther(balance))
        } catch (error) {
          console.error("Error fetching balance:", error)
          toast({
            title: "Error",
            description: "Failed to fetch wallet balance",
            variant: "destructive",
          })
        }
      } else {
        console.log('embeddedWallet is not available')
      }
    }

    fetchBalance()
  }, [embeddedWallet, toast])

  const handleWithdraw = async () => {
    if (!embeddedWallet) {
      toast({
        title: "Error",
        description: "No wallet connected",
        variant: "destructive",
      })
      return
    }

    try {
      // Implement withdrawal logic here
      toast({
        title: "Success",
        description: "Withdrawal initiated",
      })
    } catch (error) {
      console.error("Error withdrawing:", error)
      toast({
        title: "Error",
        description: "Failed to initiate withdrawal",
        variant: "destructive",
      })
    }
  }

  const handleFund = () => {
    if (embeddedWallet?.address) {
      fundWallet(embeddedWallet.address, {
        chain: base,
        // asset: 'USDC', // Optional: or 'native-currency'
        // amount: '25',  // Optional: string, or leave undefined for dashboard default
      });
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Wallet Settings</h1>

      {/* Wallet Balance */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Balance</h2>
          <NetworkSelector />
        </div>
        <p className="text-3xl font-bold mb-4">{Number(balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ETH</p>
        <div className="flex gap-4">
          <Button onClick={() => setIsDepositModalOpen(true)}>
            Deposit
          </Button>
          <Button variant="outline" onClick={handleWithdraw}>
            Withdraw
          </Button>
          <Button onClick={handleFund}>
            Fund
          </Button>
        </div>
      </div>

      {/* Wallet Address Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Wallet Address</h2>
        <p className="font-mono text-sm break-all">
          {embeddedWallet?.address || "No wallet connected"}
        </p>
      </div>

      {/* Sign Message Section */}
      <div className="mb-8">
        <SignMessage />
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

      {/* Deposit Modal */}
      {embeddedWallet && (
        <DepositModal
          isOpen={isDepositModalOpen}
          onClose={() => setIsDepositModalOpen(false)}
          walletAddress={embeddedWallet.address}
        />
      )}
    </>
  )
}

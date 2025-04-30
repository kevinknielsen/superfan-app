"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PenLine, CheckCircle, AlertCircle, Copy } from "lucide-react"
import { useWallets } from "@privy-io/react-auth"
import { ethers } from "ethers"

export function SignMessage() {
  const [message, setMessage] = useState("")
  const [signature, setSignature] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [copied, setCopied] = useState(false)
  const { wallets } = useWallets()
  const embeddedWallet = wallets.find((wallet) => wallet.walletClientType === "privy")

  const handleSign = async () => {
    if (!message.trim()) {
      setError("Please enter a message to sign")
      return
    }

    if (!embeddedWallet) {
      setError("No wallet connected")
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccess(false)
    setSignature(null)

    try {
      const provider = new ethers.BrowserProvider(await embeddedWallet.getEthereumProvider())
      const signer = await provider.getSigner()
      const signature = await signer.signMessage(message)
      setSignature(signature)
      setSuccess(true)
    } catch (err: any) {
      console.error('SignMessage error:', err)
      setError(
        err?.message
          ? `Failed to sign message: ${err.message}`
          : 'Failed to sign message. Please make sure your wallet is connected.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = () => {
    if (signature) {
      navigator.clipboard.writeText(signature)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Sign a Message to Test Your Wallet</h2>

      <div className="space-y-4">
        <div>
          <Input
            placeholder="Enter message to sign"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full"
          />
        </div>

        <Button
          onClick={handleSign}
          disabled={isLoading || !embeddedWallet}
          className="bg-blue-500 hover:bg-blue-600 text-white w-full sm:w-auto"
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Signing...
            </span>
          ) : (
            <span className="flex items-center">
              <PenLine className="mr-2 h-4 w-4" />
              Sign Message
            </span>
          )}
        </Button>

        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && signature && (
          <div className="bg-green-50 text-green-700 p-3 rounded-md flex flex-col gap-2">
            <div className="flex items-center mb-2">
              <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              <span>Message signed successfully!</span>
            </div>
            <div className="flex items-center gap-2">
              <code className="bg-white text-gray-800 p-2 rounded break-all text-xs flex-1">{signature}</code>
              <button
                onClick={handleCopy}
                className="bg-white border border-gray-200 px-2 py-1 rounded text-xs flex items-center gap-1 hover:bg-gray-100"
              >
                {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

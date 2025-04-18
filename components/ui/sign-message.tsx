"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PenLine, CheckCircle, AlertCircle } from "lucide-react"

export function SignMessage() {
  const [message, setMessage] = useState("")
  const [signature, setSignature] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSign = async () => {
    if (!message.trim()) {
      setError("Please enter a message to sign")
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccess(false)
    setSignature(null)

    try {
      // In a real implementation, this would use the wallet's signing functionality
      // For demo purposes, we'll simulate a signature after a short delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Generate a mock signature
      const mockSignature = `0x${Array.from({ length: 130 }, () => Math.floor(Math.random() * 16).toString(16)).join(
        "",
      )}`

      setSignature(mockSignature)
      setSuccess(true)
    } catch (err) {
      setError("Failed to sign message. Please make sure your wallet is connected.")
    } finally {
      setIsLoading(false)
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
          disabled={isLoading}
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
          <div className="space-y-3">
            <div className="bg-green-50 text-green-700 p-3 rounded-md flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              <span>Message signed successfully!</span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Signature</label>
              <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                <p className="text-sm font-mono text-gray-800 break-all">{signature}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

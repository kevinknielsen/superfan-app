"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, AlertCircle } from "lucide-react"
import { useCreateDeal } from "@/contexts/create-deal-context"

interface Step4Props {
  onNext: () => void
  onPrevious: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

export default function Step4RoyaltySplits({ onNext }: Step4Props) {
  const { dealData, updateRoyaltySplit, addRoyaltySplit, removeRoyaltySplit } = useCreateDeal()
  const [errors, setErrors] = useState<Record<string, Record<string, string>>>({})
  const [totalPercentage, setTotalPercentage] = useState(0)

  // Calculate total percentage whenever royalty splits change
  useEffect(() => {
    const total = dealData.royaltySplits.reduce((sum, split) => sum + (split.percentage || 0), 0)
    setTotalPercentage(total)
  }, [dealData.royaltySplits])

  const validateForm = () => {
    const newErrors: Record<string, Record<string, string>> = {}
    let isValid = true

    dealData.royaltySplits.forEach((split) => {
      const splitErrors: Record<string, string> = {}

      if (!split.recipient.trim()) {
        splitErrors.recipient = "Recipient is required"
        isValid = false
      } else if (!isValidRecipient(split.recipient)) {
        splitErrors.recipient = "Enter a valid wallet address or email"
        isValid = false
      }

      if (split.percentage <= 0) {
        splitErrors.percentage = "Percentage must be greater than 0"
        isValid = false
      }

      if (Object.keys(splitErrors).length > 0) {
        newErrors[split.id] = splitErrors
      }
    })

    // Check if total percentage is 100%
    if (totalPercentage !== 100) {
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const isValidRecipient = (recipient: string) => {
    // Simple validation for wallet address or email
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)
    const isWallet = /^0x[a-fA-F0-9]{40}$/.test(recipient)
    return isEmail || isWallet
  }

  const handleNext = () => {
    if (validateForm()) {
      onNext()
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Royalty Splits</h2>
        <p className="text-gray-600 mb-6">
          Define how royalties will be distributed among recipients. The total must equal 100%.
        </p>
      </div>

      {/* Total percentage indicator */}
      <div
        className={`p-4 rounded-lg flex items-center justify-between ${
          totalPercentage === 100 ? "bg-green-50 border border-green-200" : "bg-yellow-50 border border-yellow-200"
        }`}
      >
        <div className="flex items-center">
          {totalPercentage === 100 ? (
            <svg
              className="w-5 h-5 text-green-500 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <AlertCircle className="w-5 h-5 text-yellow-500 mr-2" />
          )}
          <span className={totalPercentage === 100 ? "text-green-700" : "text-yellow-700"}>
            Total: {totalPercentage}%
          </span>
        </div>
        <span className={totalPercentage === 100 ? "text-green-700" : "text-yellow-700"}>
          {totalPercentage === 100 ? "Valid" : `${100 - totalPercentage}% remaining`}
        </span>
      </div>

      <div className="space-y-4">
        {dealData.royaltySplits.map((split, index) => (
          <div key={split.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Recipient {index + 1}</h3>
              {dealData.royaltySplits.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeRoyaltySplit(split.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor={`recipient-${split.id}`} className={errors[split.id]?.recipient ? "text-red-500" : ""}>
                  Wallet Address or Email
                </Label>
                <Input
                  id={`recipient-${split.id}`}
                  value={split.recipient}
                  onChange={(e) => updateRoyaltySplit(split.id, "recipient", e.target.value)}
                  placeholder="0x... or name@example.com"
                  className={errors[split.id]?.recipient ? "border-red-500" : ""}
                />
                {errors[split.id]?.recipient && (
                  <p className="text-red-500 text-sm mt-1">{errors[split.id].recipient}</p>
                )}
              </div>

              <div>
                <Label
                  htmlFor={`percentage-${split.id}`}
                  className={errors[split.id]?.percentage ? "text-red-500" : ""}
                >
                  Percentage (%)
                </Label>
                <Input
                  id={`percentage-${split.id}`}
                  type="number"
                  min="0"
                  max="100"
                  value={split.percentage}
                  onChange={(e) => {
                    const value = Number.parseFloat(e.target.value) || 0
                    updateRoyaltySplit(split.id, "percentage", value)
                  }}
                  className={errors[split.id]?.percentage ? "border-red-500" : ""}
                />
                {errors[split.id]?.percentage && (
                  <p className="text-red-500 text-sm mt-1">{errors[split.id].percentage}</p>
                )}
              </div>
            </div>
          </div>
        ))}

        <Button onClick={addRoyaltySplit} variant="outline" className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Another Recipient
        </Button>
      </div>

      <div className="pt-4">
        <Button onClick={handleNext} className="w-full bg-[#0f172a] hover:bg-[#1e293b]">
          Continue to Review
        </Button>
      </div>
    </div>
  )
}

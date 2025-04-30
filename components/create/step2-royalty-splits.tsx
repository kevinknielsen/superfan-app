"use client"

import { useState, useEffect, useRef, useCallback, memo } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Trash2, AlertCircle, Users, User, Briefcase, DollarSign } from "lucide-react"
import { useCreateProject } from "@/contexts/create-project-context"

// Define collaborator types and interfaces
interface Collaborator {
  id: string
  name: string
  role: string
  email: string
  walletAddress: string
  percentage: number
  color: string
}

interface CollaboratorCardProps {
  collaborator: Collaborator
  onDelete: () => void
  onUpdate: (field: string, value: any) => void
  isSelected: boolean
  onSelect: () => void
  error?: Record<string, string>
}

// Color palette for collaborators
const COLORS = [
  "#3B82F6", // blue
  "#10B981", // green
  "#F59E0B", // amber
  "#EF4444", // red
  "#8B5CF6", // purple
  "#EC4899", // pink
  "#06B6D4", // cyan
  "#F97316", // orange
]

// CollaboratorCard component
const CollaboratorCard = memo(function CollaboratorCard({
  collaborator,
  onDelete,
  onUpdate,
  isSelected,
  onSelect,
  error,
}: CollaboratorCardProps) {
  return (
    <Card
      className={`mb-4 border-l-4 transition-all ${isSelected ? "ring-2 ring-offset-2 ring-blue-500" : ""}`}
      style={{ borderLeftColor: collaborator.color }}
      onClick={onSelect}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white"
              style={{ backgroundColor: collaborator.color }}
            >
              {collaborator.role === "Artist" ? (
                <User size={16} />
              ) : collaborator.role === "Manager" ? (
                <Briefcase size={16} />
              ) : (
                <Users size={16} />
              )}
            </div>
            <div>
              <select
                value={collaborator.role}
                onChange={(e) => onUpdate("role", e.target.value)}
                className="text-sm font-medium bg-transparent border-none focus:ring-0 p-0 pr-6"
              >
                <option value="Artist">Artist</option>
                <option value="Manager">Manager</option>
                <option value="Producer">Producer</option>
                <option value="Songwriter">Songwriter</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          {collaborator.role !== "Artist" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onDelete()
              }}
              className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3">
          <div>
            <Label
              htmlFor={`name-${collaborator.id}`}
              className={`text-xs ${error?.name ? "text-red-500" : "text-gray-500"}`}
            >
              Name
            </Label>
            <Input
              id={`name-${collaborator.id}`}
              value={collaborator.name}
              onChange={(e) => onUpdate("name", e.target.value)}
              placeholder="Full name"
              className={`mt-1 ${error?.name ? "border-red-500" : ""}`}
              onClick={(e) => e.stopPropagation()}
            />
            {error?.name && <p className="text-red-500 text-xs mt-1">{error.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label
                htmlFor={`email-${collaborator.id}`}
                className={`text-xs ${error?.email ? "text-red-500" : "text-gray-500"}`}
              >
                Email
              </Label>
              <Input
                id={`email-${collaborator.id}`}
                value={collaborator.email}
                onChange={(e) => onUpdate("email", e.target.value)}
                placeholder="Email address"
                className={`mt-1 ${error?.email ? "border-red-500" : ""}`}
                onClick={(e) => e.stopPropagation()}
              />
              {error?.email && <p className="text-red-500 text-xs mt-1">{error.email}</p>}
            </div>

            <div>
              <Label
                htmlFor={`wallet-${collaborator.id}`}
                className={`text-xs ${error?.walletAddress ? "text-red-500" : "text-gray-500"}`}
              >
                Wallet (Optional)
              </Label>
              <Input
                id={`wallet-${collaborator.id}`}
                value={collaborator.walletAddress}
                onChange={(e) => onUpdate("walletAddress", e.target.value)}
                placeholder="0x..."
                className={`mt-1 ${error?.walletAddress ? "border-red-500" : ""}`}
                onClick={(e) => e.stopPropagation()}
              />
              {error?.walletAddress && <p className="text-red-500 text-xs mt-1">{error.walletAddress}</p>}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center">
              <Label
                htmlFor={`percentage-${collaborator.id}`}
                className={`text-xs ${error?.percentage ? "text-red-500" : "text-gray-500"}`}
              >
                Revenue Share (%)
              </Label>
              <span className="text-sm font-medium">{collaborator.percentage}%</span>
            </div>
            <input
              id={`percentage-${collaborator.id}`}
              type="range"
              min="0"
              max="100"
              value={collaborator.percentage}
              onChange={(e) => onUpdate("percentage", Number.parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-2"
              style={{
                background: `linear-gradient(to right, ${collaborator.color} 0%, ${collaborator.color} ${collaborator.percentage}%, #e5e7eb ${collaborator.percentage}%, #e5e7eb 100%)`,
              }}
              onClick={(e) => e.stopPropagation()}
            />
            {error?.percentage && <p className="text-red-500 text-xs mt-1">{error.percentage}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
})

// SplitPieChart component
const SplitPieChart = memo(function SplitPieChart({ collaborators }: { collaborators: Collaborator[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    const canvas = canvasRef.current
    const width = canvas.width
    const height = canvas.height
    const radius = Math.min(width, height) / 2
    const centerX = width / 2
    const centerY = height / 2

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Filter out collaborators with 0%
    const validCollaborators = collaborators.filter((c) => c.percentage > 0)

    // Draw pie chart
    let startAngle = 0
    validCollaborators.forEach((collaborator) => {
      const sliceAngle = (collaborator.percentage / 100) * 2 * Math.PI

      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle)
      ctx.closePath()

      ctx.fillStyle = collaborator.color
      ctx.fill()

      // Draw label if slice is big enough
      if (collaborator.percentage >= 5) {
        const labelAngle = startAngle + sliceAngle / 2
        const labelRadius = radius * 0.7
        const labelX = centerX + Math.cos(labelAngle) * labelRadius
        const labelY = centerY + Math.sin(labelAngle) * labelRadius

        ctx.fillStyle = "#FFFFFF"
        ctx.font = "bold 12px Arial"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(`${collaborator.percentage}%`, labelX, labelY)
      }

      startAngle += sliceAngle
    })

    // Draw center circle (hole)
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius * 0.5, 0, 2 * Math.PI)
    ctx.fillStyle = "#FFFFFF"
    ctx.fill()
  }, [collaborators])

  return (
    <div className="flex flex-col items-center">
      <canvas ref={canvasRef} width={200} height={200} className="mb-4" />
      <div className="grid grid-cols-2 gap-2 w-full">
        {collaborators.map((collaborator) => (
          <div key={collaborator.id} className="flex items-center text-sm">
            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: collaborator.color }}></div>
            <span className="truncate">{collaborator.name || collaborator.role}</span>
            <span className="ml-1 font-medium">{collaborator.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  )
})

// Simplified FundingControls component to fix the infinite loop
const FundingControls = memo(function FundingControls({
  enableCuratorShares,
  curatorPercentage,
  platformFee,
  onCuratorSharesChange,
  onCuratorPercentageChange,
}: {
  enableCuratorShares: boolean
  curatorPercentage: number
  platformFee: number
  onCuratorSharesChange: (checked: boolean) => void
  onCuratorPercentageChange: (value: number) => void
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-lg font-medium mb-4">Funding Settings</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="platform-fee" className="text-sm">
                Platform Fee
              </Label>
              <p className="text-xs text-gray-500">Standard fee applied to all projects</p>
            </div>
            <div className="flex items-center">
              <span className="text-sm font-medium mr-2">{platformFee}%</span>
              <DollarSign size={16} className="text-gray-400" />
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-2">
              <div className="space-y-0.5">
                <Label htmlFor="curator-shares" className="text-sm">
                  Early Curator Shares
                </Label>
                <p className="text-xs text-gray-500">Reward early supporters with additional revenue share</p>
              </div>
              <Switch id="curator-shares" checked={enableCuratorShares} onCheckedChange={onCuratorSharesChange} />
            </div>

            {enableCuratorShares && (
              <div className="mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Curator Percentage</span>
                  <span className="text-sm font-medium">{curatorPercentage}%</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={curatorPercentage}
                  onChange={(e) => onCuratorPercentageChange(Number.parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-2"
                  style={{
                    background: `linear-gradient(to right, #8B5CF6 0%, #8B5CF6 ${curatorPercentage * 5}%, #e5e7eb ${curatorPercentage * 5}%, #e5e7eb 100%)`,
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
})

// DealSummary component
const DealSummary = memo(function DealSummary({
  collaborators,
  platformFee,
  curatorPercentage,
  enableCuratorShares,
}: {
  collaborators: Collaborator[]
  platformFee: number
  curatorPercentage: number
  enableCuratorShares: boolean
}) {
  // Calculate artist's final share
  const artistCollaborator = collaborators.find((c) => c.role === "Artist")
  const artistPercentage = artistCollaborator?.percentage || 0

  const totalDeductions = platformFee + (enableCuratorShares ? curatorPercentage : 0)
  const artistFinalShare = artistPercentage * (1 - totalDeductions / 100)

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-lg font-medium mb-4">Project Summary</h3>

        <div className="space-y-3">
          <div className="flex justify-between items-center pb-2 border-b">
            <span className="text-sm">Total Team Members</span>
            <span className="font-medium">{collaborators.length}</span>
          </div>

          <div className="flex justify-between items-center pb-2 border-b">
            <span className="text-sm">Platform Fee</span>
            <span className="font-medium">{platformFee}%</span>
          </div>

          {enableCuratorShares && (
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-sm">Early Curator Share</span>
              <span className="font-medium">{curatorPercentage}%</span>
            </div>
          )}

          <div className="flex justify-between items-center pb-2 border-b">
            <span className="text-sm">Artist's Share</span>
            <span className="font-medium">{artistPercentage}%</span>
          </div>

          <div className="flex justify-between items-center pt-1">
            <span className="text-sm font-medium">Artist's Final Share</span>
            <span className="font-bold text-lg">{artistFinalShare.toFixed(1)}%</span>
          </div>

          {totalDeductions > 0 && (
            <div className="text-xs text-gray-500 italic">*After platform fees and curator shares</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
})

// Main component
interface Step2Props {
  onNext: () => void
  onPrevious: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

export default function Step2RoyaltySplits({ onNext, onPrevious }: Step2Props) {
  const { projectData, updateField } = useCreateProject()

  // Initialize state with artist as first collaborator
  const [collaborators, setCollaborators] = useState<Collaborator[]>(() => [
    {
      id: "artist",
      name: projectData.artistName || "Main Artist",
      role: "Artist",
      email: "",
      walletAddress: "",
      percentage: 100,
      color: COLORS[0],
    },
  ])

  const [selectedCollaborator, setSelectedCollaborator] = useState<string>("artist")
  const [errors, setErrors] = useState<Record<string, Record<string, string>>>({})
  const [enableCuratorShares, setEnableCuratorShares] = useState<boolean>(false)
  const [curatorPercentage, setCuratorPercentage] = useState<number>(5)
  const platformFee = 2.5 // Fixed platform fee

  // Use a ref to track if we've already synced with context
  // This prevents the infinite update loop
  const initialSyncDone = useRef(false)

  // Only sync with context when collaborators change AND it's not the initial render
  useEffect(() => {
    // Skip the first render to prevent the loop
    if (!initialSyncDone.current) {
      initialSyncDone.current = true
      return
    }

    const royaltySplits = collaborators.map((collab) => ({
      id: collab.id,
      recipient: collab.email || collab.walletAddress,
      percentage: collab.percentage,
    }))

    updateField("royaltySplits", royaltySplits)
  }, [collaborators, updateField])

  // Add a new collaborator
  const addCollaborator = useCallback(() => {
    const newId = `collab-${Date.now()}`
    const newColor = COLORS[collaborators.length % COLORS.length]

    // Adjust percentages to make room for new collaborator
    const newCollaborators = collaborators.map((c) => ({
      ...c,
      percentage: Math.max(1, Math.floor(c.percentage * 0.8)), // Reduce existing by 20%
    }))

    // Calculate remaining percentage
    const usedPercentage = newCollaborators.reduce((sum, c) => sum + c.percentage, 0)
    const remainingPercentage = 100 - usedPercentage

    setCollaborators([
      ...newCollaborators,
      {
        id: newId,
        name: "",
        role: "Producer",
        email: "",
        walletAddress: "",
        percentage: remainingPercentage,
        color: newColor,
      },
    ])

    setSelectedCollaborator(newId)
  }, [collaborators])

  // Delete a collaborator
  const deleteCollaborator = useCallback(
    (id: string) => {
      const deletedCollab = collaborators.find((c) => c.id === id)
      if (!deletedCollab) return

      const remainingCollabs = collaborators.filter((c) => c.id !== id)

      // Redistribute the deleted collaborator's percentage
      const totalRemainingPercentage = remainingCollabs.reduce((sum, c) => sum + c.percentage, 0)

      if (totalRemainingPercentage === 0) {
        // If all remaining have 0%, give 100% to the first one
        remainingCollabs[0].percentage = 100
      } else {
        // Otherwise redistribute proportionally
        remainingCollabs.forEach((collab) => {
          collab.percentage = Math.round((collab.percentage / totalRemainingPercentage) * 100)
        })

        // Ensure we add up to exactly 100%
        const adjustedTotal = remainingCollabs.reduce((sum, c) => sum + c.percentage, 0)
        if (adjustedTotal !== 100 && remainingCollabs.length > 0) {
          remainingCollabs[0].percentage += 100 - adjustedTotal
        }
      }

      setCollaborators(remainingCollabs)
      setSelectedCollaborator(remainingCollabs[0]?.id || "")
    },
    [collaborators],
  )

  // Update a collaborator's field
  const updateCollaborator = useCallback((id: string, field: string, value: any) => {
    if (field === "percentage") {
      setCollaborators((prev) => {
        const currentCollab = prev.find((c) => c.id === id)
        if (!currentCollab) return prev

        const oldPercentage = currentCollab.percentage
        const difference = value - oldPercentage

        if (difference === 0) return prev

        const othersTotal = prev.filter((c) => c.id !== id).reduce((sum, c) => sum + c.percentage, 0)

        if (othersTotal === 0) {
          return prev.map((c) => (c.id === id ? { ...c, percentage: value } : c))
        }

        // Create a new array with updated percentages
        const updatedCollabs = prev.map((c) => {
          if (c.id === id) return { ...c, percentage: value }

          // Adjust other percentages proportionally
          const newPercentage = Math.max(0, Math.round(c.percentage - difference * (c.percentage / othersTotal)))
          return { ...c, percentage: newPercentage }
        })

        // Ensure total is exactly 100%
        const total = updatedCollabs.reduce((sum, c) => sum + c.percentage, 0)
        if (total !== 100) {
          // Find the largest share that's not the one we just changed
          const sortedOthers = [...updatedCollabs]
            .filter((c) => c.id !== id)
            .sort((a, b) => b.percentage - a.percentage)

          if (sortedOthers.length > 0) {
            return updatedCollabs.map((c) => {
              if (c.id === sortedOthers[0].id) {
                return { ...c, percentage: c.percentage + (100 - total) }
              }
              return c
            })
          }
        }

        return updatedCollabs
      })
    } else {
      setCollaborators((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)))
    }
  }, [])

  // Handle curator shares toggle
  const handleCuratorSharesChange = useCallback((checked: boolean) => {
    setEnableCuratorShares(checked)
  }, [])

  // Handle curator percentage change
  const handleCuratorPercentageChange = useCallback((value: number) => {
    setCuratorPercentage(value)
  }, [])

  // Validate the form
  const validateForm = useCallback(() => {
    const newErrors: Record<string, Record<string, string>> = {}
    let isValid = true

    collaborators.forEach((collab) => {
      const collabErrors: Record<string, string> = {}

      if (!collab.name.trim()) {
        collabErrors.name = "Name is required"
        isValid = false
      }

      if (!collab.email.trim()) {
        collabErrors.email = "Email is required"
        isValid = false
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(collab.email)) {
        collabErrors.email = "Invalid email format"
        isValid = false
      }

      if (collab.walletAddress && !/^0x[a-fA-F0-9]{40}$/.test(collab.walletAddress)) {
        collabErrors.walletAddress = "Invalid wallet address"
        isValid = false
      }

      if (collab.percentage <= 0) {
        collabErrors.percentage = "Must be greater than 0%"
        isValid = false
      }

      if (Object.keys(collabErrors).length > 0) {
        newErrors[collab.id] = collabErrors
      }
    })

    // Check total percentage
    const totalPercentage = collaborators.reduce((sum, c) => sum + c.percentage, 0)
    if (totalPercentage !== 100) {
      isValid = false
      // Add a general error
      newErrors.general = { percentage: "Total percentage must equal 100%" }
    }

    setErrors(newErrors)
    return isValid
  }, [collaborators])

  // Handle next button click
  const handleNext = useCallback(() => {
    if (validateForm()) {
      onNext()
    }
  }, [validateForm, onNext])

  // Calculate total percentage
  const totalPercentage = collaborators.reduce((sum, c) => sum + c.percentage, 0)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Team & Revenue Splits</h2>
        <p className="text-gray-600">Define your team members and how revenue will be distributed.</p>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Collaborator management */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Team Members</h3>
            <Button onClick={addCollaborator} variant="outline" size="sm" className="flex items-center gap-1">
              <Plus className="w-4 h-4" />
              Add Member
            </Button>
          </div>

          {/* Error message if total percentage is not 100% */}
          {totalPercentage !== 100 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 flex items-center text-yellow-800">
              <AlertCircle className="w-5 h-5 mr-2 text-yellow-500" />
              <span>Total percentage must equal 100% (currently {totalPercentage}%)</span>
            </div>
          )}

          {/* Collaborator cards */}
          <div className="space-y-3">
            {collaborators.map((collaborator) => (
              <CollaboratorCard
                key={collaborator.id}
                collaborator={collaborator}
                onDelete={() => deleteCollaborator(collaborator.id)}
                onUpdate={(field, value) => updateCollaborator(collaborator.id, field, value)}
                isSelected={selectedCollaborator === collaborator.id}
                onSelect={() => setSelectedCollaborator(collaborator.id)}
                error={errors[collaborator.id]}
              />
            ))}
          </div>
        </div>

        {/* Right column - Visualization and settings */}
        <div className="space-y-6">
          {/* Pie chart visualization */}
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-medium mb-4">Revenue Split</h3>
              <SplitPieChart collaborators={collaborators} />
            </CardContent>
          </Card>

          {/* Funding controls */}
          <FundingControls
            enableCuratorShares={enableCuratorShares}
            curatorPercentage={curatorPercentage}
            platformFee={platformFee}
            onCuratorSharesChange={handleCuratorSharesChange}
            onCuratorPercentageChange={handleCuratorPercentageChange}
          />

          {/* Deal summary */}
          <DealSummary
            collaborators={collaborators}
            platformFee={platformFee}
            curatorPercentage={curatorPercentage}
            enableCuratorShares={enableCuratorShares}
          />
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between pt-6 border-t">
        <Button onClick={onPrevious} variant="outline">
          Back
        </Button>
        <Button onClick={handleNext} className="bg-[#0f172a] hover:bg-[#1e293b]">
          Continue to Milestones
        </Button>
      </div>
    </div>
  )
}

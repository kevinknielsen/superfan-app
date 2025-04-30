"use client"

import { useState, type ChangeEvent } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useCreateProject } from "@/contexts/create-project-context"

interface Step4Props {
  onNext: () => void
  onPrevious: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

export default function Step4ProjectTerms({ onNext }: Step4Props) {
  const { projectData, updateField } = useCreateProject()
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // Handle number inputs
    if (["targetRaise", "minContribution", "maxContribution"].includes(name)) {
      const numValue = value === "" ? null : Number.parseFloat(value)
      updateField(name as keyof typeof projectData, numValue)
    } else {
      updateField(name as keyof typeof projectData, value)
    }

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!projectData.targetRaise) {
      newErrors.targetRaise = "Target raise amount is required"
    }

    if (!projectData.minContribution) {
      newErrors.minContribution = "Minimum contribution is required"
    } else if (projectData.targetRaise && projectData.minContribution > projectData.targetRaise) {
      newErrors.minContribution = "Minimum contribution cannot exceed target raise"
    }

    if (!projectData.maxContribution) {
      newErrors.maxContribution = "Maximum contribution is required"
    } else if (projectData.minContribution && projectData.maxContribution < projectData.minContribution) {
      newErrors.maxContribution = "Maximum contribution cannot be less than minimum"
    } else if (projectData.targetRaise && projectData.maxContribution > projectData.targetRaise) {
      newErrors.maxContribution = "Maximum contribution cannot exceed target raise"
    }

    if (!projectData.startDate) {
      newErrors.startDate = "Start date is required"
    }

    if (!projectData.endDate) {
      newErrors.endDate = "End date is required"
    } else if (projectData.startDate && new Date(projectData.endDate) <= new Date(projectData.startDate)) {
      newErrors.endDate = "End date must be after start date"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateForm()) {
      onNext()
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Project Terms</h2>
        <p className="text-gray-600 mb-6">Set the financial terms and timeline for your fundraising campaign.</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="targetRaise" className={errors.targetRaise ? "text-red-500" : ""}>
            Target Raise (USDC)
          </Label>
          <Input
            id="targetRaise"
            name="targetRaise"
            type="number"
            min="0"
            step="100"
            placeholder="e.g., 10000"
            value={projectData.targetRaise === null ? "" : projectData.targetRaise}
            onChange={handleChange}
            className={errors.targetRaise ? "border-red-500" : ""}
          />
          {errors.targetRaise && <p className="text-red-500 text-sm mt-1">{errors.targetRaise}</p>}
          <p className="text-gray-500 text-sm mt-1">Total amount you aim to raise for this project</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="minContribution" className={errors.minContribution ? "text-red-500" : ""}>
              Min Contribution (USDC)
            </Label>
            <Input
              id="minContribution"
              name="minContribution"
              type="number"
              min="0"
              step="10"
              placeholder="e.g., 100"
              value={projectData.minContribution === null ? "" : projectData.minContribution}
              onChange={handleChange}
              className={errors.minContribution ? "border-red-500" : ""}
            />
            {errors.minContribution && <p className="text-red-500 text-sm mt-1">{errors.minContribution}</p>}
          </div>

          <div>
            <Label htmlFor="maxContribution" className={errors.maxContribution ? "text-red-500" : ""}>
              Max Contribution (USDC)
            </Label>
            <Input
              id="maxContribution"
              name="maxContribution"
              type="number"
              min="0"
              step="100"
              placeholder="e.g., 5000"
              value={projectData.maxContribution === null ? "" : projectData.maxContribution}
              onChange={handleChange}
              className={errors.maxContribution ? "border-red-500" : ""}
            />
            {errors.maxContribution && <p className="text-red-500 text-sm mt-1">{errors.maxContribution}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="startDate" className={errors.startDate ? "text-red-500" : ""}>
              Fundraising Start Date
            </Label>
            <Input
              id="startDate"
              name="startDate"
              type="date"
              value={projectData.startDate}
              onChange={handleChange}
              className={errors.startDate ? "border-red-500" : ""}
              min={new Date().toISOString().split("T")[0]} // Today's date as minimum
            />
            {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
          </div>

          <div>
            <Label htmlFor="endDate" className={errors.endDate ? "text-red-500" : ""}>
              Fundraising End Date
            </Label>
            <Input
              id="endDate"
              name="endDate"
              type="date"
              value={projectData.endDate}
              onChange={handleChange}
              className={errors.endDate ? "border-red-500" : ""}
              min={projectData.startDate || new Date().toISOString().split("T")[0]}
            />
            {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
          </div>
        </div>
      </div>

      <div className="pt-4">
        <Button onClick={handleNext} className="w-full bg-[#0f172a] hover:bg-[#1e293b]">
          Continue to Review
        </Button>
      </div>
    </div>
  )
}

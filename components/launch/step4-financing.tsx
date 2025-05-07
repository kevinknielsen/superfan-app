"use client"

import { useState, type ChangeEvent } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useLaunchProject } from "@/contexts/launch-project-context"
import { UserAvatar } from "@/components/ui/user-avatar"
import { Check } from "lucide-react"
import supabase from '@/lib/supabaseClient'

interface Step4Props {
  onNext: () => void
  onPrevious: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

export default function Step4Financing({ onNext, onPrevious }: Step4Props) {
  const { projectData, updateField, toggleCurator } = useLaunchProject()
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

  const toggleFinancing = (checked: boolean) => {
    updateField("enableFinancing", checked)
  }

  const validateForm = () => {
    if (!projectData.enableFinancing) {
      // Skip validation if financing is disabled
      return true
    }

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

  const handleNext = async () => {
    if (!projectData.id) {
      setErrors((prev) => ({ ...prev, general: 'Project ID missing. Please complete Project Info step.' }))
      return
    }
    if (!validateForm()) return

    // Insert financing details into Supabase
    const { error } = await supabase.from('financing').insert({
      project_id: projectData.id,
      enabled: projectData.enableFinancing,
      target_raise: projectData.targetRaise,
      min_contribution: projectData.minContribution,
      max_contribution: projectData.maxContribution,
      start_date: projectData.startDate,
      end_date: projectData.endDate,
    })
    if (error) {
      setErrors((prev) => ({ ...prev, general: 'Failed to save financing: ' + error.message }))
      return
    }
    onNext()
  }

  const handleCuratorClick = (curatorId: string) => {
    toggleCurator(curatorId)
  }

  const selectedCuratorsCount = projectData.selectedCurators.filter((curator) => curator.selected).length

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Financing</h2>
        <p className="text-gray-600 mb-6">
          Set up financing options for your project or keep it private until a curator discovers it.
        </p>
      </div>

      <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex-1">
          <h3 className="font-medium">Enable Financing</h3>
          <p className="text-sm text-gray-500">
            Allow curators to raise funds for your project. If disabled, your project will remain private.
          </p>
        </div>
        <Switch checked={projectData.enableFinancing} onCheckedChange={toggleFinancing} aria-label="Enable financing" />
      </div>

      {projectData.enableFinancing ? (
        <>
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

          <div className="space-y-4 mt-8">
            <h3 className="font-medium">Select Curators to Pitch</h3>
            <p className="text-sm text-gray-500">
              Choose which curators you'd like to pitch your project to for potential funding.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projectData.selectedCurators.map((curator) => (
                <button
                  key={curator.id}
                  onClick={() => handleCuratorClick(curator.id)}
                  className={`flex items-center p-4 rounded-lg border ${
                    curator.selected ? "border-green-500 bg-green-50" : "border-gray-200"
                  } cursor-pointer transition-all hover:border-green-500 hover:bg-green-50/50`}
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <UserAvatar src={curator.avatar} name={curator.name} size={40} />
                    <span className="font-medium">{curator.name}</span>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    curator.selected 
                      ? "border-green-500 bg-green-500 text-white" 
                      : "border-gray-300"
                  }`}>
                    {curator.selected && <Check className="w-4 h-4" />}
                  </div>
                </button>
              ))}
            </div>

            <p className="text-sm text-gray-500 mt-2">
              {selectedCuratorsCount} curator{selectedCuratorsCount !== 1 ? "s" : ""} selected
            </p>
          </div>
        </>
      ) : (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800">
          <h3 className="font-medium mb-2">Private Project</h3>
          <p className="text-sm">
            Your project will be created as private. You can enable financing later if you decide to raise funds.
          </p>
          <p className="text-sm mt-2">
            Curators can still discover your project and reach out to you if they're interested.
          </p>
        </div>
      )}

      <div className="pt-6 flex justify-between">
        <Button variant="ghost" onClick={onPrevious}>
          Back
        </Button>
        <Button onClick={handleNext} className="bg-[#0f172a] hover:bg-[#1e293b]">
          Continue to Review
        </Button>
      </div>
    </div>
  )
}

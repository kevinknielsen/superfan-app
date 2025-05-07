"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2 } from "lucide-react"
import { useLaunchProject } from "@/contexts/launch-project-context"
import supabase from '@/lib/supabaseClient'

interface Step3Props {
  onNext: () => void
  onPrevious: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

export default function Step3Milestones({ onNext }: Step3Props) {
  const { projectData, addMilestone, updateMilestone, removeMilestone } = useLaunchProject()
  const [errors, setErrors] = useState<Record<string, Record<string, string>>>({})

  const validateForm = () => {
    const newErrors: Record<string, Record<string, string>> = {}
    let isValid = true

    projectData.milestones.forEach((milestone) => {
      const milestoneErrors: Record<string, string> = {}

      if (!milestone.title.trim()) {
        milestoneErrors.title = "Title is required"
        isValid = false
      }

      if (!milestone.description.trim()) {
        milestoneErrors.description = "Description is required"
        isValid = false
      }

      if (!milestone.dueDate) {
        milestoneErrors.dueDate = "Due date is required"
        isValid = false
      }

      if (Object.keys(milestoneErrors).length > 0) {
        newErrors[milestone.id] = milestoneErrors
      }
    })

    setErrors(newErrors)
    return isValid
  }

  const handleNext = async () => {
    if (!projectData.id) {
      setErrors((prev) => ({ ...prev, general: { id: 'Project ID missing. Please complete Project Info step.' } }))
      return
    }
    if (!validateForm()) return

    // Prepare milestones array for Supabase
    const milestonesArray = projectData.milestones.map((milestone) => ({
      project_id: projectData.id,
      title: milestone.title,
      description: milestone.description,
      due_date: milestone.dueDate,
      requires_approval: milestone.requiresApproval,
    }))

    // Insert into Supabase
    const { error } = await supabase.from('milestones').insert(milestonesArray)
    if (error) {
      setErrors((prev) => ({ ...prev, general: { submit: 'Failed to save milestones: ' + error.message } }))
      return
    }
    onNext()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Project Milestones</h2>
        <p className="text-gray-600 mb-6">
          Define key milestones for your project. These will help investors track progress and understand your timeline.
        </p>
      </div>

      <div className="space-y-6">
        {projectData.milestones.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500 mb-4">No milestones added yet</p>
            <Button onClick={() => addMilestone()} variant="outline" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Your First Milestone
            </Button>
          </div>
        ) : (
          projectData.milestones
            .filter(milestone => milestone && milestone.id)
            .map((milestone, index) => (
              <div key={milestone.id || index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Milestone {index + 1}</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeMilestone(milestone.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label
                      htmlFor={`title-${milestone.id}`}
                      className={errors[milestone.id]?.title ? "text-red-500" : ""}
                    >
                      Milestone Title
                    </Label>
                    <Input
                      id={`title-${milestone.id}`}
                      value={milestone.title}
                      onChange={(e) => updateMilestone(milestone.id, "title", e.target.value)}
                      placeholder="e.g., Recording Completion"
                      className={errors[milestone.id]?.title ? "border-red-500" : ""}
                    />
                    {errors[milestone.id]?.title && (
                      <p className="text-red-500 text-sm mt-1">{errors[milestone.id].title}</p>
                    )}
                  </div>

                  <div>
                    <Label
                      htmlFor={`description-${milestone.id}`}
                      className={errors[milestone.id]?.description ? "text-red-500" : ""}
                    >
                      Description
                    </Label>
                    <Textarea
                      id={`description-${milestone.id}`}
                      value={milestone.description}
                      onChange={(e) => updateMilestone(milestone.id, "description", e.target.value)}
                      placeholder="Describe what will be accomplished in this milestone..."
                      className={errors[milestone.id]?.description ? "border-red-500" : ""}
                    />
                    {errors[milestone.id]?.description && (
                      <p className="text-red-500 text-sm mt-1">{errors[milestone.id].description}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor={`dueDate-${milestone.id}`}
                        className={errors[milestone.id]?.dueDate ? "text-red-500" : ""}
                      >
                        Due Date
                      </Label>
                      <Input
                        id={`dueDate-${milestone.id}`}
                        type="date"
                        value={milestone.dueDate}
                        onChange={(e) => updateMilestone(milestone.id, "dueDate", e.target.value)}
                        className={errors[milestone.id]?.dueDate ? "border-red-500" : ""}
                        min={new Date().toISOString().split("T")[0]}
                      />
                      {errors[milestone.id]?.dueDate && (
                        <p className="text-red-500 text-sm mt-1">{errors[milestone.id].dueDate}</p>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 h-full">
                      <Checkbox
                        id={`requiresApproval-${milestone.id}`}
                        checked={milestone.requiresApproval}
                        onCheckedChange={(checked) => updateMilestone(milestone.id, "requiresApproval", Boolean(checked))}
                      />
                      <Label htmlFor={`requiresApproval-${milestone.id}`} className="text-sm">
                        Requires investor approval
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            ))
        )}

        {projectData.milestones.length > 0 && (
          <Button onClick={() => addMilestone()} variant="outline" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Another Milestone
          </Button>
        )}
      </div>

      <div className="pt-4">
        <Button onClick={handleNext} className="w-full bg-[#0f172a] hover:bg-[#1e293b]">
          Continue to Project Terms
        </Button>
      </div>
    </div>
  )
}

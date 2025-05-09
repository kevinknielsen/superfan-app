"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2 } from "lucide-react";
import { useLaunchProject } from "@/contexts/launch-project-context";
import supabase from "@/lib/supabaseClient";

interface Step3Props {
  onNext: () => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export default function Step3Milestones({ onNext }: Step3Props) {
  const { projectData, addMilestone, updateMilestone, removeMilestone } = useLaunchProject();
  const [errors, setErrors] = useState<Record<string, Record<string, string>>>({});

  const validateForm = () => {
    const newErrors: Record<string, Record<string, string>> = {};
    let isValid = true;

    projectData.milestones.forEach((milestone) => {
      const milestoneErrors: Record<string, string> = {};

      if (!milestone.title.trim()) {
        milestoneErrors.title = "Title is required";
        isValid = false;
      }

      if (!milestone.description.trim()) {
        milestoneErrors.description = "Description is required";
        isValid = false;
      }

      if (!milestone.dueDate) {
        milestoneErrors.dueDate = "Due date is required";
        isValid = false;
      } else if (new Date(milestone.dueDate) < new Date()) {
        milestoneErrors.dueDate = "Due date cannot be in the past";
        isValid = false;
      }

      if (Object.keys(milestoneErrors).length > 0) {
        newErrors[milestone.id] = milestoneErrors;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = async () => {
    if (!projectData.id) {
      setErrors((prev) => ({ ...prev, general: { id: "Project ID missing. Please complete Project Info step." } }));
      return;
    }
    if (!validateForm()) return;

    // Prepare milestones array for Supabase
    const milestonesArray = projectData.milestones.map((milestone) => ({
      project_id: projectData.id,
      title: milestone.title,
      description: milestone.description,
      due_date: milestone.dueDate,
      requires_approval: milestone.requiresApproval,
    }));

    // Insert into Supabase
    const { error } = await supabase.from("milestones").insert(milestonesArray);
    if (error) {
      setErrors((prev) => ({ ...prev, general: { submit: "Failed to save milestones: " + error.message } }));
      return;
    }
    onNext();
  };

  function MilestoneField({
    id,
    label,
    value,
    onChange,
    placeholder,
    error,
    type = "text",
  }: {
    id: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    placeholder: string;
    error?: string;
    type?: string;
  }) {
    return (
      <div>
        <Label htmlFor={id} className={error ? "text-red-500" : ""}>
          {label}
        </Label>
        {type === "textarea" ? (
          <Textarea
            id={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={error ? "border-red-500" : ""}
          />
        ) : (
          <Input
            id={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            type={type}
            className={error ? "border-red-500" : ""}
          />
        )}
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    );
  }

  const handleRemoveMilestone = (id: string) => {
    if (confirm("Are you sure you want to delete this milestone?")) {
      removeMilestone(id);
    }
  };

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
          <>
            <div className="text-right text-sm text-gray-500">Total Milestones: {projectData.milestones.length}</div>
            {projectData.milestones
              .filter((milestone) => milestone && milestone.id)
              .map((milestone, index) => (
                <div key={milestone.id || index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Milestone {index + 1}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveMilestone(milestone.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <MilestoneField
                      id={`title-${milestone.id}`}
                      label="Milestone Title"
                      value={milestone.title}
                      onChange={(e) => updateMilestone(milestone.id, "title", e.target.value)}
                      placeholder="e.g., Recording Completion"
                      error={errors[milestone.id]?.title}
                    />

                    <MilestoneField
                      id={`description-${milestone.id}`}
                      label="Description"
                      value={milestone.description}
                      onChange={(e) => updateMilestone(milestone.id, "description", e.target.value)}
                      placeholder="Describe what will be accomplished in this milestone..."
                      error={errors[milestone.id]?.description}
                      type="textarea"
                    />

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
                          onCheckedChange={(checked) =>
                            updateMilestone(milestone.id, "requiresApproval", Boolean(checked))
                          }
                          aria-label={`Requires approval for milestone ${milestone.title}`}
                        />
                        <Label htmlFor={`requiresApproval-${milestone.id}`} className="text-sm">
                          Requires investor approval
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </>
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
  );
}

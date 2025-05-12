"use client";

import React, { useState, type ChangeEvent, useMemo, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useLaunchProject } from "@/contexts/launch-project-context";
import { UserAvatar } from "@/components/ui/user-avatar";
import { Check } from "lucide-react";
import supabase from "@/lib/supabaseClient";
import { ProjectData, Curator } from "@/contexts/launch-project-context";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { DatePicker } from "@/components/ui/date-picker";

interface Step4Props {
  onNext: () => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

// Added utility function for date validation
function isEndDateAfterStartDate(startDate: Date | null, endDate: Date | null): boolean {
  return !!(startDate && endDate && new Date(endDate) > new Date(startDate));
}

function validateFinancingForm(projectData: ProjectData) {
  const errors: Record<string, string> = {};

  if (!projectData.targetRaise) {
    errors.targetRaise = "Target raise amount is required";
  }

  if (!projectData.financingStartDate) {
    errors.financingStartDate = "Start date is required";
  }

  if (!projectData.financingEndDate) {
    errors.financingEndDate = "End date is required";
  } else if (!isEndDateAfterStartDate(projectData.financingStartDate, projectData.financingEndDate)) {
    errors.financingEndDate = "End date must be after start date";
  }

  return errors;
}

// Optimized rendering of CuratorCard list with React.memo
const CuratorCard = React.memo(({ curator, onClick }: { curator: Curator; onClick: (id: string) => void }) => {
  return (
    <button
      onClick={() => onClick(curator.id)}
      className={`flex items-center p-4 rounded-lg border transition-all cursor-pointer w-full
        ${
          curator.selected
            ? "border-[#a259ff] bg-white text-[#0f172a] shadow-md"
            : "border border-gray-200 bg-white text-gray-800 hover:border-[#a259ff] hover:bg-purple-50"
        }
      `}
      aria-pressed={curator.selected}
      role="checkbox"
    >
      <div className="flex items-center space-x-3 flex-1">
        <UserAvatar src={curator.avatar || "/placeholder-user.jpg"} name={curator.name} size={40} />
        <span className="font-medium text-lg">{curator.name}</span>
      </div>
      <div
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
          ${curator.selected ? "border-white bg-white text-[#a259ff]" : "border-gray-300 bg-white"}
        `}
      >
        {curator.selected && <Check className="w-4 h-4" />}
      </div>
    </button>
  );
});

export default function Step2Financing({ onNext, onPrevious }: Step4Props) {
  const { projectData, updateField, toggleCurator } = useLaunchProject();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const parsedValue = type === "number" ? (value === "" ? null : Number(value)) : value;
    updateField(name as keyof typeof projectData, parsedValue);

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const toggleFinancing = (checked: boolean) => {
    updateField("enableFinancing", checked);
  };

  const handleStartDateChange = (date: Date | null) => {
    updateField("financingStartDate", date);
  };

  const handleEndDateChange = (date: Date | null) => {
    updateField("financingEndDate", date);
  };

  const handleDateRangeChange = (range: { from: Date; to: Date }) => {
    updateField("financingStartDate", range.from);
    updateField("financingEndDate", range.to);
  };

  const handleNext = async () => {
    if (!projectData.id) {
      setErrors((prev) => ({ ...prev, general: "Project ID missing. Please complete Project Info step." }));
      return;
    }

    const validationErrors = validateFinancingForm(projectData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    // Insert financing details into Supabase
    const { error } = await supabase.from("financing").insert({
      project_id: projectData.id,
      enabled: projectData.enableFinancing,
      target_raise: projectData.targetRaise,
      start_date: projectData.financingStartDate,
      end_date: projectData.financingEndDate,
    });
    setIsLoading(false);

    if (error) {
      setErrors((prev) => ({ ...prev, general: "Failed to save financing: " + error.message }));
      return;
    }
    onNext();
  };

  const selectedCuratorsCount = useMemo(
    () => projectData.selectedCurators.filter((curator) => curator.selected).length,
    [projectData.selectedCurators]
  );

  // Validate the form
  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (projectData.enableFinancing) {
      if (!projectData.targetRaise || projectData.targetRaise <= 0) {
        newErrors.targetRaise = "Please enter a valid target raise amount";
      }
      if (!projectData.financingStartDate) {
        newErrors.financingStartDate = "Please select a start date";
      }
      if (!projectData.financingEndDate) {
        newErrors.financingEndDate = "Please select an end date";
      }
      if (
        projectData.financingStartDate &&
        projectData.financingEndDate &&
        projectData.financingStartDate > projectData.financingEndDate
      ) {
        newErrors.financingEndDate = "End date must be after start date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [projectData]);

  // Handle next step
  const handleNextCallback = useCallback(() => {
    if (validateForm()) {
      onNext();
    }
  }, [validateForm, onNext]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Financing</h2>
        <p className="text-gray-600 mb-6">Do you want to raise funds for your project?</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-medium text-gray-900">Enable Financing</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <InformationCircleIcon className="h-5 w-5 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>Enable financing to allow fans to invest in your project</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Switch
            checked={projectData.enableFinancing}
            onCheckedChange={(checked) => {
              updateField("enableFinancing", checked);
              // Reset financing fields when disabled
              if (!checked) {
                updateField("targetRaise", null);
                updateField("financingStartDate", null);
                updateField("financingEndDate", null);
              }
            }}
            className={`${
              projectData.enableFinancing ? "bg-indigo-600" : "bg-gray-200"
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
          >
            <span
              className={`${
                projectData.enableFinancing ? "translate-x-6" : "translate-x-1"
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />
          </Switch>
        </div>
      </div>

      {projectData.enableFinancing ? (
        <>
          <div className="space-y-4">
            <div>
              <Label htmlFor="targetRaise" className={errors.targetRaise ? "text-red-500" : ""}>
                Target Raise (USDC)
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <InformationCircleIcon className="h-5 w-5 text-gray-400 ml-2" />
                    </TooltipTrigger>
                    <TooltipContent>Enter the total amount you aim to raise for this project in USDC.</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
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
                aria-invalid={!!errors.targetRaise}
                aria-describedby="targetRaiseError"
              />
              {errors.targetRaise && (
                <p id="targetRaiseError" className="text-red-500 text-sm mt-1">
                  {errors.targetRaise}
                </p>
              )}
              <p className="text-gray-500 text-sm mt-1">Total amount you aim to raise for this project</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <DatePicker
                  id="startDate"
                  selected={projectData.financingStartDate}
                  onChange={handleStartDateChange}
                  minDate={new Date()}
                  maxDate={projectData.financingEndDate || undefined}
                  placeholderText="Select start date"
                  className="w-full"
                  aria-invalid={!!errors.financingStartDate}
                  aria-describedby="startDateError"
                />
                {errors.financingStartDate && (
                  <p id="startDateError" className="text-sm text-red-500">
                    {errors.financingStartDate}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <DatePicker
                  id="endDate"
                  selected={projectData.financingEndDate}
                  onChange={handleEndDateChange}
                  minDate={projectData.financingStartDate || new Date()}
                  placeholderText="Select end date"
                  className="w-full"
                  aria-invalid={!!errors.financingEndDate}
                  aria-describedby="endDateError"
                />
                {errors.financingEndDate && (
                  <p id="endDateError" className="text-sm text-red-500">
                    {errors.financingEndDate}
                  </p>
                )}
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
                <CuratorCard key={curator.id} curator={curator} onClick={toggleCurator} />
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
        <Button variant="ghost" onClick={onPrevious} disabled={isLoading}>
          Back
        </Button>
        <Button onClick={handleNextCallback} className="bg-[#0f172a] hover:bg-[#1e293b]" disabled={isLoading}>
          {isLoading ? "Saving..." : "Continue to Royalty Splits"}
        </Button>
      </div>
    </div>
  );
}

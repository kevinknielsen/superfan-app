"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Save } from "lucide-react"
import { useCreateProject } from "@/contexts/create-project-context"

// Step components
import Step1ProjectInfo from "./step1-project-info"
import Step2RoyaltySplits from "./step2-royalty-splits"
import Step3Milestones from "./step3-milestones"
import Step4Financing from "./step4-financing"
import Step5ReviewPublish from "./step5-review-publish"

const steps = [
  { id: 1, name: "Project Info", component: Step1ProjectInfo },
  { id: 2, name: "Splits", component: Step2RoyaltySplits },
  { id: 3, name: "Milestones", component: Step3Milestones },
  { id: 4, name: "Financing", component: Step4Financing },
  { id: 5, name: "Review", component: Step5ReviewPublish },
]

export default function CreateProjectWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const router = useRouter()
  const { projectData } = useCreateProject()

  const CurrentStepComponent = steps.find((step) => step.id === currentStep)?.component || Step1ProjectInfo

  const goToNextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    }
  }

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  const goToStep = (stepId: number) => {
    // Only allow going to steps that have been visited or are the next step
    if (stepId <= currentStep + 1) {
      setCurrentStep(stepId)
      window.scrollTo(0, 0)
    }
  }

  const handleSaveAsDraft = () => {
    // In a real app, this would save to backend
    console.log("Saving draft:", projectData)
    alert("Project saved as draft!")
  }

  const handlePublish = () => {
    // In a real app, this would submit to backend
    console.log("Publishing project:", projectData)
    router.push("/create/success")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create New Project</h1>
        <p className="text-gray-600">Launch a new investment opportunity for your music project</p>
      </div>

      {/* Step indicators */}
      <div className="mb-8">
        <div className="text-xs text-gray-500 mb-2 text-center">
          <span className="inline-flex items-center">
            <svg
              className="w-3 h-3 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Click on any completed step to navigate back
          </span>
        </div>
        <div className="flex items-center justify-between">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`flex flex-col items-center ${
                currentStep === step.id ? "text-blue-600" : currentStep > step.id ? "text-green-600" : "text-gray-400"
              }`}
            >
              <button
                onClick={() => goToStep(step.id)}
                disabled={step.id > currentStep + 1}
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 
        ${
          currentStep === step.id
            ? "bg-blue-100 border-2 border-blue-600"
            : currentStep > step.id
              ? "bg-green-100 border-2 border-green-600"
              : "bg-gray-100 border-2 border-gray-300"
        }
        ${step.id <= currentStep + 1 ? "cursor-pointer hover:opacity-80" : "cursor-not-allowed"}
        transition-all duration-200
      `}
                aria-label={`Go to ${step.name} step`}
              >
                {currentStep > step.id ? (
                  <svg
                    className="w-4 h-4 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className={currentStep === step.id ? "text-blue-600" : "text-gray-400"}>{step.id}</span>
                )}
              </button>
              <button
                onClick={() => goToStep(step.id)}
                disabled={step.id > currentStep + 1}
                className={`text-xs hidden sm:block hover:underline ${step.id <= currentStep + 1 ? "cursor-pointer" : "cursor-not-allowed"}`}
                aria-label={`Go to ${step.name} step`}
              >
                {step.name}
              </button>
            </div>
          ))}
        </div>
        <div className="relative mt-2 flex w-full">
          {steps.map((step, index) => (
            <React.Fragment key={`progress-${step.id}`}>
              {/* Progress segment */}
              <button
                onClick={() => index > 0 && goToStep(steps[index - 1].id + 1)}
                disabled={index > 0 && steps[index - 1].id >= currentStep}
                className={`h-1 flex-1 transition-all duration-300 ${
                  index < steps.length - 1 && steps[index].id < currentStep
                    ? "bg-blue-600 cursor-pointer hover:bg-blue-700"
                    : index === steps.length - 1 || steps[index].id >= currentStep
                      ? "bg-gray-200 cursor-default"
                      : "bg-blue-600 cursor-pointer hover:bg-blue-700"
                }`}
                aria-label={index > 0 ? `Progress to ${steps[index - 1].name}` : ""}
              />
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Current step content */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <CurrentStepComponent
          onNext={goToNextStep}
          onPrevious={goToPreviousStep}
          onPublish={handlePublish}
          isLastStep={currentStep === steps.length}
          isFirstStep={currentStep === 1}
        />
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between">
        <div>
          {currentStep > 1 && (
            <Button variant="outline" onClick={goToPreviousStep} className="flex items-center">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleSaveAsDraft} className="flex items-center">
            <Save className="w-4 h-4 mr-2" />
            Save as Draft
          </Button>
          {currentStep < steps.length ? (
            <Button onClick={goToNextStep} className="bg-[#0f172a] hover:bg-[#1e293b] flex items-center">
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handlePublish} className="bg-[#0f172a] hover:bg-[#1e293b]">
              Publish Project
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

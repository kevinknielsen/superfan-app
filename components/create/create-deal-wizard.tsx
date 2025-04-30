"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Save } from "lucide-react"
import { useCreateDeal } from "@/contexts/create-deal-context"

// Step components
import Step1ProjectInfo from "./step1-project-info"
import Step2DealTerms from "./step2-deal-terms"
import Step3Milestones from "./step3-milestones"
import Step4RoyaltySplits from "./step4-royalty-splits"
import Step5ReviewPublish from "./step5-review-publish"

const steps = [
  { id: 1, name: "Deal Info", component: Step1ProjectInfo },
  { id: 2, name: "Terms", component: Step2DealTerms },
  { id: 3, name: "Milestones", component: Step3Milestones },
  { id: 4, name: "Splits", component: Step4RoyaltySplits },
  { id: 5, name: "Review", component: Step5ReviewPublish },
]

export default function CreateDealWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const router = useRouter()
  const { dealData } = useCreateDeal()

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

  const handleSaveAsDraft = () => {
    // In a real app, this would save to backend
    console.log("Saving draft:", dealData)
    alert("Deal saved as draft!")
  }

  const handlePublish = () => {
    // In a real app, this would submit to backend
    console.log("Publishing deal:", dealData)
    router.push("/create/success")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create New Deal</h1>
        <p className="text-gray-600">Launch a new investment opportunity for your music project</p>
      </div>

      {/* Step indicators */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`flex flex-col items-center ${
                currentStep === step.id ? "text-blue-600" : currentStep > step.id ? "text-green-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                  currentStep === step.id
                    ? "bg-blue-100 border-2 border-blue-600"
                    : currentStep > step.id
                      ? "bg-green-100 border-2 border-green-600"
                      : "bg-gray-100 border-2 border-gray-300"
                }`}
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
              </div>
              <span className="text-xs hidden sm:block">{step.name}</span>
            </div>
          ))}
        </div>
        <div className="relative mt-2">
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200"></div>
          <div
            className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-blue-600 transition-all duration-300"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          ></div>
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
              Publish Deal
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

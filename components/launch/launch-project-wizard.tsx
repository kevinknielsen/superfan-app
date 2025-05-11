"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useLaunchProject } from "@/contexts/launch-project-context"

// Step components
import Step1ProjectInfo from "./step1-project-info"
import Step2Financing from "./step2-financing"
import Step3RoyaltySplits from "./step3-royalty-splits"
import Step3Milestones from "./step3-milestones"
import Step5ReviewPublish from "./step5-review-publish"

const TOTAL_STEPS = 5

const steps = [
  {
    id: 1,
    title: "Project Info",
    description: "Basic information about your project",
    component: Step1ProjectInfo,
  },
  {
    id: 2,
    title: "Financing",
    description: "Set up financing options",
    component: Step2Financing,
  },
  {
    id: 3,
    title: "Royalty Splits",
    description: "Define revenue sharing",
    component: Step3RoyaltySplits,
  },
  {
    id: 4,
    title: "Milestones",
    description: "Set project milestones",
    component: Step3Milestones,
  },
  {
    id: 5,
    title: "Review & Publish",
    description: "Review and publish your project",
    component: Step5ReviewPublish,
  },
] as const

export default function LaunchProjectWizard() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<number>(1)
  const [highestStepSeen, setHighestStepSeen] = useState<number>(1)
  const { projectData } = useLaunchProject()

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return !!(
          projectData.title &&
          projectData.artistName &&
          projectData.description &&
          projectData.artwork
        )
      case 2:
        return projectData.royaltySplits.length > 0
      case 3:
        return projectData.milestones.length > 0
      case 4:
        return true // Financing is optional
      case 5:
        return true
      default:
        return false
    }
  }

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      if (validateStep(currentStep)) {
        const nextStep = currentStep + 1
        setCurrentStep(nextStep)
        setHighestStepSeen(Math.max(highestStepSeen, nextStep))
      }
    } else {
      handleSubmit()
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleStepClick = (stepId: number) => {
    setCurrentStep(stepId)
    setHighestStepSeen(Math.max(highestStepSeen, stepId))
  }

  const handleSubmit = async () => {
    // Validate all steps before final submission
    const allStepsValid = [1, 2, 3, 4, 5].every(validateStep)
    if (!allStepsValid) {
      // TODO: Show error message about incomplete steps
      return
    }

    try {
      console.log("Submitting project:", projectData)
      router.push("/launch/success")
    } catch (error) {
      console.error("Error submitting project:", error)
    }
  }

  return (
    <div className="container max-w-5xl py-8">
      <h1 className="text-3xl font-bold">Launch New Project</h1>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            {currentStep > 1 && (
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2"
                onClick={handleBack}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {steps.map((step) => (
              <button
                key={step.id}
                onClick={() => handleStepClick(step.id)}
                className="relative group cursor-pointer"
                aria-current={step.id === currentStep ? "step" : undefined}
              >
                <div
                  className={`w-4 h-4 rounded-full transition-all
                    ${step.id === currentStep
                      ? "bg-gradient-to-r from-[#a259ff] to-[#f857a6]"
                      : step.id < currentStep
                        ? "bg-[#a259ff]"
                        : "bg-[#e5e7eb]"
                    }
                  `}
                />
                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-sm text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  {step.title}
                </span>
              </button>
            ))}
          </div>
        </div>

        <Card className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {currentStep === 1 && (
                <Step1ProjectInfo 
                  onNext={handleNext}
                  onPrevious={handleBack}
                  isFirstStep={true}
                  isLastStep={false}
                />
              )}
              {currentStep === 2 && (
                <Step2Financing 
                  onNext={handleNext}
                  onPrevious={handleBack}
                  isFirstStep={false}
                  isLastStep={false}
                />
              )}
              {currentStep === 3 && (
                <Step3RoyaltySplits 
                  onNext={handleNext}
                  onPrevious={handleBack}
                  isFirstStep={false}
                  isLastStep={false}
                />
              )}
              {currentStep === 4 && (
                <Step3Milestones 
                  onNext={handleNext}
                  onPrevious={handleBack}
                  isFirstStep={false}
                  isLastStep={false}
                />
              )}
              {currentStep === 5 && (
                <Step5ReviewPublish 
                  onNext={handleNext}
                  onPrevious={handleBack}
                  isFirstStep={false}
                  isLastStep={true}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </Card>
      </div>
    </div>
  )
}


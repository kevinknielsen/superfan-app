"use client"

import { Button } from "@/components/ui/button"
import { useLaunchProject } from "@/contexts/launch-project-context"
import { formatDate } from "@/lib/utils"
import { UserAvatar } from "@/components/ui/user-avatar"
import supabase from '@/lib/supabaseClient'
import { useRouter } from "next/navigation"

interface Step5Props {
  onNext: () => void
  onPrevious: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

export default function Step5ReviewPublish({ onNext }: Step5Props) {
  const { projectData } = useLaunchProject()
  const router = useRouter();

  // Calculate total percentage for royalty splits
  const totalPercentage = projectData.royaltySplits.reduce((sum, split) => sum + split.percentage, 0)

  // Count selected curators
  const selectedCurators = projectData.selectedCurators.filter((curator) => curator.selected)

  const handlePublish = async () => {
    if (!projectData.id) return onNext();
    const selectedCurators = projectData.selectedCurators.filter((curator) => curator.selected);
    if (selectedCurators.length > 0) {
      const pitches = selectedCurators.map((curator) => ({
        project_id: projectData.id,
        curator_id: curator.id,
      }));
      const { error } = await supabase.from('curator_pitches').insert(pitches);
      if (error) {
        alert('Failed to save curator pitches: ' + error.message);
        return;
      }
    }
    // Redirect to success page with projectId
    router.push(`/launch/success?projectId=${projectData.id}`);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-4">Review & Publish</h2>
        <p className="text-gray-600 mb-6">Review your project details before publishing.</p>
      </div>

      {/* Project Info Section */}
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b">
          <h3 className="font-medium">Project Information</h3>
        </div>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1">
              {projectData.artworkPreview ? (
                <img
                  src={projectData.artworkPreview || "/placeholder.svg"}
                  alt="Project artwork"
                  className="w-full aspect-square object-cover rounded-md"
                />
              ) : (
                <div className="w-full aspect-square bg-gray-200 rounded-md flex items-center justify-center text-gray-400">
                  No artwork
                </div>
              )}
            </div>
            <div className="col-span-2 space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Project Title</h4>
                <p className="font-medium">{projectData.title || "Untitled Project"}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Artist Name</h4>
                <p>{projectData.artistName || "Not specified"}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Description</h4>
                <p className="text-sm">{projectData.description || "No description provided"}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Track Demo</h4>
                <p className="text-sm">
                  {projectData.trackDemo ? projectData.trackDemo.name : "No track demo uploaded"}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Additional Files</h4>
                <p className="text-sm">
                  {projectData.additionalFilesInfo.length > 0
                    ? `${projectData.additionalFilesInfo.length} file(s) uploaded`
                    : "No additional files uploaded"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Royalty Splits Section */}
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b">
          <h3 className="font-medium">Royalty Splits</h3>
        </div>
        <div className="p-4">
          <div className="space-y-4">
            {projectData.royaltySplits.map((split) => (
              <div key={split.id} className="flex justify-between items-center border-b pb-2">
                <span>{split.recipient || "Unnamed Recipient"}</span>
                <span className="font-medium">{split.percentage}%</span>
              </div>
            ))}
            <div className="flex justify-between items-center pt-2">
              <span className="font-medium">Total</span>
              <span className={`font-medium ${totalPercentage !== 100 ? "text-red-500" : ""}`}>{totalPercentage}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Milestones Section */}
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b">
          <h3 className="font-medium">Milestones</h3>
        </div>
        <div className="p-4">
          {projectData.milestones.length > 0 ? (
            <div className="space-y-4">
              {projectData.milestones.map((milestone, index) => (
                <div key={milestone.id} className="border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center gap-2">
                    <div className="bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </div>
                    <h4 className="font-medium">{milestone.title || "Untitled Milestone"}</h4>
                  </div>
                  <p className="text-sm mt-2">{milestone.description || "No description provided"}</p>
                  <div className="flex justify-between mt-2 text-sm text-gray-500">
                    <span>Due: {milestone.dueDate ? formatDate(milestone.dueDate) : "No date set"}</span>
                    <span>{milestone.requiresApproval ? "Requires approval" : "Does not require approval"}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No milestones defined</p>
          )}
        </div>
      </div>

      {/* Financing Section */}
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b">
          <h3 className="font-medium">Financing</h3>
        </div>
        <div className="p-4">
          {projectData.enableFinancing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Target Raise</h4>
                  <p className="font-medium">
                    {projectData.targetRaise ? `${projectData.targetRaise} USDC` : "Not specified"}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Contribution Range</h4>
                  <p>
                    {projectData.minContribution && projectData.maxContribution
                      ? `${projectData.minContribution} - ${projectData.maxContribution} USDC`
                      : "Not specified"}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Start Date</h4>
                  <p>{projectData.startDate ? formatDate(projectData.startDate) : "Not specified"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">End Date</h4>
                  <p>{projectData.endDate ? formatDate(projectData.endDate) : "Not specified"}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  Selected Curators ({selectedCurators.length})
                </h4>
                {selectedCurators.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedCurators.map((curator) => (
                      <div key={curator.id} className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1">
                        <UserAvatar src={curator.avatar} name={curator.name} size={20} />
                        <span className="text-sm">{curator.name}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No curators selected</p>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-blue-50 p-3 rounded-md">
              <p className="text-sm text-blue-800">Financing is disabled. This project will be created as private.</p>
            </div>
          )}
        </div>
      </div>

      <div className="pt-4">
        <Button onClick={handlePublish} className="w-full bg-[#0f172a] hover:bg-[#1e293b]">
          Publish Project
        </Button>
        <p className="text-center text-sm text-gray-500 mt-2">
          By publishing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}

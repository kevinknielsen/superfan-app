"use client";

import { Button } from "@/components/ui/button";
import { useLaunchProject } from "@/contexts/launch-project-context";
import { formatDate } from "@/lib/utils";
import { UserAvatar } from "@/components/ui/user-avatar";
import supabase from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { createProjectSplit } from "@/lib/splits";
import { useAuth } from "@/contexts/auth-context";

interface Step5Props {
  onNext: () => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

function CuratorBadge({ curator }: { curator: { id: string; name: string; avatar: string | null } }) {
  return (
    <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1">
      <UserAvatar src={curator.avatar || "/placeholder-user.jpg"} name={curator.name} size={20} alt={curator.name} />
      <span className="text-sm">{curator.name}</span>
    </div>
  );
}

export default function Step5ReviewPublish({ onNext }: Step5Props) {
  const { projectData } = useLaunchProject();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const totalPercentage = useMemo(
    () => projectData.royaltySplits.reduce((sum, split) => sum + split.percentage, 0),
    [projectData.royaltySplits]
  );

  const selectedCurators = useMemo(
    () => projectData.selectedCurators.filter((curator) => curator.selected),
    [projectData.selectedCurators]
  );

  const handlePublish = async () => {
    if (!projectData.id || !user?.wallet_address) {
      toast({
        title: "Error",
        description: "Please connect your wallet to publish the project",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Create splits contract
      const { splitAddress, txHash } = await createProjectSplit({
        collaborators: projectData.royaltySplits.map(split => ({
          address: split.recipient,
          percent: split.percentage,
        })),
        ownerAddress: user.wallet_address,
      });

      // Update project with splits contract address
      const { error: updateError } = await supabase
        .from("projects")
        .update({ 
          status: "published",
          splits_contract_address: splitAddress,
          splits_tx_hash: txHash,
        })
        .eq("id", projectData.id);
      
      if (updateError) throw new Error("Failed to update project status: " + updateError.message);

      if (selectedCurators.length > 0) {
        const pitches = selectedCurators.map((curator) => ({
          project_id: projectData.id,
          curator_id: curator.id,
        }));
        const { error } = await supabase.from("curator_pitches").insert(pitches);
        if (error) throw new Error("Failed to save curator pitches: " + error.message);
      }

      toast({
        title: "Success",
        description: "Project published successfully with splits contract created!",
      });

      router.push(`/launch/success?projectId=${projectData.id}`);
    } catch (error: any) {
      console.error('Error publishing project:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to publish project",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
                <h4 className="text-sm font-medium text-gray-500">Title</h4>
                <p className="mt-1">{projectData.title}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Artist</h4>
                <p className="mt-1">{projectData.artistName}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Description</h4>
                <p className="mt-1 text-gray-600">{projectData.description}</p>
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
            {projectData.royaltySplits.map((split, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <UserAvatar userAddress={split.recipient} />
                  <span>{split.recipient}</span>
                </div>
                <span className="text-gray-600">{split.percentage}%</span>
              </div>
            ))}
            <div className="pt-2 border-t">
              <div className="flex justify-between items-center font-medium">
                <span>Total</span>
                <span>{totalPercentage}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Financing Section */}
      {projectData.enableFinancing && (
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b">
            <h3 className="font-medium">Financing Details</h3>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Target Raise</h4>
              <p className="mt-1">${projectData.targetRaise?.toLocaleString()}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Contribution Limits</h4>
              <p className="mt-1">
                ${projectData.minContribution?.toLocaleString()} - ${projectData.maxContribution?.toLocaleString()}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Financing Period</h4>
              <p className="mt-1">
                {projectData.financingStartDate ? formatDate(projectData.financingStartDate.toISOString()) : 'Not set'} - {projectData.financingEndDate ? formatDate(projectData.financingEndDate.toISOString()) : 'Not set'}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">
                Selected Curators ({selectedCurators.length})
              </h4>
              {selectedCurators.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selectedCurators.map((curator) => (
                    <CuratorBadge key={curator.id} curator={curator} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No curators selected</p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="pt-4">
        <Button onClick={handlePublish} className="w-full bg-[#0f172a] hover:bg-[#1e293b]" disabled={isLoading}>
          {isLoading ? "Publishing..." : "Publish Project"}
        </Button>
        <p className="text-center text-sm text-gray-500 mt-2">
          By publishing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}

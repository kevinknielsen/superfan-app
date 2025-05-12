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
import { useWallets } from "@privy-io/react-auth";

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
  const { user, login } = useAuth();
  const [publishError, setPublishError] = useState<string | null>(null);
  const { wallets } = useWallets();
  const embeddedWallet = wallets.find((wallet) => wallet.walletClientType === "privy");

  const totalPercentage = useMemo(
    () => projectData.royaltySplits.reduce((sum, split) => sum + split.percentage, 0),
    [projectData.royaltySplits]
  );

  const selectedCurators = useMemo(
    () => projectData.selectedCurators.filter((curator) => curator.selected),
    [projectData.selectedCurators]
  );

  const handlePublish = async () => {
    setPublishError(null);
    console.log("Privy user object:", user);

    if (!user) {
      try {
        await login();
      } catch (e) {
        setPublishError("Wallet connection was cancelled or failed.");
        return;
      }
    }

    if (!embeddedWallet) {
      setPublishError("No Privy wallet found. Please connect your wallet first.");
      return;
    }

    if (!projectData.id) {
      const errorMsg = "Project ID missing. Please complete all steps.";
      setPublishError(errorMsg);
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
      alert(errorMsg);
      return;
    }

    setIsLoading(true);
    try {
      // Fetch team members for the project
      const { data: teamMembers, error: teamError } = await supabase
        .from("team_members")
        .select("wallet_address, revenue_share_pct")
        .eq("project_id", projectData.id);
      if (teamError) throw new Error("Failed to fetch team members: " + teamError.message);

      // Filter for valid wallet addresses
      const validCollaborators = (teamMembers || []).filter(
        (member) => /^0x[a-fA-F0-9]{40}$/.test(member.wallet_address)
      );
      if (validCollaborators.length === 0) {
        setPublishError("No valid wallet addresses found for collaborators. Please ensure all team members have a wallet address.");
        setIsLoading(false);
        return;
      }

      const collaborators = validCollaborators.map((member) => ({
        address: member.wallet_address,
        percent: member.revenue_share_pct,
      }));

      // Create splits contract
      const { splitAddress, txHash } = await createProjectSplit({
        collaborators,
        ownerAddress: embeddedWallet.address,
        wallet: embeddedWallet,
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
                {projectData.financingStartDate
                  ? formatDate(
                      (projectData.financingStartDate instanceof Date
                        ? projectData.financingStartDate
                        : new Date(projectData.financingStartDate)
                      ).toISOString()
                    )
                  : 'Not set'}
                - {projectData.financingEndDate
                  ? formatDate(
                      (projectData.financingEndDate instanceof Date
                        ? projectData.financingEndDate
                        : new Date(projectData.financingEndDate)
                      ).toISOString()
                    )
                  : 'Not set'}
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
        {publishError && (
          <p className="text-center text-red-500 mt-2">{publishError}</p>
        )}
        <p className="text-center text-sm text-gray-500 mt-2">
          By publishing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}

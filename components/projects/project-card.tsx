"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { Project } from "@/types/supabase";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useWallets } from "@privy-io/react-auth";
import { ethers } from "ethers";
import { SplitV2Client } from "@0xsplits/splits-sdk";
import { createWalletClient, custom, createPublicClient, http } from "viem";
import { base } from "viem/chains";

// Constants
const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const BASE_CHAIN_ID = 8453;
const BASE_CHAIN_ID_HEX = "0x2105";

interface ProjectCardProps {
  project: Project;
  onDelete: (id: string) => void;
  currentUserId: string | null;
  onCardClick: (project: Project) => void;
}

export function ProjectCard({ project, onDelete, currentUserId, onCardClick }: ProjectCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showInvest, setShowInvest] = useState(false);
  const [investAmount, setInvestAmount] = useState("");
  const [investStatus, setInvestStatus] = useState<null | "loading" | "success" | "error">(null);
  const [investError, setInvestError] = useState<string | null>(null);
  const [distributeStatus, setDistributeStatus] = useState<null | "loading" | "success" | "error">(null);
  const [distributeError, setDistributeError] = useState<string | null>(null);
  const [usdcBalance, setUsdcBalance] = useState<number | null>(null);
  const [balanceLoading, setBalanceLoading] = useState<boolean>(true);

  const splitAddress = project.splits_contract_address || "";

  const { wallets } = useWallets();
  const embeddedWallet = wallets.find((w) => w.walletClientType === "privy");

  // Fetch USDC balance for the split contract
  useEffect(() => {
    async function fetchOnChainBalance() {
      if (!splitAddress) {
        setBalanceLoading(false);
        return;
      }

      setBalanceLoading(true);
      try {
        const provider = new ethers.JsonRpcProvider("https://mainnet.base.org");
        const usdc = new ethers.Contract(
          USDC_ADDRESS,
          ["function balanceOf(address owner) view returns (uint256)", "function decimals() view returns (uint8)"],
          provider
        );

        const [raw, decimals] = await Promise.all([usdc.balanceOf(splitAddress), usdc.decimals()]);

        setUsdcBalance(Number(raw.toString()) / 10 ** Number(decimals));
      } catch (e) {
        setUsdcBalance(0);
      } finally {
        setBalanceLoading(false);
      }
    }

    fetchOnChainBalance();
  }, [splitAddress]);

  const handleDelete = async () => {
    if (project.creator_id !== currentUserId) {
      alert("You are not authorized to delete this project.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      setIsDeleting(true);
      try {
        const supabase = createClient();
        const { error } = await supabase.from("projects").delete().eq("id", project.id).eq("creator_id", currentUserId);

        if (error) {
          throw error;
        }

        onDelete(project.id);
      } catch (error: any) {
        console.error("Error deleting project:", error);
        alert(`Failed to delete project: ${error?.message || "Unknown error"}`);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleInvest = async (e: React.FormEvent) => {
    e.preventDefault();
    setInvestStatus("loading");
    setInvestError(null);

    try {
      if (!embeddedWallet) throw new Error("No wallet connected. Please connect your wallet first.");
      if (!splitAddress) throw new Error("This project doesn't have a valid split contract address.");
      if (!investAmount || isNaN(Number(investAmount)) || Number(investAmount) <= 0)
        throw new Error("Please enter a valid amount greater than 0.");

      const provider = new ethers.BrowserProvider(await embeddedWallet.getEthereumProvider());
      const network = await provider.getNetwork();

      // Switch to Base network if needed
      if (Number(network.chainId) !== BASE_CHAIN_ID) {
        await provider.send("wallet_switchEthereumChain", [{ chainId: BASE_CHAIN_ID_HEX }]);
      }

      const signer = await provider.getSigner();
      const usdc = new ethers.Contract(
        USDC_ADDRESS,
        [
          "function transfer(address to, uint256 amount) public returns (bool)",
          "function decimals() view returns (uint8)",
        ],
        signer
      );

      const decimals = await usdc.decimals();
      const amountInWei = ethers.parseUnits(investAmount, decimals);

      const tx = await usdc.transfer(splitAddress, amountInWei);
      await tx.wait();

      setInvestStatus("success");
      setInvestAmount("");

      // Refresh balance after successful investment
      setTimeout(() => {
        setBalanceLoading(true);
        fetchOnChainBalance();
      }, 2000);
    } catch (err: any) {
      setInvestStatus("error");
      setInvestError(err?.message || "Transaction failed. Please try again.");
    }
  };

  const fetchOnChainBalance = async () => {
    if (!splitAddress) return;

    try {
      const provider = new ethers.JsonRpcProvider("https://mainnet.base.org");
      const usdc = new ethers.Contract(
        USDC_ADDRESS,
        ["function balanceOf(address owner) view returns (uint256)", "function decimals() view returns (uint8)"],
        provider
      );

      const [raw, decimals] = await Promise.all([usdc.balanceOf(splitAddress), usdc.decimals()]);

      setUsdcBalance(Number(raw.toString()) / 10 ** Number(decimals));
    } catch (e) {
      // Don't update balance on error
    } finally {
      setBalanceLoading(false);
    }
  };

  const handleDistribute = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!embeddedWallet || !splitAddress) {
      setDistributeError("Missing wallet or split contract address");
      return;
    }

    setDistributeStatus("loading");
    setDistributeError(null);

    try {
      const provider = new ethers.BrowserProvider(await embeddedWallet.getEthereumProvider());
      const network = await provider.getNetwork();
      const signer = await provider.getSigner();
      const walletAddress = await signer.getAddress();

      // Switch to Base network if needed
      if (Number(network.chainId) !== BASE_CHAIN_ID) {
        await provider.send("wallet_switchEthereumChain", [{ chainId: BASE_CHAIN_ID_HEX }]);
      }

      // Create viem public client for Base
      const publicClient = createPublicClient({
        chain: base,
        transport: http(),
      });

      // Wrap Privy provider as viem wallet client
      const viemWalletClient = createWalletClient({
        account: walletAddress as `0x${string}`,
        chain: base,
        transport: custom(await embeddedWallet.getEthereumProvider()),
      });

      // Use Splits SDK core client with viem wallet and public client
      const splitsClient = new SplitV2Client({
        chainId: BASE_CHAIN_ID,
        walletClient: viemWalletClient,
        publicClient,
      });

      await splitsClient.distribute({
        splitAddress: splitAddress as `0x${string}`,
        tokenAddress: USDC_ADDRESS as `0x${string}`,
        distributorAddress: walletAddress as `0x${string}`,
      });

      setDistributeStatus("success");

      // Refresh balance after distribution
      setTimeout(() => {
        setBalanceLoading(true);
        fetchOnChainBalance();
      }, 2000);
    } catch (err: any) {
      setDistributeStatus("error");
      setDistributeError(err?.message || "Distribution failed. Please try again.");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden" onClick={() => onCardClick(project)}>
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-start lg:items-center">
          {/* Project Image */}
          <div className="lg:col-span-2">
            {project.cover_art_url ? (
              <Image
                src={project.cover_art_url}
                alt={project.title}
                width={120}
                height={120}
                className="rounded-lg object-cover w-full aspect-square"
              />
            ) : (
              <div className="bg-gray-200 rounded-lg w-full aspect-square flex items-center justify-center">
                <span className="text-gray-400">No image</span>
              </div>
            )}
          </div>

          {/* Project Info */}
          <div className="lg:col-span-7">
            <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
            <p className="text-gray-600 mb-2">by {project.artist_name}</p>
            {project.description && <p className="text-gray-500 text-sm mb-4">{project.description}</p>}
            <div className="flex flex-wrap gap-2">
              <span className="capitalize px-2 py-1 rounded bg-gray-100 text-sm">{project.status}</span>
            </div>
          </div>

          {/* Project Stats */}
          <div className="lg:col-span-3">
            <div className="space-y-2">
              <div className="text-sm">
                <span className="text-gray-500">Platform Fee:</span>
                <span className="ml-2 font-medium">{project.platform_fee_pct}%</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-500">Early Curator Shares:</span>
                <span className="ml-2 font-medium">{project.early_curator_shares ? "Yes" : "No"}</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-500">Created:</span>
                <span className="ml-2 font-medium">{new Date(project.created_at).toLocaleDateString()}</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-500">Amount Raised:</span>
                <span className="ml-2 font-medium">
                  {balanceLoading
                    ? "Loading..."
                    : `${
                        usdcBalance?.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }) || 0
                      } USDC`}
                </span>
              </div>
              {project.splits_contract_address && (
                <div className="text-sm">
                  <span className="text-gray-500">Split Contract:</span>
                  <a
                    href={`https://basescan.org/address/${project.splits_contract_address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-blue-600 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View on Basescan
                  </a>
                </div>
              )}
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowInvest(true);
                  }}
                  className="w-full"
                  aria-label="Invest in this project"
                >
                  Invest
                </Button>
                {usdcBalance && usdcBalance > 0 && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleDistribute}
                    disabled={distributeStatus === "loading" || !splitAddress}
                    className="w-full"
                    aria-label="Distribute funds to recipients"
                  >
                    {distributeStatus === "loading" ? "Distributing..." : "Distribute"}
                  </Button>
                )}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
                  }}
                  disabled={isDeleting || project.creator_id !== currentUserId}
                  className="w-full"
                  aria-label="Delete this project"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              </div>
              {distributeStatus === "success" && <div className="text-green-600 text-sm">Distribution successful!</div>}
              {distributeStatus === "error" && <div className="text-red-600 text-sm">{distributeError}</div>}

              {/* Investment Dialog */}
              <Dialog open={showInvest} onOpenChange={setShowInvest}>
                <DialogContent
                  className="max-w-sm"
                  onClick={(e) => e.stopPropagation()}
                  aria-label="Invest in project dialog"
                >
                  <DialogTitle>Invest in Project</DialogTitle>
                  <form onSubmit={handleInvest} className="space-y-4 mt-4">
                    <div>
                      <label htmlFor="invest-amount" className="block text-sm font-medium mb-1">
                        Amount (USDC)
                      </label>
                      <input
                        id="invest-amount"
                        type="number"
                        min="0"
                        step="0.01"
                        value={investAmount}
                        onChange={(e) => setInvestAmount(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        placeholder="Enter amount"
                        required
                        aria-required="true"
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={investStatus === "loading"}>
                      {investStatus === "loading" ? "Processing..." : "Send USDC"}
                    </Button>
                    {investStatus === "success" && (
                      <div className="text-green-600 text-sm" role="status">
                        Investment successful!
                      </div>
                    )}
                    {investStatus === "error" && (
                      <div className="text-red-600 text-sm" role="alert">
                        {investError}
                      </div>
                    )}
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

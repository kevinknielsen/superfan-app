"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import ProtectedRoute from "@/components/protected-route";
import { createClient } from "@/utils/supabase/client";
import { Project } from "@/types/supabase";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ProjectReviewDetails } from "@/components/projects/project-review-details";
import { useAuth } from "@/contexts/auth-context";
import { useWallets } from '@privy-io/react-auth';
import { ethers } from 'ethers';
import { SplitV2Client } from '@0xsplits/splits-sdk';
import { createWalletClient, custom, createPublicClient, http } from 'viem';
import { base } from 'viem/chains';
// import { SplitEarningsCard } from '@0xsplits/splitskit'; // Uncomment if you want to use SplitsKit UI

function ProjectCard({ project, onDelete, currentUserId }: { project: Project; onDelete: (id: string) => void; currentUserId: string | null }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showInvest, setShowInvest] = useState(false);
  const [investAmount, setInvestAmount] = useState("");
  const [investStatus, setInvestStatus] = useState<null | 'loading' | 'success' | 'error'>(null);
  const [investError, setInvestError] = useState<string | null>(null);
  const [fallbackBalance, setFallbackBalance] = useState<number | null>(null);
  const [distributeStatus, setDistributeStatus] = useState<null | 'loading' | 'success' | 'error'>(null);
  const [distributeError, setDistributeError] = useState<string | null>(null);
  // Log the split address for debugging
  console.log('Split address for project', project.id, project.splits_contract_address);
  // For debugging: hardcode a known indexed split address
  // const splitAddress = "0x9A4B144c512B9ed3d79F8698cBd915bf95EC483b";
  const splitAddress = project.splits_contract_address || "";
  // Always fetch USDC balance on-chain
  const [usdcBalance, setUsdcBalance] = useState<number | null>(null);
  const [balanceLoading, setBalanceLoading] = useState<boolean>(true);
  useEffect(() => {
    async function fetchOnChainBalance() {
      if (!splitAddress) return;
      setBalanceLoading(true);
      try {
        const { ethers } = await import('ethers');
        const provider = new ethers.JsonRpcProvider('https://mainnet.base.org');
        const usdc = new ethers.Contract(
          '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
          ["function balanceOf(address owner) view returns (uint256)", "function decimals() view returns (uint8)"],
          provider
        );
        const [raw, decimals] = await Promise.all([
          usdc.balanceOf(splitAddress),
          usdc.decimals(),
        ]);
        setUsdcBalance(Number(raw.toString()) / 10 ** Number(decimals));
      } catch (e) {
        setUsdcBalance(0);
      } finally {
        setBalanceLoading(false);
      }
    }
    fetchOnChainBalance();
  }, [splitAddress]);

  const { wallets } = useWallets();
  const embeddedWallet = wallets.find((w) => w.walletClientType === "privy");

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
      } catch (error) {
        console.error("Error deleting project:", error);
        alert("Failed to delete project. Please try again.");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleInvest = async (e: React.FormEvent) => {
    e.preventDefault();
    setInvestStatus('loading');
    setInvestError(null);
    try {
      if (!embeddedWallet) throw new Error("No Privy wallet connected");
      if (!splitAddress) throw new Error("No split contract address");
      if (!investAmount || isNaN(Number(investAmount)) || Number(investAmount) <= 0) throw new Error("Enter a valid amount");
      const provider = new ethers.BrowserProvider(await embeddedWallet.getEthereumProvider());
      const network = await provider.getNetwork();
      // @ts-ignore
      if (Number(network.chainId) !== 8453) {
        // Prompt user to switch to Base
        await provider.send('wallet_switchEthereumChain', [{ chainId: '0x2105' }]);
      }
      const signer = await provider.getSigner();
      const usdc = new ethers.Contract(
        '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
        ["function transfer(address to, uint256 amount) public returns (bool)", "function decimals() view returns (uint8)"],
        signer
      );
      const decimals = await usdc.decimals();
      const amountInWei = ethers.parseUnits(investAmount, decimals);
      const tx = await usdc.transfer(splitAddress, amountInWei);
      await tx.wait();
      setInvestStatus('success');
      setInvestAmount("");
    } catch (err: any) {
      setInvestStatus('error');
      setInvestError(err?.message || "Transaction failed");
    }
  };

  const handleDistribute = async () => {
    console.log('Distribute: Start', { embeddedWallet, splitAddress });
    if (!embeddedWallet || !splitAddress) {
      console.error('Distribute: Missing embeddedWallet or splitAddress', { embeddedWallet, splitAddress });
      return;
    }
    setDistributeStatus('loading');
    setDistributeError(null);
    try {
      const provider = new ethers.BrowserProvider(await embeddedWallet.getEthereumProvider());
      const network = await provider.getNetwork();
      const signer = await provider.getSigner();
      const walletAddress = await signer.getAddress();
      console.log('Distribute: Wallet address', walletAddress);
      // @ts-ignore
      if (Number(network.chainId) !== 8453) {
        console.log('Distribute: Switching to Base network');
        await provider.send('wallet_switchEthereumChain', [{ chainId: '0x2105' }]);
      }
      const tokenAddress = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
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
        chainId: 8453,
        walletClient: viemWalletClient,
        publicClient,
      });
      console.log('Distribute: Calling splitsClient.distribute', {
        splitAddress: splitAddress,
        tokenAddress: tokenAddress,
        distributorAddress: walletAddress,
      });
      const response = await splitsClient.distribute({
        splitAddress: splitAddress as `0x${string}`,
        tokenAddress: tokenAddress as `0x${string}`,
        distributorAddress: walletAddress as `0x${string}`,
      });
      console.log('Distribute: splitsClient.distribute response', response);
      setDistributeStatus('success');
    } catch (err: any) {
      console.error('Distribute: Error', err);
      setDistributeStatus('error');
      setDistributeError(err?.message || "Distribution failed");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
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
                  {balanceLoading ? "Loading..." : `${usdcBalance?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || 0} USDC`}
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
                  >
                    View on Basescan
                  </a>
                </div>
              )}
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={e => {
                    e.stopPropagation();
                    setShowInvest(true);
                  }}
                  className="w-full"
                >
                  Invest
                </Button>
                {usdcBalance && usdcBalance > 0 && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDistribute();
                    }}
                    disabled={distributeStatus === 'loading' || !splitAddress}
                    className="w-full"
                  >
                    {distributeStatus === 'loading' ? 'Distributing...' : 'Distribute'}
                  </Button>
                )}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isDeleting || project.creator_id !== currentUserId}
                  className="w-full"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              </div>
              {distributeStatus === 'success' && (
                <div className="text-green-600 text-sm">Distribution successful!</div>
              )}
              {distributeStatus === 'error' && (
                <div className="text-red-600 text-sm">{distributeError}</div>
              )}
              {/* Invest Modal */}
              {showInvest && (
                <Dialog open={showInvest} onOpenChange={setShowInvest}>
                  <DialogContent className="max-w-sm" onClick={e => e.stopPropagation()}>
                    <DialogTitle>Invest in Project</DialogTitle>
                    <form onSubmit={handleInvest} className="space-y-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Amount (USDC)</label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={investAmount}
                          onChange={e => setInvestAmount(e.target.value)}
                          className="w-full border rounded px-3 py-2"
                          placeholder="Enter amount"
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={investStatus === 'loading'}>
                        {investStatus === 'loading' ? 'Processing...' : 'Send USDC'}
                      </Button>
                      {investStatus === 'success' && <div className="text-green-600 text-sm">Investment successful!</div>}
                      {investStatus === 'error' && <div className="text-red-600 text-sm">{investError}</div>}
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [modalData, setModalData] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const fetchProjects = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.from("projects").select();

      if (isMounted) {
        if (error) {
          setError("Failed to fetch projects. Please try again later.");
        } else {
          setProjects(data || []);
        }
        setLoading(false);
      }
    };

    fetchProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleDeleteProject = (projectId: string) => {
    setProjects((prevProjects) => prevProjects.filter((p) => p.id !== projectId));
  };

  // Derive unique statuses from data
  const statuses = useMemo(() => {
    const types = new Set(projects.map((project) => project.status));
    return Array.from(types);
  }, [projects]);

  // Filter and sort projects based on selected filters
  const filteredProjects = useMemo(() => {
    let result = [...projects];

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((project) => project.status === statusFilter);
    }

    // Apply sorting
    if (sortBy === "newest") {
      result = result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return result;
  }, [projects, statusFilter, sortBy]);

  const handleCardClick = async (project: Project) => {
    if (project.status !== "published") return;
    setSelectedProject(project);
    setModalLoading(true);
    setModalOpen(true);
    // Fetch related data
    const supabase = createClient();
    const [{ data: royaltySplits }, { data: milestones }, { data: financing }, { data: collaborators }] = await Promise.all([
      supabase.from("royalty_splits").select().eq("project_id", project.id),
      supabase.from("milestones").select().eq("project_id", project.id),
      supabase.from("financing").select().eq("project_id", project.id).single(),
      supabase.from("team_members").select().eq("project_id", project.id),
    ]);
    setModalData({
      project,
      royaltySplits: (royaltySplits && royaltySplits.length > 0)
        ? royaltySplits
        : (collaborators || []).filter(c => c.revenue_share_pct > 0).map(c => ({
            id: c.id,
            recipient: c.name,
            percentage: c.revenue_share_pct,
          })),
      milestones: milestones || [],
      financing: financing || {},
      collaborators: collaborators || [],
    });
    setModalLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"
            role="status"
            aria-label="Loading"
          ></div>
          <p className="mt-4 text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogTitle className="mb-4">Project Details</DialogTitle>
          {modalLoading ? (
            <div className="p-8 text-center text-gray-500">Loading project details...</div>
          ) : modalData ? (
            <ProjectReviewDetails {...modalData} />
          ) : null}
        </DialogContent>
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            {/* Header section with title and action button */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold">Music Projects</h1>
                <p className="text-gray-600">
                  Discover and invest in music projects • {projects.length} available projects
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </div>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="all">All Statuses ({projects.length})</option>
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status} ({projects.filter((p) => p.status === status).length})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                    <select
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="newest">Newest</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Projects Grid */}
            <div className="space-y-6">
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    className={
                      project.status === "published"
                        ? "cursor-pointer hover:shadow-lg transition-shadow"
                        : "opacity-60 cursor-not-allowed"
                    }
                    onClick={() => handleCardClick(project)}
                  >
                    <ProjectCard
                      project={project}
                      onDelete={handleDeleteProject}
                      currentUserId={user?.id || null}
                    />
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No projects found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Dialog>
    </ProtectedRoute>
  );
}

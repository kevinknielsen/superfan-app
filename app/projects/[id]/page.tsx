"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import { Project } from "@/types/supabase";
import ProtectedRoute from "@/components/protected-route";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/auth-context";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import { ProjectReviewDetails } from "@/components/projects/project-review-details";
import { formatDate } from "@/lib/utils";

interface ProjectDetails extends Project {
  royalty_splits?: Array<{
    id: string;
    recipient: string;
    percentage: number;
  }>;
  milestones?: Array<any>;
  financing?: {
    total_amount: number | null;
    minimum_investment: number | null;
    current_amount: number | null;
    currency: string | null;
  };
  collaborators?: Array<any>;
  splits?: Array<{ id: string; name: string; revenue_share_pct: number }>;
  website?: string;
  round?: string;
  group_lead_investment?: number;
  post_money_valuation?: number;
  token_warrant?: string;
  network_valuation?: number;
  unlock_period?: string;
  carry?: number;
  fees?: number;
}

const SPLIT_COLORS = ["#6366f1", "#f59e42", "#34c759", "#e11d48", "#06b6d4", "#fbbf24", "#a21caf", "#10b981"]; // Extend as needed

export default function ProjectPage() {
  const params = useParams();
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (!params?.id) {
        setError("Project ID not found");
        setLoading(false);
        return;
      }

      try {
        const supabase = createClient();
        const projectId = params.id as string;

        // Fetch project and related data
        const [
          { data: projectData, error: projectError },
          { data: milestones, error: milestonesError },
          { data: financingArr, error: financingError },
          { data: teamMembers, error: teamError }
        ] = await Promise.all([
          supabase.from("projects").select().eq("id", projectId).single(),
          supabase.from("milestones").select().eq("project_id", projectId),
          supabase.from("financing").select().eq("project_id", projectId),
          supabase.from("team_members").select().eq("project_id", projectId)
        ]);

        const financing = Array.isArray(financingArr) && financingArr.length > 0 ? financingArr[0] : null;
        const allTeamMembers = Array.isArray(teamMembers) ? teamMembers : [];
        const splits = allTeamMembers.filter(c => c.revenue_share_pct && c.revenue_share_pct > 0);

        console.log({
          projectData,
          milestones,
          financing,
          allTeamMembers,
          splits,
          projectError,
          milestonesError,
          financingError,
          teamError
        });
        setProject({
          ...projectData,
          milestones: Array.isArray(milestones) ? milestones : [],
          financing: financing || {
            total_amount: null,
            minimum_investment: null,
            current_amount: null,
            currency: null
          },
          collaborators: allTeamMembers,
          splits: splits,
        });
      } catch (err) {
        console.error("Error fetching project details:", err);
        setError("Failed to load project details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [params?.id]);

  // Helper for stat cards
  function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
    return (
      <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center min-w-[120px]">
        <span className="text-xs text-gray-500 mb-1">{label}</span>
        <span className="text-2xl font-bold">{value}</span>
        {sub && <span className="text-xs text-gray-400 mt-1">{sub}</span>}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto" />
          <p className="mt-4 text-gray-600">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">{error || "Project not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <button className="mb-4 text-sm text-gray-500 hover:underline" onClick={() => window.history.back()}>&larr; Back</button>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="deck">Deck</TabsTrigger>
              <TabsTrigger value="splits">Splits</TabsTrigger>
              <TabsTrigger value="milestones">Milestones</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Project Info */}
                <div className="col-span-1">
                  <div className="bg-white rounded-xl shadow p-6 mb-6">
                    <div className="flex items-center gap-4 mb-6">
                      {project.cover_art_url ? (
                        <Image
                          src={project.cover_art_url}
                          alt={project.title}
                          width={56}
                          height={56}
                          className="rounded-md object-cover w-14 h-14"
                        />
                      ) : (
                        <div className="w-14 h-14 bg-gray-200 rounded-md flex items-center justify-center text-gray-400">No image</div>
                      )}
                      <div>
                        <h2 className="text-xl font-bold leading-tight mb-1">{project.title}</h2>
                        <div className="text-xs text-gray-500">available to {project.artist_name || "Unknown"}</div>
                      </div>
                    </div>
                    <dl className="divide-y divide-gray-100">
                      <div className="flex justify-between py-2 text-sm">
                        <dt className="text-gray-500">Status</dt>
                        <dd className="font-medium text-right capitalize">{project.status}</dd>
                      </div>
                      <div className="flex justify-between py-2 text-sm">
                        <dt className="text-gray-500">Platform Fee</dt>
                        <dd className="font-medium text-right">{project.platform_fee_pct}%</dd>
                      </div>
                      <div className="flex justify-between py-2 text-sm">
                        <dt className="text-gray-500">Early Curator Shares</dt>
                        <dd className="font-medium text-right">{project.early_curator_shares ? "Yes" : "No"}</dd>
                      </div>
                      <div className="flex justify-between py-2 text-sm">
                        <dt className="text-gray-500">Created</dt>
                        <dd className="font-medium text-right">{project.created_at ? formatDate(project.created_at) : "-"}</dd>
                      </div>
                    </dl>
                  </div>
                  {/* Add any additional left-side content here */}
                </div>
                {/* Right: Stats, warning, and main content */}
                <div className="col-span-2 flex flex-col gap-6">
                  <div className="flex flex-wrap gap-4 mb-4">
                    <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center min-w-[180px]">
                      <span className="text-xs text-gray-500 mb-1">FUNDED</span>
                      <span className="text-3xl font-bold">{project.financing && project.financing.total_amount && project.financing.current_amount ? `${Math.round((project.financing.current_amount / project.financing.total_amount) * 100)}%` : "N/A"}</span>
                    </div>
                    <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center min-w-[180px]">
                      <span className="text-xs text-gray-500 mb-1">REMAINING</span>
                      <span className="text-3xl font-bold">{project.financing && project.financing.total_amount && project.financing.current_amount ? `$${(project.financing.total_amount - project.financing.current_amount).toLocaleString()}` : "N/A"} <span className="text-base font-normal text-gray-400">USDC</span></span>
                    </div>
                    <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center min-w-[180px]">
                      <span className="text-xs text-gray-500 mb-1">ALLOCATION IN ROUND</span>
                      <span className="text-3xl font-bold">{project.financing && project.financing.total_amount ? `$${project.financing.total_amount.toLocaleString()}` : "N/A"} <span className="text-base font-normal text-gray-400">USDC</span></span>
                    </div>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <div className="font-semibold text-yellow-800 mb-1 flex items-center gap-2">
                      <span className="text-lg">⚠️</span> Strict Confidentiality Applies
                    </div>
                    <div className="text-sm text-yellow-700">
                      Regulations require all details from this page to <b>be kept confidential</b>. If you share details from this page, you will be instantly banned from Superfan and we may initiate legal proceedings. Superfan's regulatory structure requires project information to remain private to operate. Please be sensible. Thank you!
                    </div>
                  </div>
                  <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
                    <div className="text-gray-700 text-base">{project.description}</div>
                  </div>
                  {/* Add any additional right-side content here */}
                </div>
              </div>
            </TabsContent>

            {/* Deck Tab */}
            <TabsContent value="deck">
              <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">Deck content coming soon.</div>
            </TabsContent>

            {/* Splits Tab */}
            <TabsContent value="splits" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Royalty Splits</CardTitle>
                </CardHeader>
                <CardContent>
                  {project.splits && project.splits.length > 0 ? (
                    <div className="flex flex-col md:flex-row items-center gap-8">
                      <div className="w-full md:w-1/2 h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={project.splits}
                              dataKey="revenue_share_pct"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              outerRadius={90}
                              label={({ name, percent }: { name: string; percent: number }) => `${name} (${Math.round(percent * 100)}%)`}
                            >
                              {project.splits.map((entry: { id: string }, idx: number) => (
                                <Cell key={`cell-${entry.id}`} fill={SPLIT_COLORS[idx % SPLIT_COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value: number) => `${value}%`} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="w-full md:w-1/2">
                        <table className="w-full text-sm">
                          <tbody>
                            {project.splits.map((split: { id: string; name: string; revenue_share_pct: number }, idx: number) => (
                              <tr key={split.id}>
                                <td className="py-1">
                                  <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ background: SPLIT_COLORS[idx % SPLIT_COLORS.length] }} />
                                  {split.name}
                                </td>
                                <td className="text-right font-medium">{split.revenue_share_pct}%</td>
                              </tr>
                            ))}
                            <tr>
                              <td className="font-bold pt-2">Total</td>
                              <td className="text-right font-bold pt-2">{project.splits.reduce((sum: number, s: { revenue_share_pct: number }) => sum + (s.revenue_share_pct || 0), 0)}%</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-500">No royalty splits available.</div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Milestones Tab */}
            <TabsContent value="milestones" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Project Milestones</CardTitle>
                </CardHeader>
                <CardContent>
                  {project.milestones && project.milestones.length > 0 ? (
                    <div className="space-y-4">
                      {project.milestones.map((milestone) => (
                        <div key={milestone.id} className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium">{milestone.title}</h3>
                            <span className="capitalize px-2 py-1 rounded-full bg-gray-200 text-sm">
                              {milestone.status}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-2">{milestone.description}</p>
                          <p className="text-sm text-gray-500">
                            Due: {milestone.due_date ? new Date(milestone.due_date).toLocaleDateString() : "-"}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-500">No milestones available.</div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Team Tab */}
            <TabsContent value="team" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Team Members</CardTitle>
                </CardHeader>
                <CardContent>
                  {project.collaborators && project.collaborators.length > 0 ? (
                    <div className="space-y-4">
                      {project.collaborators.map((member) => (
                        <div key={member.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                          <div>
                            <h3 className="font-medium">{member.name}</h3>
                            <p className="text-sm text-gray-600">{member.role}</p>
                          </div>
                          {member.revenue_share_pct > 0 && (
                            <span className="text-gray-600">{member.revenue_share_pct}%</span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-500">No team members listed.</div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
} 
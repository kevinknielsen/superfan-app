import { formatDate } from "@/lib/utils";
import Image from "next/image";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export interface ProjectReviewDetailsProps {
  project: any;
  royaltySplits: { id: string; recipient: string; percentage: number }[];
  milestones: { id: string; title: string; description: string; due_date: string; requires_approval: boolean }[];
  financing?: { target_raise?: number };
  collaborators?: { name: string; role: string }[];
}

export function ProjectReviewDetails({ project, royaltySplits, milestones, financing, collaborators }: ProjectReviewDetailsProps) {
  const totalPercentage = royaltySplits.reduce((sum, split) => sum + split.percentage, 0);
  const COLORS = ["#6366f1", "#f59e42", "#10b981", "#f43f5e", "#fbbf24", "#3b82f6", "#a21caf", "#14b8a6", "#eab308", "#ef4444"];

  return (
    <div className="max-h-[80vh] overflow-y-auto space-y-8 pr-2">
      {/* Project Info Section */}
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b">
          <h3 className="font-medium">Project Information</h3>
        </div>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1">
              {project.cover_art_url ? (
                <Image
                  src={project.cover_art_url}
                  alt="Project artwork"
                  width={300}
                  height={300}
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
                <p className="font-medium">{project.title || "Untitled Project"}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Artist Name</h4>
                <p>{project.artist_name || "Not specified"}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Description</h4>
                <p className="text-sm">{project.description || "No description provided"}</p>
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
          {royaltySplits.length === 0 ? (
            <div className="text-gray-500 text-sm">No royalty splits defined</div>
          ) : (
            <>
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="w-full md:w-1/2 h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={royaltySplits}
                        dataKey="percentage"
                        nameKey="recipient"
                        cx="50%"
                        cy="50%"
                        outerRadius={70}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      >
                        {royaltySplits.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-2">
                  {royaltySplits.map((split, idx) => (
                    <div key={split.id} className="flex justify-between items-center border-b pb-2">
                      <span className="flex items-center gap-2">
                        <span className="inline-block w-3 h-3 rounded-full" style={{ background: COLORS[idx % COLORS.length] }} />
                        {split.recipient || "Unnamed Recipient"}
                      </span>
                      <span className="font-medium">{split.percentage}%</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-2">
                    <span className="font-medium">Total</span>
                    <span className={`font-medium ${totalPercentage !== 100 ? "text-red-500" : ""}`}>{totalPercentage}%</span>
                  </div>
                  {totalPercentage !== 100 && (
                    <div className="text-red-500 text-xs mt-2">Total does not equal 100%</div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Milestones Section */}
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b">
          <h3 className="font-medium">Milestones</h3>
        </div>
        <div className="p-4">
          {milestones.length > 0 ? (
            <div className="space-y-4">
              {milestones.map((milestone, index) => (
                <div key={milestone.id} className="border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center gap-2">
                    <div className="bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </div>
                    <h4 className="font-medium">{milestone.title || "Untitled Milestone"}</h4>
                  </div>
                  <p className="text-sm mt-2">{milestone.description || "No description provided"}</p>
                  <div className="flex justify-between mt-2 text-sm text-gray-500">
                    <span>Due: {milestone.due_date ? formatDate(milestone.due_date) : "No date set"}</span>
                    <span>{milestone.requires_approval ? "Requires approval" : "Does not require approval"}</span>
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
          {financing && financing.target_raise ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Target Raise</h4>
                  <p className="font-medium">{financing.target_raise} USDC</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No financing info</p>
          )}
        </div>
      </div>

      {/* Collaborators Section */}
      {collaborators && (
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b">
            <h3 className="font-medium">Collaborators</h3>
          </div>
          <div className="p-4">
            {collaborators.length > 0 ? (
              <div className="space-y-2">
                {collaborators.map((c, i) => (
                  <div key={i} className="flex justify-between items-center border-b pb-2">
                    <span>{c.name}</span>
                    <span className="text-xs text-gray-500">{c.role}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No collaborators listed</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 
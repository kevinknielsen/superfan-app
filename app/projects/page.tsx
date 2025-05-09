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

function ProjectCard({ project, onDelete }: { project: Project; onDelete: (id: string) => void }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      setIsDeleting(true);
      try {
        const supabase = createClient();
        const { error } = await supabase.from("projects").delete().eq("id", project.id);
        
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
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
                className="w-full mt-2"
              >
                {isDeleting ? "Deleting..." : "Delete Project"}
              </Button>
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
                    <ProjectCard project={project} onDelete={handleDeleteProject} />
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

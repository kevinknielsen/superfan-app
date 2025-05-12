"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import ProtectedRoute from "@/components/protected-route";
import { createClient } from "@/utils/supabase/client";
import { Project } from "@/types/supabase";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ProjectReviewDetails } from "@/components/projects/project-review-details";
import { ProjectCard } from "@/components/projects/project-card";
import { useAuth } from "@/contexts/auth-context";

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

  // Fetch projects on component mount
  useEffect(() => {
    let isMounted = true;

    const fetchProjects = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.from("projects").select();

        if (!isMounted) return;

        if (error) {
          setError(`Failed to fetch projects: ${error.message}`);
        } else {
          setProjects(data || []);
        }
      } catch (err) {
        if (isMounted) {
          setError("An unexpected error occurred. Please try again later.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
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

    try {
      // Fetch related data
      const supabase = createClient();
      const [
        { data: milestones, error: milestonesError },
        { data: financing, error: financingError },
        { data: collaborators, error: collaboratorsError },
      ] = await Promise.all([
        supabase.from("milestones").select().eq("project_id", project.id),
        supabase.from("financing").select().eq("project_id", project.id),
        supabase.from("team_members").select().eq("project_id", project.id),
      ]);

      // Error handling
      if (milestonesError || financingError || collaboratorsError) {
        throw new Error("Failed to load project details");
      }

      // Process financing data
      const financingData =
        financing && financing.length > 0 ? financing[0] : { message: "No financing data available" };

      // Process collaborators data
      const processedRoyaltySplits = (collaborators || [])
        .filter((c) => c.revenue_share_pct > 0)
        .map((c) => ({
          id: c.id,
          recipient: c.name,
          percentage: c.revenue_share_pct,
        }));

      setModalData({
        project,
        royaltySplits: processedRoyaltySplits,
        milestones: milestones || [],
        financing: financingData,
        collaborators: collaborators || [],
      });
    } catch (err) {
      // Set error message for modal
      setModalData({ error: "Failed to load project details" });
    } finally {
      setModalLoading(false);
    }
  };

  // Loading state
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

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow">
          <p className="text-red-500 mb-4" role="alert">
            {error}
          </p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header section with title and action button */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Music Projects</h1>
              <p className="text-gray-600">
                Discover and invest in music projects • {filteredProjects.length} available projects
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => setShowFilters(!showFilters)}
                aria-expanded={showFilters}
                aria-controls="filter-panel"
              >
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div id="filter-panel" className="bg-white p-4 rounded-lg shadow-sm mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    id="status-filter"
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
                  <label htmlFor="sort-by" className="block text-sm font-medium text-gray-700 mb-1">
                    Sort By
                  </label>
                  <select
                    id="sort-by"
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
                >
                  <ProjectCard
                    project={project}
                    onDelete={handleDeleteProject}
                    currentUserId={user?.id || null}
                    onCardClick={handleCardClick}
                  />
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <p className="text-gray-500">No projects found matching your filters</p>
                {statusFilter !== "all" && (
                  <Button variant="link" onClick={() => setStatusFilter("all")} className="mt-2">
                    Clear filters
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Project Details Modal */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogTitle className="mb-4">Project Details</DialogTitle>
            {modalLoading ? (
              <div className="p-8 text-center text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                Loading project details...
              </div>
            ) : modalData ? (
              modalData.error ? (
                <div className="p-4 text-center text-red-500" role="alert">
                  {modalData.error}
                </div>
              ) : (
                <ProjectReviewDetails {...modalData} />
              )
            ) : null}
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  );
}

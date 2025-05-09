"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import ProtectedRoute from "@/components/protected-route";
import { createClient } from "@/utils/supabase/client";
import { Project } from "@/types/supabase";

function ProjectCard({ project }: { project: Project }) {
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
              filteredProjects.map((project) => <ProjectCard key={project.id} project={project} />)
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No projects found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

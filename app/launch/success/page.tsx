"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowRight } from "lucide-react"
import supabase from "@/lib/supabaseClient"
import { useSearchParams } from "next/navigation"

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) {
      setLoading(false);
      return;
    }
    const fetchProject = async () => {
      const { data, error } = await supabase.from("projects").select("*").eq("id", projectId).single();
      setProject(data);
      setLoading(false);
    };
    fetchProject();
  }, [projectId]);

  if (!projectId) {
    return (
      <div className="container max-w-3xl mx-auto px-4 py-16">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold mb-2">No project ID provided</h1>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container max-w-3xl mx-auto px-4 py-16">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-2">Project Successfully Created!</h1>
          <p className="text-gray-600 mb-8">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container max-w-3xl mx-auto px-4 py-16">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold mb-2">Project not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl mx-auto px-4 py-16">
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-2">Project Successfully Created!</h1>
        <p className="text-gray-600 mb-8">
          {project.enableFinancing
            ? "Your project has been created and is now visible to your selected curators."
            : "Your project has been created as private and is ready for you to share with curators."}
        </p>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-center mb-4">
            {project.cover_art_url ? (
              <img
                src={project.cover_art_url || "/placeholder.svg"}
                alt="Project artwork"
                className="w-24 h-24 object-cover rounded-md"
              />
            ) : (
              <div className="w-24 h-24 bg-gray-200 rounded-md flex items-center justify-center text-gray-400">
                No artwork
              </div>
            )}
          </div>
          <h2 className="text-xl font-bold">{project.title || "Untitled Project"}</h2>
          <p className="text-gray-600">{project.artist_name || "Unknown Artist"}</p>

          {project.enableFinancing ? (
            <div className="mt-4 flex justify-center">
              <div className="bg-blue-50 text-blue-800 px-4 py-2 rounded-full text-sm">
                Target: {project.targetRaise ? `${project.targetRaise} USDC` : "Not specified"}
              </div>
            </div>
          ) : (
            <div className="mt-4 flex justify-center">
              <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full text-sm">Private Project</div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <Link href="/deals">
            <Button className="w-full bg-[#0f172a] hover:bg-[#1e293b] flex items-center justify-center">
              View All Projects
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/launch">
            <Button variant="outline" className="w-full">
              Launch Another Project
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

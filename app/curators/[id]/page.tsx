"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { MoreVertical, ArrowLeft, ExternalLink, Camera } from "lucide-react"
import ProtectedRoute from "@/components/protected-route"
import { createClient } from "@/utils/supabase/client"

export default function GroupDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [curator, setCurator] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCurator = async () => {
      const supabase = createClient()
      const { data, error } = await supabase.from("curators").select("*").eq("id", params.id).single()
      setCurator(data)
      setLoading(false)
    }
    if (params.id) fetchCurator()
  }, [params.id])

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-lg text-gray-600">Loading curator...</div>
  }
  if (!curator) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-lg text-gray-600">Curator not found.</div>
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-4">
          {/* Header with back button and actions */}
          <div className="flex justify-between items-center mb-6">
            <button onClick={() => router.back()} className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5 mr-1" />
              <span className="hidden sm:inline">Back</span>
            </button>

            <div className="relative">
              <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 rounded-full hover:bg-gray-200">
                <MoreVertical className="h-5 w-5" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                  <div className="py-1">
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setMenuOpen(false)}
                    >
                      Leave this group
                    </button>
                    <button
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setMenuOpen(false)}
                    >
                      View full group terms
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Curator profile section */}
          <div className="mb-8">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={curator.image_url || "/placeholder.svg"}
                  alt={curator.name}
                  width={80}
                  height={80}
                  className="object-cover"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">{curator.name}</h1>
                <div className="flex flex-wrap gap-2 mb-3">
                  {(curator.tags || []).map((tag: string) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <p className="text-gray-600 mb-4">{curator.description}</p>
              </div>
            </div>

            {/* Stats section */}
            <div className="flex flex-wrap gap-8 text-gray-600 mb-6">
              <div>
                <div className="text-sm">Members</div>
                <div className="text-2xl font-bold text-black">{curator.members_count?.toLocaleString() ?? 0}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Active Projects</div>
                <div className="text-2xl font-bold text-black">{curator.active_projects ?? 0}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Backed Projects</div>
                <div className="text-2xl font-bold text-black">{curator.backed_projects ?? 0}</div>
              </div>
            </div>
          </div>

          {/* Available projects section */}
          <div className="mb-12">
            <h2 className="text-xl font-bold mb-4">Available projects</h2>

            <div className="bg-white rounded-lg shadow-sm p-8 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Camera className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                There are no currently available projects for you in this curator
              </h3>
              <p className="text-gray-600 max-w-md">
                Curators post projects when they become available. Check back later for more projects, or join other curators
                to see more projects.
              </p>
            </div>
          </div>

          {/* Previous projects section (placeholder for future dynamic fetch) */}
          {/* You can implement fetching previous projects for this curator here */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Previous projects</h2>
              <Link href="/dashboard" className="text-blue-600 hover:text-blue-800 flex items-center">
                See portfolio <span className="ml-1">→</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Placeholder: Replace with dynamic project cards in the future */}
              <div className="col-span-3 bg-white rounded-lg shadow-sm p-12 text-center">
                <h3 className="text-lg font-medium text-gray-700">No previous projects to display</h3>
                <p className="text-gray-500 mt-2">This curator has not backed any projects yet.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronDown } from "lucide-react"
import ProtectedRoute from "@/components/protected-route"
import { createClient } from "@/utils/supabase/client"
import { Project } from "@/types/supabase"

// Mock data for investment groups (record labels and curators)
const mockInvestmentGroups = [
  {
    id: "1",
    name: "Original Works",
    image: "/placeholder-groups/group-1.png",
    type: "Record Label",
    tags: ["Indie Pop", "Electronic"],
    owner: {
      name: "@originalworks",
      avatar: "/placeholder-avatars/avatar-1.png",
    },
    description:
      "Independent label specializing in indie pop and electronic music with a focus on emerging artists and innovative sounds.",
    activeProjects: 2,
    totalRaised: "$125K",
  },
  {
    id: "2",
    name: "Phat Trax",
    image: "/placeholder-groups/group-2.png",
    type: "Record Label",
    tags: ["Hip-Hop", "R&B", "Soul"],
    owner: {
      name: "@phattrax",
      avatar: "/placeholder-avatars/avatar-2.png",
    },
    description: "Artist-owned label focused on hip-hop, R&B and soul music | Streaming: 50M+ monthly",
    activeProjects: 3,
    totalRaised: "$250K",
  },
  {
    id: "3",
    name: "Coop Records",
    image: "/placeholder-groups/group-3.png",
    type: "Curator",
    tags: ["Electronic", "Ambient"],
    owner: {
      name: "@cooprecords",
      avatar: "/placeholder-avatars/avatar-3.png",
    },
    description: "Electronic and ambient music curator with a roster of innovative producers and composers",
    activeProjects: 4,
    totalRaised: "$180K",
  },
]

export default function BrowsePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    const fetchProjects = async () => {
      const supabase = createClient()
      const { data, error } = await supabase.from("projects").select().order("created_at", { ascending: false }).limit(2)
      if (isMounted) {
        setProjects(data || [])
        setLoading(false)
      }
    }
    fetchProjects()
    return () => { isMounted = false }
  }, [])

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white">
        {/* Deal Section - now dynamic */}
        <div className="container mx-auto px-4 py-8 border-b">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">
                See <span className="font-normal">{projects.length} available project{projects.length !== 1 ? 's' : ''}</span>
              </h2>
              <Link href="/projects">
                <Button variant="link" className="text-blue-600">
                  Browse all projects
                </Button>
              </Link>
            </div>

            {loading ? (
              <div className="text-gray-500 p-8 text-center">Loading projects...</div>
            ) : projects.length === 0 ? (
              <div className="text-gray-500 p-8 text-center">No projects available right now.</div>
            ) : (
              projects.map((project) => (
                <div key={project.id} className="bg-white border rounded-lg overflow-hidden mb-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 p-4 items-start lg:items-center">
                    <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex items-center gap-4">
                      <div className="w-16 h-16 bg-black rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={project.cover_art_url || "/placeholder-deals/deal-1.png"}
                          alt={project.title}
                          width={64}
                          height={64}
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{project.title}</h3>
                        <div className="flex items-center text-sm text-gray-500">
                          <span>by {project.artist_name}</span>
                        </div>
                        {project.description && (
                          <div className="text-xs text-gray-500 mt-1 line-clamp-2">{project.description}</div>
                        )}
                      </div>
                    </div>
                    <div className="col-span-1 sm:col-span-1 lg:col-span-2">
                      <div className="text-sm text-gray-500">Status</div>
                      <div className="font-semibold capitalize">{project.status}</div>
                    </div>
                    <div className="col-span-1 sm:col-span-1 lg:col-span-2">
                      <div className="text-sm text-gray-500">Created</div>
                      <div className="font-semibold">{new Date(project.created_at).toLocaleDateString()}</div>
                    </div>
                    <div className="col-span-1 sm:col-span-2 lg:col-span-1 flex justify-end gap-2 mt-4 sm:mt-0">
                      <Link href={`/projects`}>
                        <Button variant="outline" size="sm" className="p-2 h-8 w-8">
                          →
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Investment Curators Section */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                See our <span className="font-normal">trending curators</span>
              </h2>
              <Link href="/curators">
                <Button variant="link" className="text-blue-600">
                  Browse all curators
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mockInvestmentGroups.map((group) => (
                <div key={group.id} className="bg-white rounded-lg border overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={group.image || "/placeholder.svg"}
                          alt={group.name}
                          width={64}
                          height={64}
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{group.name}</h3>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <span>{group.type}</span>
                          <span className="mx-2">•</span>
                          <div className="w-5 h-5 bg-gray-200 rounded-full overflow-hidden mr-1">
                            <Image
                              src={group.owner.avatar || "/placeholder.svg"}
                              alt={group.owner.name}
                              width={20}
                              height={20}
                              className="object-cover"
                            />
                          </div>
                          <span>{group.owner.name}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {group.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{group.description}</p>

                    <div className="border-t pt-4 mt-4">
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-gray-500">Active Projects</div>
                          <div className="text-sm text-gray-500">Total Raised</div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="font-bold text-xl">{group.activeProjects}</div>
                          <div className="font-bold text-xl">{group.totalRaised}</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <Link href={`/curators/${group.id}`}>
                        <Button variant="outline" className="w-full">
                          View Group
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

"use client"

import { useState, useMemo, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Filter } from "lucide-react"
import ProtectedRoute from "@/components/protected-route"
import { createClient } from "@/utils/supabase/client"

export default function CuratorsPage() {
  const [curators, setCurators] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("browse")
  const [showFilters, setShowFilters] = useState(false)
  const [groupTypeFilter, setGroupTypeFilter] = useState("all")
  const [genreFilter, setGenreFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  useEffect(() => {
    const fetchCurators = async () => {
      const supabase = createClient()
      const { data, error } = await supabase.from("curators").select("*")
      setCurators(data || [])
      setLoading(false)
    }
    fetchCurators()
  }, [])

  // Derive unique group types from data
  const groupTypes = useMemo(() => {
    const types = new Set(curators.map((group) => group.type))
    return Array.from(types)
  }, [curators])

  // Derive unique genres from data
  const genres = useMemo(() => {
    const allTags = curators.flatMap((group) => group.tags || [])
    const uniqueTags = new Set(allTags)
    return Array.from(uniqueTags)
  }, [curators])

  // Filter and sort groups based on selected filters
  const filteredGroups = useMemo(() => {
    let result = [...curators]

    // Apply group type filter
    if (groupTypeFilter !== "all") {
      result = result.filter((group) => group.type === groupTypeFilter)
    }

    // Apply genre filter
    if (genreFilter !== "all") {
      result = result.filter((group) => (group.tags || []).includes(genreFilter))
    }

    // Apply sorting
    if (sortBy === "raised") {
      result = result.sort((a, b) => {
        const aValue = Number.parseInt((a.total_raised || "0").toString().replace(/\D/g, ""))
        const bValue = Number.parseInt((b.total_raised || "0").toString().replace(/\D/g, ""))
        return bValue - aValue
      })
    } else if (sortBy === "deals") {
      result = result.sort((a, b) => (b.backed_projects ?? 0) - (a.backed_projects ?? 0))
    }

    return result
  }, [curators, groupTypeFilter, genreFilter, sortBy])

  // Get groups for each tab
  const browseGroups = filteredGroups
  // For now, myGroups and pendingGroups are empty or can be implemented with user data
  const myGroups: any[] = []
  const pendingGroups: any[] = []

  // Count for tabs
  const browseCount = curators.length
  const myGroupsCount = myGroups.length
  const pendingCount = pendingGroups.length

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-lg text-gray-600">Loading curators...</div>
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header section with title and action button - matching dashboard style */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Curators</h1>
              <p className="text-gray-600">Discover and join investment curators</p>
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

          {/* Filters (conditionally shown) */}
          {showFilters && (
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Group Type</label>
                  <select
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={groupTypeFilter}
                    onChange={(e) => setGroupTypeFilter(e.target.value)}
                  >
                    <option value="all">All Types ({curators.length})</option>
                    {groupTypes.map((type) => (
                      <option key={type} value={type}>
                        {type} ({curators.filter((g) => g.type === type).length})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Music Genre</label>
                  <select
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={genreFilter}
                    onChange={(e) => setGenreFilter(e.target.value)}
                  >
                    <option value="all">All Genres ({curators.length})</option>
                    {genres.map((genre) => {
                      const count = curators.filter((g) => (g.tags || []).includes(genre)).length
                      return (
                        <option key={genre} value={genre}>
                          {genre} ({count})
                        </option>
                      )
                    })}
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
                    <option value="raised">Most Raised</option>
                    <option value="deals">Most Deals</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Tab Navigation - Styled to match the image */}
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="flex flex-wrap border-b">
              <button
                className={`px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm font-medium border-b-2 ${
                  activeTab === "browse"
                    ? "border-black text-black"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("browse")}
              >
                Browse • {browseCount}
              </button>
              <button
                className={`px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm font-medium border-b-2 ${
                  activeTab === "pending"
                    ? "border-black text-black"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("pending")}
              >
                Pending {pendingCount > 0 ? `• ${pendingCount}` : ""}
              </button>
              <button
                className={`px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm font-medium border-b-2 ${
                  activeTab === "my"
                    ? "border-black text-black"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("my")}
              >
                My Groups • {myGroupsCount}
              </button>
            </div>
          </div>

          {/* Content based on active tab */}
          {activeTab === "browse" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {browseGroups.length > 0 ? (
                browseGroups.map((group) => (
                  <div key={group.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={group.image_url || "/placeholder.svg"}
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
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {(group.tags || []).map((tag: string) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{group.description}</p>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Active Projects</div>
                          <div className="text-2xl font-bold">{group.active_projects}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Total Raised</div>
                          <div className="text-2xl font-bold">{group.total_raised}</div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <Link href={`/curators/${group.id}`}>
                          <Button className="w-full bg-[#0f172a] text-white hover:bg-[#1e293b]">View Group</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 bg-white rounded-lg shadow-sm p-12 text-center">
                  <h3 className="text-lg font-medium text-gray-700">No curators match your filters</h3>
                  <p className="text-gray-500 mt-2">Try adjusting your filters to see more results.</p>
                </div>
              )}
            </div>
          )}

          {/* Pending and My Groups tabs can be implemented similarly if needed */}
        </div>
      </div>
    </ProtectedRoute>
  )
}

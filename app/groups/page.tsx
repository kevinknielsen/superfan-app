"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Filter } from "lucide-react"
import ProtectedRoute from "@/components/protected-route"

// Update the mockInvestmentGroups array to use the placeholder images
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
    activeDeals: 2,
    totalRaised: "$125K",
    recentDeals: ["/placeholder-deals/deal-1.png", "/placeholder-deals/deal-2.png", "/placeholder-deals/deal-3.png"],
    isMember: false,
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
    activeDeals: 3,
    totalRaised: "$250K",
    recentDeals: [
      "/placeholder-deals/deal-1.png",
      "/placeholder-deals/deal-2.png",
      "/placeholder-deals/deal-3.png",
      "/placeholder-deals/deal-4.png",
      "/placeholder-deals/deal-5.png",
    ],
    isMember: true,
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
    activeDeals: 4,
    totalRaised: "$180K",
    recentDeals: [
      "/placeholder-deals/deal-1.png",
      "/placeholder-deals/deal-2.png",
      "/placeholder-deals/deal-3.png",
      "/placeholder-deals/deal-4.png",
      "/placeholder-deals/deal-5.png",
    ],
    isMember: true,
  },
  {
    id: "4",
    name: "Future Sounds",
    image: "/placeholder-groups/group-4.png",
    type: "Record Label",
    tags: ["Electronic", "Dance"],
    owner: {
      name: "@futuresounds",
      avatar: "/placeholder-avatars/avatar-4.png",
    },
    description: "Forward-thinking electronic music label specializing in dance and club music",
    activeDeals: 2,
    totalRaised: "$95K",
    recentDeals: ["/placeholder-deals/deal-1.png", "/placeholder-deals/deal-2.png"],
    isMember: false,
  },
  {
    id: "5",
    name: "Indie Collective",
    image: "/placeholder-groups/group-5.png",
    type: "Curator",
    tags: ["Indie Rock", "Alternative"],
    owner: {
      name: "@indiecollective",
      avatar: "/placeholder-avatars/avatar-5.png",
    },
    description: "Curator collective focused on discovering and promoting independent rock and alternative artists",
    activeDeals: 1,
    totalRaised: "$75K",
    recentDeals: ["/placeholder-deals/deal-3.png"],
    isMember: false,
    pendingApplication: true,
  },
]

export default function GroupsPage() {
  const [activeTab, setActiveTab] = useState("browse")
  const [showFilters, setShowFilters] = useState(false)
  const [groupTypeFilter, setGroupTypeFilter] = useState("all")
  const [genreFilter, setGenreFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  // Derive unique group types from data
  const groupTypes = useMemo(() => {
    const types = new Set(mockInvestmentGroups.map((group) => group.type))
    return Array.from(types)
  }, [])

  // Derive unique genres from data
  const genres = useMemo(() => {
    const allTags = mockInvestmentGroups.flatMap((group) => group.tags)
    const uniqueTags = new Set(allTags)
    return Array.from(uniqueTags)
  }, [])

  // Filter and sort groups based on selected filters
  const filteredGroups = useMemo(() => {
    let result = [...mockInvestmentGroups]

    // Apply group type filter
    if (groupTypeFilter !== "all") {
      result = result.filter((group) => group.type === groupTypeFilter)
    }

    // Apply genre filter
    if (genreFilter !== "all") {
      result = result.filter((group) => group.tags.includes(genreFilter))
    }

    // Apply sorting
    if (sortBy === "raised") {
      result = result.sort((a, b) => {
        const aValue = Number.parseInt(a.totalRaised.replace(/\D/g, ""))
        const bValue = Number.parseInt(b.totalRaised.replace(/\D/g, ""))
        return bValue - aValue
      })
    } else if (sortBy === "deals") {
      result = result.sort((a, b) => b.activeDeals - a.activeDeals)
    }

    return result
  }, [mockInvestmentGroups, groupTypeFilter, genreFilter, sortBy])

  // Get groups for each tab
  const browseGroups = filteredGroups
  const myGroups = useMemo(() => mockInvestmentGroups.filter((group) => group.isMember), [])
  const pendingGroups = useMemo(() => mockInvestmentGroups.filter((group) => group.pendingApplication), [])

  // Count for tabs
  const browseCount = mockInvestmentGroups.length
  const myGroupsCount = myGroups.length
  const pendingCount = pendingGroups.length

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header section with title and action button - matching dashboard style */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Groups</h1>
              <p className="text-gray-600">Discover and join investment groups</p>
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
                    <option value="all">All Types ({mockInvestmentGroups.length})</option>
                    {groupTypes.map((type) => (
                      <option key={type} value={type}>
                        {type} ({mockInvestmentGroups.filter((g) => g.type === type).length})
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
                    <option value="all">All Genres ({mockInvestmentGroups.length})</option>
                    {genres.map((genre) => {
                      const count = mockInvestmentGroups.filter((g) => g.tags.includes(genre)).length
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

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Active Deals</div>
                          <div className="text-2xl font-bold">{group.activeDeals}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Total Raised</div>
                          <div className="text-2xl font-bold">{group.totalRaised}</div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <Link href={`/groups/${group.id}`}>
                          <Button className="w-full bg-[#0f172a] text-white hover:bg-[#1e293b]">View Group</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 bg-white rounded-lg shadow-sm p-12 text-center">
                  <h3 className="text-lg font-medium text-gray-700">No groups match your filters</h3>
                  <p className="text-gray-500 mt-2">Try adjusting your filters to see more results.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "pending" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pendingGroups.length > 0 ? (
                pendingGroups.map((group) => (
                  <div key={group.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
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

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Active Deals</div>
                          <div className="text-2xl font-bold">{group.activeDeals}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Total Raised</div>
                          <div className="text-2xl font-bold">{group.totalRaised}</div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="text-sm text-amber-600 mb-2 text-center">Application pending approval</div>
                        <Link href={`/groups/${group.id}`}>
                          <Button className="w-full bg-[#0f172a] text-white hover:bg-[#1e293b]">View Group</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 bg-white rounded-lg shadow-sm p-12 text-center">
                  <h3 className="text-lg font-medium text-gray-700">You don't have any pending applications</h3>
                  <p className="text-gray-500 mt-2">
                    Browse groups and request to join to see pending applications here.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "my" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {myGroups.length > 0 ? (
                myGroups.map((group) => (
                  <div key={group.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
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

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Active Deals</div>
                          <div className="text-2xl font-bold">{group.activeDeals}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Total Raised</div>
                          <div className="text-2xl font-bold">{group.totalRaised}</div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <Link href={`/groups/${group.id}`}>
                          <Button className="w-full bg-[#0f172a] text-white hover:bg-[#1e293b]">View Group</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 bg-white rounded-lg shadow-sm p-12 text-center">
                  <h3 className="text-lg font-medium text-gray-700">You haven't joined any groups yet</h3>
                  <p className="text-gray-500 mt-2">Browse groups and request to join to see your groups here.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}

"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"
import ProtectedRoute from "@/components/protected-route"

// Update the mockDeals array to use the placeholder images
const mockDeals = [
  {
    id: 1,
    name: "Neon Dreams EP",
    image: "/placeholder-deals/deal-1.png",
    type: "SAFT",
    description:
      "Pre-release financing for David Park's upcoming EP with strong streaming potential and crossover appeal",
    group: {
      name: "Original Works",
      avatar: "/placeholder-avatars/avatar-1.png",
    },
    funding: {
      raised: 25757,
      goal: 50000,
      percent: 51,
    },
    revenueShare: "25% for 3 years",
    deadline: "4 days remaining",
    closeDate: "March 31, 2025",
    minimumInvestment: 1000,
    genres: ["Electronic", "Pop"],
  },
  {
    id: 2,
    name: "Summer Vibes Collection",
    image: "/placeholder-deals/deal-2.png",
    type: "RT Token",
    description: "Tokenized catalog of summer-themed hip-hop releases from established Phat Trax artists",
    group: {
      name: "Phat Trax",
      avatar: "/placeholder-avatars/avatar-2.png",
    },
    funding: {
      raised: 75000,
      goal: 120000,
      percent: 62,
    },
    revenueShare: "30% for 5 years",
    deadline: "7 days remaining",
    closeDate: "April 3, 2025",
    minimumInvestment: 5000,
    genres: ["Hip-Hop", "R&B"],
  },
  {
    id: 3,
    name: "Ambient Futures",
    image: "/placeholder-deals/deal-3.png",
    type: "SAFT",
    description: "Future release slate of ambient electronic music from Coop Records' roster of innovative producers",
    group: {
      name: "Coop Records",
      avatar: "/placeholder-avatars/avatar-3.png",
    },
    funding: {
      raised: 45000,
      goal: 80000,
      percent: 56,
    },
    revenueShare: "35% for 3 years",
    deadline: "10 days remaining",
    closeDate: "April 6, 2025",
    minimumInvestment: 2500,
    genres: ["Electronic", "Ambient"],
  },
  {
    id: 4,
    name: "Indie Anthology",
    image: "/placeholder-deals/deal-4.png",
    type: "Catalog",
    description: "Established indie rock catalog with consistent streaming performance and sync licensing potential",
    group: {
      name: "Original Works",
      avatar: "/placeholder-avatars/avatar-1.png",
    },
    funding: {
      raised: 120000,
      goal: 200000,
      percent: 60,
    },
    revenueShare: "40% for 5 years",
    deadline: "15 days remaining",
    closeDate: "April 11, 2025",
    minimumInvestment: 10000,
    genres: ["Indie Rock", "Alternative"],
  },
  {
    id: 5,
    name: "Beat Collective Vol. 2",
    image: "/placeholder-deals/deal-5.png",
    type: "RT Token",
    description: "Second volume of the successful beat collection featuring top producers from the Phat Trax roster",
    group: {
      name: "Phat Trax",
      avatar: "/placeholder-avatars/avatar-2.png",
    },
    funding: {
      raised: 35000,
      goal: 75000,
      percent: 47,
    },
    revenueShare: "30% for 3 years",
    deadline: "12 days remaining",
    closeDate: "April 8, 2025",
    minimumInvestment: 2000,
    genres: ["Hip-Hop", "Instrumental"],
  },
]

export default function DealsPage() {
  const [showFilters, setShowFilters] = useState(false)
  const [dealTypeFilter, setDealTypeFilter] = useState("all")
  const [genreFilter, setGenreFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  // Derive unique deal types from data
  const dealTypes = useMemo(() => {
    const types = new Set(mockDeals.map((deal) => deal.type))
    return Array.from(types)
  }, [])

  // Derive unique genres from data
  const genres = useMemo(() => {
    const allGenres = mockDeals.flatMap((deal) => deal.genres)
    const uniqueGenres = new Set(allGenres)
    return Array.from(uniqueGenres)
  }, [])

  // Filter and sort deals based on selected filters
  const filteredDeals = useMemo(() => {
    let result = [...mockDeals]

    // Apply deal type filter
    if (dealTypeFilter !== "all") {
      result = result.filter((deal) => deal.type === dealTypeFilter)
    }

    // Apply genre filter
    if (genreFilter !== "all") {
      result = result.filter((deal) => deal.genres.includes(genreFilter))
    }

    // Apply sorting
    if (sortBy === "closing") {
      result = result.sort((a, b) => {
        const aDays = Number.parseInt(a.deadline.split(" ")[0])
        const bDays = Number.parseInt(b.deadline.split(" ")[0])
        return aDays - bDays
      })
    } else if (sortBy === "funding") {
      result = result.sort((a, b) => b.funding.percent - a.funding.percent)
    }

    return result
  }, [mockDeals, dealTypeFilter, genreFilter, sortBy])

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header section with title and action button - matching dashboard style */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Investment Opportunities</h1>
              <p className="text-gray-600">
                Discover and invest in music projects • {mockDeals.length} available deals
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

          {/* Filters (conditionally shown) */}
          {showFilters && (
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deal Type</label>
                  <select
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={dealTypeFilter}
                    onChange={(e) => setDealTypeFilter(e.target.value)}
                  >
                    <option value="all">All Types ({mockDeals.length})</option>
                    {dealTypes.map((type) => (
                      <option key={type} value={type}>
                        {type} ({mockDeals.filter((d) => d.type === type).length})
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
                    <option value="all">All Genres ({mockDeals.length})</option>
                    {genres.map((genre) => {
                      const count = mockDeals.filter((d) => d.genres.includes(genre)).length
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
                    <option value="closing">Closing Soon</option>
                    <option value="funding">Most Funded</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Deals Grid - keeping original structure but updating styling */}
          <div className="space-y-6">
            {filteredDeals.length > 0 ? (
              filteredDeals.map((deal) => (
                <div key={deal.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-start lg:items-center">
                      <div className="col-span-1 sm:col-span-2 lg:col-span-4 flex items-center gap-4 mb-4 lg:mb-0">
                        <div className="w-16 h-16 bg-black rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={deal.image || "/placeholder.svg"}
                            alt={deal.name}
                            width={64}
                            height={64}
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{deal.name}</h3>
                          <div className="flex items-center text-sm text-gray-500">
                            <span>Offered by</span>
                            <div className="w-5 h-5 bg-gray-200 rounded-full overflow-hidden mx-1">
                              <Image
                                src={deal.group.avatar || "/placeholder.svg"}
                                alt={deal.group.name}
                                width={20}
                                height={20}
                                className="object-cover"
                              />
                            </div>
                            <span>{deal.group.name}</span>
                          </div>
                        </div>
                      </div>

                      <div className="col-span-1 sm:col-span-1 lg:col-span-2">
                        <div className="text-sm text-gray-500">Deal Type</div>
                        <div className="font-semibold">{deal.type}</div>
                        <div className="text-xs text-gray-500">
                          {deal.type === "SAFT"
                            ? "Pre-release financing"
                            : deal.type === "RT Token"
                              ? "Tokenized revenue"
                              : "Catalog acquisition"}
                        </div>
                      </div>

                      <div className="col-span-1 sm:col-span-1 lg:col-span-2">
                        <div className="text-sm text-gray-500">Funding</div>
                        <div className="font-semibold">${deal.funding.raised.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">of ${deal.funding.goal.toLocaleString()} total</div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${deal.funding.percent}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="col-span-1 sm:col-span-1 lg:col-span-2">
                        <div className="text-sm text-gray-500">Revenue Share</div>
                        <div className="font-semibold">{deal.revenueShare}</div>
                        <div className="text-xs text-gray-500">Min: ${deal.minimumInvestment.toLocaleString()}</div>
                      </div>

                      <div className="col-span-1 sm:col-span-1 lg:col-span-2">
                        <div className="text-sm text-gray-500">Deadline</div>
                        <div className="font-semibold">{deal.deadline}</div>
                        <div className="text-xs text-gray-500">Closes on {deal.closeDate}</div>
                      </div>
                    </div>

                    <div className="mt-4 border-t pt-4">
                      <p className="text-gray-600 text-sm mb-4">{deal.description}</p>
                      <div className="flex justify-center sm:justify-end">
                        <Button className="w-full sm:w-auto bg-[#0f172a] text-white hover:bg-[#1e293b]">
                          View Deal
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <h3 className="text-lg font-medium text-gray-700">No deals match your filters</h3>
                <p className="text-gray-500 mt-2">Try adjusting your filters to see more results.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

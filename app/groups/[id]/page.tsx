"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { MoreVertical, ArrowLeft, ExternalLink, Camera } from "lucide-react"
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
    activeDeals: 0,
    totalRaised: "$125K",
    closedDeals: 4,
    members: 8432,
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
    activeDeals: 0,
    totalRaised: "$250K",
    closedDeals: 6,
    members: 12543,
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
    activeDeals: 0,
    totalRaised: "$180K",
    closedDeals: 5,
    members: 9876,
    isMember: true,
  },
]

// Update the mockPreviousDeals array to use the placeholder images
const mockPreviousDeals = [
  {
    id: "1",
    name: "Summer Beats EP",
    image: "/placeholder-deals/deal-1.png",
    owner: {
      name: "@phattrax",
      avatar: "/placeholder-avatars/avatar-2.png",
    },
    round: "Seed",
    fundedOn: "Jan 23",
  },
  {
    id: "2",
    name: "Ambient Collection",
    image: "/placeholder-deals/deal-2.png",
    owner: {
      name: "@cooprecords",
      avatar: "/placeholder-avatars/avatar-3.png",
    },
    round: "Seed",
    fundedOn: "Dec 12",
  },
  {
    id: "3",
    name: "Indie Voices",
    image: "/placeholder-deals/deal-3.png",
    owner: {
      name: "@originalworks",
      avatar: "/placeholder-avatars/avatar-1.png",
    },
    round: "The People",
    fundedOn: "Nov 5",
  },
]

export default function GroupDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  // Find the group based on the ID from the URL
  const groupId = params?.id as string
  const group = mockInvestmentGroups.find((g) => g.id === groupId) || mockInvestmentGroups[0]

  // Filter previous deals for this group
  const previousDeals = mockPreviousDeals.filter((deal) => deal.owner.name === group.owner.name)

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

          {/* Group profile section */}
          <div className="mb-8">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={group.image || "/placeholder.svg"}
                  alt={group.name}
                  width={80}
                  height={80}
                  className="object-cover"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">{group.name}</h1>
                <div className="flex flex-wrap gap-2 mb-3">
                  {group.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <p className="text-gray-600 mb-4">{group.description}</p>
              </div>
            </div>

            {/* Stats section */}
            <div className="flex flex-wrap gap-8 text-gray-600 mb-6">
              <div>
                <div className="text-sm">Members</div>
                <div className="text-2xl font-bold text-black">{group.members.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-sm">Active deals</div>
                <div className="text-2xl font-bold text-black">{group.activeDeals}</div>
              </div>
              <div>
                <div className="text-sm">Closed deals</div>
                <div className="text-2xl font-bold text-black">{group.closedDeals}</div>
              </div>
            </div>
          </div>

          {/* Available deals section */}
          <div className="mb-12">
            <h2 className="text-xl font-bold mb-4">Available deals</h2>

            <div className="bg-white rounded-lg shadow-sm p-8 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Camera className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                There are no currently available deals for you in this group
              </h3>
              <p className="text-gray-600 max-w-md">
                Group leads post deals when they become available. Check back later for more deals, or join other groups
                to see more deals.
              </p>
            </div>
          </div>

          {/* Previous deals section */}
          {previousDeals.length > 0 && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Previous deals</h2>
                <Link href="/dashboard" className="text-blue-600 hover:text-blue-800 flex items-center">
                  See portfolio <span className="ml-1">→</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {previousDeals.map((deal) => (
                  <div key={deal.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="p-4">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
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
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <div className="w-5 h-5 bg-gray-200 rounded-full overflow-hidden mr-1">
                              <Image
                                src={deal.owner.avatar || "/placeholder.svg"}
                                alt={deal.owner.name}
                                width={20}
                                height={20}
                                className="object-cover"
                              />
                            </div>
                            <span>{deal.owner.name}</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-500">Round</div>
                          <div className="font-medium">{deal.round}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Funded on</div>
                          <div className="font-medium">{deal.fundedOn}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}

"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronDown } from "lucide-react"
import ProtectedRoute from "@/components/protected-route"

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
    activeDeals: 2,
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
    activeDeals: 3,
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
    activeDeals: 4,
    totalRaised: "$180K",
  },
]

export default function BrowsePage() {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white">
        {/* Onboarding Banner */}
        <div className="bg-[#0f172a] text-white py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h1 className="text-3xl font-bold mb-6">Finish setting up your account to invest with Superfan One</h1>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="relative">
                  <div className="absolute -left-1 top-0 w-12 h-12 rounded-full border-2 border-gray-500 flex items-center justify-center bg-green-500">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M5 12L10 17L19 8"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="pl-16">
                    <h3 className="font-medium text-gray-400 mb-2">Verify your identity</h3>
                    <p className="text-sm text-gray-400">
                      Regulations require us to check your identity and accreditation status before you can invest with
                      Superfan One.
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -left-1 top-0 w-12 h-12 rounded-full border-2 border-white flex items-center justify-center bg-[#0f172a]">
                    <span className="text-white font-medium">2</span>
                  </div>
                  <div className="pl-16">
                    <h3 className="font-medium text-white mb-2">Explore investment groups</h3>
                    <p className="text-sm text-gray-400">
                      Browse record labels and curators to discover investment opportunities. Each group sources and
                      manages their own deals.
                    </p>
                    <Link href="/groups">
                      <button className="mt-4 text-white border border-gray-600 rounded px-4 py-1 text-sm hover:bg-gray-800">
                        Browse investment groups
                      </button>
                    </Link>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -left-1 top-0 w-12 h-12 rounded-full border-2 border-gray-500 flex items-center justify-center bg-[#0f172a]">
                    <span className="text-white font-medium">3</span>
                  </div>
                  <div className="pl-16">
                    <h3 className="font-medium text-gray-400 mb-2">Complete your tax information</h3>
                    <p className="text-sm text-gray-400">
                      We need to confirm your current tax residency and associated tax numbers before you invest in a
                      deal.
                    </p>
                    <button className="mt-4 text-white border border-gray-600 rounded px-4 py-1 text-sm hover:bg-gray-800">
                      Complete tax information
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -left-1 top-0 w-12 h-12 rounded-full border-2 border-gray-500 flex items-center justify-center bg-[#0f172a]">
                    <span className="text-white font-medium">4</span>
                  </div>
                  <div className="pl-16">
                    <h3 className="font-medium text-gray-400 mb-2">Fund your wallet</h3>
                    <p className="text-sm text-gray-400">
                      Add USDC to your wallet to invest in deals. You control your own private keys, Superfan One does
                      not have access to your funds.
                    </p>
                    <Link href="/settings/wallet">
                      <button className="mt-4 text-white border border-gray-600 rounded px-4 py-1 text-sm hover:bg-gray-800 underline">
                        Fund Superfan wallet
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Active Deal Section */}
        <div className="container mx-auto px-4 py-8 border-b">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">
                See <span className="font-normal">1 available deal</span>
              </h2>
              <Link href="/deals">
                <Button variant="link" className="text-blue-600">
                  Browse all deals
                </Button>
              </Link>
            </div>

            <div className="bg-white border rounded-lg overflow-hidden">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 p-4 items-start lg:items-center">
                <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex items-center gap-4">
                  <div className="w-16 h-16 bg-black rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src="/placeholder-deals/deal-1.png"
                      alt="Neon Dreams EP"
                      width={64}
                      height={64}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Neon Dreams EP</h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <span>Offered by</span>
                      <div className="w-5 h-5 bg-gray-200 rounded-full overflow-hidden mx-1">
                        <Image
                          src="/placeholder-avatars/avatar-3.png"
                          alt="Coop Records"
                          width={20}
                          height={20}
                          className="object-cover"
                        />
                      </div>
                      <Link href="/groups/3" className="hover:underline">
                        <span>Coop Records</span>
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="col-span-1 sm:col-span-1 lg:col-span-2">
                  <div className="text-sm text-gray-500">Deal Type</div>
                  <div className="font-semibold">SAFT</div>
                  <div className="text-xs text-gray-500">Pre-release financing</div>
                </div>

                <div className="col-span-1 sm:col-span-1 lg:col-span-2">
                  <div className="text-sm text-gray-500">Funding</div>
                  <div className="font-semibold">$25,757</div>
                  <div className="text-xs text-gray-500">of $50,000 total</div>
                </div>

                <div className="col-span-1 sm:col-span-1 lg:col-span-2">
                  <div className="text-sm text-gray-500">Revenue Share</div>
                  <div className="flex items-center">
                    <span className="font-semibold">25% for 3 years</span>
                  </div>
                </div>

                <div className="col-span-1 sm:col-span-1 lg:col-span-2">
                  <div className="text-sm text-gray-500">Deadline</div>
                  <div className="font-semibold">4 days remaining</div>
                  <div className="text-xs text-gray-500">Closes on March 31, 2025</div>
                </div>

                <div className="col-span-1 sm:col-span-2 lg:col-span-1 flex justify-end gap-2 mt-4 sm:mt-0">
                  <Button variant="outline" size="sm" className="p-2 h-8 w-8">
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  <Link href="/deals/1">
                    <Button variant="outline" size="sm" className="p-2 h-8 w-8">
                      →
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Investment Groups Section */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                See our <span className="font-normal">trending groups</span>
              </h2>
              <Link href="/groups">
                <Button variant="link" className="text-blue-600">
                  Browse all groups
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
                          <div className="text-sm text-gray-500">Active Deals</div>
                          <div className="text-sm text-gray-500">Total Raised</div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="font-bold text-xl">{group.activeDeals}</div>
                          <div className="font-bold text-xl">{group.totalRaised}</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <Link href={`/groups/${group.id}`}>
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

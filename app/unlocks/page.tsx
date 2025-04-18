"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserAvatar } from "@/components/ui/user-avatar"
import { Lock, Unlock, Calendar, Music, Ticket, Gift, ShoppingBag, MessageCircle } from "lucide-react"

export default function UnlocksPage() {
  const { user, isAuthenticated } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [unlocks, setUnlocks] = useState<any[]>([])
  const [tokenHoldings, setTokenHoldings] = useState({
    total: 0,
    artists: [] as { name: string; tokens: number; image: string }[],
  })

  // Use useCallback instead of useEffectEvent
  const loadData = useCallback(() => {
    setTokenHoldings({
      total: 12,
      artists: [
        { name: "Taylor Swift", tokens: 5, image: "/placeholder-avatars/avatar-1.png" },
        { name: "Drake", tokens: 3, image: "/placeholder-avatars/avatar-2.png" },
        { name: "Beyoncé", tokens: 4, image: "/placeholder-avatars/avatar-3.png" },
      ],
    })

    setUnlocks([
      {
        id: 1,
        title: "Exclusive Merch Drop",
        description: "Limited edition hoodie only available to token holders",
        requirement: 2,
        type: "merch",
        status: "available",
        artist: "Taylor Swift",
        image: "/placeholder-deals/deal-1.png",
        date: "May 15, 2025",
      },
      {
        id: 2,
        title: "Early Access: New Single",
        description: "Listen to the new single 48 hours before public release",
        requirement: 1,
        type: "music",
        status: "available",
        artist: "Drake",
        image: "/placeholder-deals/deal-2.png",
        date: "April 28, 2025",
      },
      {
        id: 3,
        title: "Virtual Q&A Session",
        description: "Join an exclusive online Q&A with the artist",
        requirement: 3,
        type: "event",
        status: "available",
        artist: "Beyoncé",
        image: "/placeholder-deals/deal-3.png",
        date: "June 5, 2025",
      },
      {
        id: 4,
        title: "Pre-sale Concert Tickets",
        description: "Get access to concert tickets before they go on sale to the public",
        requirement: 2,
        type: "tickets",
        status: "available",
        artist: "Taylor Swift",
        image: "/placeholder-deals/deal-4.png",
        date: "July 10, 2025",
      },
      {
        id: 5,
        title: "Signed Vinyl",
        description: "Receive a signed vinyl of the latest album",
        requirement: 5,
        type: "merch",
        status: "locked",
        artist: "Drake",
        image: "/placeholder-deals/deal-5.png",
        date: "August 20, 2025",
      },
      {
        id: 6,
        title: "Behind-the-Scenes Content",
        description: "Exclusive access to behind-the-scenes footage from the latest music video",
        requirement: 4,
        type: "content",
        status: "locked",
        artist: "Beyoncé",
        image: "/placeholder-groups/group-1.png",
        date: "May 30, 2025",
      },
    ])
    setIsLoading(false)
  }, [])

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      loadData()
    }, 1000)

    return () => clearTimeout(timer)
  }, [loadData])

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Connect Your Wallet</h1>
          <p className="text-gray-600 mb-8">Please connect your wallet to view your unlocks.</p>
          <Button>Connect Wallet</Button>
        </div>
      </div>
    )
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "merch":
        return <ShoppingBag className="h-4 w-4" />
      case "music":
        return <Music className="h-4 w-4" />
      case "event":
        return <Calendar className="h-4 w-4" />
      case "tickets":
        return <Ticket className="h-4 w-4" />
      case "content":
        return <MessageCircle className="h-4 w-4" />
      default:
        return <Gift className="h-4 w-4" />
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Unlocks</h1>

      {isLoading ? (
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded-lg mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Token Holdings Summary */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
              <div>
                <h2 className="text-xl font-semibold">Your Royalty Token Holdings</h2>
                <p className="text-gray-600">Unlock exclusive rewards with your tokens</p>
              </div>
              <div className="mt-4 md:mt-0">
                <span className="text-3xl font-bold">{tokenHoldings.total}</span>
                <span className="text-gray-600 ml-2">Total Tokens</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mt-4">
              {tokenHoldings.artists.map((artist, index) => (
                <div key={index} className="flex items-center bg-gray-50 rounded-full px-3 py-2">
                  <UserAvatar src={artist.image} name={artist.name} size={32} />
                  <div className="ml-2">
                    <p className="text-sm font-medium">{artist.name}</p>
                    <p className="text-xs text-gray-600">{artist.tokens} tokens</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs for filtering */}
          <Tabs defaultValue="all" className="mb-6">
            <TabsList>
              <TabsTrigger value="all">All Unlocks</TabsTrigger>
              <TabsTrigger value="available">Available</TabsTrigger>
              <TabsTrigger value="locked">Locked</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {unlocks.map((unlock) => (
                  <UnlockCard key={unlock.id} unlock={unlock} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="available" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {unlocks
                  .filter((u) => u.status === "available")
                  .map((unlock) => (
                    <UnlockCard key={unlock.id} unlock={unlock} />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="locked" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {unlocks
                  .filter((u) => u.status === "locked")
                  .map((unlock) => (
                    <UnlockCard key={unlock.id} unlock={unlock} />
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}

function UnlockCard({ unlock }: { unlock: any }) {
  const isLocked = unlock.status === "locked"

  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 ${isLocked ? "opacity-70" : "hover:shadow-lg"}`}
    >
      <div className="relative h-48 bg-gray-200">
        <img src={unlock.image || "/placeholder.svg"} alt={unlock.title} className="w-full h-full object-cover" />
        <div className="absolute top-3 right-3">
          <Badge
            variant={isLocked ? "outline" : "default"}
            className={isLocked ? "bg-white text-gray-700" : "bg-green-100 text-green-800 border-green-200"}
          >
            {isLocked ? (
              <span className="flex items-center">
                <Lock className="h-3 w-3 mr-1" /> Locked
              </span>
            ) : (
              <span className="flex items-center">
                <Unlock className="h-3 w-3 mr-1" /> Available
              </span>
            )}
          </Badge>
        </div>
        <div className="absolute bottom-3 left-3">
          <Badge variant="secondary" className="bg-white/90">
            {unlock.artist}
          </Badge>
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold">{unlock.title}</h3>
          <Badge variant="outline" className="ml-2 text-xs">
            {unlock.requirement}+ RTs
          </Badge>
        </div>

        <p className="text-gray-600 text-sm mb-3">{unlock.description}</p>

        <div className="flex items-center text-gray-500 text-xs mb-4">
          <Calendar className="h-3 w-3 mr-1" />
          <span>{unlock.date}</span>
        </div>

        <Button className="w-full" variant={isLocked ? "outline" : "default"} disabled={isLocked}>
          {isLocked ? "Locked" : "Claim Now"}
        </Button>
      </div>
    </div>
  )
}

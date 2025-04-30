"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState({
    productUpdates: true,
    newDeals: true,
    dealUpdates: true,
    groupPosts: true,
    groupMembership: true,
    investmentEvents: true,
    securityAlerts: true,
  })

  const handleToggle = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>

      {/* General Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">General</h2>

        <div className="bg-white rounded-lg shadow divide-y">
          <div className="p-4 flex items-center justify-between">
            <div>
              <h3 className="font-medium">Superfan product updates</h3>
              <p className="text-sm text-gray-500">
                Learn about new features, company announcements, and product improvements.
              </p>
            </div>
            <Switch checked={notifications.productUpdates} onCheckedChange={() => handleToggle("productUpdates")} />
          </div>
        </div>
      </div>

      {/* Deal Notifications */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Deals</h2>

        <div className="bg-white rounded-lg shadow divide-y">
          <div className="p-4 flex items-center justify-between">
            <div>
              <h3 className="font-medium">New deal alerts</h3>
              <p className="text-sm text-gray-500">Get notified when new investment opportunities are available.</p>
            </div>
            <Switch checked={notifications.newDeals} onCheckedChange={() => handleToggle("newDeals")} />
          </div>

          <div className="p-4 flex items-center justify-between">
            <div>
              <h3 className="font-medium">Deal updates</h3>
              <p className="text-sm text-gray-500">Receive updates about deals you've invested in.</p>
            </div>
            <Switch checked={notifications.dealUpdates} onCheckedChange={() => handleToggle("dealUpdates")} />
          </div>
        </div>
      </div>

      {/* Group Notifications */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Curators</h2>

        <div className="bg-white rounded-lg shadow divide-y">
          <div className="p-4 flex items-center justify-between">
            <div>
              <h3 className="font-medium">Group posts and activity</h3>
              <p className="text-sm text-gray-500">Get notified about new posts and activity in your curators.</p>
            </div>
            <Switch checked={notifications.groupPosts} onCheckedChange={() => handleToggle("groupPosts")} />
          </div>

          <div className="p-4 flex items-center justify-between">
            <div>
              <h3 className="font-medium">Group membership updates</h3>
              <p className="text-sm text-gray-500">Receive notifications about your group membership status.</p>
            </div>
            <Switch checked={notifications.groupMembership} onCheckedChange={() => handleToggle("groupMembership")} />
          </div>
        </div>
      </div>

      {/* Investment Notifications */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Investments</h2>

        <div className="bg-white rounded-lg shadow divide-y">
          <div className="p-4 flex items-center justify-between">
            <div>
              <h3 className="font-medium">Distribution events</h3>
              <p className="text-sm text-gray-500">
                Get notified about distributions and returns from your investments.
              </p>
            </div>
            <Switch checked={notifications.investmentEvents} onCheckedChange={() => handleToggle("investmentEvents")} />
          </div>
        </div>
      </div>

      {/* Security Notifications */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Security</h2>

        <div className="bg-white rounded-lg shadow divide-y">
          <div className="p-4 flex items-center justify-between">
            <div>
              <h3 className="font-medium">Security alerts</h3>
              <p className="text-sm text-gray-500">Receive notifications about login attempts and account changes.</p>
            </div>
            <Switch checked={notifications.securityAlerts} onCheckedChange={() => handleToggle("securityAlerts")} />
          </div>
        </div>
      </div>
    </div>
  )
}

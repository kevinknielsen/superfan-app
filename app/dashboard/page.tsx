import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, PieChart, LineChart, ArrowUpRight, TrendingUp, DollarSign, Music, Activity } from "lucide-react"
import ProtectedRoute from "@/components/protected-route"

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Investor Dashboard</h1>
              <p className="text-gray-600">Welcome back, Investor</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button className="bg-[#0f172a] text-white hover:bg-[#1e293b]">Browse Music Investments</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
                <DollarSign className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$125,000</div>
                <div className="flex items-center text-sm text-green-600 mt-1">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  <span>12% from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Investments</CardTitle>
                <Activity className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <div className="flex items-center text-sm text-green-600 mt-1">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  <span>2 new this month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Royalty Income (YTD)</CardTitle>
                <Music className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$3,450</div>
                <div className="flex items-center text-sm text-blue-600 mt-1">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span>Up 8% this quarter</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="portfolio" className="w-full">
            <TabsList className="flex w-full overflow-x-auto mb-8">
              <TabsTrigger value="portfolio" className="flex-1 text-xs sm:text-sm">
                Portfolio
              </TabsTrigger>
              <TabsTrigger value="opportunities" className="flex-1 text-xs sm:text-sm">
                Opportunities
              </TabsTrigger>
              <TabsTrigger value="royalties" className="flex-1 text-xs sm:text-sm">
                Royalties
              </TabsTrigger>
            </TabsList>

            <TabsContent value="portfolio">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Portfolio Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80 flex items-center justify-center bg-gray-100 rounded-md">
                        <LineChart className="w-12 h-12 text-gray-400" />
                        <span className="ml-2 text-gray-400">Portfolio chart visualization</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Investment Allocation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-60 flex items-center justify-center bg-gray-100 rounded-md mb-4">
                        <PieChart className="w-12 h-12 text-gray-400" />
                        <span className="ml-2 text-gray-400">Allocation chart</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                            <span className="text-sm">Singles</span>
                          </div>
                          <span className="text-sm font-medium">35%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                            <span className="text-sm">Albums</span>
                          </div>
                          <span className="text-sm font-medium">45%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                            <span className="text-sm">Label Catalogs</span>
                          </div>
                          <span className="text-sm font-medium">20%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <h2 className="text-xl font-bold mt-8 mb-4">Your Music Investments</h2>
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <table className="w-full min-w-[800px]">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Project
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium">David Park - "Neon Dreams" EP</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            SAFT
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">$25,000</td>
                        <td className="px-6 py-4 whitespace-nowrap">Mar 10, 2025</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Released
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link href="/dashboard/investments/1" className="text-blue-600 hover:text-blue-900">
                            View
                          </Link>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium">Indie Label Collective - Q2 Releases</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                            RT Token
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">$50,000</td>
                        <td className="px-6 py-4 whitespace-nowrap">Feb 22, 2025</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            In Production
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link href="/dashboard/investments/2" className="text-blue-600 hover:text-blue-900">
                            View
                          </Link>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium">Elena Rodriguez - "Summer Nights" Single</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            SAFT
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">$15,000</td>
                        <td className="px-6 py-4 whitespace-nowrap">Jan 15, 2025</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Released
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link href="/dashboard/investments/3" className="text-blue-600 hover:text-blue-900">
                            View
                          </Link>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="px-6 py-4 bg-gray-50">
                  <Link href="/dashboard/investments" className="text-blue-600 hover:underline text-sm">
                    View all investments
                  </Link>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="opportunities">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        Album
                      </span>
                      <span className="text-sm text-gray-500">Closing in 7 days</span>
                    </div>
                    <CardTitle className="mt-2">Midnight Collective - "Echoes"</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      Indie rock band's sophomore album with strong streaming history and growing fanbase.
                    </p>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Raising</span>
                        <span className="font-medium">$75K</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Minimum</span>
                        <span className="font-medium">$5,000</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Revenue Share</span>
                        <span className="font-medium">30% for 3 years</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Committed</span>
                        <span className="font-medium">$48K (64%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: "64%" }}></div>
                    </div>
                    <Button className="w-full bg-[#0f172a] text-white hover:bg-[#1e293b]">View Opportunity</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Single
                      </span>
                      <span className="text-sm text-gray-500">Closing in 14 days</span>
                    </div>
                    <CardTitle className="mt-2">Sarah James - "Horizon"</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      Rising pop artist with 500K monthly listeners releasing a new single with major playlist
                      potential.
                    </p>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Raising</span>
                        <span className="font-medium">$25K</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Minimum</span>
                        <span className="font-medium">$1,000</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Revenue Share</span>
                        <span className="font-medium">25% for 2 years</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Committed</span>
                        <span className="font-medium">$15K (60%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: "60%" }}></div>
                    </div>
                    <Button className="w-full bg-[#0f172a] text-white hover:bg-[#1e293b]">View Opportunity</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                        Catalog
                      </span>
                      <span className="text-sm text-gray-500">Closing in 21 days</span>
                    </div>
                    <CardTitle className="mt-2">Future Sounds Records - Q3 Releases</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      Boutique electronic music label funding their next quarter of releases (5 artists).
                    </p>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Raising</span>
                        <span className="font-medium">$150K</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Minimum</span>
                        <span className="font-medium">$10,000</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Revenue Share</span>
                        <span className="font-medium">35% for 3 years</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Committed</span>
                        <span className="font-medium">$90K (60%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: "60%" }}></div>
                    </div>
                    <Button className="w-full bg-[#0f172a] text-white hover:bg-[#1e293b]">View Opportunity</Button>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-8 text-center">
                <Button asChild variant="outline">
                  <Link href="/dashboard/opportunities">View All Opportunities</Link>
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="royalties">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Royalty Income</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80 flex items-center justify-center bg-gray-100 rounded-md">
                        <BarChart className="w-12 h-12 text-gray-400" />
                        <span className="ml-2 text-gray-400">Monthly royalty income chart</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Top Performing Projects</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                              <Music className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold">David Park - "Neon Dreams"</h3>
                              <p className="text-sm text-gray-500">EP • Released Mar 2025</p>
                            </div>
                          </div>
                          <span className="font-semibold">$1,250</span>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                              <Music className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold">Elena Rodriguez - "Summer Nights"</h3>
                              <p className="text-sm text-gray-500">Single • Released Jan 2025</p>
                            </div>
                          </div>
                          <span className="font-semibold">$875</span>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                              <Music className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold">Indie Label Collective</h3>
                              <p className="text-sm text-gray-500">Label • Q1 2025 Releases</p>
                            </div>
                          </div>
                          <span className="font-semibold">$650</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <h2 className="text-xl font-bold mt-8 mb-4">Recent Royalty Payments</h2>
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Project
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Source
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium">David Park - "Neon Dreams" EP</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">Spotify</td>
                        <td className="px-6 py-4 whitespace-nowrap">$320.45</td>
                        <td className="px-6 py-4 whitespace-nowrap">Apr 15, 2025</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link href="/dashboard/royalties/1" className="text-blue-600 hover:text-blue-900">
                            Details
                          </Link>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium">Elena Rodriguez - "Summer Nights" Single</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">Apple Music</td>
                        <td className="px-6 py-4 whitespace-nowrap">$185.20</td>
                        <td className="px-6 py-4 whitespace-nowrap">Apr 12, 2025</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link href="/dashboard/royalties/2" className="text-blue-600 hover:text-blue-900">
                            Details
                          </Link>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium">Indie Label Collective - Q1 Releases</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">Multiple DSPs</td>
                        <td className="px-6 py-4 whitespace-nowrap">$275.80</td>
                        <td className="px-6 py-4 whitespace-nowrap">Apr 10, 2025</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link href="/dashboard/royalties/3" className="text-blue-600 hover:text-blue-900">
                            Details
                          </Link>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium">David Park - "Neon Dreams" EP</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">Sync License</td>
                        <td className="px-6 py-4 whitespace-nowrap">$1,200.00</td>
                        <td className="px-6 py-4 whitespace-nowrap">Apr 5, 2025</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link href="/dashboard/royalties/4" className="text-blue-600 hover:text-blue-900">
                            Details
                          </Link>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="px-6 py-4 bg-gray-50">
                  <Link href="/dashboard/royalties" className="text-blue-600 hover:underline text-sm">
                    View all royalty payments
                  </Link>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  )
}

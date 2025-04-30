import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, PieChart, LineChart, ArrowUpRight, TrendingUp, DollarSign, Music, Activity } from "lucide-react"

export default function ArtistDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Artist Dashboard</h1>
            <p className="text-gray-600">Welcome back, David Park</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button className="bg-[#0f172a] text-white hover:bg-[#1e293b]">
              Launch New Project
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Raised</CardTitle>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$75,000</div>
              <div className="flex items-center text-sm text-green-600 mt-1">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                <span>New project funded this month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <Activity className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <div className="flex items-center text-sm text-green-600 mt-1">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                <span>1 in funding, 2 released</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Royalty Revenue (YTD)</CardTitle>
              <Music className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$12,450</div>
              <div className="flex items-center text-sm text-blue-600 mt-1">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>Up 15% this quarter</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
            <TabsTrigger value="royalties">Royalty Tracking</TabsTrigger>
          </TabsList>

          <TabsContent value="projects">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 flex items-center justify-center bg-gray-100 rounded-md">
                      <LineChart className="w-12 h-12 text-gray-400" />
                      <span className="ml-2 text-gray-400">Project performance chart</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-60 flex items-center justify-center bg-gray-100 rounded-md mb-4">
                      <PieChart className="w-12 h-12 text-gray-400" />
                      <span className="ml-2 text-gray-400">Revenue chart</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                          <span className="text-sm">Streaming</span>
                        </div>
                        <span className="text-sm font-medium">65%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                          <span className="text-sm">Sync Licensing</span>
                        </div>
                        <span className="text-sm font-medium">25%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                          <span className="text-sm">Other</span>
                        </div>
                        <span className="text-sm font-medium">10%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <h2 className="text-xl font-bold mt-8 mb-4">Your Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">EP</span>
                    <span className="text-sm text-gray-500">Released Mar 2025</span>
                  </div>
                  <CardTitle className="mt-2">"Neon Dreams" EP</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Raised</span>
                      <span className="font-medium">$25,000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Revenue Share</span>
                      <span className="font-medium">30% for 3 years</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Revenue Generated</span>
                      <span className="font-medium">$8,450</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Investor Payout</span>
                      <span className="font-medium">$2,535</span>
                    </div>
                  </div>
                  <Button className="w-full bg-[#0f172a] text-white hover:bg-[#1e293b]">View Project</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Single
                    </span>
                    <span className="text-sm text-gray-500">Released Jan 2025</span>
                  </div>
                  <CardTitle className="mt-2">"Midnight Drive" Single</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Raised</span>
                      <span className="font-medium">$15,000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Revenue Share</span>
                      <span className="font-medium">25% for 2 years</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Revenue Generated</span>
                      <span className="font-medium">$6,200</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Investor Payout</span>
                      <span className="font-medium">$1,550</span>
                    </div>
                  </div>
                  <Button className="w-full bg-[#0f172a] text-white hover:bg-[#1e293b]">View Project</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      In Funding
                    </span>
                    <span className="text-sm text-gray-500">64% Funded</span>
                  </div>
                  <CardTitle className="mt-2">"Urban Echoes" Album</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Goal</span>
                      <span className="font-medium">$35,000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Raised So Far</span>
                      <span className="font-medium">$22,400</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Revenue Share</span>
                      <span className="font-medium">35% for 3 years</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Days Left</span>
                      <span className="font-medium">12</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div className="bg-yellow-600 h-2 rounded-full" style={{ width: "64%" }}></div>
                  </div>
                  <Button className="w-full bg-[#0f172a] text-white hover:bg-[#1e293b]">Manage Campaign</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="milestones">
            <Card>
              <CardHeader>
                <CardTitle>Project Milestones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div className="relative">
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                    <div className="relative pl-8 pb-8">
                      <div className="absolute left-0 top-0 w-4 h-4 rounded-full bg-green-500 -ml-2"></div>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">"Urban Echoes" Album - Pre-Production</h3>
                          <p className="text-gray-600 mt-1">Songwriting and demo recording completed</p>
                          <div className="mt-2 flex items-center text-sm text-green-600">
                            <span>Completed on April 5, 2025</span>
                          </div>
                        </div>
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Completed
                        </span>
                      </div>
                    </div>

                    <div className="relative pl-8 pb-8">
                      <div className="absolute left-0 top-0 w-4 h-4 rounded-full bg-green-500 -ml-2"></div>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">"Urban Echoes" Album - Studio Recording</h3>
                          <p className="text-gray-600 mt-1">Recording of all tracks at Sunset Studios</p>
                          <div className="mt-2 flex items-center text-sm text-green-600">
                            <span>Completed on April 15, 2025</span>
                          </div>
                        </div>
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Completed
                        </span>
                      </div>
                    </div>

                    <div className="relative pl-8 pb-8">
                      <div className="absolute left-0 top-0 w-4 h-4 rounded-full bg-yellow-500 -ml-2"></div>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">"Urban Echoes" Album - Mixing & Mastering</h3>
                          <p className="text-gray-600 mt-1">Professional mixing and mastering of all tracks</p>
                          <div className="mt-2 flex items-center text-sm text-yellow-600">
                            <span>In Progress - Due May 10, 2025</span>
                          </div>
                        </div>
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          In Progress
                        </span>
                      </div>
                    </div>

                    <div className="relative pl-8">
                      <div className="absolute left-0 top-0 w-4 h-4 rounded-full bg-gray-300 -ml-2"></div>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">"Urban Echoes" Album - Release & Marketing</h3>
                          <p className="text-gray-600 mt-1">Album release, PR campaign, and playlist pitching</p>
                          <div className="mt-2 flex items-center text-sm text-gray-600">
                            <span>Scheduled for June 1, 2025</span>
                          </div>
                        </div>
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                          Upcoming
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mt-8">
              <Button className="bg-[#0f172a] text-white hover:bg-[#1e293b]">Update Milestone Status</Button>
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
                    <CardTitle>Revenue Sources</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <span className="font-semibold text-blue-600">S</span>
                          </div>
                          <div>
                            <h3 className="font-semibold">Spotify</h3>
                            <p className="text-sm text-gray-500">Streaming</p>
                          </div>
                        </div>
                        <span className="font-semibold">$4,250</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                            <span className="font-semibold text-green-600">A</span>
                          </div>
                          <div>
                            <h3 className="font-semibold">Apple Music</h3>
                            <p className="text-sm text-gray-500">Streaming</p>
                          </div>
                        </div>
                        <span className="font-semibold">$3,120</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                            <span className="font-semibold text-purple-600">SL</span>
                          </div>
                          <div>
                            <h3 className="font-semibold">Sync Licensing</h3>
                            <p className="text-sm text-gray-500">TV & Film</p>
                          </div>
                        </div>
                        <span className="font-semibold">$3,500</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <h2 className="text-xl font-bold mt-8 mb-4">Royalty Distribution</h2>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Project
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Period
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Revenue
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Artist Share
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Investor Share
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium">"Neon Dreams" EP</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">April 2025</td>
                      <td className="px-6 py-4 whitespace-nowrap">$3,200.45</td>
                      <td className="px-6 py-4 whitespace-nowrap">$2,240.32 (70%)</td>
                      <td className="px-6 py-4 whitespace-nowrap">$960.13 (30%)</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Distributed
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium">"Midnight Drive" Single</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">April 2025</td>
                      <td className="px-6 py-4 whitespace-nowrap">$1,850.20</td>
                      <td className="px-6 py-4 whitespace-nowrap">$1,387.65 (75%)</td>
                      <td className="px-6 py-4 whitespace-nowrap">$462.55 (25%)</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Distributed
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium">"Neon Dreams" EP</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">March 2025</td>
                      <td className="px-6 py-4 whitespace-nowrap">$2,758.80</td>
                      <td className="px-6 py-4 whitespace-nowrap">$1,931.16 (70%)</td>
                      <td className="px-6 py-4 whitespace-nowrap">$827.64 (30%)</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Distributed
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-4 bg-gray-50">
                <Link href="/dashboard/royalties" className="text-blue-600 hover:underline text-sm">
                  View all royalty distributions
                </Link>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

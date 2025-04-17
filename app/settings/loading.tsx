export default function SettingsLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation Skeleton */}
        <aside className="w-full md:w-64 shrink-0">
          <nav className="flex flex-col space-y-1 border-r border-gray-200">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="px-4 py-3">
                <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Content Skeleton */}
        <main className="flex-1">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-6"></div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="space-y-6">
              <div className="h-24 bg-gray-200 rounded animate-pulse"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

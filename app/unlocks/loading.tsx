export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="h-10 w-48 bg-gray-200 rounded mb-6" aria-hidden="true"></div>

      <div className="animate-pulse" aria-busy="true" aria-label="Loading unlocks">
        <div className="h-32 bg-gray-200 rounded-lg mb-8" aria-hidden="true"></div>

        <div className="flex gap-2 mb-6" aria-hidden="true">
          <div className="h-10 w-24 bg-gray-200 rounded"></div>
          <div className="h-10 w-24 bg-gray-200 rounded"></div>
          <div className="h-10 w-24 bg-gray-200 rounded"></div>
          <div className="h-10 w-24 bg-gray-200 rounded"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" aria-hidden="true">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    </div>
  )
}

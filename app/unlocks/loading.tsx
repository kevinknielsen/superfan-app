export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="h-10 w-48 bg-gray-200 rounded mb-6"></div>

      <div className="animate-pulse">
        <div className="h-32 bg-gray-200 rounded-lg mb-8"></div>

        <div className="h-10 w-full bg-gray-200 rounded mb-6"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    </div>
  )
}

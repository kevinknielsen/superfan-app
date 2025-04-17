import { Loader2 } from "lucide-react"

export default function DealsLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 bg-white p-8 rounded-lg shadow-sm">
        <Loader2 className="h-12 w-12 animate-spin text-gray-400" />
        <p className="text-lg text-gray-600">Loading investment opportunities...</p>
      </div>
    </div>
  )
}

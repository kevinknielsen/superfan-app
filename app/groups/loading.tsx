import { Loader2 } from "lucide-react"

export default function GroupsLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-gray-400" />
        <p className="text-lg text-gray-600">Loading groups...</p>
      </div>
    </div>
  )
}

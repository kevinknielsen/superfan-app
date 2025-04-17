import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Inbox } from "lucide-react"

export default function DocumentsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Documents</h1>

      <div className="flex flex-col items-center justify-center text-center py-16">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Inbox className="h-8 w-8 text-gray-400" />
        </div>
        <h2 className="text-xl font-semibold mb-2">No documents yet</h2>
        <p className="text-gray-600 max-w-md mb-6">
          Once you invest in deals, you'll be able to see all of the documents for those deals here
        </p>
        <Link href="/deals">
          <Button className="bg-[#0f172a] hover:bg-[#1e293b]">Browse deals</Button>
        </Link>
      </div>
    </div>
  )
}

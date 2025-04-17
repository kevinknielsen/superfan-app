import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <span className="font-semibold">Superfan.xyz</span>
            <span className="text-gray-500 text-sm hidden md:inline">|</span>
            <span className="text-gray-500 text-sm">Early-stage investing in startups</span>
          </div>

          <div className="flex items-center space-x-6">
            <a
              href="https://twitter.com/superfanone"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 text-sm flex items-center"
            >
              Follow on X
            </a>
            <Link href="/terms" className="text-gray-600 hover:text-gray-900 text-sm">
              Terms
            </Link>
            <Link href="/support" className="text-gray-600 hover:text-gray-900 text-sm">
              Support
            </Link>
            <span className="text-gray-500 text-sm">© {new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <span className="font-medium">Superfan.xyz</span>
            <span className="hidden sm:inline text-gray-500">|</span>
            <span className="hidden sm:inline text-gray-500">Early-stage investing in startups</span>
          </div>
          <div className="flex flex-wrap justify-center md:justify-end items-center gap-4 md:space-x-6">
            <a
              href="https://twitter.com/superfanone"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 flex items-center"
            >
              Follow on X
            </a>
            <Link href="/terms" className="text-gray-600 hover:text-gray-900">
              Terms
            </Link>
            <Link href="/support" className="text-gray-600 hover:text-gray-900">
              Support
            </Link>
            <span className="text-gray-500">© 2025</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

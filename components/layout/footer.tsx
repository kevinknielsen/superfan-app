export default function Footer() {
  return (
    <footer className="bg-[#0f172a] text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-400">© 2023 Superfan One. All rights reserved.</p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-sm text-gray-400 hover:text-white">
              Terms
            </a>
            <a href="#" className="text-sm text-gray-400 hover:text-white">
              Privacy
            </a>
            <a href="#" className="text-sm text-gray-400 hover:text-white">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

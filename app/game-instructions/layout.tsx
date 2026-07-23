import Link from "next/link"
import Footer from "@/components/footer"

/**
 * Shared chrome for content pages that are not tool apps
 * (game instructions, etc.). Matches help/legal header style.
 */
export default function GameInstructionsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="w-full border-b border-gray-200 bg-white shadow-sm">
        <div className="flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500">
              <div className="h-4 w-4 rounded-full bg-green-600" />
            </div>
            <span className="font-spin-display text-xl font-bold text-gray-800">
              Picker Wheel
            </span>
          </Link>
          <nav className="flex items-center gap-4 font-spin-display text-sm font-semibold text-gray-600">
            <Link href="/" className="hover:text-gray-900">
              Home
            </Link>
            <Link href="/game-instructions" className="text-green-700">
              Games
            </Link>
            <Link href="/articles" className="hover:text-gray-900">
              Blogs
            </Link>
            <Link href="/help" className="hover:text-gray-900">
              Help
            </Link>
          </nav>
        </div>
      </header>

      <div className="flex-1">{children}</div>

      <Footer />
    </div>
  )
}

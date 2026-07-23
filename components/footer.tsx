import Link from "next/link"

export default function Footer() {
  return (
    <footer className="w-full bg-gray-800 py-8 font-spin-body text-white">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 font-spin-display text-lg font-bold">
              Picker Wheel
            </h3>
            <p className="text-sm font-medium text-gray-300">
              The ultimate decision-making tool for random choices. Fair, fun,
              and easy to use.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-spin-display font-semibold">Tools</h4>
            <ul className="space-y-2 text-sm font-medium">
              <li>
                <Link
                  href="/spin-wheels"
                  className="text-gray-300 hover:text-white"
                >
                  All Categories
                </Link>
              </li>
              <li>
                <Link
                  href="/spin-wheels/all-wheels"
                  className="text-gray-300 hover:text-white"
                >
                  All Wheels
                </Link>
              </li>
              <li>
                <Link
                  href="/spin-wheels/tools-wheel-pickers"
                  className="text-gray-300 hover:text-white"
                >
                  Tools Wheels
                </Link>
              </li>
              <li>
                <Link
                  href="/spin-wheels/sports-wheel-pickers"
                  className="text-gray-300 hover:text-white"
                >
                  Sports Wheels
                </Link>
              </li>
              <li>
                <Link
                  href="/spin-wheels/video-games-wheel-pickers"
                  className="text-gray-300 hover:text-white"
                >
                  Video Game Wheels
                </Link>
              </li>
              <li>
                <Link
                  href="/spin-wheels/travel-world-wheel-pickers"
                  className="text-gray-300 hover:text-white"
                >
                  Travel & World
                </Link>
              </li>
              <li>
                <Link href="/" className="text-gray-300 hover:text-white">
                  Random Name Picker
                </Link>
              </li>
              <li>
                <Link
                  href="/country-picker-wheel"
                  className="text-gray-300 hover:text-white"
                >
                  Country Picker
                </Link>
              </li>
              <li>
                <Link
                  href="/state-wheel"
                  className="text-gray-300 hover:text-white"
                >
                  State Picker
                </Link>
              </li>
              <li>
                <Link
                  href="/weighted-wheel-spinner"
                  className="text-gray-300 hover:text-white"
                >
                  Weighted Wheel
                </Link>
              </li>
              <li>
                <Link
                  href="/prize-wheel-spinner"
                  className="text-gray-300 hover:text-white"
                >
                  Prize Wheel
                </Link>
              </li>
              <li>
                <Link
                  href="/wheel-of-fortune"
                  className="text-gray-300 hover:text-white"
                >
                  Wheel of Fortune
                </Link>
              </li>
              <li>
                <Link
                  href="/jjk-spin-the-wheel"
                  className="text-gray-300 hover:text-white"
                >
                  JJK Spin Wheel picker
                </Link>
              </li>
              <li>
                <Link
                  href="/demon-slayer-spin-wheel"
                  className="text-gray-300 hover:text-white"
                >
                  Demon Slayer Spin Wheel
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-spin-display font-semibold">Support</h4>
            <ul className="space-y-2 text-sm font-medium">
              <li>
                <Link href="/help" className="text-gray-300 hover:text-white">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/articles" className="text-gray-300 hover:text-white">
                  Blogs
                </Link>
              </li>
              <li>
                <Link
                  href="/articles/board-games/spin-wheel-for-board-game-nights"
                  className="text-gray-300 hover:text-white"
                >
                  Board Game Night Guide
                </Link>
              </li>
              <li>
                <Link
                  href="/articles/education/random-name-picker-for-teachers"
                  className="text-gray-300 hover:text-white"
                >
                  Teachers Name Picker Guide
                </Link>
              </li>
              <li>
                <Link
                  href="/articles/giveaways/fair-online-prize-wheel"
                  className="text-gray-300 hover:text-white"
                >
                  Fair Giveaway Guide
                </Link>
              </li>
              <li>
                <Link
                  href="/articles/how-it-works/is-spin-wheel-really-random"
                  className="text-gray-300 hover:text-white"
                >
                  Is a Spin Wheel Random?
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-gray-300 hover:text-white">
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/help#people-also-ask"
                  className="text-gray-300 hover:text-white"
                >
                  People Also Ask
                </Link>
              </li>
              <li>
                <Link
                  href="/help#what-is-a-spin-wheel-picker"
                  className="text-gray-300 hover:text-white"
                >
                  What Is a Spin Wheel?
                </Link>
              </li>
              <li>
                <Link
                  href="/help#is-the-spin-wheel-really-random"
                  className="text-gray-300 hover:text-white"
                >
                  Is It Really Random?
                </Link>
              </li>
              <li>
                <Link
                  href="/help#how-to-create-a-wheel"
                  className="text-gray-300 hover:text-white"
                >
                  How to Create a Wheel
                </Link>
              </li>
              <li>
                <Link
                  href="/help#country-picker-how-it-works"
                  className="text-gray-300 hover:text-white"
                >
                  Country Picker Guide
                </Link>
              </li>
              <li>
                <Link
                  href="/help#state-picker-how-it-works"
                  className="text-gray-300 hover:text-white"
                >
                  State Picker Guide
                </Link>
              </li>
              <li>
                <Link
                  href="/help#gaming-features-explained"
                  className="text-gray-300 hover:text-white"
                >
                  Games & Achievements
                </Link>
              </li>
              <li>
                <Link
                  href="/game-instructions"
                  className="text-gray-300 hover:text-white"
                >
                  Game Instructions
                </Link>
              </li>
              <li>
                <Link
                  href="/help#what-is-picker-wheel"
                  className="text-gray-300 hover:text-white"
                >
                  About Picker Wheel
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-spin-display font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm font-medium">
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-gray-300 hover:text-white"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-of-service"
                  className="text-gray-300 hover:text-white"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/cookie-policy"
                  className="text-gray-300 hover:text-white"
                >
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/contact-us"
                  className="text-gray-300 hover:text-white"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-700 pt-8 text-center text-sm font-medium text-gray-300">
          <p>&copy; {new Date().getFullYear()} Picker Wheel. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

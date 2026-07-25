import Link from "next/link"
import { BrandLogo } from "@/components/brand-logo"
import { SITE_NAME, SITE_SUPPORT_EMAIL } from "@/lib/site-metadata"

type FooterLink = {
  label: string
  href: string
  external?: boolean
}

type FooterColumn = {
  title: string
  links: FooterLink[]
}

const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: `About ${SITE_NAME}`,
    links: [
      { label: "Home", href: "/" },
      { label: "Changelog", href: "/changelog" },
      { label: "Blogs", href: "/articles" },
      { label: "Contact Us", href: "/contact-us" },
      { label: "About Picker Wheel", href: "/help#what-is-picker-wheel" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", href: "/help" },
      { label: "FAQ", href: "/help" },
      { label: "People Also Ask", href: "/help#people-also-ask" },
      { label: "Game Instructions", href: "/game-instructions" },
      { label: "How to Create a Wheel", href: "/help#how-to-create-a-wheel" },
      { label: "Is It Really Random?", href: "/help#is-the-spin-wheel-really-random" },
    ],
  },
  {
    title: "Popular Wheels",
    links: [
      { label: "Random Name Picker", href: "/" },
      { label: "Prize Wheel", href: "/prize-wheel-spinner" },
      { label: "Weighted Wheel", href: "/weighted-wheel-spinner" },
      { label: "Wheel of Fortune", href: "/wheel-of-fortune" },
      { label: "JJK Spin Wheel", href: "/jjk-spin-the-wheel" },
      { label: "Demon Slayer Spin Wheel", href: "/demon-slayer-spin-wheel" },
    ],
  },
  {
    title: "Categories",
    links: [
      { label: "All Categories", href: "/spin-wheels" },
      { label: "All Wheels", href: "/spin-wheels/all-wheels" },
      { label: "Tools Wheels", href: "/spin-wheels/tools-wheel-pickers" },
      { label: "Sports Wheels", href: "/spin-wheels/sports-wheel-pickers" },
      { label: "Video Game Wheels", href: "/spin-wheels/video-games-wheel-pickers" },
      { label: "Travel & World", href: "/spin-wheels/travel-world-wheel-pickers" },
    ],
  },
  {
    title: "Tools",
    links: [
      { label: "Create Custom Wheel", href: "/create-custom-wheel-spinner" },
      { label: "Country Picker", href: "/country-picker-wheel" },
      { label: "State Picker", href: "/state-wheel" },
      { label: "Number Wheel", href: "/number-picker-wheel" },
      { label: "Letter Picker", href: "/random-letter-picker" },
      { label: "Yes or No Wheel", href: "/yes-or-no-wheel" },
    ],
  },
  {
    title: "Guides",
    links: [
      { label: "Board Game Night Guide", href: "/articles/board-games/spin-wheel-for-board-game-nights" },
      { label: "Teachers Name Picker Guide", href: "/articles/education/random-name-picker-for-teachers" },
      { label: "Fair Giveaway Guide", href: "/articles/giveaways/fair-online-prize-wheel" },
      { label: "Is a Spin Wheel Random?", href: "/articles/how-it-works/is-spin-wheel-really-random" },
      { label: "Games & Achievements", href: "/help#gaming-features-explained" },
    ],
  },
]

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  )
}

function PinterestIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-3.64 19.31c-.09-1.57-.02-3.45.39-5.21l1.29-5.46s-.32-.65-.32-1.61c0-1.51.87-2.64 1.96-2.64.93 0 1.38.7 1.38 1.53 0 .93-.59 2.32-.9 3.61-.26 1.08.54 1.96 1.61 1.96 1.93 0 3.41-2.03 3.41-4.97 0-2.6-1.87-4.42-4.54-4.42-3.09 0-4.91 2.32-4.91 4.72 0 .94.36 1.94.81 2.49.09.11.1.21.08.32l-.3 1.24c-.05.2-.16.24-.37.15-1.39-.65-2.26-2.68-2.26-4.31 0-3.51 2.55-6.73 7.35-6.73 3.86 0 6.86 2.75 6.86 6.42 0 3.83-2.42 6.92-5.77 6.92-1.13 0-2.19-.59-2.55-1.28l-.69 2.64c-.25.97-.93 2.18-1.38 2.92.79.24 1.63.37 2.5.37A10 10 0 0 0 12 2Z" />
    </svg>
  )
}

const SOCIAL_LINKS = [
  { label: "X (Twitter)", href: "https://x.com/spinifywheel", Icon: XIcon },
  {
    label: "Pinterest",
    href: "https://in.pinterest.com/spinifywheel/",
    Icon: PinterestIcon,
  },
]

export default function Footer() {
  return (
    <footer className="w-full bg-neutral-950 py-12 font-spin-body text-white">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Link columns */}
        <div className="grid w-full grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title}>
              <h4 className="mb-4 font-spin-display text-sm font-bold text-white">
                {column.title}
              </h4>
              <ul className="space-y-3 text-sm font-medium">
                {column.links.map((link) => (
                  <li key={`${column.title}-${link.label}`}>
                    <Link
                      href={link.href}
                      className="text-neutral-400 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Brand row: logo left, social icons right */}
        <div className="mt-12 flex flex-col items-start gap-6 border-t border-neutral-800 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <BrandLogo variant="dark" showWordmark />
          </div>
          <div className="flex items-center gap-3">
            {SOCIAL_LINKS.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-white"
              >
                <Icon className="h-5 w-5" strokeWidth={1.75} />
              </a>
            ))}
          </div>
        </div>

        {/* Fine print */}
        <div className="mt-8 space-y-3 border-t border-neutral-800 pt-6 text-xs font-medium leading-relaxed text-neutral-400">
          <p>
            Copyright &copy; {new Date().getFullYear()} {SITE_NAME}. All rights
            reserved. The {SITE_NAME} word mark and wheel logo are trademarks of{" "}
            {SITE_NAME}. Developed by{" "}
            <a
              href="https://solvebytez.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-300 underline-offset-2 hover:text-white hover:underline"
            >
              Solvebytez
            </a>
            .
          </p>
          <p>
            Use of this site is subject to express terms of use. By using this
            site, you signify that you agree to be bound by our{" "}
            <Link
              href="/terms-of-service"
              className="text-neutral-300 underline-offset-2 hover:text-white hover:underline"
            >
              Terms of Service
            </Link>
            ,{" "}
            <Link
              href="/privacy-policy"
              className="text-neutral-300 underline-offset-2 hover:text-white hover:underline"
            >
              Privacy Policy
            </Link>
            , and{" "}
            <Link
              href="/cookie-policy"
              className="text-neutral-300 underline-offset-2 hover:text-white hover:underline"
            >
              Cookie Policy
            </Link>
            . Questions? Email{" "}
            <a
              href={`mailto:${SITE_SUPPORT_EMAIL}`}
              className="text-neutral-300 underline-offset-2 hover:text-white hover:underline"
            >
              {SITE_SUPPORT_EMAIL}
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  )
}

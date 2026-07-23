import type { Metadata } from "next"
import Link from "next/link"
import Footer from "@/components/footer"
import { ToolBreadcrumbNav } from "@/components/tool-breadcrumb-nav"
import {
  CATEGORY_DIRECTORY,
  getToolBreadcrumbTrail,
  SPIN_WHEELS_BASE_PATH,
} from "@/lib/wheel-categories"

export const metadata: Metadata = {
  title: "Wheel Categories | Picker Wheel",
  description:
    "Browse all picker wheel categories—tools, sports, video games, travel, and more. Find the right random picker for any decision.",
}

export default function SpinWheelsCategoriesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-white via-slate-50 to-slate-100">
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
            <Link href={SPIN_WHEELS_BASE_PATH} className="text-green-700">
              Wheels
            </Link>
          </nav>
        </div>
      </header>

      <ToolBreadcrumbNav
        pathname={SPIN_WHEELS_BASE_PATH}
        crumbs={getToolBreadcrumbTrail(SPIN_WHEELS_BASE_PATH)}
      />

      <main className="flex-1 py-12 md:py-16">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="mb-12 text-center md:mb-16">
            <h1 className="font-spin-display text-4xl font-bold tracking-tight text-slate-800 md:text-5xl">
              Categories
            </h1>
            <div
              className="mx-auto mt-4 flex justify-center gap-1.5"
              aria-hidden="true"
            >
              {Array.from({ length: 12 }).map((_, index) => (
                <span
                  key={index}
                  className="h-1.5 w-1.5 rounded-full bg-green-500"
                />
              ))}
            </div>
            <p className="mx-auto mt-5 max-w-2xl text-base font-medium text-slate-500 md:text-lg">
              Explore every wheel category with a short overview, then jump into
              the pickers that fit your next decision.
            </p>
          </div>

          <ul className="grid grid-cols-1 gap-x-12 gap-y-10 md:grid-cols-2">
            {CATEGORY_DIRECTORY.map((category) => {
              const Icon = category.icon
              return (
                <li key={category.id}>
                  <Link
                    href={category.href}
                    className="group flex gap-4 rounded-2xl p-2 transition-colors hover:bg-white/80"
                  >
                    <span
                      className="mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white shadow-sm transition-transform group-hover:scale-105"
                      style={{ backgroundColor: category.color }}
                    >
                      <Icon className="h-6 w-6" strokeWidth={2.25} />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-spin-display text-xl font-bold text-slate-800 transition-colors group-hover:text-green-700">
                        {category.title}
                      </span>
                      <span className="mt-1.5 block text-sm font-medium leading-relaxed text-slate-500 md:text-[15px]">
                        {category.description}
                      </span>
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </main>

      <Footer />
    </div>
  )
}

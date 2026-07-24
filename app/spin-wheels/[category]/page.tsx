import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight } from "lucide-react"
import Footer from "@/components/footer"
import { ToolBreadcrumbNav } from "@/components/tool-breadcrumb-nav"
import {
  ALL_WHEELS_ENTRY,
  getAllWheels,
  getAvailableWheels,
  getCategoryById,
  getToolBreadcrumbTrail,
  SPIN_WHEELS_BASE_PATH,
  WHEEL_CATEGORIES,
} from "@/lib/wheel-categories"

type PageProps = {
  params: Promise<{ category: string }>
}

export function generateStaticParams() {
  return [
    { category: ALL_WHEELS_ENTRY.id },
    ...WHEEL_CATEGORIES.map((category) => ({ category: category.id })),
  ]
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category: categoryId } = await params

  if (categoryId === ALL_WHEELS_ENTRY.id) {
    return {
      title: "All Wheels | Picker Wheel",
      description: ALL_WHEELS_ENTRY.description,
    }
  }

  const category = getCategoryById(categoryId)
  if (!category) {
    return { title: "Category Not Found | Picker Wheel" }
  }

  return {
    title: `${category.title} Wheels | Picker Wheel`,
    description: category.description,
  }
}

export default async function SpinWheelCategoryPage({ params }: PageProps) {
  const { category: categoryId } = await params

  const isAll = categoryId === ALL_WHEELS_ENTRY.id
  const category = isAll ? null : getCategoryById(categoryId)

  if (!isAll && !category) {
    notFound()
  }

  const title = isAll ? ALL_WHEELS_ENTRY.title : category!.title
  const description = isAll
    ? ALL_WHEELS_ENTRY.description
    : category!.description
  const Icon = isAll ? ALL_WHEELS_ENTRY.icon : category!.icon
  const color = isAll ? ALL_WHEELS_ENTRY.color : category!.color
  const bg = isAll ? ALL_WHEELS_ENTRY.bg : category!.bg
  const wheels = getAvailableWheels(isAll ? getAllWheels() : category!.items)
  const categoryPath = `${SPIN_WHEELS_BASE_PATH}/${categoryId}`

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
        pathname={categoryPath}
        crumbs={getToolBreadcrumbTrail(categoryPath)}
        placement="header"
      />

      <main className="flex-1 py-10 md:py-14">
        <div className="container mx-auto max-w-5xl px-4">
          <Link
            href={SPIN_WHEELS_BASE_PATH}
            className="mb-8 inline-flex items-center gap-2 font-spin-display text-sm font-semibold text-slate-500 transition-colors hover:text-green-700"
          >
            <ArrowLeft className="h-4 w-4" />
            All categories
          </Link>

          <div
            className="mb-10 flex flex-col gap-4 rounded-2xl px-5 py-6 sm:flex-row sm:items-center"
            style={{ backgroundColor: bg }}
          >
            <span
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white shadow-sm"
              style={{ backgroundColor: color }}
            >
              <Icon className="h-7 w-7" strokeWidth={2.25} />
            </span>
            <div>
              <h1 className="font-spin-display text-3xl font-bold text-slate-800 md:text-4xl">
                {title}
              </h1>
              <p className="mt-2 max-w-2xl font-medium text-slate-600">
                {description}
              </p>
            </div>
          </div>

          {wheels.length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-300 bg-white/70 px-6 py-10 text-center text-slate-500">
              Wheels for this category are coming soon.
            </p>
          ) : (
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {wheels.map((wheel) => {
                const WheelIcon = wheel.icon
                return (
                  <li key={wheel.label}>
                    <Link
                      href={wheel.href!}
                      className="group flex h-full items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-green-300 hover:shadow-md"
                    >
                      <span
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                        style={{
                          backgroundColor: wheel.bg,
                          color: wheel.color,
                        }}
                      >
                        <WheelIcon className="h-5 w-5" strokeWidth={2.25} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-2">
                          <span className="font-spin-display font-semibold text-slate-800 group-hover:text-green-700">
                            {wheel.label}
                          </span>
                          <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-green-600" />
                        </span>
                        {wheel.description && (
                          <span className="mt-1.5 block text-sm font-medium leading-relaxed text-slate-500">
                            {wheel.description}
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

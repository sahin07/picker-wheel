"use client"

import { usePathname } from "next/navigation"
import { ToolBreadcrumbNav } from "@/components/tool-breadcrumb-nav"
import { getToolBreadcrumbTrail } from "@/lib/wheel-categories"

const HIDDEN_PREFIXES = [
  "/articles",
  "/help",
  "/privacy-policy",
  "/terms-of-service",
  "/cookie-policy",
  "/contact-us",
  "/game-instructions",
]

export default function ToolBreadcrumbs() {
  const pathname = usePathname() || "/"

  if (
    HIDDEN_PREFIXES.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    )
  ) {
    return null
  }

  const crumbs = getToolBreadcrumbTrail(pathname)
  // Tool pillars already emit BreadcrumbList JSON-LD — avoid duplicate schema here
  return (
    <ToolBreadcrumbNav crumbs={crumbs} pathname={pathname} withSchema={false} />
  )
}

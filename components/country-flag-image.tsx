"use client"

import { useState } from "react"
import type { Country } from "@/data/countries"
import { countryFlagImageUrl } from "@/lib/country-wheel-canvas"

type FlagCountry = Pick<Country, "code" | "id" | "name" | "flag">

interface CountryFlagImageProps {
  country: FlagCountry | null | undefined
  width?: 20 | 40 | 80 | 160 | 320
  className?: string
  imgClassName?: string
  title?: string
}

/** Renders a country flag via flagcdn (reliable on Windows vs emoji). */
export function CountryFlagImage({
  country,
  width = 80,
  className = "",
  imgClassName = "object-cover rounded shadow-sm",
  title,
}: CountryFlagImageProps) {
  const [failed, setFailed] = useState(false)
  const url = country ? countryFlagImageUrl(country, width) : null
  const label = title || country?.name || "Flag"

  if (!country) return null

  if (url && !failed) {
    return (
      <span className={`inline-flex items-center justify-center shrink-0 ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url}
          alt={label}
          title={label}
          width={width}
          height={Math.round(width * 0.75)}
          className={imgClassName}
          loading="lazy"
          onError={() => setFailed(true)}
        />
      </span>
    )
  }

  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 text-4xl leading-none ${className}`}
      title={label}
      role="img"
      aria-label={label}
    >
      {country.flag || countryFlagCodeFallback(country) || "🏳️"}
    </span>
  )
}

function countryFlagCodeFallback(country: FlagCountry): string {
  return String(country.code || country.id || "")
    .trim()
    .toUpperCase()
    .slice(0, 2)
}

"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Users, DollarSign, Globe, Languages } from "lucide-react"
import type { Country } from "@/data/countries"
import { formatPopulation, formatArea, formatGDP } from "@/data/countries"
import { CountryFlagImage } from "@/components/country-flag-image"

interface CountryStatisticsModalProps {
  isOpen: boolean
  onClose: () => void
  country: Country | null
}

export default function CountryStatisticsModal({ isOpen, onClose, country }: CountryStatisticsModalProps) {
  if (!isOpen || !country) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-3">
            <CountryFlagImage
              country={country}
              width={80}
              imgClassName="h-12 w-[4.5rem] rounded-md object-cover border border-slate-200 shadow-sm"
            />
            <div>
              <CardTitle className="text-2xl">{country.name}</CardTitle>
              <p className="text-gray-600">{country.region}</p>
            </div>
          </div>
          <Button variant="ghost" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center">
                <Globe className="w-5 h-5 mr-2" />
                Basic Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Capital:</span>
                  <span className="font-medium">{country.capital}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Country Code:</span>
                  <span className="font-medium">{country.code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Subregion:</span>
                  <span className="font-medium">{country.subregion}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Continent:</span>
                  <span className="font-medium">{country.continent}</span>
                </div>
              </div>
            </div>

            {/* Demographics */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Demographics
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Population:</span>
                  <span className="font-medium">{formatPopulation(country.population)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Area:</span>
                  <span className="font-medium">{formatArea(country.area)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Density:</span>
                  <span className="font-medium">{Math.round(country.population / country.area)} people/km²</span>
                </div>
              </div>
            </div>

            {/* Economy */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Economy
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Currency:</span>
                  <span className="font-medium">{country.currency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">GDP:</span>
                  <span className="font-medium">{formatGDP(country.gdp)}</span>
                </div>
                {country.gdp && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">GDP per capita:</span>
                    <span className="font-medium">
                      ${Math.round((country.gdp * 1000000000) / country.population).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Culture & Language */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center">
                <Languages className="w-5 h-5 mr-2" />
                Culture & Language
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Language(s):</span>
                  <span className="font-medium">{country.language}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Timezone:</span>
                  <span className="font-medium">{country.timezone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Flag Display */}
          <div className="mt-6 text-center">
            <div className="inline-block p-4 bg-gray-50 rounded-lg">
              <div className="text-8xl mb-2">{country.flag}</div>
              <p className="text-sm text-gray-600">Flag of {country.name}</p>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button onClick={onClose}>Close</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

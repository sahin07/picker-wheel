"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Users, Globe } from "lucide-react"
import type { State } from "@/data/states"
import { formatPopulation, formatArea } from "@/data/states"

interface StateStatisticsModalProps {
  isOpen: boolean
  onClose: () => void
  state: State | null
}

export default function StateStatisticsModal({ isOpen, onClose, state }: StateStatisticsModalProps) {
  if (!isOpen || !state) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-3">
            {state.flag && <span className="text-4xl">{state.flag}</span>}
            <div>
              <CardTitle className="text-2xl">{state.name}</CardTitle>
              <p className="text-gray-600">{state.country}</p>
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
                {state.capital && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Capital:</span>
                    <span className="font-medium">{state.capital}</span>
                  </div>
                )}
                {state.abbreviation && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Abbreviation:</span>
                    <span className="font-medium">{state.abbreviation}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Country:</span>
                  <span className="font-medium">{state.country}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Country Code:</span>
                  <span className="font-medium">{state.countryCode}</span>
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
                {state.population && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Population:</span>
                    <span className="font-medium">{formatPopulation(state.population)}</span>
                  </div>
                )}
                {state.area && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Area:</span>
                    <span className="font-medium">{formatArea(state.area)}</span>
                  </div>
                )}
                {state.population && state.area && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Density:</span>
                    <span className="font-medium">{Math.round(state.population / state.area)} people/km²</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Flag Display */}
          {state.flag && (
            <div className="mt-6 text-center">
              <div className="inline-block p-4 bg-gray-50 rounded-lg">
                <div className="text-8xl mb-2">{state.flag}</div>
                <p className="text-sm text-gray-600">Flag of {state.name}</p>
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <Button onClick={onClose}>Close</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

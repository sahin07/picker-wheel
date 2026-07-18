"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Heart, Trash2, BarChart3, GitCompare } from "lucide-react"
import { useWheelManagerStore } from "@/stores/wheel-manager-store"
import { useState } from "react"
import CountryStatisticsModal from "./country-statistics-modal"
import type { Country } from "@/data/countries"
import CountryComparisonModal from "./country-comparison-modal"

interface CountryFavoritesModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CountryFavoritesModal({ isOpen, onClose }: CountryFavoritesModalProps) {
  const wheel = useWheelManagerStore(state => {
    const wheels = state.wheelsByTool[state.currentTool] || [];
    return wheels.find(w => w.id === state.currentWheelId) || null;
  });
  const data = (wheel?.data as any) ?? {};
  const favoriteCountries = data.favoriteCountries ?? [];
  const updateWheelData = useWheelManagerStore.getState().updateWheelData;
  const comparisonCountries = data.comparisonCountries ?? [];
  const isInComparison = (countryId: string) => comparisonCountries.some((c: any) => c.id === countryId);

  const removeFromFavorites = (countryId: string) => {
    if (!wheel) return;
    updateWheelData("country-wheel", wheel.id, {
      ...data,
      favoriteCountries: favoriteCountries.filter((c: any) => c.id !== countryId),
    });
  };
  const clearFavorites = () => {
    if (!wheel) return;
    updateWheelData("country-wheel", wheel.id, {
      ...data,
      favoriteCountries: [],
    });
  };

  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
  const [showStats, setShowStats] = useState(false)
  const [showComparisonModal, setShowComparisonModal] = useState(false);

  const handleShowStats = (country: Country) => {
    setSelectedCountry(country)
    setShowStats(true)
  }

  const handleAddToComparison = (country: Country) => {
    if (!wheel) return;
    const comparisonCountries = data.comparisonCountries ?? [];
    if (!comparisonCountries.some((c: any) => c.id === country.id)) {
      useWheelManagerStore.getState().updateWheelData("country-wheel", wheel.id, {
        ...data,
        comparisonCountries: [...comparisonCountries, country],
      });
    }
  };

  const handleViewComparison = () => {
    setShowComparisonModal(true);
    onClose();
  };

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl max-h-[80vh] overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-red-500" />
              <CardTitle>Favorite Countries ({favoriteCountries.length})</CardTitle>
            </div>
            <div className="flex items-center space-x-2">
              {favoriteCountries.length > 0 && (
                <Button variant="outline" size="sm" onClick={handleViewComparison}>
                  <GitCompare className="w-4 h-4 mr-2" />
                  View Comparison
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={clearFavorites}>
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
              <Button variant="ghost" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="max-h-[60vh] overflow-y-auto">
            {favoriteCountries.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold mb-2">No Favorite Countries</h3>
                <p className="text-gray-600">Add countries to your favorites from the country list</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {favoriteCountries.map((country: any) => (
                  <Card key={country.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <span className="text-3xl">{country.flag}</span>
                          <div>
                            <h3 className="font-semibold">{country.name}</h3>
                            <p className="text-sm text-gray-600">{country.region}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromFavorites(country.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Capital:</span>
                          <span>{country.capital}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Population:</span>
                          <span>{(country.population / 1000000).toFixed(1)}M</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Currency:</span>
                          <span>{country.currency}</span>
                        </div>
                      </div>

                      <div className="flex space-x-2 mt-4">
                        <Button variant="outline" size="sm" onClick={() => handleShowStats(country)} className="flex-1">
                          <BarChart3 className="w-4 h-4 mr-1" />
                          Stats
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddToComparison(country)}
                          disabled={isInComparison(country.id)}
                          className="flex-1"
                        >
                          <GitCompare className="w-4 h-4 mr-1" />
                          {isInComparison(country.id) ? "Added" : "Compare"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <Button onClick={onClose}>Close</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <CountryStatisticsModal isOpen={showStats} onClose={() => setShowStats(false)} country={selectedCountry} />
      <CountryComparisonModal
        isOpen={showComparisonModal}
        onClose={() => setShowComparisonModal(false)}
      />
    </>
  )
}

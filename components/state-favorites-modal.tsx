"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Heart, Trash2, BarChart3, GitCompare } from "lucide-react"
import { useWheelManagerStore } from "@/stores/wheel-manager-store"
import { useState } from "react"
import StateStatisticsModal from "./state-statistics-modal"
import StateComparisonModal from "./state-comparison-modal"
import type { State } from "@/data/states"

interface StateFavoritesModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function StateFavoritesModal({ isOpen, onClose }: StateFavoritesModalProps) {
  const wheel = useWheelManagerStore(state => {
    const wheels = state.wheelsByTool[state.currentTool] || [];
    return wheels.find(w => w.id === state.currentWheelId) || null;
  });
  const data = (wheel?.data as any) ?? {};
  const favoriteStates = data.favoriteStates ?? [];
  const updateWheelData = useWheelManagerStore.getState().updateWheelData;

  const removeFromFavorites = (stateId: string) => {
    if (!wheel) return;
    updateWheelData("state-wheel", wheel.id, {
      ...data,
      favoriteStates: favoriteStates.filter((s: any) => s.id !== stateId),
    });
  };
  const clearFavorites = () => {
    if (!wheel) return;
    updateWheelData("state-wheel", wheel.id, {
      ...data,
      favoriteStates: [],
    });
  };

  const [selectedState, setSelectedState] = useState<State | null>(null)
  const [showStats, setShowStats] = useState(false)
  const [showComparisonModal, setShowComparisonModal] = useState(false);

  const handleShowStats = (state: State) => {
    setSelectedState(state)
    setShowStats(true)
  }

  const handleAddToComparison = (state: State) => {
    if (!wheel) return;
    const comparisonStates = data.comparisonStates ?? [];
    if (!comparisonStates.some((s: any) => s.id === state.id)) {
      useWheelManagerStore.getState().updateWheelData("state-wheel", wheel.id, {
        ...data,
        comparisonStates: [...comparisonStates, state],
      });
    }
  };

  const handleViewComparison = () => {
    setShowComparisonModal(true);
    onClose();
  };

  const comparisonStates = data.comparisonStates ?? [];
  const isInComparison = (stateId: string) => comparisonStates.some((s: any) => s.id === stateId);

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl max-h-[80vh] overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-red-500" />
              <CardTitle>Favorite States ({favoriteStates.length})</CardTitle>
            </div>
            <div className="flex items-center space-x-2">
              {favoriteStates.length > 0 && (
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
            {favoriteStates.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold mb-2">No Favorite States</h3>
                <p className="text-gray-600">Add states to your favorites from the state list</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {favoriteStates.map((state:any) => (
                  <Card key={state.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          {state.flag && <span className="text-3xl">{state.flag}</span>}
                          <div>
                            <h3 className="font-semibold">{state.name}</h3>
                            <p className="text-sm text-gray-600">{state.country}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromFavorites(state.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="space-y-2 text-sm">
                        {state.capital && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Capital:</span>
                            <span>{state.capital}</span>
                          </div>
                        )}
                        {state.population && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Population:</span>
                            <span>{(state.population / 1000000).toFixed(1)}M</span>
                          </div>
                        )}
                        {state.abbreviation && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Code:</span>
                            <span>{state.abbreviation}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex space-x-2 mt-4">
                        <Button variant="outline" size="sm" onClick={() => handleShowStats(state)} className="flex-1">
                          <BarChart3 className="w-4 h-4 mr-1" />
                          Stats
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddToComparison(state)}
                          disabled={isInComparison(state.id)}
                          className="flex-1"
                        >
                          <GitCompare className="w-4 h-4 mr-1" />
                          {isInComparison(state.id) ? "Added" : "Compare"}
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

      <StateStatisticsModal isOpen={showStats} onClose={() => setShowStats(false)} state={selectedState} />
      <StateComparisonModal
        isOpen={showComparisonModal}
        onClose={() => setShowComparisonModal(false)}
      />
    </>
  )
}

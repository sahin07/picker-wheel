"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Trash2 } from "lucide-react"
import { useStateWheelStore } from "@/stores/state-wheel-store"
import { formatPopulation, formatArea } from "@/data/states"
import { useWheelManagerStore } from "@/stores/wheel-manager-store"

interface StateComparisonModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function StateComparisonModal({ isOpen, onClose }: StateComparisonModalProps) {
  const wheel = useWheelManagerStore(state => {
    const wheels = state.wheelsByTool[state.currentTool] || [];
    return wheels.find(w => w.id === state.currentWheelId) || null;
  });
  const data = (wheel?.data as any) ?? {};
  const comparisonStates = data.comparisonStates ?? [];
  const updateWheelData = useWheelManagerStore.getState().updateWheelData;

  const removeFromComparison = (stateId: string) => {
    if (!wheel) return;
    updateWheelData("state-wheel", wheel.id, {
      ...data,
      comparisonStates: comparisonStates.filter((s: any) => s.id !== stateId),
    });
  };
  const clearComparison = () => {
    if (!wheel) return;
    updateWheelData("state-wheel", wheel.id, {
      ...data,
      comparisonStates: [],
    });
  };

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>State Comparison</CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={clearComparison}>
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
            <Button variant="ghost" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="max-h-[75vh] overflow-y-auto">
          {comparisonStates.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏛️</div>
              <h3 className="text-xl font-semibold mb-2">No States to Compare</h3>
              <p className="text-gray-600">Add states to comparison from the state list</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-semibold">State</th>
                    {comparisonStates.map((state) => (
                      <th key={state.id} className="text-center p-3 min-w-[200px]">
                        <div className="flex flex-col items-center space-y-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromComparison(state.id)}
                            className="self-end text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                          {state.flag && <div className="text-4xl">{state.flag}</div>}
                          <div className="font-semibold">{state.name}</div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">Capital</td>
                    {comparisonStates.map((state) => (
                      <td key={state.id} className="p-3 text-center">
                        {state.capital || "N/A"}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">Country</td>
                    {comparisonStates.map((state) => (
                      <td key={state.id} className="p-3 text-center">
                        {state.country}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">Population</td>
                    {comparisonStates.map((state) => (
                      <td key={state.id} className="p-3 text-center">
                        <div>{formatPopulation(state.population)}</div>
                        {state.population && (
                          <div className="text-xs text-gray-500">{state.population.toLocaleString()}</div>
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">Area</td>
                    {comparisonStates.map((state) => (
                      <td key={state.id} className="p-3 text-center">
                        {formatArea(state.area)}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">Population Density</td>
                    {comparisonStates.map((state) => (
                      <td key={state.id} className="p-3 text-center">
                        {state.population && state.area
                          ? `${Math.round(state.population / state.area)} people/km²`
                          : "N/A"}
                      </td>
                    ))}
                  </tr>
                  {comparisonStates.some((state) => state.abbreviation) && (
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">Abbreviation</td>
                      {comparisonStates.map((state) => (
                        <td key={state.id} className="p-3 text-center">
                          {state.abbreviation || "N/A"}
                        </td>
                      ))}
                    </tr>
                  )}
                </tbody>
              </table>
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

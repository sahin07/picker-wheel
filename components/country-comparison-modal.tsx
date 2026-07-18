"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Trash2 } from "lucide-react"
import { useWheelManagerStore } from "@/stores/wheel-manager-store"
import { formatPopulation, formatArea, formatGDP } from "@/data/countries"

interface CountryComparisonModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CountryComparisonModal({ isOpen, onClose }: CountryComparisonModalProps) {
  const wheel = useWheelManagerStore(state => {
    const wheels = state.wheelsByTool[state.currentTool] || [];
    return wheels.find(w => w.id === state.currentWheelId) || null;
  });
  const data = (wheel?.data as any) ?? {};
  const comparisonCountries = data.comparisonCountries ?? [];
  const updateWheelData = useWheelManagerStore.getState().updateWheelData;

  const removeFromComparison = (countryId: string) => {
    if (!wheel) return;
    updateWheelData("country-wheel", wheel.id, {
      ...data,
      comparisonCountries: comparisonCountries.filter((c: any) => c.id !== countryId),
    });
  };
  const clearComparison = () => {
    if (!wheel) return;
    updateWheelData("country-wheel", wheel.id, {
      ...data,
      comparisonCountries: [],
    });
  };

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Country Comparison</CardTitle>
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
          {comparisonCountries.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🌍</div>
              <h3 className="text-xl font-semibold mb-2">No Countries to Compare</h3>
              <p className="text-gray-600">Add countries to comparison from the country list</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-semibold">Country</th>
                    {comparisonCountries.map((country) => (
                      <th key={country.id} className="text-center p-3 min-w-[200px]">
                        <div className="flex flex-col items-center space-y-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromComparison(country.id)}
                            className="self-end text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                          <div className="text-4xl">{country.flag}</div>
                          <div className="font-semibold">{country.name}</div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">Capital</td>
                    {comparisonCountries.map((country) => (
                      <td key={country.id} className="p-3 text-center">
                        {country.capital}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">Population</td>
                    {comparisonCountries.map((country) => (
                      <td key={country.id} className="p-3 text-center">
                        <div>{formatPopulation(country.population)}</div>
                        <div className="text-xs text-gray-500">{country.population.toLocaleString()}</div>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">Area</td>
                    {comparisonCountries.map((country) => (
                      <td key={country.id} className="p-3 text-center">
                        {formatArea(country.area)}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">Population Density</td>
                    {comparisonCountries.map((country) => (
                      <td key={country.id} className="p-3 text-center">
                        {Math.round(country.population / country.area)} people/km²
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">Currency</td>
                    {comparisonCountries.map((country) => (
                      <td key={country.id} className="p-3 text-center">
                        {country.currency}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">Language(s)</td>
                    {comparisonCountries.map((country) => (
                      <td key={country.id} className="p-3 text-center">
                        {country.language}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">GDP</td>
                    {comparisonCountries.map((country) => (
                      <td key={country.id} className="p-3 text-center">
                        {formatGDP(country.gdp)}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">GDP per Capita</td>
                    {comparisonCountries.map((country) => (
                      <td key={country.id} className="p-3 text-center">
                        {country.gdp
                          ? `$${Math.round((country.gdp * 1000000000) / country.population).toLocaleString()}`
                          : "N/A"}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">Region</td>
                    {comparisonCountries.map((country) => (
                      <td key={country.id} className="p-3 text-center">
                        {country.region}
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="p-3 font-medium">Timezone</td>
                    {comparisonCountries.map((country) => (
                      <td key={country.id} className="p-3 text-center">
                        {country.timezone}
                      </td>
                    ))}
                  </tr>
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

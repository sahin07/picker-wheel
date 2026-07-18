"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { useWheelManagerStore, MLBWheelData } from "@/stores/wheel-manager-store"

interface MLBComparisonModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function MLBComparisonModal({ isOpen, onClose }: MLBComparisonModalProps) {
  // Subscribe to the current wheel using a Zustand selector
  const wheel = useWheelManagerStore(state => {
    const wheels = state.wheelsByTool[state.currentTool] || [];
    return wheels.find(w => w.id === state.currentWheelId) || null;
  });
  const data = (wheel?.data as MLBWheelData) ?? { comparisonTeams: [] }
  const { comparisonTeams } = data
  const { updateWheelData } = useWheelManagerStore()

  const removeFromComparison = (teamId: string) => {
    if (!wheel) return;
    updateWheelData("mlb-wheel", wheel.id, {
      ...data,
      comparisonTeams: comparisonTeams.filter(t => t.id !== teamId)
    })
  }

  if (comparisonTeams.length === 0) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Team Comparison</DialogTitle>
          </DialogHeader>
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">⚾</div>
            <p className="font-medium">No teams selected for comparison</p>
            <p className="text-sm">Add teams to the comparison list to see their stats side by side</p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Team Comparison ({comparisonTeams.length}/4)</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {comparisonTeams.map((team) => (
            <div key={team.id} className="bg-white border rounded-lg p-4 shadow-sm">
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{team.logo}</span>
                  <div>
                    <div className="font-semibold text-sm">{team.name}</div>
                    <div className="text-xs text-gray-500">{team.city}</div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFromComparison(team.id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* League & Division */}
              <div className="mb-3">
                <div className="flex space-x-1">
                  <Badge variant="outline" className="text-xs">{team.league}</Badge>
                  <Badge variant="secondary" className="text-xs">{team.division}</Badge>
                </div>
              </div>

              {/* Championships */}
              <div className="bg-yellow-50 rounded p-2 mb-3">
                <div className="text-center">
                  <div className="text-xl font-bold text-yellow-600">{team.championships}</div>
                  <div className="text-xs text-gray-600">Championships</div>
                </div>
              </div>

              {/* Founded */}
              <div className="text-xs text-gray-600 mb-2">
                Founded: {team.founded} ({new Date().getFullYear() - team.founded} years)
              </div>

              {/* Venue */}
              <div className="text-xs text-gray-600 mb-2">
                Home: {team.homeVenue}
              </div>

              {/* Manager */}
              <div className="text-xs text-gray-600 mb-3">
                Manager: {team.manager}
              </div>

              {/* Team Colors */}
              <div className="flex space-x-1">
                <div 
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: team.primaryColor }}
                  title={`Primary: ${team.primaryColor}`}
                />
                <div 
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: team.secondaryColor }}
                  title={`Secondary: ${team.secondaryColor}`}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Summary */}
        {comparisonTeams.length > 1 && (
          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Comparison Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">
                  {Math.max(...comparisonTeams.map(t => t.championships))}
                </div>
                <div className="text-xs text-gray-600">Most Championships</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">
                  {Math.min(...comparisonTeams.map(t => t.founded))}
                </div>
                <div className="text-xs text-gray-600">Oldest Team</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600">
                  {comparisonTeams.filter(t => t.league === 'American').length}
                </div>
                <div className="text-xs text-gray-600">American League</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-orange-600">
                  {comparisonTeams.filter(t => t.league === 'National').length}
                </div>
                <div className="text-xs text-gray-600">National League</div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
} 
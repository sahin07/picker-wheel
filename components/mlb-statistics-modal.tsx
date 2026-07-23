"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { type MLBTeam } from "@/data/mlb-teams"

interface MLBStatisticsModalProps {
  isOpen: boolean
  onClose: () => void
  team: MLBTeam | null
}

export default function MLBStatisticsModal({ isOpen, onClose, team }: MLBStatisticsModalProps) {
  if (!team) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span className="text-2xl">{team.logo}</span>
            <span>{team.name} Statistics</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Basic Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">Team Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">City:</span>
                <span className="font-medium">{team.city}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">League:</span>
                <Badge variant="outline">{team.league}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Division:</span>
                <span className="font-medium">{team.division}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Abbreviation:</span>
                <span className="font-medium">{team.abbreviation}</span>
              </div>
            </div>
          </div>

          {/* Championships */}
          <div className="bg-yellow-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">Championships</h3>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">{team.championships}</div>
              <div className="text-sm text-gray-600">
                {team.championships === 1 ? 'World Series Title' : 'World Series Titles'}
              </div>
            </div>
          </div>

          {/* History */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">History</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Founded:</span>
                <span className="font-medium">{team.founded}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Age:</span>
                <span className="font-medium">{new Date().getFullYear() - team.founded} years</span>
              </div>
            </div>
          </div>

          {/* Venue */}
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">Home Venue</h3>
            <div className="text-center">
              <div className="text-lg font-medium text-green-700">{team.homeVenue}</div>
            </div>
          </div>

          {/* Management */}
          <div className="bg-purple-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">Management</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Manager:</span>
                <span className="font-medium">{team.manager}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Owner:</span>
                <span className="font-medium">{team.owner}</span>
              </div>
            </div>
          </div>

          {/* Team Colors */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">Team Colors</h3>
            <div className="flex space-x-2">
              <div 
                className="w-8 h-8 rounded-full border-2 border-gray-300"
                style={{ backgroundColor: team.primaryColor }}
                title={`Primary: ${team.primaryColor}`}
              />
              <div 
                className="w-8 h-8 rounded-full border-2 border-gray-300"
                style={{ backgroundColor: team.secondaryColor }}
                title={`Secondary: ${team.secondaryColor}`}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 
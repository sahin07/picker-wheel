"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Trophy, MapPin, Calendar, Building, User, Crown, Star } from "lucide-react"
import { type MLBTeam } from "@/data/mlb-teams"

interface MLBTeamDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  team: MLBTeam | null
}

export default function MLBTeamDetailsModal({ isOpen, onClose, team }: MLBTeamDetailsModalProps) {
  if (!team) return null

  const getLeagueColor = (league: string) => {
    return league === "American" ? "bg-red-100 text-red-800 border-red-200" : "bg-blue-100 text-blue-800 border-blue-200"
  }

  const getDivisionColor = (division: string) => {
    const colors = {
      "East": "bg-green-100 text-green-800 border-green-200",
      "Central": "bg-purple-100 text-purple-800 border-purple-200", 
      "West": "bg-orange-100 text-orange-800 border-orange-200"
    }
    return colors[division as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  const getChampionshipBadge = (count: number) => {
    if (count === 0) return <Badge variant="outline" className="text-gray-500">No Championships</Badge>
    if (count >= 10) return <Badge className="bg-yellow-500 text-white"><Trophy className="w-3 h-3 mr-1" />{count} Championships</Badge>
    if (count >= 5) return <Badge className="bg-orange-500 text-white"><Trophy className="w-3 h-3 mr-1" />{count} Championships</Badge>
    return <Badge className="bg-blue-500 text-white"><Trophy className="w-3 h-3 mr-1" />{count} Championships</Badge>
  }

  const getTeamAge = (founded: number) => {
    const currentYear = new Date().getFullYear()
    const age = currentYear - founded
    if (age >= 100) return <Badge className="bg-red-500 text-white"><Star className="w-3 h-3 mr-1" />Century Club ({age} years)</Badge>
    if (age >= 50) return <Badge className="bg-purple-500 text-white"><Calendar className="w-3 h-3 mr-1" />Established ({age} years)</Badge>
    return <Badge variant="outline"><Calendar className="w-3 h-3 mr-1" />{age} years old</Badge>
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <span className="text-3xl">{team.logo}</span>
            <div>
              <div className="font-bold">{team.name}</div>
              <div className="text-sm font-normal text-gray-600">{team.abbreviation}</div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Team Identity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5" />
                Team Identity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge className={getLeagueColor(team.league)}>
                  {team.league} League
                </Badge>
                <Badge className={getDivisionColor(team.division)}>
                  {team.division} Division
                </Badge>
                {getChampionshipBadge(team.championships)}
                {getTeamAge(team.founded)}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">City:</span>
                  <span className="font-medium">{team.city}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Venue:</span>
                  <span className="font-medium">{team.homeVenue}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team Colors */}
          <Card>
            <CardHeader>
              <CardTitle>Team Colors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: team.primaryColor }}
                  />
                  <span className="text-sm">Primary: {team.primaryColor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: team.secondaryColor }}
                  />
                  <span className="text-sm">Secondary: {team.secondaryColor}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Leadership */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Leadership
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="text-sm text-gray-600">Manager:</span>
                <div className="font-medium">{team.manager}</div>
              </div>
              <Separator />
              <div>
                <span className="text-sm text-gray-600">Owner:</span>
                <div className="font-medium">{team.owner}</div>
              </div>
            </CardContent>
          </Card>

                     {/* Team Statistics */}
           <Card>
             <CardHeader>
               <CardTitle>Team Statistics</CardTitle>
             </CardHeader>
             <CardContent>
               <div className="grid grid-cols-2 gap-4">
                 <div className="text-center p-3 bg-gray-50 rounded-lg">
                   <div className="text-2xl font-bold text-blue-600">{team.championships}</div>
                   <div className="text-sm text-gray-600">World Series Titles</div>
                 </div>
                 <div className="text-center p-3 bg-gray-50 rounded-lg">
                   <div className="text-2xl font-bold text-green-600">{new Date().getFullYear() - team.founded}</div>
                   <div className="text-sm text-gray-600">Years in MLB</div>
                 </div>
                 <div className="text-center p-3 bg-gray-50 rounded-lg">
                   <div className="text-2xl font-bold text-purple-600">{team.league}</div>
                   <div className="text-sm text-gray-600">League</div>
                 </div>
                 <div className="text-center p-3 bg-gray-50 rounded-lg">
                   <div className="text-2xl font-bold text-orange-600">{team.division}</div>
                   <div className="text-sm text-gray-600">Division</div>
                 </div>
               </div>
             </CardContent>
           </Card>

          {/* Historical Context */}
          <Card>
            <CardHeader>
              <CardTitle>Historical Context</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="text-sm text-gray-600">Founded:</span>
                <div className="font-medium">{team.founded}</div>
              </div>
              <div>
                <span className="text-sm text-gray-600">League History:</span>
                <div className="font-medium">
                  {team.league} League • {team.division} Division
                </div>
              </div>
              {team.championships > 0 && (
                <div>
                  <span className="text-sm text-gray-600">Championship Years:</span>
                  <div className="font-medium text-sm text-gray-600">
                    {team.championships} total championship{team.championships > 1 ? 's' : ''}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
} 
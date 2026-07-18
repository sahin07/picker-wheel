import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { BarChart3 } from "lucide-react"
import { rarityColors, rarityIcons } from "@/lib/rarity-config"
import type { Skin, SpinResult } from "@/types/fortnite-types"

interface StatsTabProps {
  skinStats?: Record<string, number>
  allResults?: SpinResult[]
  getAllSkins?: () => Skin[]
}

export function StatsTab({ 
  skinStats = {}, 
  allResults = [], 
  getAllSkins = () => [] 
}: StatsTabProps) {
  const getCollaborationStats = () => {
    const collabSkins = getAllSkins().filter(
      (skin) =>
        skin.season.includes("Marvel") ||
        skin.season.includes("DC") ||
        skin.season.includes("Star Wars") ||
        skin.season.includes("Anime") ||
        skin.season.includes("Dragon Ball") ||
        skin.season.includes("Collab"),
    )
    return {
      total: collabSkins.length,
      marvel: collabSkins.filter((s) => s.season.includes("Marvel")).length,
      dc: collabSkins.filter((s) => s.season.includes("DC")).length,
      starWars: collabSkins.filter((s) => s.season.includes("Star Wars")).length,
      anime: collabSkins.filter((s) => s.season.includes("Anime") || s.season.includes("Dragon Ball")).length,
      music: collabSkins.filter((s) => s.season.includes("Collab")).length,
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-800">
          <BarChart3 className="w-5 h-5" />
          Collection Stats
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Rarity Distribution */}
        <div>
          <h4 className="font-semibold text-sm mb-3 text-gray-800">Rarity Distribution</h4>
          <div className="space-y-2">
            {Object.entries(skinStats).map(([rarity, count]) => (
              <div key={rarity} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span style={{ color: rarityColors[rarity as keyof typeof rarityColors] }}>
                    {rarityIcons[rarity as keyof typeof rarityIcons]}
                  </span>
                  <span className="text-sm capitalize text-gray-700">{rarity}</span>
                </div>
                <Badge variant="outline" className="text-gray-600">
                  {count}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Collaboration Stats */}
        <div>
          <h4 className="font-semibold text-sm mb-3 text-gray-800">Collaboration Breakdown</h4>
          <div className="space-y-2">
            {(() => {
              const collabStats = getCollaborationStats()
              return (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">🦸 Marvel</span>
                    <Badge variant="outline">{collabStats.marvel}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">🦇 DC Comics</span>
                    <Badge variant="outline">{collabStats.dc}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">⭐ Star Wars</span>
                    <Badge variant="outline">{collabStats.starWars}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">🍥 Anime</span>
                    <Badge variant="outline">{collabStats.anime}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">🎵 Music Artists</span>
                    <Badge variant="outline">{collabStats.music}</Badge>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span className="text-sm text-gray-800">Total Collaborations</span>
                    <Badge className="bg-purple-100 text-purple-800">{collabStats.total}</Badge>
                  </div>
                </>
              )
            })()}
          </div>
        </div>

        {/* Spin History */}
        <div>
          <h4 className="font-semibold text-sm mb-3 text-gray-800">Recent Activity</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Spins</span>
              <Badge variant="outline">{allResults.length}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Unique Skins Hit</span>
              <Badge variant="outline">{new Set(allResults.map((r) => r.skin.id)).size}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Success Rate</span>
              <Badge variant="outline">
                {allResults.length > 0
                  ? Math.round((new Set(allResults.map((r) => r.skin.id)).size / allResults.length) * 100)
                  : 0}
                %
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

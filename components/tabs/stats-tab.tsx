import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BarChart3, TrendingUp, Users, Gamepad2 } from "lucide-react";
import {
  roleColors,
  popularityColors,
  difficultyColors,
} from "@/constants/lol-config";
import type { LoLChampion, SpinResult } from "@/types/lol-types";

interface StatsTabProps {
  championStats: Record<string, number>;
  allResults: SpinResult[];
  getAllChampions: () => LoLChampion[];
}

export function StatsTab({
  championStats,
  allResults,
  getAllChampions,
}: StatsTabProps) {
  const getPopularityStats = () => {
    const allChampions = getAllChampions();
    const popularityCount: Record<string, number> = {};
    allChampions.forEach((champion) => {
      popularityCount[champion.popularity] =
        (popularityCount[champion.popularity] || 0) + 1;
    });
    return popularityCount;
  };

  const getDifficultyStats = () => {
    const allChampions = getAllChampions();
    const difficultyCount: Record<string, number> = {};
    allChampions.forEach((champion) => {
      difficultyCount[champion.difficulty] =
        (difficultyCount[champion.difficulty] || 0) + 1;
    });
    return difficultyCount;
  };

  const getSpecialStats = () => {
    const allChampions = getAllChampions();
    return {
      communityFavorites: allChampions.filter((c) => c.communityFavorite)
        .length,
      proPlayChampions: allChampions.filter((c) => c.proPlayPresence === "high")
        .length,
      sTierChampions: allChampions.filter((c) => c.popularity === "S-tier")
        .length,
      easyChampions: allChampions.filter((c) => c.difficulty === "easy").length,
    };
  };

  return (
    <Card className="bg-white border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-800">
          <BarChart3 className="w-5 h-5" />
          LoL Champion Stats
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Role Distribution */}
        <div>
          <h4 className="font-semibold text-sm mb-3 text-gray-800 flex items-center gap-2">
            <Gamepad2 className="w-4 h-4" />
            Role Distribution
          </h4>
          <div className="space-y-2">
            {Object.entries(championStats).map(([role, count]) => (
              <div key={role} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    style={{
                      color: roleColors[role as keyof typeof roleColors],
                    }}
                  >
                    ●
                  </span>
                  <span className="text-sm capitalize text-gray-600">
                    {role}
                  </span>
                </div>
                <Badge
                  variant="outline"
                  className="text-gray-600 border-gray-200"
                >
                  {count}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Popularity Distribution */}
        <div>
          <h4 className="font-semibold text-sm mb-3 text-gray-800 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Popularity Tiers
          </h4>
          <div className="space-y-2">
            {Object.entries(getPopularityStats())
              .sort(([, a], [, b]) => b - a)
              .map(([popularity, count]) => (
                <div
                  key={popularity}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor:
                          popularityColors[
                            popularity as keyof typeof popularityColors
                          ],
                      }}
                    ></span>
                    <span className="text-sm text-gray-600">{popularity}</span>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-gray-600 border-gray-200"
                  >
                    {count}
                  </Badge>
                </div>
              ))}
          </div>
        </div>

        {/* Difficulty Distribution */}
        <div>
          <h4 className="font-semibold text-sm mb-3 text-gray-800">
            Difficulty Levels
          </h4>
          <div className="space-y-2">
            {Object.entries(getDifficultyStats())
              .sort(([, a], [, b]) => b - a)
              .map(([difficulty, count]) => (
                <div
                  key={difficulty}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor:
                          difficultyColors[
                            difficulty as keyof typeof difficultyColors
                          ],
                      }}
                    ></span>
                    <span className="text-sm text-gray-600">{difficulty}</span>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-gray-600 border-gray-200"
                  >
                    {count}
                  </Badge>
                </div>
              ))}
          </div>
        </div>

        {/* Special Categories */}
        <div>
          <h4 className="font-semibold text-sm mb-3 text-gray-800 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Special Categories
          </h4>
          <div className="space-y-2">
            {(() => {
              const specialStats = getSpecialStats();
              return (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">
                      ❤️ Community Favorites
                    </span>
                    <Badge
                      variant="outline"
                      className="border-pink-400/30 text-pink-300"
                    >
                      {specialStats.communityFavorites}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">
                      👑 Pro Play Champions
                    </span>
                    <Badge
                      variant="outline"
                      className="border-yellow-400/30 text-yellow-300"
                    >
                      {specialStats.proPlayChampions}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">
                      ⚡ S-Tier Meta
                    </span>
                    <Badge
                      variant="outline"
                      className="border-gold-400/30 text-gold-300"
                    >
                      {specialStats.sTierChampions}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">
                      🎮 Beginner Friendly
                    </span>
                    <Badge
                      variant="outline"
                      className="border-green-400/30 text-green-300"
                    >
                      {specialStats.easyChampions}
                    </Badge>
                  </div>
                  <Separator className="bg-gray-200" />
                  <div className="flex justify-between font-medium">
                    <span className="text-sm text-gray-800">
                      Total Champions
                    </span>
                    <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                      {getAllChampions().length}
                    </Badge>
                  </div>
                </>
              );
            })()}
          </div>
        </div>

        {/* Spin History */}
        <div>
          <h4 className="font-semibold text-sm mb-3 text-gray-800">
            Recent Activity
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Total Spins</span>
              <Badge
                variant="outline"
                className="text-gray-600 border-gray-200"
              >
                {allResults.length}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">
                Unique Champions Selected
              </span>
              <Badge
                variant="outline"
                className="text-gray-600 border-gray-200"
              >
                {new Set(allResults.map((r) => r.champion.id)).size}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Selection Rate</span>
              <Badge
                variant="outline"
                className="text-gray-600 border-gray-200"
              >
                {allResults.length > 0
                  ? Math.round(
                      (new Set(allResults.map((r) => r.champion.id)).size /
                        allResults.length) *
                        100
                    )
                  : 0}
                %
              </Badge>
            </div>
            {allResults.length > 0 && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Most Recent</span>
                <Badge
                  variant="outline"
                  className="text-gray-600 border-gray-200"
                >
                  {allResults[allResults.length - 1].champion.name}
                </Badge>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

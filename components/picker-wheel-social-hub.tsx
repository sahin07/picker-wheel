"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { 
  Users, 
  Trophy, 
  Share2, 
  Target, 
  TrendingUp, 
  Heart,
  Calendar,
  Star,
  Copy,
  ExternalLink,
  User,
  Activity,
  Award,
  Palette
} from "lucide-react"
import { 
  SocialProfile, 
  SharedWheel, 
  CommunityChallenge, 
  LeaderboardEntry, 
  SocialActivity, 
  SocialStats,
  MOCK_SOCIAL_PROFILES,
  MOCK_SHARED_WHEELS,
  MOCK_COMMUNITY_CHALLENGES,
  MOCK_LEADERBOARD,
  MOCK_SOCIAL_ACTIVITIES,
  MOCK_SOCIAL_STATS,
  generateShareLink,
  formatNumber,
  getTimeAgo,
  getCategoryIcon,
  getActivityIcon
} from "@/lib/picker-wheel-social"

interface PickerWheelSocialHubProps {
  isVisible: boolean
  onClose: () => void
  currentUser?: SocialProfile
  onShareWheel?: () => void
}

export default function PickerWheelSocialHub({
  isVisible,
  onClose,
  currentUser,
  onShareWheel
}: PickerWheelSocialHubProps) {
  const [activeTab, setActiveTab] = useState("community")
  const [selectedMetric, setSelectedMetric] = useState<'points' | 'spins' | 'achievements' | 'streak'>('points')

  const handleCopyLink = (wheelId: string) => {
    const link = generateShareLink(wheelId)
    navigator.clipboard.writeText(link)
    // You could add a toast notification here
  }

  function CommunityStats() {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{formatNumber(MOCK_SOCIAL_STATS.totalUsers)}</div>
            <div className="text-sm text-gray-600">Total Users</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{formatNumber(MOCK_SOCIAL_STATS.totalSpins)}</div>
            <div className="text-sm text-gray-600">Total Spins</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{MOCK_SOCIAL_STATS.activeToday}</div>
            <div className="text-sm text-gray-600">Active Today</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{MOCK_SOCIAL_STATS.challengesCompleted}</div>
            <div className="text-sm text-gray-600">Challenges</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  function SharedWheelsSection() {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Popular Wheels</h3>
          {onShareWheel && (
            <Button onClick={onShareWheel} size="sm" variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Share My Wheel
            </Button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_SHARED_WHEELS.map((wheel) => (
            <Card key={wheel.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base">{wheel.name}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{wheel.description}</p>
                  </div>
                  <Badge variant="outline" className="ml-2">
                    {getCategoryIcon(wheel.category)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                  <span>by {wheel.creatorName}</span>
                  <span>{getTimeAgo(wheel.createdAt)}</span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      {wheel.spins}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {wheel.likes}
                    </span>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => handleCopyLink(wheel.id)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {wheel.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  function CommunityChallengesSection() {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Active Challenges</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MOCK_COMMUNITY_CHALLENGES.map((challenge) => (
            <Card key={challenge.id} className="border-2 border-blue-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base">{challenge.title}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{challenge.description}</p>
                  </div>
                  <Badge variant="outline" className="ml-2">
                    {challenge.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                  <span>{challenge.participants} participants</span>
                  <span>{challenge.totalSpins} spins</span>
                </div>
                <div className="mb-3">
                  <div className="text-xs text-gray-500 mb-1">Rewards:</div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {challenge.rewards.points} points
                    </Badge>
                    {challenge.rewards.achievements.map((achievement) => (
                      <Badge key={achievement} variant="outline" className="text-xs">
                        {achievement}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button className="w-full" size="sm">
                  <Target className="h-4 w-4 mr-2" />
                  Participate
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  function LeaderboardSection() {
    const filteredLeaderboard = MOCK_LEADERBOARD.filter(entry => entry.metric === selectedMetric)
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Leaderboard</h3>
          <div className="flex gap-2">
            {(['points', 'spins', 'achievements', 'streak'] as const).map((metric) => (
              <Button
                key={metric}
                size="sm"
                variant={selectedMetric === metric ? "default" : "outline"}
                onClick={() => setSelectedMetric(metric)}
              >
                {metric.charAt(0).toUpperCase() + metric.slice(1)}
              </Button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          {filteredLeaderboard.map((entry) => (
            <Card key={entry.userId} className="hover:bg-gray-50 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                      <span className="text-sm font-bold text-blue-600">#{entry.rank}</span>
                    </div>
                    <div>
                      <div className="font-medium">{entry.username}</div>
                      <div className="text-sm text-gray-600">
                        {formatNumber(entry.score)} {selectedMetric}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {entry.change !== undefined && (
                      <Badge 
                        variant={entry.change > 0 ? "default" : entry.change < 0 ? "destructive" : "outline"}
                        className="text-xs"
                      >
                        {entry.change > 0 ? '+' : ''}{entry.change}
                      </Badge>
                    )}
                    <Trophy className="h-4 w-4 text-yellow-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  function SocialFeedSection() {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Recent Activity</h3>
        <div className="space-y-3">
          {MOCK_SOCIAL_ACTIVITIES.map((activity) => (
            <Card key={activity.id} className="hover:bg-gray-50 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                    <span className="text-lg">{getActivityIcon(activity.type)}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{activity.username}</span>
                      <span className="text-sm text-gray-500">{getTimeAgo(activity.timestamp)}</span>
                    </div>
                    <div className="text-sm text-gray-700">{activity.description}</div>
                    {activity.data && (
                      <div className="mt-2">
                        {activity.data.points && (
                          <Badge variant="outline" className="text-xs mr-2">
                            +{activity.data.points} points
                          </Badge>
                        )}
                        {activity.data.achievement && (
                          <Badge variant="outline" className="text-xs">
                            {activity.data.achievement}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  function UserProfilesSection() {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Top Users</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_SOCIAL_PROFILES.map((profile) => (
            <Card key={profile.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{profile.username}</div>
                    <div className="text-sm text-gray-600">Level {profile.level}</div>
                  </div>
                  <Badge variant="outline">#{profile.id}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="font-medium text-blue-600">{formatNumber(profile.totalPoints)}</div>
                    <div className="text-xs text-gray-600">Points</div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="font-medium text-green-600">{profile.totalSpins}</div>
                    <div className="text-xs text-gray-600">Spins</div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>{profile.achievements} achievements</span>
                  <span>{profile.themes} themes</span>
                </div>
                {profile.bio && (
                  <p className="text-sm text-gray-600 mt-2">{profile.bio}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <Dialog open={isVisible} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-6 w-6 text-green-500" />
            Social Hub
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="community">Community</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="community" className="space-y-6 mt-6">
            <CommunityStats />
            <SharedWheelsSection />
            <UserProfilesSection />
          </TabsContent>

          <TabsContent value="challenges" className="space-y-6 mt-6">
            <CommunityChallengesSection />
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-6 mt-6">
            <LeaderboardSection />
          </TabsContent>

          <TabsContent value="activity" className="space-y-6 mt-6">
            <SocialFeedSection />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
} 
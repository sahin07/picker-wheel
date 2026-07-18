"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { 
  History, 
  Play, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Search,
  RotateCcw,
  BarChart3,
  Brain,
  Settings
} from "lucide-react"

export interface SpinRecord {
  id: string
  timestamp: Date
  result: string
  rotation: number
  duration: number
  mode: "yes-no" | "yes-no-maybe"
  activeTab: "manual" | "ai"
  userQuestion?: string
  aiAdvice?: string
  wheelTheme: string
  streak: { type: string; count: number }
  totalSpins: number
  results: { yes: number; no: number; maybe: number }
}

interface SpinHistoryProps {
  spinHistory: SpinRecord[]
  isVisible: boolean
  onClose: () => void
  onReplay: (spin: SpinRecord) => void
  currentMode: "yes-no" | "yes-no-maybe"
  currentActiveTab: "manual" | "ai"
}

export function SpinHistory({ 
  spinHistory, 
  isVisible, 
  onClose, 
  onReplay,
  currentMode,
  currentActiveTab
}: SpinHistoryProps) {
  const [activeTab, setActiveTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "result">("newest")

  // Filter and sort history
  const filteredHistory = spinHistory
    .filter(spin => {
      if (activeTab === "all") return true
      if (activeTab === "manual" && spin.activeTab === "manual") return true
      if (activeTab === "ai" && spin.activeTab === "ai") return true
      if (activeTab === "yes-no" && spin.mode === "yes-no") return true
      if (activeTab === "yes-no-maybe" && spin.mode === "yes-no-maybe") return true
      return false
    })
    .filter(spin => {
      if (!searchTerm) return true
      return (
        spin.result.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (spin.userQuestion && spin.userQuestion.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (spin.aiAdvice && spin.aiAdvice.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return b.timestamp.getTime() - a.timestamp.getTime()
        case "oldest":
          return a.timestamp.getTime() - b.timestamp.getTime()
        case "result":
          return a.result.localeCompare(b.result)
        default:
          return b.timestamp.getTime() - a.timestamp.getTime()
      }
    })

  // Statistics
  const totalSpins = spinHistory.length
  const yesCount = spinHistory.filter(s => s.result === "Yes").length
  const noCount = spinHistory.filter(s => s.result === "No").length
  const maybeCount = spinHistory.filter(s => s.result === "Maybe").length

  const getResultColor = (result: string) => {
    switch (result) {
      case "Yes": return "bg-green-100 text-green-800 border-green-200"
      case "No": return "bg-red-100 text-red-800 border-red-200"
      case "Maybe": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getModeIcon = (activeTab: string) => {
    return activeTab === "ai" ? <Brain className="h-4 w-4" /> : <Settings className="h-4 w-4" />
  }

  const formatDuration = (duration: number) => {
    return `${(duration / 1000).toFixed(1)}s`
  }

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return "Just now"
  }

  return (
    <Dialog open={isVisible} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Spin History & Replay
          </DialogTitle>
          <DialogDescription>
            Review your decision history and replay previous spins
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col h-full gap-4">
          {/* Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Spins</p>
                    <p className="text-2xl font-bold">{totalSpins}</p>
                  </div>
                  <RotateCcw className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Yes</p>
                    <p className="text-2xl font-bold text-green-600">{yesCount}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">No</p>
                    <p className="text-2xl font-bold text-red-600">{noCount}</p>
                  </div>
                  <TrendingDown className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Maybe</p>
                    <p className="text-2xl font-bold text-yellow-600">{maybeCount}</p>
                  </div>
                  <Minus className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search spins..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortBy(sortBy === "newest" ? "oldest" : "newest")}
                className="flex items-center gap-2"
              >
                <Clock className="h-4 w-4" />
                {sortBy === "newest" ? "Newest" : "Oldest"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortBy("result")}
                className="flex items-center gap-2"
              >
                <BarChart3 className="h-4 w-4" />
                By Result
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="manual">Manual</TabsTrigger>
              <TabsTrigger value="ai">AI</TabsTrigger>
              <TabsTrigger value="yes-no">Yes/No</TabsTrigger>
              <TabsTrigger value="yes-no-maybe">Yes/No/Maybe</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-4">
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {filteredHistory.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No spins found</p>
                      <p className="text-sm">Start spinning to build your history!</p>
                    </div>
                  ) : (
                    filteredHistory.map((spin) => (
                      <Card key={spin.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge className={getResultColor(spin.result)}>
                                  {spin.result}
                                </Badge>
                                <Badge variant="outline" className="flex items-center gap-1">
                                  {getModeIcon(spin.activeTab)}
                                  {spin.activeTab === "ai" ? "AI" : "Manual"}
                                </Badge>
                                <Badge variant="outline">
                                  {spin.mode === "yes-no" ? "Yes/No" : "Yes/No/Maybe"}
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                  {formatTimeAgo(spin.timestamp)}
                                </span>
                              </div>
                              
                              {spin.userQuestion && (
                                <p className="text-sm font-medium mb-1">
                                  Q: {spin.userQuestion}
                                </p>
                              )}
                              
                              {spin.aiAdvice && (
                                <p className="text-sm text-muted-foreground mb-2">
                                  AI: {spin.aiAdvice}
                                </p>
                              )}
                              
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span>Spin #{spin.totalSpins}</span>
                                <span>Duration: {formatDuration(spin.duration)}</span>
                                <span>Theme: {spin.wheelTheme}</span>
                                {spin.streak.count > 1 && (
                                  <span>Streak: {spin.streak.count}x {spin.streak.type}</span>
                                )}
                              </div>
                            </div>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onReplay(spin)}
                              className="flex items-center gap-2 ml-4"
                            >
                              <Play className="h-4 w-4" />
                              Replay
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
} 
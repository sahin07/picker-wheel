"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Palette, Lock, Star, Zap, Sparkles, Crown, Rainbow
} from "lucide-react"
import { WheelTheme } from "@/lib/wheel-themes"

interface ThemeSelectorProps {
  themes: WheelTheme[]
  currentTheme: string
  onThemeChange: (themeId: string) => void
  isVisible: boolean
  onClose: () => void
}

export function ThemeSelector({ 
  themes, currentTheme, onThemeChange, isVisible, onClose 
}: ThemeSelectorProps) {
  const [activeTab, setActiveTab] = useState("unlocked")

  if (!isVisible) return null

  const unlockedThemes = themes.filter(theme => theme.unlocked)
  const lockedThemes = themes.filter(theme => !theme.unlocked)

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case "common": return <Star className="h-4 w-4 text-gray-400" />
      case "rare": return <Zap className="h-4 w-4 text-blue-400" />
      case "epic": return <Sparkles className="h-4 w-4 text-purple-400" />
      case "legendary": return <Crown className="h-4 w-4 text-yellow-400" />
      default: return <Star className="h-4 w-4" />
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common": return "bg-gray-100 text-gray-800"
      case "rare": return "bg-blue-100 text-blue-800"
      case "epic": return "bg-purple-100 text-purple-800"
      case "legendary": return "bg-yellow-100 text-yellow-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl max-h-[80vh] overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-6 w-6" />
              Wheel Themes
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              ✕
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="unlocked" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Unlocked ({unlockedThemes.length})
              </TabsTrigger>
              <TabsTrigger value="locked" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Locked ({lockedThemes.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="unlocked" className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto">
                {unlockedThemes.map((theme) => (
                  <ThemeCard
                    key={theme.id}
                    theme={theme}
                    isSelected={currentTheme === theme.id}
                    onSelect={() => onThemeChange(theme.id)}
                    getRarityIcon={getRarityIcon}
                    getRarityColor={getRarityColor}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="locked" className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto">
                {lockedThemes.map((theme) => (
                  <LockedThemeCard
                    key={theme.id}
                    theme={theme}
                    getRarityIcon={getRarityIcon}
                    getRarityColor={getRarityColor}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

function ThemeCard({ 
  theme, isSelected, onSelect, getRarityIcon, getRarityColor 
}: {
  theme: WheelTheme
  isSelected: boolean
  onSelect: () => void
  getRarityIcon: (rarity: string) => React.ReactNode
  getRarityColor: (rarity: string) => string
}) {
  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
        isSelected ? 'ring-2 ring-purple-500 bg-purple-50' : 'hover:shadow-lg'
      }`}
      onClick={onSelect}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            <h3 className="font-semibold text-lg">{theme.name}</h3>
          </div>
          {getRarityIcon(theme.rarity)}
        </div>
        
        <p className="text-sm text-gray-600 mb-3">{theme.description}</p>
        
        <div className="flex gap-1 mb-3">
          <div 
            className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
            style={{ backgroundColor: theme.colors.yes }}
          />
          <div 
            className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
            style={{ backgroundColor: theme.colors.no }}
          />
          <div 
            className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
            style={{ backgroundColor: theme.colors.maybe }}
          />
        </div>

        <div className="flex items-center justify-between">
          <Badge className={getRarityColor(theme.rarity)}>
            {theme.rarity}
          </Badge>
          
          <div className="flex gap-1">
            {theme.effects.particles && <Sparkles className="h-4 w-4 text-blue-500" />}
            {theme.effects.glow && <Zap className="h-4 w-4 text-yellow-500" />}
            {theme.effects.sparkle && <Star className="h-4 w-4 text-purple-500" />}
            {theme.effects.rainbow && <Rainbow className="h-4 w-4 text-pink-500" />}
          </div>
        </div>

        {isSelected && (
          <div className="mt-2 text-center">
            <Badge className="bg-green-100 text-green-800">Selected</Badge>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function LockedThemeCard({ 
  theme, getRarityIcon, getRarityColor 
}: {
  theme: WheelTheme
  getRarityIcon: (rarity: string) => React.ReactNode
  getRarityColor: (rarity: string) => string
}) {
  return (
    <Card className="cursor-not-allowed opacity-60">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-gray-400" />
            <h3 className="font-semibold text-lg text-gray-500">{theme.name}</h3>
          </div>
          {getRarityIcon(theme.rarity)}
        </div>
        
        <p className="text-sm text-gray-500 mb-3">{theme.description}</p>
        
        <div className="flex gap-1 mb-3">
          <div className="w-8 h-8 rounded-full border-2 border-white shadow-sm bg-gray-300" />
          <div className="w-8 h-8 rounded-full border-2 border-white shadow-sm bg-gray-300" />
          <div className="w-8 h-8 rounded-full border-2 border-white shadow-sm bg-gray-300" />
        </div>

        <div className="flex items-center justify-between">
          <Badge className={getRarityColor(theme.rarity)}>
            {theme.rarity}
          </Badge>
          
          <div className="flex gap-1">
            {theme.effects.particles && <Sparkles className="h-4 w-4 text-gray-400" />}
            {theme.effects.glow && <Zap className="h-4 w-4 text-gray-400" />}
            {theme.effects.sparkle && <Star className="h-4 w-4 text-gray-400" />}
            {theme.effects.rainbow && <Rainbow className="h-4 w-4 text-gray-400" />}
          </div>
        </div>

        <div className="mt-3 p-2 bg-gray-100 rounded text-xs text-gray-600">
          <strong>Unlock:</strong> {theme.unlockRequirement}
        </div>
      </CardContent>
    </Card>
  )
} 
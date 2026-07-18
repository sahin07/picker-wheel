"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Palette, Lock, CheckCircle, Star, Crown, Gem } from "lucide-react"
import { WheelTheme } from "@/lib/picker-wheel-themes"

interface PickerWheelThemeSelectorProps {
  themes: WheelTheme[]
  currentTheme: string
  onThemeSelect: (themeId: string) => void
  isVisible: boolean
  onClose: () => void
}

export default function PickerWheelThemeSelector({
  themes,
  currentTheme,
  onThemeSelect,
  isVisible,
  onClose
}: PickerWheelThemeSelectorProps) {
  const [activeTab, setActiveTab] = useState("unlocked")

  const unlockedThemes = themes.filter(t => t.unlocked)
  const lockedThemes = themes.filter(t => !t.unlocked)

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'text-purple-600'
      case 'epic': return 'text-blue-600'
      case 'rare': return 'text-green-600'
      case 'common': return 'text-gray-600'
      default: return 'text-gray-600'
    }
  }

  const getRarityBgColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'bg-purple-50'
      case 'epic': return 'bg-blue-50'
      case 'rare': return 'bg-green-50'
      case 'common': return 'bg-gray-50'
      default: return 'bg-gray-50'
    }
  }

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return <Crown className="h-3 w-3" />
      case 'epic': return <Gem className="h-3 w-3" />
      case 'rare': return <Star className="h-3 w-3" />
      case 'common': return <Palette className="h-3 w-3" />
      default: return <Palette className="h-3 w-3" />
    }
  }

  function ThemeCard({ theme }: { theme: WheelTheme }) {
    const isSelected = currentTheme === theme.id

    return (
      <Card 
        className={`${getRarityBgColor(theme.rarity)} border-2 cursor-pointer transition-all hover:shadow-md ${
          isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'
        }`}
        onClick={() => onThemeSelect(theme.id)}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className={`font-semibold ${getRarityColor(theme.rarity)}`}>
                  {theme.name}
                </h3>
                {isSelected && <CheckCircle className="h-4 w-4 text-blue-600" />}
                <Badge variant="outline" className={getRarityColor(theme.rarity)}>
                  {getRarityIcon(theme.rarity)}
                  <span className="ml-1 capitalize">{theme.rarity}</span>
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-3">{theme.description}</p>
            </div>
          </div>

          {/* Color Preview */}
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-2">Colors:</p>
            <div className="flex gap-1">
              {theme.colors.slice(0, 8).map((color, index) => (
                <div
                  key={index}
                  className="w-6 h-6 rounded-full border border-gray-200"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* Effects Preview */}
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-2">Effects:</p>
            <div className="flex flex-wrap gap-1">
              {theme.effects.particles && <Badge variant="secondary" className="text-xs">Particles</Badge>}
              {theme.effects.glow && <Badge variant="secondary" className="text-xs">Glow</Badge>}
              {theme.effects.sparkle && <Badge variant="secondary" className="text-xs">Sparkle</Badge>}
              {theme.effects.rainbow && <Badge variant="secondary" className="text-xs">Rainbow</Badge>}
              {theme.effects.gradient && <Badge variant="secondary" className="text-xs">Gradient</Badge>}
            </div>
          </div>

          {/* Animations Preview */}
          <div>
            <p className="text-xs text-gray-500 mb-2">Animations:</p>
            <div className="flex flex-wrap gap-1">
              <Badge variant="outline" className="text-xs">
                Speed: {theme.animations.spinSpeed}x
              </Badge>
              {theme.animations.bounce && <Badge variant="outline" className="text-xs">Bounce</Badge>}
              {theme.animations.pulse && <Badge variant="outline" className="text-xs">Pulse</Badge>}
              {theme.animations.shake && <Badge variant="outline" className="text-xs">Shake</Badge>}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  function LockedThemeCard({ theme }: { theme: WheelTheme }) {
    return (
      <Card className={`${getRarityBgColor(theme.rarity)} border-2 border-gray-200 opacity-60`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className={`font-semibold ${getRarityColor(theme.rarity)}`}>
                  {theme.name}
                </h3>
                <Lock className="h-4 w-4 text-gray-400" />
                <Badge variant="outline" className={getRarityColor(theme.rarity)}>
                  {getRarityIcon(theme.rarity)}
                  <span className="ml-1 capitalize">{theme.rarity}</span>
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-3">{theme.description}</p>
            </div>
          </div>

          {/* Color Preview */}
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-2">Colors:</p>
            <div className="flex gap-1">
              {theme.colors.slice(0, 8).map((color, index) => (
                <div
                  key={index}
                  className="w-6 h-6 rounded-full border border-gray-200"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* Unlock Requirements */}
          {theme.unlockRequirement && (
            <div className="mt-3 p-2 bg-gray-50 rounded border border-gray-200">
              <p className="text-xs text-gray-600 font-medium">Unlock Requirements:</p>
              <ul className="text-xs text-gray-500 mt-1">
                {theme.unlockRequirement.totalSpins && (
                  <li>• Complete {theme.unlockRequirement.totalSpins} spins</li>
                )}
                {theme.unlockRequirement.totalPoints && (
                  <li>• Earn {theme.unlockRequirement.totalPoints} achievement points</li>
                )}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Dialog open={isVisible} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="h-6 w-6 text-purple-500" />
            Wheel Themes
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="unlocked" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Unlocked ({unlockedThemes.length})
            </TabsTrigger>
            <TabsTrigger value="locked" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Locked ({lockedThemes.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="unlocked" className="space-y-4 mt-4">
            {unlockedThemes.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <Palette className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No themes unlocked yet!</p>
                <p className="text-sm">Keep spinning the wheel to unlock themes.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {unlockedThemes.map(theme => (
                  <ThemeCard key={theme.id} theme={theme} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="locked" className="space-y-4 mt-4">
            {lockedThemes.length === 0 ? (
              <div className="text-center text-green-500 py-8">
                <Palette className="h-12 w-12 mx-auto mb-4" />
                <p>All themes unlocked!</p>
                <p className="text-sm">Congratulations on unlocking all themes!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lockedThemes.map(theme => (
                  <LockedThemeCard key={theme.id} theme={theme} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
} 
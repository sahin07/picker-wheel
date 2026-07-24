"use client"

import { BarChart3, Gamepad2, Palette, Trophy, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

type Props = {
  totalPoints?: number
  onOpenAchievements?: () => void
  onOpenThemeSelector?: () => void
  onOpenAnalytics?: () => void
  onOpenSocialHub?: () => void
  onOpenGameModes?: () => void
  className?: string
}

const BTN =
  "h-auto min-w-0 px-1.5 py-1.5 text-[10px] sm:px-2 sm:text-xs"

/**
 * Shared under-wheel feature row used across tools (Games, Achievements, Themes, etc.).
 */
export function WheelFeatureActions({
  totalPoints = 0,
  onOpenAchievements,
  onOpenThemeSelector,
  onOpenAnalytics,
  onOpenSocialHub,
  onOpenGameModes,
  className = "",
}: Props) {
  if (
    !onOpenAchievements &&
    !onOpenThemeSelector &&
    !onOpenAnalytics &&
    !onOpenSocialHub &&
    !onOpenGameModes
  ) {
    return null
  }

  return (
    <div className={`mb-2 mt-3 grid w-full max-w-2xl grid-cols-5 gap-1.5 sm:gap-2 ${className}`}>
      {onOpenAchievements && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onOpenAchievements}
          className={`${BTN} border-yellow-300 bg-yellow-50 text-yellow-700 hover:bg-yellow-100`}
        >
          <Trophy className="mr-0.5 h-3 w-3 shrink-0 sm:mr-1" />
          <span className="truncate">Achievements ({totalPoints})</span>
        </Button>
      )}
      {onOpenThemeSelector && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onOpenThemeSelector}
          className={`${BTN} border-purple-300 bg-purple-50 text-purple-700 hover:bg-purple-100`}
        >
          <Palette className="mr-0.5 h-3 w-3 shrink-0 sm:mr-1" />
          <span className="truncate">Themes</span>
        </Button>
      )}
      {onOpenAnalytics && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onOpenAnalytics}
          className={`${BTN} border-green-300 bg-green-50 text-green-700 hover:bg-green-100`}
        >
          <BarChart3 className="mr-0.5 h-3 w-3 shrink-0 sm:mr-1" />
          <span className="truncate">Analytics</span>
        </Button>
      )}
      {onOpenSocialHub && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onOpenSocialHub}
          className={`${BTN} border-orange-300 bg-orange-50 text-orange-700 hover:bg-orange-100`}
        >
          <Users className="mr-0.5 h-3 w-3 shrink-0 sm:mr-1" />
          <span className="truncate">Social</span>
        </Button>
      )}
      {onOpenGameModes && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onOpenGameModes}
          className={`${BTN} border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100`}
        >
          <Gamepad2 className="mr-0.5 h-3 w-3 shrink-0 sm:mr-1" />
          <span className="truncate">Games</span>
        </Button>
      )}
    </div>
  )
}

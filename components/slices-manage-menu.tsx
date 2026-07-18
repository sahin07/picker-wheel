"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ArrowDownAZ,
  FilterX,
  MoreHorizontal,
  Search,
  Shuffle,
  Trash2,
  Wand2,
  CopyMinus,
} from "lucide-react"
import type { WheelSettings } from "@/types/settings"

interface SlicesManageMenuProps {
  settings: WheelSettings
  onUpdateSettings: (settings: Partial<WheelSettings>) => void
  onSortZA: () => void
  onShuffle: () => void
  onEqualize: () => void
  onDeleteBlanks: () => void
  onRemoveDuplicates: () => void
  onClearAll: () => void
  searchQuery: string
  onSearchQueryChange: (query: string) => void
}

export function SlicesManageMenu({
  settings,
  onUpdateSettings,
  onSortZA,
  onShuffle,
  onEqualize,
  onDeleteBlanks,
  onRemoveDuplicates,
  onClearAll,
  searchQuery,
  onSearchQueryChange,
}: SlicesManageMenuProps) {
  const [showSearch, setShowSearch] = useState(false)

  const toggleSearch = () => {
    setShowSearch((prev) => {
      if (prev) onSearchQueryChange("")
      return !prev
    })
  }

  return (
    <div className="flex items-center gap-1">
      {showSearch && (
        <Input
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          placeholder="Search slices..."
          className="h-8 w-36 text-xs"
          autoFocus
        />
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Manage">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuLabel>Manage</DropdownMenuLabel>
          <DropdownMenuItem onClick={onSortZA}>
            <ArrowDownAZ className="w-4 h-4 mr-2" />
            Sort Z-A
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onShuffle}>
            <Shuffle className="w-4 h-4 mr-2" />
            Shuffle
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onEqualize}>
            <Wand2 className="w-4 h-4 mr-2" />
            Equalize
          </DropdownMenuItem>
          <DropdownMenuItem onClick={toggleSearch}>
            <Search className="w-4 h-4 mr-2" />
            Search slices
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuCheckboxItem
            checked={settings.spinBehavior.removeWinnerAfterSpin}
            onCheckedChange={(checked) =>
              onUpdateSettings({
                spinBehavior: { ...settings.spinBehavior, removeWinnerAfterSpin: !!checked },
              })
            }
          >
            Remove winner
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={settings.spinBehavior.mysterySpin}
            onCheckedChange={(checked) =>
              onUpdateSettings({
                spinBehavior: { ...settings.spinBehavior, mysterySpin: !!checked },
              })
            }
          >
            Mystery wheel
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={settings.spinBehavior.mysteryResult}
            onCheckedChange={(checked) =>
              onUpdateSettings({
                spinBehavior: { ...settings.spinBehavior, mysteryResult: !!checked },
              })
            }
          >
            Mystery result
          </DropdownMenuCheckboxItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={onDeleteBlanks}>
            <FilterX className="w-4 h-4 mr-2" />
            Delete blanks
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onRemoveDuplicates}>
            <CopyMinus className="w-4 h-4 mr-2" />
            Remove duplicates
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onClearAll} className="text-red-600 focus:text-red-600">
            <Trash2 className="w-4 h-4 mr-2" />
            Clear all
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

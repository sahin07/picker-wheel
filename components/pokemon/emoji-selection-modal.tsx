"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface EmojiSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (emoji: string) => void
  pokemonName: string
}

const EMOJI_OPTIONS = [
  "🌱", "🔥", "💧", "⚡", "🌪️", "❄️", "🌙", "☀️", "⭐", "🌟",
  "🐉", "🦊", "🐺", "🦁", "🐯", "🦅", "🦉", "🦇", "🐸", "🦎",
  "🐙", "🦑", "🦐", "🦞", "🦀", "🦋", "🐛", "🐜", "🐝", "🐞",
  "🦕", "🦖", "🦈", "🐋", "🐊", "🐍", "🐢", "🐍", "🦎", "🦕",
  "🏆", "🥇", "🥈", "🥉", "💎", "👑", "🪖", "🛡️", "⚔️", "🏹"
]

export function EmojiSelectionModal({ isOpen, onClose, onConfirm, pokemonName }: EmojiSelectionModalProps) {
  const [selectedEmoji, setSelectedEmoji] = useState("🌱")

  const handleConfirm = () => {
    onConfirm(selectedEmoji)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            Choose Emoji for "{pokemonName}"
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-4xl mb-2">{selectedEmoji}</div>
            <p className="text-sm text-gray-600">Preview</p>
          </div>
          
          <div className="grid grid-cols-10 gap-2 max-h-48 overflow-y-auto">
            {EMOJI_OPTIONS.map((emoji, index) => (
              <Button
                key={`emoji-${index}-${emoji}`}
                variant={selectedEmoji === emoji ? "default" : "outline"}
                size="sm"
                className="w-10 h-10 p-0 text-lg"
                onClick={() => setSelectedEmoji(emoji)}
              >
                {emoji}
              </Button>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleConfirm} className="flex-1">
              Add to Wheel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

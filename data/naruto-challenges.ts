import type { NarutoEntry } from "@/types/naruto-types"

const challenge = (id: string, name: string, emoji: string, blurb: string): NarutoEntry => ({
  id,
  name,
  emoji,
  category: ["challenge"],
  preview: `/placeholder.svg?text=${encodeURIComponent(name)}`,
  blurb,
})

export const narutoChallenges: NarutoEntry[] = [
  challenge("draw-character", "Draw the character", "✏️", "Sketch whoever the last spin landed on."),
  challenge("name-5-jutsu", "Name 5 jutsu", "5️⃣", "List five named techniques without repeating."),
  challenge("name-3-akatsuki", "Name 3 Akatsuki members", "💍", "Recall three Akatsuki members and their roles."),
  challenge("explain-ability", "Explain a character's ability", "🗣️", "Describe how their signature jutsu works in plain language."),
  challenge("guess-character", "Guess the character", "❓", "Give three clues; the group guesses who it is."),
  challenge("quote-challenge", "Quote challenge", "💬", "Say a famous line and guess the speaker."),
  challenge("village-trivia", "Village trivia", "🗺️", "Name the Kage and a landmark of a spun village."),
  challenge("cosplay-prompt", "Cosplay prompt", "👘", "Describe a costume, accessory, and pose for the pick."),
]

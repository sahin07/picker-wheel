import type { NarutoEntry } from "@/types/naruto-types"

const village = (id: string, name: string, emoji: string, blurb: string): NarutoEntry => ({
  id,
  name,
  emoji,
  category: ["village"],
  village: name,
  preview: `/placeholder.svg?text=${encodeURIComponent(name)}`,
  blurb,
})

export const narutoVillages: NarutoEntry[] = [
  village("leaf", "Hidden Leaf", "🍃", "Konoha — the Village Hidden in the Leaves."),
  village("sand", "Hidden Sand", "🏜️", "Suna — the Village Hidden in the Sand."),
  village("mist", "Hidden Mist", "🌫️", "Kiri — the Village Hidden in the Mist."),
  village("cloud", "Hidden Cloud", "☁️", "Kumo — the Village Hidden in the Clouds."),
  village("stone", "Hidden Stone", "🪨", "Iwa — the Village Hidden in the Stones."),
  village("rain", "Hidden Rain", "🌧️", "Ame — the Village Hidden in the Rain."),
  village("sound", "Hidden Sound", "🎵", "Oto — Orochimaru’s Village Hidden in the Sound."),
  village("waterfall", "Hidden Waterfall", "💧", "Taki — the Village Hidden in the Waterfall."),
  village("grass", "Hidden Grass", "🌾", "Kusa — the Village Hidden in the Grass."),
  village("star", "Hidden Star", "⭐", "Hoshigakure — the Village Hidden in the Stars."),
  village("hot-springs", "Hidden Hot Springs", "♨️", "Yugakure — the Village Hidden in the Hot Springs."),
  village("snow", "Hidden Snow", "❄️", "Yukigakure — the Village Hidden in the Snow."),
]

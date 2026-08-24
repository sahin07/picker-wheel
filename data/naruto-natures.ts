import type { NarutoEntry } from "@/types/naruto-types"

const item = (
  id: string,
  name: string,
  emoji: string,
  category: NarutoEntry["category"][number],
  blurb: string,
): NarutoEntry => ({
  id,
  name,
  emoji,
  category: [category],
  preview: `/placeholder.svg?text=${encodeURIComponent(name)}`,
  blurb,
})

export const narutoNatures: NarutoEntry[] = [
  item("fire-release", "Fire Release", "🔥", "nature", "Katon — Uchiha specialty."),
  item("wind-release", "Wind Release", "💨", "nature", "Fūton — Naruto’s affinity."),
  item("lightning-release", "Lightning Release", "⚡", "nature", "Raiton — Kakashi and Sasuke."),
  item("earth-release", "Earth Release", "🪨", "nature", "Doton — Iwa specialty."),
  item("water-release", "Water Release", "💧", "nature", "Suiton — Kiri specialty."),
  item("yin-release", "Yin Release", "🌑", "nature", "Spiritual/genjutsu-oriented chakra."),
  item("yang-release", "Yang Release", "☀️", "nature", "Physical/vitality-oriented chakra."),
]

export const narutoKekkei: NarutoEntry[] = [
  item("sharingan-kg", "Sharingan", "🔴", "kekkei", "Uchiha dōjutsu of insight and copy."),
  item("byakugan-kg", "Byakugan", "🤍", "kekkei", "Hyūga near-360° vision."),
  item("rinegan-kg", "Rinnegan", "🟣", "kekkei", "Sage of Six Paths dōjutsu."),
  item("wood-kg", "Wood Release", "🌳", "kekkei", "Hashirama’s Earth + Water mix."),
  item("ice-kg", "Ice Release", "❄️", "kekkei", "Haku’s Water + Wind mix."),
  item("lava-kg", "Lava Release", "🌋", "kekkei", "Mei and Rōshi’s fire-earth mix."),
  item("boil-kg", "Boil Release", "♨️", "kekkei", "Mei’s corrosive mist."),
  item("magnet-kg", "Magnet Release", "🧲", "kekkei", "Gaara / Third Kazekage iron sand."),
  item("storm-kg", "Storm Release", "🌩️", "kekkei", "Cloud Village lightning-water mix."),
  item("none-kg", "No Kekkei Genkai", "—", "kekkei", "Standard chakra natures only."),
]

export const narutoRanks: NarutoEntry[] = [
  item("academy", "Academy Student", "🎓", "rank", "Still in ninja school."),
  item("genin", "Genin", "📗", "rank", "Lowest active shinobi rank."),
  item("chunin", "Chūnin", "📘", "rank", "Tactical mid-rank ninja."),
  item("jonin", "Jōnin", "📙", "rank", "Elite squad leader rank."),
  item("anbu", "ANBU", "🎭", "rank", "Black-ops mask unit."),
  item("kage-rank", "Kage", "👑", "rank", "Village leader."),
  item("sannin", "Sannin", "🐸", "rank", "Legendary three of Konoha."),
]

export const narutoSummons: NarutoEntry[] = [
  item("toads", "Toads of Mount Myōboku", "🐸", "summon", "Naruto and Jiraiya’s contract."),
  item("snakes", "Snakes of Ryūchi Cave", "🐍", "summon", "Orochimaru and Sasuke."),
  item("slugs", "Katsuyu of Shikkotsu Forest", "🐌", "summon", "Tsunade’s healing slug."),
  item("ninken", "Ninken pack", "🐕", "summon", "Kakashi’s tracking dogs."),
  item("crows", "Crows", "🐦‍⬛", "summon", "Itachi’s genjutsu flock."),
  item("hawks", "Hawks", "🦅", "summon", "Sasuke’s aerial summons."),
  item("sand-gourd", "Sand (no animal)", "🏜️", "summon", "Gaara fights with living sand."),
  item("none-summon", "No summoning contract", "🚫", "summon", "This ninja has not signed a contract."),
]
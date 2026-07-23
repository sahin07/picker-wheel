import type { DemonSlayerCategory, DemonSlayerEntry } from "@/types/demon-slayer-types"

const entry = (
  id: string,
  name: string,
  emoji: string,
  category: DemonSlayerCategory[],
  extra: Partial<DemonSlayerEntry> = {},
): DemonSlayerEntry => ({
  id,
  name,
  emoji,
  category,
  preview: `/placeholder.svg?text=${encodeURIComponent(name)}`,
  ...extra,
})

export const demonSlayerCharacters: DemonSlayerEntry[] = [
  // Main cast
  entry("tanjiro-kamado", "Tanjiro Kamado", "🔥", ["main", "corps"], { breathingStyle: "Water / Sun" }),
  entry("nezuko-kamado", "Nezuko Kamado", "🎋", ["main", "demon"]),
  entry("zenitsu-agatsuma", "Zenitsu Agatsuma", "⚡", ["main", "corps"], { breathingStyle: "Thunder" }),
  entry("inosuke-hashibira", "Inosuke Hashibira", "🐗", ["main", "corps"], { breathingStyle: "Beast" }),
  entry("genya-shinazugawa", "Genya Shinazugawa", "🔫", ["main", "corps"]),
  entry("kanao-tsuyuri", "Kanao Tsuyuri", "🌸", ["main", "corps"], { breathingStyle: "Flower" }),
  entry("sabito", "Sabito", "🦊", ["main", "corps"], { breathingStyle: "Water" }),
  entry("makomo", "Makomo", "💧", ["main", "corps"], { breathingStyle: "Water" }),
  entry("hotaru-haganezuka", "Hotaru Haganezuka", "⚒️", ["corps"]),
  entry("sakonji-urokodaki", "Sakonji Urokodaki", "🎭", ["corps"], { breathingStyle: "Water" }),
  entry("kagaya-ubuyashiki", "Kagaya Ubuyashiki", "🪷", ["corps"]),
  entry("amu-ubuyashiki", "Amane Ubuyashiki", "🕊️", ["corps"]),

  // Hashira
  entry("giyu-tomioka", "Giyu Tomioka", "🌊", ["main", "hashira", "corps"], { breathingStyle: "Water", rank: "Water Hashira" }),
  entry("shinobu-kocho", "Shinobu Kocho", "🦋", ["main", "hashira", "corps"], { breathingStyle: "Insect", rank: "Insect Hashira" }),
  entry("kyojuro-rengoku", "Kyojuro Rengoku", "🔥", ["main", "hashira", "corps"], { breathingStyle: "Flame", rank: "Flame Hashira" }),
  entry("tengen-uzui", "Tengen Uzui", "💎", ["main", "hashira", "corps"], { breathingStyle: "Sound", rank: "Sound Hashira" }),
  entry("mitsuri-kanroji", "Mitsuri Kanroji", "💚", ["main", "hashira", "corps"], { breathingStyle: "Love", rank: "Love Hashira" }),
  entry("muichiro-tokito", "Muichiro Tokito", "🌫️", ["main", "hashira", "corps"], { breathingStyle: "Mist", rank: "Mist Hashira" }),
  entry("obanai-iguro", "Obanai Iguro", "🐍", ["main", "hashira", "corps"], { breathingStyle: "Serpent", rank: "Serpent Hashira" }),
  entry("sanemi-shinazugawa", "Sanemi Shinazugawa", "💨", ["main", "hashira", "corps"], { breathingStyle: "Wind", rank: "Wind Hashira" }),
  entry("gyomei-himejima", "Gyomei Himejima", "🪨", ["main", "hashira", "corps"], { breathingStyle: "Stone", rank: "Stone Hashira" }),

  // Upper Rank demons
  entry("kokushibo", "Kokushibo", "🌕", ["demon", "upper_rank"], { rank: "Upper Rank One", breathingStyle: "Moon" }),
  entry("doma", "Doma", "❄️", ["demon", "upper_rank"], { rank: "Upper Rank Two" }),
  entry("akaza", "Akaza", "🥊", ["demon", "upper_rank"], { rank: "Upper Rank Three" }),
  entry("hantengu", "Hantengu", "😨", ["demon", "upper_rank"], { rank: "Upper Rank Four" }),
  entry("gyokko", "Gyokko", "🏺", ["demon", "upper_rank"], { rank: "Upper Rank Five" }),
  entry("daki", "Daki", "👘", ["demon", "upper_rank"], { rank: "Upper Rank Six" }),
  entry("gyutaro", "Gyutaro", "🔪", ["demon", "upper_rank"], { rank: "Upper Rank Six" }),
  entry("kaigaku", "Kaigaku", "⛈️", ["demon", "upper_rank"], { rank: "Upper Rank Six (replacement)" }),
  entry("nakime", "Nakime", "🎸", ["demon", "upper_rank"], { rank: "Upper Rank Four (replacement)" }),

  // Lower Rank + other demons
  entry("enmu", "Enmu", "😴", ["demon", "lower_rank"], { rank: "Lower Rank One" }),
  entry("rokuro", "Rokuro", "🩸", ["demon", "lower_rank"], { rank: "Lower Rank Two" }),
  entry("wakuraba", "Wakuraba", "🍃", ["demon", "lower_rank"], { rank: "Lower Rank Three" }),
  entry("mukago", "Mukago", "🦊", ["demon", "lower_rank"], { rank: "Lower Rank Four" }),
  entry("rui", "Rui", "🧵", ["demon", "lower_rank"], { rank: "Lower Rank Five" }),
  entry("kamanue", "Kamanue", "🐛", ["demon", "lower_rank"], { rank: "Lower Rank Six" }),
  entry("muzan-kibutsuji", "Muzan Kibutsuji", "👁️", ["main", "demon"], { rank: "Demon King" }),
  entry("susamaru", "Susamaru", "🏀", ["demon"]),
  entry("yahaba", "Yahaba", "🏹", ["demon"]),
  entry("temari-demon", "Temple Demon", "🛕", ["demon"]),
  entry("hand-demon", "Hand Demon", "✋", ["demon"]),
  entry("swamp-demon", "Swamp Demon", "🐊", ["demon"]),
  entry("spider-mother", "Spider Mother", "🕷️", ["demon"]),
  entry("spider-father", "Spider Father", "🕸️", ["demon"]),
  entry("spider-sister", "Spider Sister", "🕷️", ["demon"]),
  entry("spider-brother", "Spider Brother", "🪲", ["demon"]),
]

export const demonSlayerBreathingStyles: DemonSlayerEntry[] = [
  entry("breath-water", "Water Breathing", "🌊", ["breathing"]),
  entry("breath-flame", "Flame Breathing", "🔥", ["breathing"]),
  entry("breath-thunder", "Thunder Breathing", "⚡", ["breathing"]),
  entry("breath-beast", "Beast Breathing", "🐗", ["breathing"]),
  entry("breath-insect", "Insect Breathing", "🦋", ["breathing"]),
  entry("breath-sound", "Sound Breathing", "🎵", ["breathing"]),
  entry("breath-love", "Love Breathing", "💗", ["breathing"]),
  entry("breath-mist", "Mist Breathing", "🌫️", ["breathing"]),
  entry("breath-serpent", "Serpent Breathing", "🐍", ["breathing"]),
  entry("breath-wind", "Wind Breathing", "💨", ["breathing"]),
  entry("breath-stone", "Stone Breathing", "🪨", ["breathing"]),
  entry("breath-flower", "Flower Breathing", "🌸", ["breathing"]),
  entry("breath-sun", "Sun Breathing", "☀️", ["breathing"]),
  entry("breath-moon", "Moon Breathing", "🌙", ["breathing"]),
]

export const demonSlayerNichirinColors: DemonSlayerEntry[] = [
  entry("nichirin-black", "Black Nichirin", "⬛", ["nichirin"]),
  entry("nichirin-red", "Red Nichirin", "🟥", ["nichirin"]),
  entry("nichirin-blue", "Blue Nichirin", "🟦", ["nichirin"]),
  entry("nichirin-yellow", "Yellow Nichirin", "🟨", ["nichirin"]),
  entry("nichirin-green", "Green Nichirin", "🟩", ["nichirin"]),
  entry("nichirin-pink", "Pink Nichirin", "💗", ["nichirin"]),
  entry("nichirin-purple", "Purple Nichirin", "🟪", ["nichirin"]),
  entry("nichirin-white", "White Nichirin", "⬜", ["nichirin"]),
  entry("nichirin-gray", "Gray Nichirin", "🩶", ["nichirin"]),
  entry("nichirin-indigo-gray", "Indigo-Gray Nichirin", "🔵", ["nichirin"]),
]

export function getAllDemonSlayerEntries(): DemonSlayerEntry[] {
  return [...demonSlayerCharacters, ...demonSlayerBreathingStyles, ...demonSlayerNichirinColors]
}

export function filterByCategory(category: DemonSlayerCategory): DemonSlayerEntry[] {
  return getAllDemonSlayerEntries().filter((item) => item.category.includes(category))
}

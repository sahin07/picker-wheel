import type { WheelItem } from "@/lib/types"

export type ImagePickerUseCaseId =
  | "animals"
  | "emoji"
  | "logo"
  | "flag"
  | "pokemon"
  | "food"
  | "car-logo"
  | "fruit"
  | "dinosaur"
  | "minecraft"

export type ImagePickerAccent =
  | "sky"
  | "amber"
  | "rose"
  | "lime"
  | "orange"
  | "teal"
  | "indigo"
  | "cyan"
  | "violet"
  | "emerald"

type PresetEntry = {
  text: string
  emoji: string
  color: string
  bg: string
}

/** Inline SVG so presets work offline without external image hosts. */
export function emojiDataUrl(emoji: string, bg: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
  <rect width="128" height="128" rx="28" fill="${bg}"/>
  <text x="64" y="84" font-size="64" text-anchor="middle">${emoji}</text>
</svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

function toWheelItems(entries: PresetEntry[], prefix: string): WheelItem[] {
  return entries.map((entry, index) => ({
    id: `${prefix}-${index + 1}`,
    text: entry.text,
    enabled: true,
    count: 0,
    color: entry.color,
    imageUrl: emojiDataUrl(entry.emoji, entry.bg),
  }))
}

export interface ImagePickerUseCase {
  id: ImagePickerUseCaseId
  label: string
  description: string
  accent: ImagePickerAccent
  toolTitle: string
  toolDescription: string
  items: WheelItem[]
}

const ANIMAL_ENTRIES: PresetEntry[] = [
  { text: "Dog", emoji: "🐶", color: "#F59E0B", bg: "#FEF3C7" },
  { text: "Cat", emoji: "🐱", color: "#F97316", bg: "#FFEDD5" },
  { text: "Lion", emoji: "🦁", color: "#EAB308", bg: "#FEF9C3" },
  { text: "Panda", emoji: "🐼", color: "#64748B", bg: "#F1F5F9" },
  { text: "Fox", emoji: "🦊", color: "#EA580C", bg: "#FFEDD5" },
  { text: "Rabbit", emoji: "🐰", color: "#EC4899", bg: "#FCE7F3" },
  { text: "Owl", emoji: "🦉", color: "#78716C", bg: "#F5F5F4" },
  { text: "Frog", emoji: "🐸", color: "#22C55E", bg: "#DCFCE7" },
]

const EMOJI_ENTRIES: PresetEntry[] = [
  { text: "Happy", emoji: "😀", color: "#FACC15", bg: "#FEF9C3" },
  { text: "Cool", emoji: "😎", color: "#3B82F6", bg: "#DBEAFE" },
  { text: "Love", emoji: "😍", color: "#EC4899", bg: "#FCE7F3" },
  { text: "Think", emoji: "🤔", color: "#8B5CF6", bg: "#EDE9FE" },
  { text: "Party", emoji: "🥳", color: "#F97316", bg: "#FFEDD5" },
  { text: "Fire", emoji: "🔥", color: "#EF4444", bg: "#FEE2E2" },
  { text: "Star", emoji: "⭐", color: "#EAB308", bg: "#FEF9C3" },
  { text: "Rocket", emoji: "🚀", color: "#6366F1", bg: "#E0E7FF" },
]

const LOGO_ENTRIES: PresetEntry[] = [
  { text: "Alpha", emoji: "🅰️", color: "#EF4444", bg: "#FEE2E2" },
  { text: "Beta", emoji: "🅱️", color: "#3B82F6", bg: "#DBEAFE" },
  { text: "Nova", emoji: "✳️", color: "#10B981", bg: "#D1FAE5" },
  { text: "Pulse", emoji: "💠", color: "#06B6D4", bg: "#CFFAFE" },
  { text: "Orbit", emoji: "🌐", color: "#6366F1", bg: "#E0E7FF" },
  { text: "Spark", emoji: "⚡", color: "#F59E0B", bg: "#FEF3C7" },
]

const FLAG_ENTRIES: PresetEntry[] = [
  { text: "USA", emoji: "🇺🇸", color: "#2563EB", bg: "#DBEAFE" },
  { text: "Japan", emoji: "🇯🇵", color: "#DC2626", bg: "#FEE2E2" },
  { text: "Brazil", emoji: "🇧🇷", color: "#16A34A", bg: "#DCFCE7" },
  { text: "India", emoji: "🇮🇳", color: "#EA580C", bg: "#FFEDD5" },
  { text: "France", emoji: "🇫🇷", color: "#1D4ED8", bg: "#DBEAFE" },
  { text: "Canada", emoji: "🇨🇦", color: "#DC2626", bg: "#FEE2E2" },
  { text: "Germany", emoji: "🇩🇪", color: "#CA8A04", bg: "#FEF9C3" },
  { text: "Australia", emoji: "🇦🇺", color: "#0284C7", bg: "#E0F2FE" },
]

const POKEMON_ENTRIES: PresetEntry[] = [
  { text: "Pikachu", emoji: "⚡", color: "#FACC15", bg: "#FEF9C3" },
  { text: "Charmander", emoji: "🔥", color: "#F97316", bg: "#FFEDD5" },
  { text: "Squirtle", emoji: "💧", color: "#0EA5E9", bg: "#E0F2FE" },
  { text: "Bulbasaur", emoji: "🌿", color: "#22C55E", bg: "#DCFCE7" },
  { text: "Eevee", emoji: "🦊", color: "#D97706", bg: "#FEF3C7" },
  { text: "Jigglypuff", emoji: "🎵", color: "#EC4899", bg: "#FCE7F3" },
  { text: "Snorlax", emoji: "😴", color: "#64748B", bg: "#F1F5F9" },
  { text: "Gengar", emoji: "👻", color: "#7C3AED", bg: "#EDE9FE" },
]

const FOOD_ENTRIES: PresetEntry[] = [
  { text: "Pizza", emoji: "🍕", color: "#EF4444", bg: "#FEE2E2" },
  { text: "Burger", emoji: "🍔", color: "#F59E0B", bg: "#FEF3C7" },
  { text: "Sushi", emoji: "🍣", color: "#F43F5E", bg: "#FFE4E6" },
  { text: "Taco", emoji: "🌮", color: "#EAB308", bg: "#FEF9C3" },
  { text: "Pasta", emoji: "🍝", color: "#F97316", bg: "#FFEDD5" },
  { text: "Salad", emoji: "🥗", color: "#22C55E", bg: "#DCFCE7" },
  { text: "Ice Cream", emoji: "🍦", color: "#EC4899", bg: "#FCE7F3" },
  { text: "Ramen", emoji: "🍜", color: "#EA580C", bg: "#FFEDD5" },
]

const CAR_LOGO_ENTRIES: PresetEntry[] = [
  { text: "Speed", emoji: "🏎️", color: "#EF4444", bg: "#FEE2E2" },
  { text: "Cruise", emoji: "🚗", color: "#3B82F6", bg: "#DBEAFE" },
  { text: "Trail", emoji: "🚙", color: "#16A34A", bg: "#DCFCE7" },
  { text: "Volt", emoji: "🔋", color: "#06B6D4", bg: "#CFFAFE" },
  { text: "Classic", emoji: "🚘", color: "#64748B", bg: "#F1F5F9" },
  { text: "Rally", emoji: "🏁", color: "#111827", bg: "#E5E7EB" },
]

const FRUIT_ENTRIES: PresetEntry[] = [
  { text: "Apple", emoji: "🍎", color: "#EF4444", bg: "#FEE2E2" },
  { text: "Banana", emoji: "🍌", color: "#EAB308", bg: "#FEF9C3" },
  { text: "Orange", emoji: "🍊", color: "#F97316", bg: "#FFEDD5" },
  { text: "Grape", emoji: "🍇", color: "#8B5CF6", bg: "#EDE9FE" },
  { text: "Strawberry", emoji: "🍓", color: "#F43F5E", bg: "#FFE4E6" },
  { text: "Watermelon", emoji: "🍉", color: "#22C55E", bg: "#DCFCE7" },
  { text: "Pineapple", emoji: "🍍", color: "#CA8A04", bg: "#FEF9C3" },
  { text: "Cherry", emoji: "🍒", color: "#DC2626", bg: "#FEE2E2" },
]

const DINOSAUR_ENTRIES: PresetEntry[] = [
  { text: "T-Rex", emoji: "🦖", color: "#16A34A", bg: "#DCFCE7" },
  { text: "Sauropod", emoji: "🦕", color: "#0D9488", bg: "#CCFBF1" },
  { text: "Egg", emoji: "🥚", color: "#F59E0B", bg: "#FEF3C7" },
  { text: "Fossil", emoji: "🦴", color: "#A8A29E", bg: "#F5F5F4" },
  { text: "Volcano", emoji: "🌋", color: "#EF4444", bg: "#FEE2E2" },
  { text: "Leaf", emoji: "🍃", color: "#22C55E", bg: "#DCFCE7" },
]

const MINECRAFT_ENTRIES: PresetEntry[] = [
  { text: "Creeper", emoji: "🟩", color: "#22C55E", bg: "#DCFCE7" },
  { text: "Zombie", emoji: "🧟", color: "#65A30D", bg: "#ECFCCB" },
  { text: "Skeleton", emoji: "💀", color: "#E5E7EB", bg: "#F8FAFC" },
  { text: "Enderman", emoji: "🟪", color: "#7C3AED", bg: "#EDE9FE" },
  { text: "Spider", emoji: "🕷️", color: "#57534E", bg: "#F5F5F4" },
  { text: "Steve", emoji: "⛏️", color: "#0EA5E9", bg: "#E0F2FE" },
  { text: "Pig", emoji: "🐷", color: "#FB7185", bg: "#FFE4E6" },
  { text: "Cow", emoji: "🐮", color: "#78716C", bg: "#F5F5F4" },
]

export const IMAGE_PICKER_USE_CASES: ImagePickerUseCase[] = [
  {
    id: "animals",
    label: "Animal Image Wheel",
    description: "Spin animal pictures for kids, teachers, and recognition games.",
    accent: "amber",
    toolTitle: "Animal Image Wheel",
    toolDescription: "Spin animal pictures for a fair visual pick",
    items: toWheelItems(ANIMAL_ENTRIES, "animal"),
  },
  {
    id: "emoji",
    label: "Emoji Wheel",
    description: "Spin emoji faces and icons for chat games and icebreakers.",
    accent: "rose",
    toolTitle: "Emoji Wheel",
    toolDescription: "Spin emojis for games and icebreakers",
    items: toWheelItems(EMOJI_ENTRIES, "emoji"),
  },
  {
    id: "logo",
    label: "Logo Wheel",
    description: "Spin brand-style marks for quizzes and marketing activities.",
    accent: "indigo",
    toolTitle: "Logo Wheel",
    toolDescription: "Spin logo-style marks for quizzes",
    items: toWheelItems(LOGO_ENTRIES, "logo"),
  },
  {
    id: "flag",
    label: "Flag Wheel",
    description: "Spin country flags for geography lessons and travel quizzes.",
    accent: "sky",
    toolTitle: "Flag Wheel",
    toolDescription: "Spin country flags for geography quizzes",
    items: toWheelItems(FLAG_ENTRIES, "flag"),
  },
  {
    id: "pokemon",
    label: "Pokémon Image Wheel",
    description: "Spin Pokémon-inspired picks for gaming parties and fair drafts.",
    accent: "violet",
    toolTitle: "Pokémon Image Wheel",
    toolDescription: "Spin Pokémon-inspired characters for a fair pick",
    items: toWheelItems(POKEMON_ENTRIES, "pokemon"),
  },
  {
    id: "food",
    label: "Food Image Wheel",
    description: "Spin food photos when you cannot decide what to eat.",
    accent: "orange",
    toolTitle: "Food Image Wheel",
    toolDescription: "Spin food options for meal decisions",
    items: toWheelItems(FOOD_ENTRIES, "food"),
  },
  {
    id: "car-logo",
    label: "Car Logo Wheel",
    description: "Spin car-style marks for auto enthusiasts and trivia nights.",
    accent: "cyan",
    toolTitle: "Car Logo Wheel",
    toolDescription: "Spin car-style marks for trivia and drafts",
    items: toWheelItems(CAR_LOGO_ENTRIES, "car"),
  },
  {
    id: "fruit",
    label: "Fruit Image Wheel",
    description: "Spin fruit pictures for early education and snack choices.",
    accent: "lime",
    toolTitle: "Fruit Image Wheel",
    toolDescription: "Spin fruit pictures for learning and snacks",
    items: toWheelItems(FRUIT_ENTRIES, "fruit"),
  },
  {
    id: "dinosaur",
    label: "Dinosaur Wheel",
    description: "Spin dinosaur images for preschool themes and museum games.",
    accent: "teal",
    toolTitle: "Dinosaur Wheel",
    toolDescription: "Spin dinosaur images for kids activities",
    items: toWheelItems(DINOSAUR_ENTRIES, "dino"),
  },
  {
    id: "minecraft",
    label: "Minecraft Mob Wheel",
    description: "Spin Minecraft-style mobs for challenges and stream games.",
    accent: "emerald",
    toolTitle: "Minecraft Mob Wheel",
    toolDescription: "Spin Minecraft-style mobs for challenges",
    items: toWheelItems(MINECRAFT_ENTRIES, "mc"),
  },
]

export function getImagePickerUseCase(
  id: ImagePickerUseCaseId | string | null | undefined,
): ImagePickerUseCase | undefined {
  if (!id) return undefined
  return IMAGE_PICKER_USE_CASES.find((useCase) => useCase.id === id)
}

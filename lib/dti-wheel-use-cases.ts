import { DTI_WHEEL_PATH } from "@/lib/dti-wheel-seo"
import { useWheelManagerStore, type FortuneWheelEntry } from "@/stores/wheel-manager-store"

export type DtiWheelUseCaseId =
  | "outfit-themes"
  | "theme"
  | "color"
  | "aesthetic"
  | "style"
  | "challenge"
  | "hair"
  | "accessory"
  | "season"
  | "dress-to-impress"
  | "dress-to-impress-outfit"
  | "random-generator"

export type DtiWheelUseCaseAccent =
  | "amber"
  | "blue"
  | "cyan"
  | "emerald"
  | "orange"
  | "pink"
  | "rose"
  | "violet"

export type DtiWheelUseCaseConfig = {
  entries: FortuneWheelEntry[]
  templateParam: string
}

export type DtiWheelUseCase = {
  id: DtiWheelUseCaseId
  label: string
  description: string
  accent: DtiWheelUseCaseAccent
  config: DtiWheelUseCaseConfig
}

const COLORS = [
  "#db2777",
  "#7c3aed",
  "#2563eb",
  "#0891b2",
  "#16a34a",
  "#ca8a04",
  "#ea580c",
  "#e11d48",
] as const

/** Pillar default list — exact ready-made themes from the brief */
export const DTI_PILLAR_THEMES = [
  "Y2K",
  "Coquette",
  "Goth",
  "Cottagecore",
  "Fairy",
  "Royal",
  "Celebrity",
  "School",
  "Summer",
  "Winter",
  "Pink Only",
  "Black & White",
  "Fantasy",
  "Villain",
  "Angel",
  "Mermaid",
  "Princess",
  "Casual",
  "Formal",
  "Streetwear",
] as const

function entries(prefix: string, names: readonly string[]): FortuneWheelEntry[] {
  return names.map((name, index) => ({
    id: `${prefix}-${index + 1}`,
    name,
    color: COLORS[index % COLORS.length],
    enabled: true,
  }))
}

export const DTI_WHEEL_USE_CASES: DtiWheelUseCase[] = [
  {
    id: "outfit-themes",
    label: "Outfit Theme Wheel",
    description: "Twenty ready-made Dress to Impress themes for any round.",
    accent: "pink",
    config: {
      templateParam: "outfit-themes",
      entries: entries("outfit-themes", DTI_PILLAR_THEMES),
    },
  },
  {
    id: "theme",
    label: "DTI Theme Wheel",
    description: "Spin classic DTI outfit themes for every lobby.",
    accent: "violet",
    config: {
      templateParam: "theme",
      entries: entries("theme", [
        "Y2K",
        "Coquette",
        "Goth",
        "Cottagecore",
        "Fairy",
        "Royal",
        "Celebrity",
        "School",
        "Fantasy",
        "Villain",
        "Angel",
        "Mermaid",
        "Princess",
        "Streetwear",
        "Formal",
        "Casual",
      ]),
    },
  },
  {
    id: "color",
    label: "DTI Color Challenge",
    description: "Color locks and palette challenges for creative fits.",
    accent: "rose",
    config: {
      templateParam: "color",
      entries: entries("color", [
        "Pink Only",
        "Black & White",
        "All Red",
        "All Blue",
        "Pastel Rainbow",
        "Neon Glow",
        "Gold & White",
        "Purple Mood",
        "Earth Tones",
        "Monochrome",
        "Complementary Colors",
        "Summer Brights",
        "Winter Cool Tones",
        "No Black Allowed",
        "One Accent Color",
        "Metallic Only",
      ]),
    },
  },
  {
    id: "aesthetic",
    label: "DTI Aesthetic Wheel",
    description: "Aesthetic vibes for fashion-forward Dress to Impress rounds.",
    accent: "pink",
    config: {
      templateParam: "aesthetic",
      entries: entries("aesthetic", [
        "Y2K",
        "Coquette",
        "Goth",
        "Cottagecore",
        "Fairy",
        "Dark Academia",
        "Clean Girl",
        "Soft Girl",
        "E-Girl",
        "Grunge",
        "Old Money",
        "Barbiecore",
        "Vampire",
        "Angelcore",
        "Kawaii",
        "Streetwear Aesthetic",
      ]),
    },
  },
  {
    id: "style",
    label: "DTI Style Wheel",
    description: "Style categories from casual to formal runway energy.",
    accent: "blue",
    config: {
      templateParam: "style",
      entries: entries("style", [
        "Casual",
        "Formal",
        "Streetwear",
        "Business Chic",
        "Party Glam",
        "Sporty",
        "Boho",
        "Preppy",
        "Minimalist",
        "Maximalist",
        "Vintage",
        "Runway Avant-Garde",
        "Date Night",
        "Concert Fit",
        "Red Carpet",
        "Everyday Soft",
      ]),
    },
  },
  {
    id: "challenge",
    label: "DTI Challenge Wheel",
    description: "Fashion challenge prompts for streams and friend groups.",
    accent: "orange",
    config: {
      templateParam: "challenge",
      entries: entries("challenge", [
        "No Repeats",
        "One Pattern Only",
        "Hats Required",
        "No Dresses",
        "Only Skirts",
        "Layer Everything",
        "Mismatch Challenge",
        "Budget Look Energy",
        "VIP Lobby Flex",
        "Under 60 Seconds",
        "Theme Swap Mid-Round",
        "Accessory Overload",
        "Hair First Then Outfit",
        "Friend Picks Your Shoes",
        "Opposite of Your Style",
        "Steal the Theme Literally",
      ]),
    },
  },
  {
    id: "hair",
    label: "DTI Hair Challenge",
    description: "Hair styles and color rules for complete DTI looks.",
    accent: "amber",
    config: {
      templateParam: "hair",
      entries: entries("hair", [
        "Long Waves",
        "Short Bob",
        "Space Buns",
        "Ponytail",
        "Braids",
        "Afro Volume",
        "Straight Sleek",
        "Curly Crown",
        "Half-Up Half-Down",
        "Neon Hair Color",
        "Black Hair Only",
        "Blonde Moment",
        "Pastel Hair",
        "Updo Formal",
        "Messy Bun",
        "Twin Tails",
      ]),
    },
  },
  {
    id: "accessory",
    label: "DTI Accessory Wheel",
    description: "Bags, jewelry, and statement pieces for advanced players.",
    accent: "cyan",
    config: {
      templateParam: "accessory",
      entries: entries("accessory", [
        "Statement Earrings",
        "Layered Necklaces",
        "Choker",
        "Sunglasses",
        "Beret",
        "Bucket Hat",
        "Crossbody Bag",
        "Mini Handbag",
        "Gloves",
        "Belt Focus",
        "Boots Focus",
        "Heels Required",
        "Wings",
        "Halo",
        "Crown",
        "No Accessories Allowed",
      ]),
    },
  },
  {
    id: "season",
    label: "DTI Season Wheel",
    description: "Seasonal and holiday outfit inspiration for DTI.",
    accent: "emerald",
    config: {
      templateParam: "season",
      entries: entries("season", [
        "Summer",
        "Winter",
        "Spring Bloom",
        "Autumn Layers",
        "Halloween Spooky",
        "Valentine Soft",
        "Holiday Glam",
        "New Year Sparkle",
        "Beach Day",
        "Ski Lodge",
        "Festival Season",
        "Back to School",
        "Rainy Day",
        "Sunny Picnic",
        "Snow Queen",
        "Tropical Vacation",
      ]),
    },
  },
  {
    id: "dress-to-impress",
    label: "Dress to Impress Wheel",
    description: "A Dress to Impress spinner packed with popular themes.",
    accent: "violet",
    config: {
      templateParam: "dress-to-impress",
      entries: entries("dress-to-impress", [
        "Y2K",
        "Coquette",
        "Goth",
        "Celebrity",
        "School",
        "Fantasy",
        "Mermaid",
        "Princess",
        "Streetwear",
        "Formal",
        "Villain",
        "Angel",
        "Summer",
        "Winter",
        "Pink Only",
        "Black & White",
      ]),
    },
  },
  {
    id: "dress-to-impress-outfit",
    label: "Dress to Impress Outfit Picker",
    description: "Random outfit ideas tailored for Roblox Dress to Impress.",
    accent: "rose",
    config: {
      templateParam: "dress-to-impress-outfit",
      entries: entries("dti-outfit", [
        "Royal Ball",
        "Coffee Date",
        "Met Gala",
        "Office Siren",
        "Fairy Picnic",
        "Villain Arc",
        "Pop Star",
        "Museum Night",
        "Sports Banquet",
        "Masquerade",
        "Farmers Market",
        "Airport Fit",
        "Movie Premiere",
        "Sleepover Soft",
        "Cyber Future",
        "Cottage Weekend",
      ]),
    },
  },
  {
    id: "random-generator",
    label: "Random DTI Outfit Generator",
    description: "Generate a random DTI outfit direction in one spin.",
    accent: "blue",
    config: {
      templateParam: "random-generator",
      entries: entries("random-gen", [
        "Y2K Remix",
        "Coquette Classic",
        "Goth Glam",
        "Cottagecore Soft",
        "Fairy Garden",
        "Royal Court",
        "Celebrity Red Carpet",
        "School Uniform Twist",
        "Summer Festival",
        "Winter Formal",
        "Pink Monochrome",
        "Noir Black & White",
        "Fantasy Armor Soft",
        "Villain Monologue",
        "Angel Light",
        "Mermaid Tide",
        "Princess Tea",
        "Casual Errands",
        "Black-Tie Formal",
        "Streetwear Flex",
      ]),
    },
  },
]

export function getDtiWheelUseCase(id: DtiWheelUseCaseId): DtiWheelUseCase | undefined {
  return DTI_WHEEL_USE_CASES.find((useCase) => useCase.id === id)
}

export function dtiWheelUseCaseFromTemplate(
  template: string | null,
): DtiWheelUseCaseId | null {
  const value = (template ?? "").toLowerCase().trim()
  if (!value) return null
  const direct = DTI_WHEEL_USE_CASES.find(
    (useCase) => useCase.id === value || useCase.config.templateParam === value,
  )
  return direct?.id ?? null
}

export function applyDtiWheelUseCase(id: DtiWheelUseCaseId): boolean {
  const useCase = getDtiWheelUseCase(id)
  if (!useCase) return false

  const store = useWheelManagerStore.getState()
  if (store.currentTool !== "dti-wheel") {
    store.setCurrentTool("dti-wheel")
  }

  let wheel = store.getCurrentWheel()
  if (!wheel) {
    store.createNewWheel("dti-wheel", "My DTI Outfit Wheel")
    wheel = store.getCurrentWheel()
  }
  if (!wheel) return false

  store.updateWheelData("dti-wheel", wheel.id, {
    ...(wheel.data as object),
    entries: useCase.config.entries.map((entry) => ({ ...entry })),
    viewMode: "wheel",
  })

  if (
    typeof window !== "undefined" &&
    window.location.pathname === DTI_WHEEL_PATH
  ) {
    const url = new URL(window.location.href)
    url.searchParams.set("template", useCase.config.templateParam)
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`)
  }

  return true
}

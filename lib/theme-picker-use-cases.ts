import { THEME_PICKER_PATH } from "@/lib/theme-picker-seo"
import { useWheelManagerStore, type FortuneWheelEntry } from "@/stores/wheel-manager-store"

export type ThemePickerUseCaseId =
  | "general"
  | "party"
  | "drawing"
  | "writing"
  | "classroom"
  | "halloween"
  | "christmas"
  | "costume"
  | "youtube"
  | "tiktok"
  | "photography"

export type ThemePickerUseCaseAccent =
  | "amber"
  | "blue"
  | "cyan"
  | "emerald"
  | "orange"
  | "pink"
  | "rose"
  | "teal"
  | "violet"

export type ThemePickerUseCaseConfig = {
  entries: FortuneWheelEntry[]
  templateParam: string
}

export type ThemePickerUseCase = {
  id: ThemePickerUseCaseId
  label: string
  description: string
  accent: ThemePickerUseCaseAccent
  config: ThemePickerUseCaseConfig
}

const COLORS = [
  "#0d9488",
  "#2563eb",
  "#7c3aed",
  "#db2777",
  "#ea580c",
  "#ca8a04",
  "#16a34a",
  "#e11d48",
] as const

function entries(prefix: string, names: readonly string[]): FortuneWheelEntry[] {
  return names.map((name, index) => ({
    id: `${prefix}-${index + 1}`,
    name,
    color: COLORS[index % COLORS.length],
    enabled: true,
  }))
}

/** Pillar default mix — broad creative themes */
export const THEME_PICKER_GENERAL_THEMES = [
  "Retro",
  "Beach",
  "Superhero",
  "Movie Night",
  "Fantasy",
  "Nature",
  "Sci-Fi",
  "Food",
  "Mystery",
  "Adventure",
  "Comedy",
  "Romance",
  "Sports",
  "Travel",
  "Music",
  "Animals",
] as const

export const THEME_PICKER_PARTY_THEMES = [
  "Retro Disco",
  "Beach Luau",
  "Superhero Night",
  "Movie Marathon",
  "Tropical Escape",
  "Masquerade",
  "Decades Party",
  "Costume Free-for-All",
  "Game Night",
  "Glow Party",
  "Formal Black Tie",
  "Pajama Party",
] as const

export const THEME_PICKER_DRAWING_THEMES = [
  "Fantasy Creature",
  "Nature Landscape",
  "Urban Sketch",
  "Animals",
  "Sci-Fi Vehicle",
  "Food Still Life",
  "Architecture",
  "Portrait Study",
  "Underwater World",
  "Mythical Place",
  "Everyday Object",
  "Abstract Shapes",
] as const

export const THEME_PICKER_WRITING_THEMES = [
  "Mystery",
  "Adventure",
  "Romance",
  "Sci-Fi",
  "Fantasy",
  "Horror Short",
  "Slice of Life",
  "Time Travel",
  "Found Family",
  "Heist Story",
  "Coming of Age",
  "Alternate History",
] as const

export const THEME_PICKER_CLASSROOM_THEMES = [
  "Would You Rather",
  "Debate Topic",
  "Story Starter",
  "Science Mystery",
  "History Hot Seat",
  "Creative Writing",
  "Group Project Idea",
  "Icebreaker Question",
  "Show and Tell Angle",
  "Research Prompt",
  "Math in Real Life",
  "Kindness Challenge",
] as const

export const THEME_PICKER_HALLOWEEN_THEMES = [
  "Haunted House",
  "Vampire Ball",
  "Witch Academy",
  "Monster Mash",
  "Pumpkin Patch",
  "Spooky Story",
  "Costume Contest",
  "Zombie Night",
  "Ghost Stories",
  "Candy Chaos",
  "Midnight Mystery",
  "Creepy Carnival",
] as const

export const THEME_PICKER_CHRISTMAS_THEMES = [
  "Cozy Cabin",
  "Ugly Sweater Party",
  "Winter Wonderland",
  "Classic Red & Green",
  "Secret Santa Night",
  "Gingerbread Bake-Off",
  "Movie Marathon",
  "Hot Cocoa Social",
  "Office Holiday Bash",
  "Family Game Night",
  "Christmas Market",
  "New Year Countdown",
] as const

export const THEME_PICKER_COSTUME_THEMES = [
  "Superhero",
  "Movie Character",
  "Historical Figure",
  "Animal Costume",
  "Fantasy Creature",
  "Decade Throwback",
  "Celebrity Lookalike",
  "Book Character",
  "Sci-Fi Alien",
  "Fairytale",
  "Sports Star",
  "DIY Mystery",
] as const

export const THEME_PICKER_YOUTUBE_THEMES = [
  "Day in My Life",
  "Challenge Video",
  "How-To Tutorial",
  "Reaction Style",
  "Storytime",
  "Product Review",
  "Collab Idea",
  "Q&A Episode",
  "Behind the Scenes",
  "Ranking Video",
  "Travel Vlog",
  "Series Premiere",
] as const

export const THEME_PICKER_TIKTOK_THEMES = [
  "Trend Remix",
  "Transition Challenge",
  "Duet Prompt",
  "Storytime Clip",
  "Before & After",
  "GRWM Style",
  "Comedy Skit",
  "Educational Explainer",
  "Aesthetic Edit",
  "Day Recap",
  "POV Scenario",
  "Sound Challenge",
] as const

export const THEME_PICKER_PHOTOGRAPHY_THEMES = [
  "Golden Hour Portraits",
  "Street Photography",
  "Food Flat Lay",
  "Nature Macro",
  "Architecture Lines",
  "Black & White Mood",
  "Product Showcase",
  "Candid Moments",
  "Travel Landmark",
  "Pet Portrait",
  "Night Lights",
  "Minimal Still Life",
] as const

export const THEME_PICKER_USE_CASES: ThemePickerUseCase[] = [
  {
    id: "general",
    label: "Theme Picker Mix",
    description: "A balanced starter list for parties, creativity, and challenges.",
    accent: "teal",
    config: {
      templateParam: "general",
      entries: entries("general", THEME_PICKER_GENERAL_THEMES),
    },
  },
  {
    id: "party",
    label: "Party Themes",
    description: "Event vibes for birthdays, costumes, and celebrations.",
    accent: "pink",
    config: {
      templateParam: "party",
      entries: entries("party", THEME_PICKER_PARTY_THEMES),
    },
  },
  {
    id: "drawing",
    label: "Drawing Themes",
    description: "Art prompts for sketch practice and challenges.",
    accent: "orange",
    config: {
      templateParam: "drawing",
      entries: entries("drawing", THEME_PICKER_DRAWING_THEMES),
    },
  },
  {
    id: "writing",
    label: "Writing Themes",
    description: "Genres and story starters for writers.",
    accent: "violet",
    config: {
      templateParam: "writing",
      entries: entries("writing", THEME_PICKER_WRITING_THEMES),
    },
  },
  {
    id: "classroom",
    label: "Classroom Themes",
    description: "Discussion, writing, and icebreaker prompts for teachers.",
    accent: "blue",
    config: {
      templateParam: "classroom",
      entries: entries("classroom", THEME_PICKER_CLASSROOM_THEMES),
    },
  },
  {
    id: "halloween",
    label: "Halloween Themes",
    description: "Spooky party, costume, and creative challenge ideas.",
    accent: "amber",
    config: {
      templateParam: "halloween",
      entries: entries("halloween", THEME_PICKER_HALLOWEEN_THEMES),
    },
  },
  {
    id: "christmas",
    label: "Christmas Themes",
    description: "Holiday party, family, and seasonal celebration vibes.",
    accent: "rose",
    config: {
      templateParam: "christmas",
      entries: entries("christmas", THEME_PICKER_CHRISTMAS_THEMES),
    },
  },
  {
    id: "costume",
    label: "Costume Themes",
    description: "Character and outfit costume ideas for parties and events.",
    accent: "violet",
    config: {
      templateParam: "costume",
      entries: entries("costume", THEME_PICKER_COSTUME_THEMES),
    },
  },
  {
    id: "youtube",
    label: "YouTube Themes",
    description: "Video formats and content ideas for creators.",
    accent: "orange",
    config: {
      templateParam: "youtube",
      entries: entries("youtube", THEME_PICKER_YOUTUBE_THEMES),
    },
  },
  {
    id: "tiktok",
    label: "TikTok Themes",
    description: "Short-form challenge and content prompts for creators.",
    accent: "cyan",
    config: {
      templateParam: "tiktok",
      entries: entries("tiktok", THEME_PICKER_TIKTOK_THEMES),
    },
  },
  {
    id: "photography",
    label: "Photography Themes",
    description: "Shoot prompts for practice, challenges, and portfolios.",
    accent: "emerald",
    config: {
      templateParam: "photography",
      entries: entries("photography", THEME_PICKER_PHOTOGRAPHY_THEMES),
    },
  },
]

export function getThemePickerUseCase(
  id: ThemePickerUseCaseId,
): ThemePickerUseCase | undefined {
  return THEME_PICKER_USE_CASES.find((useCase) => useCase.id === id)
}

export function themePickerUseCaseFromTemplate(
  template: string | null,
): ThemePickerUseCaseId | null {
  const value = (template ?? "").toLowerCase().trim()
  if (!value) return null
  const direct = THEME_PICKER_USE_CASES.find(
    (useCase) => useCase.id === value || useCase.config.templateParam === value,
  )
  return direct?.id ?? null
}

export function applyThemePickerUseCase(id: ThemePickerUseCaseId): boolean {
  const useCase = getThemePickerUseCase(id)
  if (!useCase) return false

  const store = useWheelManagerStore.getState()
  if (store.currentTool !== "theme-picker-wheel") {
    store.setCurrentTool("theme-picker-wheel")
  }

  let wheel = store.getCurrentWheel()
  if (!wheel) {
    store.createNewWheel("theme-picker-wheel", "My Theme Wheel")
    wheel = store.getCurrentWheel()
  }
  if (!wheel) return false

  store.updateWheelData("theme-picker-wheel", wheel.id, {
    ...(wheel.data as object),
    entries: useCase.config.entries.map((entry) => ({ ...entry })),
    viewMode: "wheel",
  })

  if (
    typeof window !== "undefined" &&
    window.location.pathname === THEME_PICKER_PATH
  ) {
    const url = new URL(window.location.href)
    url.searchParams.set("template", useCase.config.templateParam)
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`)
  }

  return true
}

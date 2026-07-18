import type { ColorPaletteId } from "@/lib/color-picker-palettes"
import type { ColorPickerDeepLink } from "@/lib/color-picker-spokes"

export type ColorPickerUseCaseId =
  | "basic"
  | "rainbow"
  | "pastel"
  | "neon"
  | "primary"
  | "secondary"
  | "warm"
  | "cool"
  | "crayon"
  | "paint"
  | "html"
  | "css"
  | "hex"
  | "random"

export type ColorPickerUseCaseAccent =
  | "sky"
  | "amber"
  | "rose"
  | "lime"
  | "orange"
  | "teal"
  | "indigo"
  | "cyan"
  | "yellow"
  | "violet"

export type ColorPickerUseCase = {
  id: ColorPickerUseCaseId
  label: string
  description: string
  accent: ColorPickerUseCaseAccent
  href: string
  config: ColorPickerDeepLink & { palette: ColorPaletteId }
}

/** Popular color wheels shown under the page title (same pattern as Letter / Yes-No). */
export const COLOR_PICKER_USE_CASES: ColorPickerUseCase[] = [
  {
    id: "basic",
    label: "Basic Colors",
    description: "Everyday colors for kids, classrooms, and quick picks.",
    accent: "sky",
    href: "/basic-color-wheel",
    config: {
      palette: "basic",
      tab: "manual",
      toolTitle: "Basic Colors Wheel",
      toolDescription: "Spin everyday basic colors",
    },
  },
  {
    id: "rainbow",
    label: "Rainbow",
    description: "ROYGBIV rainbow slices for classroom and party spins.",
    accent: "violet",
    href: "/rainbow-color-wheel",
    config: {
      palette: "rainbow",
      tab: "manual",
      toolTitle: "Rainbow Color Wheel",
      toolDescription: "Spin ROYGBIV rainbow colors",
    },
  },
  {
    id: "pastel",
    label: "Pastel",
    description: "Soft pastels for moodboards and gentle design prompts.",
    accent: "rose",
    href: "/pastel-color-wheel",
    config: {
      palette: "pastel",
      tab: "manual",
      toolTitle: "Pastel Color Wheel",
      toolDescription: "Spin soft pastel colors",
    },
  },
  {
    id: "neon",
    label: "Neon",
    description: "Bright neons for games, streamers, and high-energy picks.",
    accent: "lime",
    href: "/neon-color-wheel",
    config: {
      palette: "neon",
      tab: "manual",
      toolTitle: "Neon Color Wheel",
      toolDescription: "Spin bright neon game colors",
    },
  },
  {
    id: "primary",
    label: "Primary",
    description: "Red, yellow, and blue for early education and art basics.",
    accent: "amber",
    href: "/primary-color-wheel",
    config: {
      palette: "primary",
      tab: "manual",
      toolTitle: "Primary Colors Wheel",
      toolDescription: "Spin red, yellow, and blue",
    },
  },
  {
    id: "secondary",
    label: "Secondary",
    description: "Orange, green, and purple for art-class mixing practice.",
    accent: "orange",
    href: "/secondary-color-wheel",
    config: {
      palette: "secondary",
      tab: "manual",
      toolTitle: "Secondary Colors Wheel",
      toolDescription: "Spin orange, green, and purple",
    },
  },
  {
    id: "warm",
    label: "Warm Colors",
    description: "Reds, oranges, and yellows for warm palette decisions.",
    accent: "yellow",
    href: "/warm-color-wheel",
    config: {
      palette: "warm",
      tab: "manual",
      toolTitle: "Warm Colors Wheel",
      toolDescription: "Spin warm reds, oranges, and yellows",
    },
  },
  {
    id: "cool",
    label: "Cool Colors",
    description: "Blues, greens, and purples for cool palette spins.",
    accent: "cyan",
    href: "/cool-color-wheel",
    config: {
      palette: "cool",
      tab: "manual",
      toolTitle: "Cool Colors Wheel",
      toolDescription: "Spin cool blues, greens, and purples",
    },
  },
  {
    id: "crayon",
    label: "Crayon Colors",
    description: "Familiar crayon-style names for early education fun.",
    accent: "teal",
    href: "/crayon-color-wheel",
    config: {
      palette: "crayon",
      tab: "manual",
      toolTitle: "Crayon Colors Wheel",
      toolDescription: "Spin familiar crayon-style colors",
    },
  },
  {
    id: "paint",
    label: "Paint Colors",
    description: "Paint-box colors for art challenges and studio prompts.",
    accent: "indigo",
    href: "/paint-color-wheel",
    config: {
      palette: "paint",
      tab: "manual",
      toolTitle: "Paint Colors Wheel",
      toolDescription: "Spin studio paint-box colors",
    },
  },
  {
    id: "random",
    label: "Random / Lucky",
    description: "Mixed lucky colors for fast random inspiration.",
    accent: "violet",
    href: "/random-color-picker",
    config: {
      palette: "random",
      tab: "manual",
      toolTitle: "Random Color Picker",
      toolDescription: "Spin a lucky color from a mixed palette",
    },
  },
  {
    id: "html",
    label: "HTML Colors",
    description: "Named HTML colors for web demos and teaching.",
    accent: "sky",
    href: "/html-color-wheel",
    config: {
      palette: "html",
      tab: "manual",
      toolTitle: "HTML Color Wheel",
      toolDescription: "Spin named HTML colors",
    },
  },
  {
    id: "css",
    label: "CSS Colors",
    description: "CSS named colors for prototype accents.",
    accent: "indigo",
    href: "/css-color-wheel",
    config: {
      palette: "css",
      tab: "manual",
      toolTitle: "CSS Color Wheel",
      toolDescription: "Spin CSS named colors",
    },
  },
  {
    id: "hex",
    label: "Hex Codes",
    description: "Hex-labeled slices ready to paste into CSS.",
    accent: "amber",
    href: "/hex-color-picker-wheel",
    config: {
      palette: "hex",
      tab: "manual",
      toolTitle: "Hex Color Picker Wheel",
      toolDescription: "Spin hex-labeled colors",
    },
  },
]

export function getColorPickerUseCase(
  id: ColorPickerUseCaseId,
): ColorPickerUseCase | undefined {
  return COLOR_PICKER_USE_CASES.find((item) => item.id === id)
}

export function getColorPickerUseCaseByPalette(
  palette: ColorPaletteId | undefined,
): ColorPickerUseCase | undefined {
  if (!palette) return undefined
  return COLOR_PICKER_USE_CASES.find((item) => item.config.palette === palette)
}

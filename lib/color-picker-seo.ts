import { HOME_SITE_URL } from "@/lib/home-seo"

export const COLOR_PICKER_SITE_URL = HOME_SITE_URL

/** Canonical pillar path. */
export const COLOR_PICKER_PATH = "/color-picker-wheel"

/** Competitor-style alias redirected to the pillar. */
export const COLOR_PICKER_LEGACY_PATH = "/wheel-of-colors"

export const COLOR_PICKER_URL = `${COLOR_PICKER_SITE_URL}${COLOR_PICKER_PATH}`

export const COLOR_PICKER_OG_IMAGE_URL = `${COLOR_PICKER_SITE_URL}/og/color-picker-wheel.svg`

export const COLOR_PICKER_PAGE_TITLE =
  "Color Picker Wheel | Spin a Random Color Wheel Online"

export const COLOR_PICKER_PAGE_DESCRIPTION =
  "Spin the Color Picker Wheel to choose a random color instantly. Customize colors, create your own color wheel, and use it for games, classrooms, design inspiration, or fun decision-making."

export const COLOR_PICKER_H1 = "Color Picker Wheel"

/** Short chrome title above the tool (not the SEO H1). */
export const COLOR_PICKER_SHORT_TITLE = "Color Picker Wheel"

export const COLOR_PICKER_HERO_INTRO =
  "Looking for a fun way to choose a random color? Our Color Picker Wheel lets you spin a customizable wheel and instantly select a color from your own list or from ready-made color palettes. Whether you're teaching in a classroom, choosing game colors, finding creative inspiration, or making simple decisions, this free color wheel makes every selection quick, fair, and enjoyable."

/** Primary + secondary + semantic keywords — random color selection intent only. */
export const COLOR_PICKER_KEYWORDS = [
  "color picker wheel",
  "color wheel spinner",
  "color spinner",
  "color wheel picker",
  "wheel spinner",
  "spinner wheel picker",
  "random color picker",
  "random color wheel",
  "spin color wheel",
  "color chooser wheel",
  "color selection wheel",
  "choose a random color",
  "lucky color picker",
  "random color generator",
  "spin the wheel",
  "color decision wheel",
  "classroom color wheel",
  "game color spinner",
  "prize color wheel",
] as const

export const COLOR_PICKER_ON_THIS_PAGE = [
  { id: "cp-spin-wheel", label: "Spin the color wheel" },
  { id: "cp-create-wheel", label: "Create your own color wheel" },
  { id: "cp-options", label: "How this tool's options work" },
  { id: "cp-use-cases", label: "Ways to use a color picker wheel" },
  { id: "cp-why", label: "Why use a color wheel" },
  { id: "cp-vs-picker", label: "Color picker wheel vs color picker tool" },
  { id: "cp-related", label: "Related tools" },
  { id: "cp-faq", label: "FAQ" },
] as const

export type ColorPickerLinkItem = {
  label: string
  href: string
  description: string
}

/** Cluster spokes — ready-made palette landing pages. */
export const COLOR_PICKER_POPULAR_WHEELS: ColorPickerLinkItem[] = [
  {
    label: "Basic Colors Wheel",
    href: "/basic-color-wheel",
    description: "Classic everyday colors for kids, classrooms, and quick picks.",
  },
  {
    label: "Rainbow Color Wheel",
    href: "/rainbow-color-wheel",
    description: "ROYGBIV rainbow slices for classroom and party spins.",
  },
  {
    label: "Pastel Color Wheel",
    href: "/pastel-color-wheel",
    description: "Soft pastel swatches for design moodboards and gentle prompts.",
  },
  {
    label: "Neon Color Wheel",
    href: "/neon-color-wheel",
    description: "Bright neon colors for games, streamers, and high-energy picks.",
  },
  {
    label: "Primary Colors Wheel",
    href: "/primary-color-wheel",
    description: "Red, yellow, and blue for early education and art basics.",
  },
  {
    label: "Secondary Colors Wheel",
    href: "/secondary-color-wheel",
    description: "Orange, green, and purple for art-class color mixing practice.",
  },
  {
    label: "Warm Colors Wheel",
    href: "/warm-color-wheel",
    description: "Reds, oranges, and yellows for warm palette decisions.",
  },
  {
    label: "Cool Colors Wheel",
    href: "/cool-color-wheel",
    description: "Blues, greens, and purples for cool palette spins.",
  },
  {
    label: "Crayon Colors Wheel",
    href: "/crayon-color-wheel",
    description: "Familiar crayon-style names for early education fun.",
  },
  {
    label: "Paint Colors Wheel",
    href: "/paint-color-wheel",
    description: "Paint-box style colors for art challenges and studio prompts.",
  },
]

export const COLOR_PICKER_CREATE_POINTS = [
  {
    title: "Add custom colors",
    description:
      "Open Manual mode to add any hex colors you need—brand swatches, team colors, or a short classroom list.",
  },
  {
    title: "Remove colors",
    description:
      "Turn slices off or delete colors you do not want, or use elimination so each color is used once.",
  },
  {
    title: "Rename colors",
    description:
      "Give each swatch a friendly name (for example “Team Blue” or “Lucky Green”) so results are easy to read aloud.",
  },
  {
    title: "Change wheel appearance",
    description:
      "Adjust themes, sound, confetti, and display options so the spinner matches your class, stream, or brand.",
  },
  {
    title: "Save wheels",
    description:
      "Keep custom color wheels in My Wheels on this device and reopen them for the next lesson or game night.",
  },
  {
    title: "Share wheels",
    description:
      "Share a spin result, export your color list, or embed the page when you want others to spin the same setup.",
  },
] as const

/** Explains each Color Controls option for the complete guide. */
export const COLOR_PICKER_OPTIONS_GUIDE = [
  {
    title: "Action Mode",
    description:
      "Normal Mode keeps every color on the wheel after a spin. Elimination Mode removes the winner so later spins pick from remaining colors—use Restore All when you want the full palette back.",
  },
  {
    title: "Color Wheel tab",
    description:
      "Pick a color combination (Single, Monochromatic, Complementary, Analogous, Triadic, and more), set Manual or Random pointer mode, and choose a primary color. This is the fastest way to build harmony-based palettes before you spin.",
  },
  {
    title: "Result Show Mode & Alpha",
    description:
      "Control what appears after a spin: Color is always shown; optionally add Text, HEX, RGB, or RGBA. Alpha adjusts opacity when you need translucent swatches for design or overlays.",
  },
  {
    title: "Manual tab",
    description:
      "Add a Custom Color by name and swatch, insert PW Colors / Basic Colors, or load Theme Colors (Birthday, Ocean, Neon, Forest, and more). Enable or disable individual colors under Current Colors.",
  },
  {
    title: "Image tab",
    description:
      "Upload an image to extract a palette, then Insert All or curate which extracted colors stay enabled. Ideal when you want brand art, product photos, or classroom posters to drive the wheel.",
  },
  {
    title: "AI-Powered tab",
    description:
      "Generate palettes from mood, style, and purpose; name colors with context; run the Color Blindness Simulator; and use Analysis or Learning tools when you want smarter naming and accessibility checks.",
  },
  {
    title: "Confetti, Sound & Show stats",
    description:
      "Toggle celebration effects and on-wheel stats so spins stay clear for quiet classrooms or lively streams. Mute from the Color Wheel / Image tabs when you only need a silent pick.",
  },
  {
    title: "Other Options & Share",
    description:
      "Import, Export, Share, Embed, QR Code, Fullscreen, and OBS Overlay help you reuse or broadcast the same color wheel. Save setups in My Wheels on this device for the next lesson or design session.",
  },
] as const

export type ColorPickerUseCaseGroup = {
  title: string
  items: readonly { title: string; description: string; href: string }[]
}

export const COLOR_PICKER_USE_CASE_GROUPS: ColorPickerUseCaseGroup[] = [
  {
    title: "Classroom",
    items: [
      {
        title: "Learn colors",
        href: "/basic-color-wheel",
        description: "Spin a basic or rainbow wheel so students practice naming colors out loud.",
      },
      {
        title: "Student games",
        href: "/crayon-color-wheel",
        description: "Assign crayon colors for teams, stations, or scavenger-hunt challenges.",
      },
      {
        title: "Group activities",
        href: "/rainbow-color-wheel",
        description: "Let the whole class watch a fair spin for group roles or art materials.",
      },
    ],
  },
  {
    title: "Design",
    items: [
      {
        title: "Pick accent colors",
        href: "/pastel-color-wheel",
        description: "Spin pastels or warm/cool sets when you need a quick accent for a layout.",
      },
      {
        title: "Choose UI colors",
        href: "/css-color-wheel",
        description: "Use CSS or HTML named colors when brainstorming interface accents.",
      },
      {
        title: "Creative brainstorming",
        href: "/random-color-picker",
        description: "Spin for random inspiration when a blank canvas needs a starting hue.",
      },
    ],
  },
  {
    title: "Games",
    items: [
      {
        title: "Assign player colors",
        href: "/neon-color-wheel",
        description: "Spin neon or basic colors so each player gets a fair team color.",
      },
      {
        title: "Board games",
        href: "/basic-color-wheel",
        description: "Pick pawn colors, territories, or challenge cards without arguing.",
      },
      {
        title: "Party games",
        href: "/rainbow-color-wheel",
        description: "Use a rainbow spinner for prizes, dares, or costume themes.",
      },
    ],
  },
  {
    title: "Art",
    items: [
      {
        title: "Drawing prompts",
        href: "/paint-color-wheel",
        description: "Spin a paint-box palette for the next sketch or illustration constraint.",
      },
      {
        title: "Painting challenges",
        href: "/primary-color-wheel",
        description: "Limit the session to primary or secondary colors for focused practice.",
      },
      {
        title: "Sketch ideas",
        href: "/warm-color-wheel",
        description: "Warm or cool wheels force a mood before the first line goes down.",
      },
    ],
  },
  {
    title: "Daily fun",
    items: [
      {
        title: "Outfit color",
        href: "/cool-color-wheel",
        description: "Spin for today’s outfit accent when you cannot decide.",
      },
      {
        title: "Room decoration",
        href: "/pastel-color-wheel",
        description: "Pick a soft accent color for a shelf, craft, or moodboard.",
      },
      {
        title: "Random challenges",
        href: "/neon-color-wheel",
        description: "Let a lucky color picker choose the theme for a day or stream.",
      },
    ],
  },
] as const

export const COLOR_PICKER_WHY_POINTS = [
  {
    title: "Removes bias",
    description:
      "A spinning color wheel makes the pick feel fair—no one can claim you always choose your favorite.",
  },
  {
    title: "Faster decisions",
    description:
      "Stop debating which color to use. Spin once and move on to the game, lesson, or design task.",
  },
  {
    title: "Fun interaction",
    description:
      "Watching the wheel land is more engaging than typing into a quiet random color generator.",
  },
  {
    title: "Great for groups",
    description:
      "Classrooms, parties, and streams can all see the same color spinner result at once.",
  },
  {
    title: "Encourages creativity",
    description:
      "Random constraints spark new outfit ideas, art prompts, and UI accents you might not pick manually.",
  },
] as const

/** Wheel vs precision color picker tool — not Google Color Picker. */
export const COLOR_PICKER_COMPARISON = [
  {
    aspect: "Purpose",
    wheel: "Chooses a random color",
    tool: "Selects an exact color value",
  },
  {
    aspect: "Best for",
    wheel: "Great for games, classrooms, and decisions",
    tool: "Great for designers needing precision",
  },
  {
    aspect: "Experience",
    wheel: "Interactive spinning",
    tool: "Manual selection",
  },
  {
    aspect: "Outcome",
    wheel: "Random inspiration",
    tool: "Precision editing",
  },
] as const

export const COLOR_PICKER_RELATED_TOOLS: ColorPickerLinkItem[] = [
  {
    label: "Random Wheel Picker",
    href: "/",
    description: "The main spinner for any custom list of options.",
  },
  {
    label: "Random Name Picker",
    href: "/",
    description: "Spin names for classrooms, giveaways, and teams.",
  },
  {
    label: "Random Number Picker",
    href: "/number-picker-wheel",
    description: "Spin numbers for ranges, bingo, and dice-style rolls.",
  },
  {
    label: "Letter Picker",
    href: "/random-letter-picker",
    description: "Spin the alphabet wheel for games and learning.",
  },
  {
    label: "Yes or No Wheel",
    href: "/yes-or-no-wheel",
    description: "A simple decision wheel for binary choices.",
  },
  {
    label: "Decision Wheel",
    href: "/decision-wheel",
    description: "A focused decision spinner for everyday choices.",
  },
  {
    label: "Coin Flip",
    href: "/yes-or-no-wheel?mode=fair-coin",
    description: "Heads-or-tails style spins when you need a quick binary pick.",
  },
  {
    label: "Dice Roller",
    href: "/number-picker-wheel",
    description: "Use the number wheel for dice-style random rolls and ranges.",
  },
]

export const COLOR_PICKER_ARTICLE_TITLE = "Spin the Color Wheel"

export const COLOR_PICKER_ARTICLE_INTRO = [
  "A Color Picker Wheel is a spinning color chooser made for random selection. Add your own colors or open a ready-made palette, spin the wheel, and land on a lucky color everyone can see—ideal when you want a fair pick for games, classrooms, art prompts, or everyday decisions.",
  "Unlike a precision color picker tool (the kind designers use to sample an exact hex), this color wheel spinner focuses on random inspiration. You can still copy HEX and RGB after a spin when you need the code, but the experience is built around spinning—not manually dialing in values.",
  "If you arrived looking for Google’s color picker or a deep dive into color theory, those are different intents. This page stays focused on randomly choosing colors with a visual spinner. Ready-made wheels like rainbow, pastel, neon, warm, and cool give you fast starting points without rebuilding the list each time.",
] as const

export const COLOR_PICKER_FAQ_ITEMS = [
  {
    question: "What is a Color Picker Wheel?",
    answer:
      "A Color Picker Wheel is an online color spinner that randomly selects a color from a list or palette you define. You spin the wheel to choose a random color for games, classrooms, design inspiration, or fun decisions.",
  },
  {
    question: "Is the color selection random?",
    answer:
      "Yes. Each enabled color on the wheel has a fair chance of being selected when weights are equal. You can remove colors or use elimination mode if you want each color used only once.",
  },
  {
    question: "Can I add my own colors?",
    answer:
      "Yes. Open Manual mode to add custom colors with names and hex values, or start from a ready-made palette page and edit the list.",
  },
  {
    question: "Can I remove colors from the wheel?",
    answer:
      "Yes. Disable or delete colors you do not want, or turn on elimination (remove winner) so selected colors leave the wheel until you reset.",
  },
  {
    question: "Can I create a custom color palette?",
    answer:
      "Yes. Build a palette in Manual mode, import a list, or open templates like Basic, Rainbow, Pastel, Neon, Warm, and Cool, then customize names and colors.",
  },
  {
    question: "Can I save my color wheel?",
    answer:
      "Yes. Use My Wheels to keep custom color wheels on this device so you can reopen a classroom set, game palette, or brand shortlist later.",
  },
  {
    question: "Does it work on phones and tablets?",
    answer:
      "Yes. The color spinner is mobile-friendly, so you can spin a random color on phones, tablets, and desktops without installing an app.",
  },
  {
    question: "Is this different from Google's Color Picker?",
    answer:
      "Yes. Google’s color picker is for selecting an exact color value. This Color Picker Wheel is for randomly choosing a color with a fun spin—better for games, classrooms, and group decisions. If you need precision hex editing, use a designer color picker tool instead.",
  },
  {
    question: "Can I use it for classroom activities?",
    answer:
      "Absolutely. Teachers use classroom color wheels for naming practice, team colors, art warm-ups, and fair group assignments. Rainbow, basic, and crayon templates are ready to open.",
  },
  {
    question: "Is it free?",
    answer:
      "Yes. You can spin the Color Picker Wheel in your browser for free. No account is required to start choosing a random color.",
  },
] as const

export type ColorPickerSeoTab = "color-wheel" | "manual" | "image" | "ai"

export function parseColorPickerSeoTab(value: string | null): ColorPickerSeoTab | null {
  if (
    value === "color-wheel" ||
    value === "manual" ||
    value === "image" ||
    value === "ai"
  ) {
    return value
  }
  return null
}

export function parseColorPickerSeoCombo(value: string | null): string | null {
  if (!value) return null
  const allowed = [
    "complementary",
    "analogous",
    "triadic",
    "monochromatic",
    "tetradic",
    "split-complementary",
  ]
  return allowed.includes(value) ? value : null
}

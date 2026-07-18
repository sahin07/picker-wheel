import {
  COLOR_PICKER_PATH,
  COLOR_PICKER_SITE_URL,
  type ColorPickerSeoTab,
} from "@/lib/color-picker-seo"
import type { ColorPaletteId } from "@/lib/color-picker-palettes"

export type ColorPickerSpokeId =
  | "random"
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

export type ColorPickerDeepLink = {
  palette?: ColorPaletteId
  tab?: ColorPickerSeoTab
  combination?: string
  toolTitle?: string
  toolDescription?: string
}

export type ColorPickerSpokeFaq = {
  question: string
  answer: string
}

export type ColorPickerSpokeSeo = {
  id: ColorPickerSpokeId
  path: string
  pageTitle: string
  description: string
  h1: string
  shortTitle: string
  heroIntro: string
  keywords: readonly string[]
  articleTitle: string
  articleIntro: readonly string[]
  uniqueSection: {
    title: string
    intro: string
    points: readonly { title: string; description: string }[]
  }
  faq: readonly ColorPickerSpokeFaq[]
  siblingIds: readonly ColorPickerSpokeId[]
  deepLink: ColorPickerDeepLink
  audience: string
}

export function colorSpokeUrl(path: string): string {
  return `${COLOR_PICKER_SITE_URL}${path}`
}

const DEFAULT_SIBLINGS: ColorPickerSpokeId[] = [
  "basic",
  "rainbow",
  "pastel",
  "neon",
  "warm",
  "cool",
]

function spokeFaq(
  label: string,
  audience: string,
): readonly ColorPickerSpokeFaq[] {
  return [
    {
      question: `What is a ${label}?`,
      answer: `A ${label} is a ready-made Color Picker Wheel template loaded with a ${audience.toLowerCase()} palette. Spin to choose a random color from that set for games, classrooms, or creative prompts.`,
    },
    {
      question: "Can I edit the colors after opening this page?",
      answer:
        "Yes. Switch to Manual mode to rename, add, or remove colors. Your edits stay on this device in My Wheels if you save the wheel.",
    },
    {
      question: "Is this the same as a designer color picker?",
      answer:
        "No. This page randomly spins a color from a list. A precision color picker tool selects an exact hex value for design work—different intent.",
    },
    {
      question: "Where is the main Color Picker Wheel?",
      answer: `Open the Color Picker Wheel pillar at ${COLOR_PICKER_PATH} for spectrum spin, image sampling, AI tools, and all palette templates.`,
    },
  ]
}

export const COLOR_PICKER_SPOKES: Record<ColorPickerSpokeId, ColorPickerSpokeSeo> = {
  random: {
    id: "random",
    path: "/random-color-picker",
    pageTitle: "Random Color Picker | Spin a Lucky Color Online",
    description:
      "Use this free random color picker to spin a lucky color instantly. Fair visual spinner for games, classrooms, art prompts, and everyday decisions.",
    h1: "Random Color Picker",
    shortTitle: "Random Color Picker",
    heroIntro:
      "Need to choose a random color fast? This random color picker opens a mixed lucky-color wheel so you can spin for inspiration, team colors, or a fun decision—no signup required.",
    keywords: [
      "random color picker",
      "lucky color picker",
      "choose a random color",
      "random color wheel",
      "spin color wheel",
    ],
    articleTitle: "Spin a Random Color Instantly",
    articleIntro: [
      "A random color picker is the quickest way to land on a fair color without arguing over favorites. Everyone watches the same spin, then you copy the result or keep spinning.",
      "This template loads a mixed lucky palette. Prefer rainbow, neon, pastel, or warm/cool sets? Open those dedicated wheels from the cluster links below.",
    ],
    uniqueSection: {
      title: "When a Random Color Picker Works Best",
      intro: "Use a mixed lucky palette when you want surprise more than a themed set.",
      points: [
        {
          title: "Creative warm-ups",
          description: "Spin once and build a sketch, outfit, or UI accent around that color.",
        },
        {
          title: "Fair team colors",
          description: "Assign player colors without bias when friends cannot agree.",
        },
        {
          title: "Daily challenges",
          description: "Let a lucky color picker set today’s theme for streams or journals.",
        },
      ],
    },
    faq: spokeFaq("Random Color Picker", "Lucky mixed colors"),
    siblingIds: DEFAULT_SIBLINGS,
    deepLink: {
      palette: "random",
      tab: "manual",
      toolTitle: "Random Color Picker",
      toolDescription: "Spin a lucky color from a mixed palette",
    },
    audience: "General users & creators",
  },
  basic: {
    id: "basic",
    path: "/basic-color-wheel",
    pageTitle: "Basic Colors Wheel | Spin Everyday Colors Online",
    description:
      "Spin a basic colors wheel with everyday reds, blues, greens, and more. Perfect for kids, classrooms, and simple random color picks.",
    h1: "Basic Colors Wheel",
    shortTitle: "Basic Colors Wheel",
    heroIntro:
      "Open a classic basic colors wheel loaded with everyday swatches kids and groups already know. Spin to choose a random color for classroom games, team picks, or simple decisions.",
    keywords: [
      "basic color wheel",
      "basic colors spinner",
      "classroom color wheel",
      "simple color picker wheel",
    ],
    articleTitle: "Spin Everyday Basic Colors",
    articleIntro: [
      "Basic color wheels keep the list short and familiar—red, blue, green, yellow, and other everyday names. That makes them ideal for early learners and quick group activities.",
      "After you spin, rename slices, remove colors, or switch to another template like rainbow or crayon when you need more variety.",
    ],
    uniqueSection: {
      title: "Who the Basic Colors Wheel Is For",
      intro: "Keep the vocabulary simple when naming colors is part of the activity.",
      points: [
        { title: "Kids & general users", description: "Familiar names everyone can shout out." },
        { title: "Classroom naming", description: "Practice color vocabulary with a visible spin." },
        { title: "Quick team picks", description: "Assign simple player colors without a long list." },
      ],
    },
    faq: spokeFaq("Basic Colors Wheel", "Kids & general users"),
    siblingIds: ["rainbow", "crayon", "primary", "pastel", "neon"],
    deepLink: {
      palette: "basic",
      tab: "manual",
      toolTitle: "Basic Colors Wheel",
      toolDescription: "Spin everyday basic colors",
    },
    audience: "Kids & general users",
  },
  rainbow: {
    id: "rainbow",
    path: "/rainbow-color-wheel",
    pageTitle: "Rainbow Color Wheel | Spin ROYGBIV Colors Online",
    description:
      "Spin a rainbow color wheel with ROYGBIV colors. A classroom favorite for learning colors, party games, and fair random picks.",
    h1: "Rainbow Color Wheel",
    shortTitle: "Rainbow Color Wheel",
    heroIntro:
      "Spin a rainbow color wheel loaded with classic ROYGBIV colors. Great for classrooms learning the rainbow, party games, and colorful prize spins.",
    keywords: [
      "rainbow color wheel",
      "rainbow spinner",
      "roygbiv wheel",
      "classroom rainbow colors",
    ],
    articleTitle: "Spin the Rainbow Online",
    articleIntro: [
      "A rainbow color wheel makes ROYGBIV visible and fun. Teachers use it for rainbow lessons; hosts use it for colorful party challenges.",
      "Need softer or louder vibes? Jump to pastel or neon wheels in this cluster.",
    ],
    uniqueSection: {
      title: "Classroom Rainbow Moments",
      intro: "Rainbow templates shine when the activity is about the spectrum itself.",
      points: [
        { title: "Learn the rainbow", description: "Spin and say each ROYGBIV color in order or as a challenge." },
        { title: "Group stations", description: "Assign rainbow teams for rotations and centers." },
        { title: "Party prizes", description: "Let guests spin for a colorful prize category." },
      ],
    },
    faq: spokeFaq("Rainbow Color Wheel", "Classrooms"),
    siblingIds: ["basic", "primary", "pastel", "neon", "crayon"],
    deepLink: {
      palette: "rainbow",
      tab: "manual",
      toolTitle: "Rainbow Color Wheel",
      toolDescription: "Spin ROYGBIV rainbow colors",
    },
    audience: "Classrooms",
  },
  pastel: {
    id: "pastel",
    path: "/pastel-color-wheel",
    pageTitle: "Pastel Color Wheel | Soft Random Color Spinner",
    description:
      "Spin a pastel color wheel for soft random colors. Ideal for designers, moodboards, gentle art prompts, and calm classroom crafts.",
    h1: "Pastel Color Wheel",
    shortTitle: "Pastel Color Wheel",
    heroIntro:
      "Spin soft pastel colors when you want gentle inspiration—moodboards, spring crafts, or calm design accents without harsh neons.",
    keywords: ["pastel color wheel", "pastel color picker", "soft color spinner", "pastel palette spinner"],
    articleTitle: "Spin Soft Pastel Colors",
    articleIntro: [
      "Pastel wheels favor soft pinks, mints, lilacs, and peaches. Designers use them for moodboards; teachers use them for spring craft themes.",
      "Want higher energy? Try the neon color wheel. Prefer fundamentals? Open primary or secondary wheels.",
    ],
    uniqueSection: {
      title: "Pastels for Designers",
      intro: "Soft palettes help when you need calm accents fast.",
      points: [
        { title: "Moodboards", description: "Spin a pastel accent for layouts and invitations." },
        { title: "UI brainstorming", description: "Explore soft accents before committing in Figma." },
        { title: "Craft themes", description: "Pick pastel materials for classroom projects." },
      ],
    },
    faq: spokeFaq("Pastel Color Wheel", "Designers"),
    siblingIds: ["neon", "warm", "cool", "css", "basic"],
    deepLink: {
      palette: "pastel",
      tab: "manual",
      toolTitle: "Pastel Color Wheel",
      toolDescription: "Spin soft pastel colors",
    },
    audience: "Designers",
  },
  neon: {
    id: "neon",
    path: "/neon-color-wheel",
    pageTitle: "Neon Color Wheel | Bright Game Color Spinner",
    description:
      "Spin a neon color wheel for bright random colors. Perfect for games, streamers, parties, and high-energy player color picks.",
    h1: "Neon Color Wheel",
    shortTitle: "Neon Color Wheel",
    heroIntro:
      "Spin bright neon colors for games, stream overlays, and party challenges. High-energy swatches that stand out on screens and stage.",
    keywords: ["neon color wheel", "neon color spinner", "game color spinner", "streamer color picker"],
    articleTitle: "Spin Neon Colors for Games & Streams",
    articleIntro: [
      "Neon wheels deliver punchy pinks, greens, and cyans that read well on stream and in party games.",
      "For softer picks use pastel; for classic classroom names use basic or crayon.",
    ],
    uniqueSection: {
      title: "Built for Games & Streamers",
      intro: "Bright slices make player colors and prize spins pop.",
      points: [
        { title: "Player colors", description: "Assign neon team colors viewers can track easily." },
        { title: "Prize wheels", description: "Spin for neon-themed challenges or rewards." },
        { title: "Overlay accents", description: "Pick a neon accent for tonight’s stream theme." },
      ],
    },
    faq: spokeFaq("Neon Color Wheel", "Games & streamers"),
    siblingIds: ["rainbow", "pastel", "basic", "hex", "random"],
    deepLink: {
      palette: "neon",
      tab: "manual",
      toolTitle: "Neon Color Wheel",
      toolDescription: "Spin bright neon game colors",
    },
    audience: "Games & streamers",
  },
  primary: {
    id: "primary",
    path: "/primary-color-wheel",
    pageTitle: "Primary Colors Wheel | Red Yellow Blue Spinner",
    description:
      "Spin a primary colors wheel with red, yellow, and blue. Simple education spinner for art basics and early learning.",
    h1: "Primary Colors Wheel",
    shortTitle: "Primary Colors Wheel",
    heroIntro:
      "Spin the three primary colors—red, yellow, and blue—for art basics, early education, and simple mixing lessons.",
    keywords: ["primary color wheel", "primary colors spinner", "red yellow blue wheel"],
    articleTitle: "Spin Red, Yellow, and Blue",
    articleIntro: [
      "Primary color wheels keep the set to three so lessons stay focused on fundamentals.",
      "Pair with the secondary colors wheel when you introduce orange, green, and purple next.",
    ],
    uniqueSection: {
      title: "Education-First Primary Spins",
      intro: "Fewer slices mean clearer teaching moments.",
      points: [
        { title: "Art basics", description: "Spin a primary before a mixing demonstration." },
        { title: "Early learning", description: "Name and match primary colors with a shared spin." },
        { title: "Limited palette challenges", description: "Force sketches to use only the spun primary." },
      ],
    },
    faq: spokeFaq("Primary Colors Wheel", "Education"),
    siblingIds: ["secondary", "rainbow", "basic", "paint", "crayon"],
    deepLink: {
      palette: "primary",
      tab: "manual",
      toolTitle: "Primary Colors Wheel",
      toolDescription: "Spin red, yellow, and blue",
    },
    audience: "Education",
  },
  secondary: {
    id: "secondary",
    path: "/secondary-color-wheel",
    pageTitle: "Secondary Colors Wheel | Orange Green Purple Spinner",
    description:
      "Spin a secondary colors wheel with orange, green, and purple. Great for art classes practicing color mixing results.",
    h1: "Secondary Colors Wheel",
    shortTitle: "Secondary Colors Wheel",
    heroIntro:
      "Spin orange, green, and purple—the secondary colors—for art-class practice and mixing follow-ups after primary lessons.",
    keywords: ["secondary color wheel", "secondary colors spinner", "orange green purple wheel"],
    articleTitle: "Spin Secondary Colors",
    articleIntro: [
      "Secondary wheels focus on the three mixes students learn after primaries.",
      "Use primary and secondary pages together for a full fundamentals lesson.",
    ],
    uniqueSection: {
      title: "Art Class Mixing Practice",
      intro: "Keep secondary spins short and focused.",
      points: [
        { title: "Mixing check-ins", description: "Spin a secondary and ask how it was mixed." },
        { title: "Palette limits", description: "Challenge students to paint with only that secondary plus neutrals." },
        { title: "Quick quizzes", description: "Guess the parents of the spun secondary color." },
      ],
    },
    faq: spokeFaq("Secondary Colors Wheel", "Art classes"),
    siblingIds: ["primary", "paint", "rainbow", "warm", "cool"],
    deepLink: {
      palette: "secondary",
      tab: "manual",
      toolTitle: "Secondary Colors Wheel",
      toolDescription: "Spin orange, green, and purple",
    },
    audience: "Art classes",
  },
  warm: {
    id: "warm",
    path: "/warm-color-wheel",
    pageTitle: "Warm Colors Wheel | Spin Warm Palette Colors",
    description:
      "Spin a warm colors wheel with reds, oranges, and yellows. Ideal for design learning, mood prompts, and cozy creative challenges.",
    h1: "Warm Colors Wheel",
    shortTitle: "Warm Colors Wheel",
    heroIntro:
      "Spin warm colors—reds, oranges, and yellows—when you want energetic, cozy, or sunset-inspired random picks.",
    keywords: ["warm color wheel", "warm colors spinner", "warm palette picker"],
    articleTitle: "Spin Warm Colors",
    articleIntro: [
      "Warm wheels help when a prompt needs heat: energy, comfort, or autumn vibes.",
      "Pair with the cool colors wheel to contrast temperature choices in design lessons.",
    ],
    uniqueSection: {
      title: "Design Learning with Warm Palettes",
      intro: "Temperature is easier to feel when the wheel only shows warm hues.",
      points: [
        { title: "Mood prompts", description: "Spin a warm accent for posters or story scenes." },
        { title: "Outfit accents", description: "Pick a warm color for today’s accessory." },
        { title: "Contrast lessons", description: "Compare a warm spin against a cool wheel next." },
      ],
    },
    faq: spokeFaq("Warm Colors Wheel", "Design learning"),
    siblingIds: ["cool", "pastel", "neon", "paint", "basic"],
    deepLink: {
      palette: "warm",
      tab: "manual",
      toolTitle: "Warm Colors Wheel",
      toolDescription: "Spin warm reds, oranges, and yellows",
    },
    audience: "Design learning",
  },
  cool: {
    id: "cool",
    path: "/cool-color-wheel",
    pageTitle: "Cool Colors Wheel | Spin Cool Palette Colors",
    description:
      "Spin a cool colors wheel with blues, greens, and purples. Great for calm design prompts, ocean themes, and cool palette practice.",
    h1: "Cool Colors Wheel",
    shortTitle: "Cool Colors Wheel",
    heroIntro:
      "Spin cool colors—blues, greens, and purples—for calm moods, ocean themes, and cool-palette design practice.",
    keywords: ["cool color wheel", "cool colors spinner", "cool palette picker"],
    articleTitle: "Spin Cool Colors",
    articleIntro: [
      "Cool wheels keep the temperature on the blue-green-purple side of the spectrum.",
      "Use warm and cool pages side by side when teaching palette temperature.",
    ],
    uniqueSection: {
      title: "Cool Palettes in Practice",
      intro: "Limit the wheel to cool hues when the brief calls for calm energy.",
      points: [
        { title: "UI accents", description: "Spin a cool accent for dashboards and apps." },
        { title: "Nature themes", description: "Ocean and forest prompts start with a cool spin." },
        { title: "Outfit picks", description: "Choose a cool color when warm feels like too much." },
      ],
    },
    faq: spokeFaq("Cool Colors Wheel", "Design learning"),
    siblingIds: ["warm", "pastel", "css", "html", "basic"],
    deepLink: {
      palette: "cool",
      tab: "manual",
      toolTitle: "Cool Colors Wheel",
      toolDescription: "Spin cool blues, greens, and purples",
    },
    audience: "Design learning",
  },
  crayon: {
    id: "crayon",
    path: "/crayon-color-wheel",
    pageTitle: "Crayon Colors Wheel | Kids Color Spinner",
    description:
      "Spin a crayon colors wheel with familiar crayon-style names. Early education favorite for naming practice and classroom games.",
    h1: "Crayon Colors Wheel",
    shortTitle: "Crayon Colors Wheel",
    heroIntro:
      "Spin crayon-style colors kids already know from the box—fun names, classroom-ready, and perfect for early education games.",
    keywords: ["crayon color wheel", "crayon colors spinner", "kids color picker wheel"],
    articleTitle: "Spin Crayon Colors",
    articleIntro: [
      "Crayon wheels use playful, familiar names that younger students recognize.",
      "For simpler three-color lessons, open primary; for ROYGBIV, open rainbow.",
    ],
    uniqueSection: {
      title: "Early Education Wins",
      intro: "Named crayon colors make reading the result part of the lesson.",
      points: [
        { title: "Name practice", description: "Spin and read crayon names together." },
        { title: "Supply stations", description: "Assign crayon colors for craft tables." },
        { title: "Story prompts", description: "Write a sentence featuring the spun crayon color." },
      ],
    },
    faq: spokeFaq("Crayon Colors Wheel", "Early education"),
    siblingIds: ["basic", "rainbow", "primary", "paint", "pastel"],
    deepLink: {
      palette: "crayon",
      tab: "manual",
      toolTitle: "Crayon Colors Wheel",
      toolDescription: "Spin familiar crayon-style colors",
    },
    audience: "Early education",
  },
  paint: {
    id: "paint",
    path: "/paint-color-wheel",
    pageTitle: "Paint Colors Wheel | Studio Color Spinner",
    description:
      "Spin a paint colors wheel with studio-style paint names. Ideal for painting challenges, drawing prompts, and art class warm-ups.",
    h1: "Paint Colors Wheel",
    shortTitle: "Paint Colors Wheel",
    heroIntro:
      "Spin paint-box style colors for studio challenges—cadmiums, ultramarine, and earth tones that feel at home in an art room.",
    keywords: ["paint color wheel", "paint colors spinner", "art class color spinner"],
    articleTitle: "Spin Paint Colors for Art Challenges",
    articleIntro: [
      "Paint wheels use names artists recognize from the studio. Great for limited-palette painting days.",
      "Combine with primary/secondary wheels when teaching mixing theory without competing with Google color theory pages.",
    ],
    uniqueSection: {
      title: "Studio & Art Class Prompts",
      intro: "Treat each spin as a painting constraint.",
      points: [
        { title: "Limited palette days", description: "Paint only with the spun color plus neutrals." },
        { title: "Sketch warm-ups", description: "Start a drawing forced to feature that paint color." },
        { title: "Critique icebreakers", description: "Spin a color and find it in classmate work." },
      ],
    },
    faq: spokeFaq("Paint Colors Wheel", "Art classes"),
    siblingIds: ["primary", "secondary", "warm", "cool", "crayon"],
    deepLink: {
      palette: "paint",
      tab: "manual",
      toolTitle: "Paint Colors Wheel",
      toolDescription: "Spin studio paint-box colors",
    },
    audience: "Art classes",
  },
  html: {
    id: "html",
    path: "/html-color-wheel",
    pageTitle: "HTML Color Wheel | Spin Named HTML Colors",
    description:
      "Spin an HTML color wheel with familiar named HTML colors. Handy random inspiration for web developers and front-end brainstorming.",
    h1: "HTML Color Wheel",
    shortTitle: "HTML Color Wheel",
    heroIntro:
      "Spin named HTML colors like Tomato, Gold, and DeepSkyBlue when you want random web-friendly color inspiration—not a precision color picker.",
    keywords: ["html color wheel", "html color spinner", "named html colors picker"],
    articleTitle: "Spin Named HTML Colors",
    articleIntro: [
      "HTML named colors are memorable shortcuts for quick demos and teaching CSS basics.",
      "This spinner randomly chooses among them. For exact hex editing, use a designer color picker tool—not this wheel.",
    ],
    uniqueSection: {
      title: "For Web Developers",
      intro: "Random named colors spark demos without opening a theory textbook.",
      points: [
        { title: "Quick demos", description: "Spin a named HTML color for a live coding example." },
        { title: "Teaching CSS", description: "Show named colors before introducing hex." },
        { title: "Moodboard seeds", description: "Land on a named color then refine in your editor." },
      ],
    },
    faq: spokeFaq("HTML Color Wheel", "Web developers"),
    siblingIds: ["css", "hex", "pastel", "neon", "basic"],
    deepLink: {
      palette: "html",
      tab: "manual",
      toolTitle: "HTML Color Wheel",
      toolDescription: "Spin named HTML colors",
    },
    audience: "Web developers",
  },
  css: {
    id: "css",
    path: "/css-color-wheel",
    pageTitle: "CSS Color Wheel | Spin CSS Named Colors",
    description:
      "Spin a CSS color wheel with common CSS named colors. Random front-end inspiration for prototypes and teaching stylesheets.",
    h1: "CSS Color Wheel",
    shortTitle: "CSS Color Wheel",
    heroIntro:
      "Spin CSS named colors for prototype accents and teaching moments—random picks that still feel at home in a stylesheet.",
    keywords: ["css color wheel", "css color spinner", "css named colors picker"],
    articleTitle: "Spin CSS Named Colors",
    articleIntro: [
      "CSS named colors give developers a shared vocabulary for quick experiments.",
      "Use this wheel for random inspiration; use a precision picker when you need an exact brand hex.",
    ],
    uniqueSection: {
      title: "Front-End Brainstorming",
      intro: "Keep named CSS colors handy when exploring accents.",
      points: [
        { title: "Prototype accents", description: "Spin a CSS color for a temporary theme." },
        { title: "Pair with HTML wheel", description: "Compare HTML and CSS named sets in class." },
        { title: "Hex follow-up", description: "Jump to the hex color picker wheel for code-labeled slices." },
      ],
    },
    faq: spokeFaq("CSS Color Wheel", "Web developers"),
    siblingIds: ["html", "hex", "pastel", "cool", "neon"],
    deepLink: {
      palette: "css",
      tab: "manual",
      toolTitle: "CSS Color Wheel",
      toolDescription: "Spin CSS named colors",
    },
    audience: "Web developers",
  },
  hex: {
    id: "hex",
    path: "/hex-color-picker-wheel",
    pageTitle: "Hex Color Picker Wheel | Spin Hex Color Codes",
    description:
      "Spin a hex color picker wheel labeled with hex codes. Random hex inspiration for developers and designers who still want a fair spin.",
    h1: "Hex Color Picker Wheel",
    shortTitle: "Hex Color Picker Wheel",
    heroIntro:
      "Spin hex-labeled colors when you want random hex inspiration with a visual wheel—not a silent random hex generator box.",
    keywords: [
      "hex color picker wheel",
      "hex color spinner",
      "random hex color wheel",
      "spin hex colors",
    ],
    articleTitle: "Spin Hex Color Codes",
    articleIntro: [
      "Hex wheels show the code on the slice so developers can read the result aloud or paste it quickly after the spin.",
      "This stays in random-selection intent. It is not Google’s color picker and not a full color-theory lesson.",
    ],
    uniqueSection: {
      title: "Hex Spins for Builders",
      intro: "When the label is the hex, the result is ready for CSS.",
      points: [
        { title: "Paste into CSS", description: "Copy the spun hex into a variable or utility class." },
        { title: "Design jams", description: "Force a prototype to use the spun hex as its accent." },
        { title: "Teach codes", description: "Connect named color wheels to hex-labeled slices." },
      ],
    },
    faq: spokeFaq("Hex Color Picker Wheel", "Web developers"),
    siblingIds: ["html", "css", "neon", "random", "basic"],
    deepLink: {
      palette: "hex",
      tab: "manual",
      toolTitle: "Hex Color Picker Wheel",
      toolDescription: "Spin hex-labeled colors",
    },
    audience: "Web developers",
  },
}

export function getColorPickerSpoke(id: ColorPickerSpokeId): ColorPickerSpokeSeo {
  return COLOR_PICKER_SPOKES[id]
}

export function getColorSpokeSiblings(spoke: ColorPickerSpokeSeo): ColorPickerSpokeSeo[] {
  return spoke.siblingIds.map((id) => COLOR_PICKER_SPOKES[id])
}

/** Popular + extra cluster links for pillar and spoke grids. */
export const COLOR_PICKER_CLUSTER_LINKS = [
  ...Object.values(COLOR_PICKER_SPOKES).map((spoke) => ({
    label: spoke.shortTitle,
    href: spoke.path,
    description: spoke.description,
  })),
]
